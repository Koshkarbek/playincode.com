import { NextRequest, NextResponse } from "next/server";
import { and, asc, eq, isNull } from "drizzle-orm";
import { getDb, runDbBatch } from "@/db";
import { answers, invitations } from "@/db/schema";
import { questions } from "@/features/profile-test/content";
import { sha256Hex } from "@/features/profile-test/crypto";
import {
  BASE_TYPES,
  countScores,
  determineProfile,
} from "@/features/profile-test/scoring";
import { hasAllowedOrigin } from "@/features/profile-test/server/public-origin";
import type { BaseType, Locale } from "@/features/profile-test/types";

type InvitationRow = {
  id: string;
  locale: Locale | null;
  status: "ready" | "in_progress" | "completed";
  progress: number;
};

async function findInvitation(token: string): Promise<InvitationRow | null> {
  const tokenHash = await sha256Hex(token);
  const [invitation] = await (await getDb())
    .select({
      id: invitations.id,
      locale: invitations.locale,
      status: invitations.status,
      progress: invitations.progress,
    })
    .from(invitations)
    .where(eq(invitations.tokenHash, tokenHash))
    .limit(1);
  return invitation ?? null;
}

async function finalizeInvitation(
  invitation: InvitationRow,
): Promise<boolean> {
  const db = await getDb();
  const rows = await db
    .select({ baseType: answers.baseType })
    .from(answers)
    .where(eq(answers.invitationId, invitation.id))
    .orderBy(asc(answers.questionId));

  if (rows.length !== questions.length) return false;

  const scores = countScores(rows.map((row) => row.baseType));
  const profile = determineProfile(scores);
  await db
    .update(invitations)
    .set({
      status: "completed",
      progress: questions.length,
      scoreA: scores.A,
      scoreB: scores.B,
      scoreC: scores.C,
      scoreD: scores.D,
      profileKey: profile,
      completedAt: Date.now(),
    })
    .where(eq(invitations.id, invitation.id));
  return true;
}

async function statePayload(invitation: InvitationRow) {
  if (invitation.status === "completed") {
    return { status: "completed", locale: invitation.locale ?? "ru" };
  }

  if (invitation.progress >= questions.length) {
    const completed = await finalizeInvitation(invitation);
    if (completed) {
      return { status: "completed", locale: invitation.locale ?? "ru" };
    }
  }

  if (!invitation.locale) return { status: "choose_locale" };

  const locale = invitation.locale;
  const question = questions[invitation.progress];
  return {
    status: "question",
    locale,
    progress: invitation.progress,
    total: questions.length,
    question: {
      id: question.id,
      prompt: question.prompt[locale],
      answers: BASE_TYPES.map((type, index) => ({
        id: index,
        text: question.answers[type][locale],
      })),
    },
  };
}

export async function GET(
  _request: NextRequest,
  context: { params: Promise<{ token: string }> },
) {
  const { token } = await context.params;
  if (!token || token.length > 256) {
    return NextResponse.json({ status: "invalid" }, { status: 404 });
  }

  const invitation = await findInvitation(token);
  if (!invitation) {
    return NextResponse.json({ status: "invalid" }, { status: 404 });
  }
  return NextResponse.json(await statePayload(invitation), {
    headers: { "Cache-Control": "no-store" },
  });
}

export async function POST(
  request: NextRequest,
  context: { params: Promise<{ token: string }> },
) {
  if (!hasAllowedOrigin(request)) {
    return NextResponse.json({ error: "invalid_origin" }, { status: 403 });
  }

  const { token } = await context.params;
  if (!token || token.length > 256) {
    return NextResponse.json({ status: "invalid" }, { status: 404 });
  }

  let body: {
    action?: unknown;
    locale?: unknown;
    questionId?: unknown;
    answerIndex?: unknown;
  };
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "invalid_request" }, { status: 400 });
  }

  let invitation = await findInvitation(token);
  if (!invitation) {
    return NextResponse.json({ status: "invalid" }, { status: 404 });
  }

  if (body.action === "set_locale") {
    if (
      invitation.locale ||
      invitation.progress !== 0 ||
      (body.locale !== "ru" && body.locale !== "en")
    ) {
      return NextResponse.json(await statePayload(invitation), { status: 409 });
    }
    await (await getDb())
      .update(invitations)
      .set({ locale: body.locale, status: "in_progress" })
      .where(
        and(
          eq(invitations.id, invitation.id),
          eq(invitations.progress, 0),
          isNull(invitations.locale),
        ),
      );
    invitation = (await findInvitation(token)) as InvitationRow;
    return NextResponse.json(await statePayload(invitation));
  }

  if (body.action !== "answer") {
    return NextResponse.json({ error: "invalid_action" }, { status: 400 });
  }

  if (invitation.status === "completed") {
    return NextResponse.json(await statePayload(invitation));
  }

  const questionId = Number(body.questionId);
  const answerIndex = Number(body.answerIndex);
  if (
    !Number.isInteger(questionId) ||
    !Number.isInteger(answerIndex) ||
    answerIndex < 0 ||
    answerIndex >= BASE_TYPES.length
  ) {
    return NextResponse.json({ error: "invalid_answer" }, { status: 400 });
  }

  if (questionId <= invitation.progress) {
    return NextResponse.json(await statePayload(invitation));
  }

  if (
    !invitation.locale ||
    questionId !== invitation.progress + 1 ||
    questionId > questions.length
  ) {
    return NextResponse.json(await statePayload(invitation), { status: 409 });
  }

  const currentInvitation = invitation;
  try {
    await runDbBatch((batchDb) => [
      batchDb.insert(answers).values({
        invitationId: currentInvitation.id,
        questionId,
        choiceIndex: answerIndex,
        baseType: BASE_TYPES[answerIndex] as BaseType,
        createdAt: Date.now(),
      }),
      batchDb
        .update(invitations)
        .set({ progress: questionId, status: "in_progress" })
        .where(
          and(
            eq(invitations.id, currentInvitation.id),
            eq(invitations.progress, currentInvitation.progress),
          ),
        ),
    ]);
  } catch {
    invitation = (await findInvitation(token)) as InvitationRow;
    return NextResponse.json(await statePayload(invitation));
  }

  invitation = (await findInvitation(token)) as InvitationRow;
  if (questionId === questions.length) {
    await finalizeInvitation(invitation);
    invitation = (await findInvitation(token)) as InvitationRow;
  }
  return NextResponse.json(await statePayload(invitation));
}
