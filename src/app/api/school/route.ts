import { NextRequest, NextResponse } from "next/server";
import { and, asc, desc, eq, notExists, sql } from "drizzle-orm";
import { getDb, runDbBatch } from "@/db";
import { answers, batches, invitations } from "@/db/schema";
import {
  isAdmin,
  isSameOrigin,
} from "@/features/profile-test/server/admin-auth";
import { profiles, questions } from "@/features/profile-test/content";
import {
  encryptToken,
  randomCode,
  randomToken,
  sha256Hex,
} from "@/features/profile-test/crypto";
import { getPublicBaseUrl } from "@/features/profile-test/server/public-origin";
import { getRuntimeValue } from "@/features/profile-test/server/runtime-env";

async function unauthorizedUnlessAdmin(request: NextRequest) {
  if (!(await isAdmin(request))) {
    return NextResponse.json({ error: "unauthorized" }, { status: 401 });
  }
  return null;
}

export async function GET(request: NextRequest) {
  const unauthorized = await unauthorizedUnlessAdmin(request);
  if (unauthorized) return unauthorized;

  const db = await getDb();
  const [batchRows, invitationRows, answerRows] = await Promise.all([
    db.select().from(batches).orderBy(desc(batches.createdAt)),
    db
      .select()
      .from(invitations)
      .orderBy(desc(invitations.createdAt), asc(invitations.code)),
    db
      .select()
      .from(answers)
      .orderBy(asc(answers.invitationId), asc(answers.questionId)),
  ]);

  const answersByInvitation = new Map<string, typeof answerRows>();
  for (const answer of answerRows) {
    const current = answersByInvitation.get(answer.invitationId) ?? [];
    current.push(answer);
    answersByInvitation.set(answer.invitationId, current);
  }

  const publicBaseUrl = getPublicBaseUrl(request);
  const invitationPayload = await Promise.all(
    invitationRows.map(async (invitation) => {
      const url = invitation.tokenCiphertext
        ? `${publicBaseUrl}/profile-test`
        : null;

      return {
        id: invitation.id,
        batchId: invitation.batchId,
        code: invitation.code,
        url,
        locale: invitation.locale,
        status: invitation.status,
        progress: invitation.progress,
        scores:
          invitation.scoreA === null
            ? null
            : {
                A: invitation.scoreA,
                B: invitation.scoreB ?? 0,
                C: invitation.scoreC ?? 0,
                D: invitation.scoreD ?? 0,
              },
        profileKey: invitation.profileKey,
        createdAt: invitation.createdAt,
        completedAt: invitation.completedAt,
        firstSentAt: invitation.firstSentAt,
        lastSentAt: invitation.lastSentAt,
        sendCount: invitation.sendCount,
        adminNote: invitation.adminNote,
        adminNoteUpdatedAt: invitation.adminNoteUpdatedAt,
        answers: (answersByInvitation.get(invitation.id) ?? []).map(
          (answer) => ({
            questionId: answer.questionId,
            choiceIndex: answer.choiceIndex,
            baseType: answer.baseType,
          }),
        ),
      };
    }),
  );

  return NextResponse.json(
    {
      testUrl: `${publicBaseUrl}/profile-test`,
      content: { profiles, questions },
      batches: batchRows.map((batch) => ({
        id: batch.id,
        createdAt: batch.createdAt,
        quantity: batch.quantity,
      })),
      invitations: invitationPayload,
    },
    { headers: { "Cache-Control": "no-store" } },
  );
}

export async function POST(request: NextRequest) {
  if (!isSameOrigin(request)) {
    return NextResponse.json({ error: "invalid_origin" }, { status: 403 });
  }
  const unauthorized = await unauthorizedUnlessAdmin(request);
  if (unauthorized) return unauthorized;

  let body: {
    action?: unknown;
    count?: unknown;
    invitationId?: unknown;
    note?: unknown;
  };
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "invalid_request" }, { status: 400 });
  }

  if (body.action === "update_note") {
    if (
      typeof body.invitationId !== "string" ||
      body.invitationId.length === 0 ||
      body.invitationId.length > 100
    ) {
      return NextResponse.json(
        { error: "invalid_invitation" },
        { status: 400 },
      );
    }
    if (typeof body.note !== "string" || body.note.length > 1000) {
      return NextResponse.json({ error: "invalid_note" }, { status: 400 });
    }

    const db = await getDb();
    const updatedAt = Date.now();
    const [updated] = await db
      .update(invitations)
      .set({
        adminNote: body.note.length > 0 ? body.note : null,
        adminNoteUpdatedAt: body.note.length > 0 ? updatedAt : null,
      })
      .where(eq(invitations.id, body.invitationId))
      .returning({
        id: invitations.id,
        adminNote: invitations.adminNote,
        adminNoteUpdatedAt: invitations.adminNoteUpdatedAt,
      });
    if (!updated) {
      return NextResponse.json(
        { error: "invitation_not_found" },
        { status: 404 },
      );
    }
    return NextResponse.json({
      invitationId: updated.id,
      adminNote: updated.adminNote,
      adminNoteUpdatedAt: updated.adminNoteUpdatedAt,
    });
  }

  if (body.action === "mark_sent" || body.action === "reset_sent") {
    if (
      typeof body.invitationId !== "string" ||
      body.invitationId.length === 0 ||
      body.invitationId.length > 100
    ) {
      return NextResponse.json(
        { error: "invalid_invitation" },
        { status: 400 },
      );
    }

    const db = await getDb();
    const [invitation] = await db
      .select({
        id: invitations.id,
        status: invitations.status,
        progress: invitations.progress,
      })
      .from(invitations)
      .where(eq(invitations.id, body.invitationId))
      .limit(1);
    if (!invitation) {
      return NextResponse.json(
        { error: "invitation_not_found" },
        { status: 404 },
      );
    }
    if (invitation.status !== "ready" || invitation.progress !== 0) {
      return NextResponse.json(
        { error: "test_already_started" },
        { status: 409 },
      );
    }

    if (body.action === "reset_sent") {
      const [updated] = await db
        .update(invitations)
        .set({
          firstSentAt: null,
          lastSentAt: null,
          sendCount: 0,
        })
        .where(
          and(
            eq(invitations.id, invitation.id),
            eq(invitations.status, "ready"),
            eq(invitations.progress, 0),
          ),
        )
        .returning({ id: invitations.id });
      if (!updated) {
        return NextResponse.json(
          { error: "test_already_started" },
          { status: 409 },
        );
      }
      return NextResponse.json({
        delivery: {
          invitationId: invitation.id,
          firstSentAt: null,
          lastSentAt: null,
          sendCount: 0,
        },
      });
    }

    const sentAt = Date.now();
    const [updated] = await db
      .update(invitations)
      .set({
        firstSentAt: sql`coalesce(${invitations.firstSentAt}, ${sentAt})`,
        lastSentAt: sentAt,
        sendCount: sql`${invitations.sendCount} + 1`,
      })
      .where(
        and(
          eq(invitations.id, invitation.id),
          eq(invitations.status, "ready"),
          eq(invitations.progress, 0),
        ),
      )
      .returning({
        firstSentAt: invitations.firstSentAt,
        lastSentAt: invitations.lastSentAt,
        sendCount: invitations.sendCount,
      });
    if (!updated) {
      return NextResponse.json(
        { error: "test_already_started" },
        { status: 409 },
      );
    }
    return NextResponse.json({
      delivery: {
        invitationId: invitation.id,
        firstSentAt: updated.firstSentAt,
        lastSentAt: updated.lastSentAt,
        sendCount: updated.sendCount,
      },
    });
  }

  if (body.action !== "create_batch") {
    return NextResponse.json({ error: "invalid_action" }, { status: 400 });
  }

  const count = Number(body.count);
  if (!Number.isInteger(count) || count < 1 || count > 500) {
    return NextResponse.json({ error: "invalid_count" }, { status: 400 });
  }

  const batchId = crypto.randomUUID();
  const createdAt = Date.now();
  const publicBaseUrl = getPublicBaseUrl(request);
  const encryptionKey = getRuntimeValue("LINK_ENCRYPTION_KEY");
  const generated = await Promise.all(
    Array.from({ length: count }, async () => {
      const token = randomToken();
      return {
        id: crypto.randomUUID(),
        code: randomCode(),
        token,
        tokenHash: await sha256Hex(token),
        tokenCiphertext: await encryptToken(token, encryptionKey),
      };
    }),
  );

  await runDbBatch((batchDb) => [
    batchDb.insert(batches).values({ id: batchId, createdAt, quantity: count }),
    batchDb.insert(invitations).values(
      generated.map((item) => ({
        id: item.id,
        batchId,
        code: item.code,
        tokenHash: item.tokenHash,
        tokenCiphertext: item.tokenCiphertext,
        locale: null,
        status: "ready" as const,
        progress: 0,
        createdAt,
        firstSentAt: null,
        lastSentAt: null,
        sendCount: 0,
      })),
    ),
  ]);

  return NextResponse.json({
    batch: { id: batchId, createdAt, quantity: count },
    links: generated.map((item) => ({
      code: item.code,
      url: `${publicBaseUrl}/profile-test`,
    })),
  });
}

export async function DELETE(request: NextRequest) {
  if (!isSameOrigin(request)) {
    return NextResponse.json({ error: "invalid_origin" }, { status: 403 });
  }
  const unauthorized = await unauthorizedUnlessAdmin(request);
  if (unauthorized) return unauthorized;

  let body: { scope?: unknown; id?: unknown };
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "invalid_request" }, { status: 400 });
  }

  if (
    (body.scope !== "invitation" && body.scope !== "batch") ||
    typeof body.id !== "string" ||
    body.id.length === 0 ||
    body.id.length > 100
  ) {
    return NextResponse.json({ error: "invalid_request" }, { status: 400 });
  }

  const db = await getDb();
  const targetId = body.id;
  if (body.scope === "invitation") {
    const [invitation] = await db
      .select({ batchId: invitations.batchId })
      .from(invitations)
      .where(eq(invitations.id, targetId))
      .limit(1);
    if (!invitation) {
      return NextResponse.json({ deleted: true });
    }

    await runDbBatch((batchDb) => {
      const remainingInvitations = batchDb
        .select({ id: invitations.id })
        .from(invitations)
        .where(eq(invitations.batchId, invitation.batchId));
      return [
        batchDb.delete(invitations).where(eq(invitations.id, targetId)),
        batchDb
          .update(batches)
          .set({ quantity: sql`greatest(${batches.quantity} - 1, 0)` })
          .where(eq(batches.id, invitation.batchId)),
        batchDb
          .delete(batches)
          .where(
            and(
              eq(batches.id, invitation.batchId),
              notExists(remainingInvitations),
            ),
          ),
      ];
    });
  } else {
    await db.delete(batches).where(eq(batches.id, targetId));
  }

  return NextResponse.json({ deleted: true });
}
