import { NextRequest, NextResponse } from "next/server";
import { eq } from "drizzle-orm";
import { getDb } from "@/db";
import { invitations } from "@/db/schema";
import { normalizeAccessCode } from "@/features/profile-test/access-code";
import { decryptToken } from "@/features/profile-test/crypto";
import {
  clearCodeAccessFailures,
  getCodeAccessBlock,
  recordCodeAccessFailure,
} from "@/features/profile-test/server/code-access";
import { isSameOrigin } from "@/features/profile-test/server/admin-auth";
import { getRuntimeValue } from "@/features/profile-test/server/runtime-env";

const INVALID_RESPONSE = { error: "invalid_code" } as const;

function rateLimited(retryAfter: number) {
  return NextResponse.json(
    { error: "rate_limited", contactManager: true },
    {
      status: 429,
      headers: {
        "Cache-Control": "no-store",
        "Retry-After": String(Math.max(retryAfter, 1)),
      },
    },
  );
}

export async function POST(request: NextRequest) {
  if (!isSameOrigin(request)) {
    return NextResponse.json(INVALID_RESPONSE, { status: 404 });
  }

  const currentBlock = await getCodeAccessBlock(request);
  if (currentBlock.blocked) return rateLimited(currentBlock.retryAfter);

  let body: { code?: unknown };
  try {
    body = await request.json();
  } catch {
    body = {};
  }

  const code = normalizeAccessCode(body.code);
  let redirectTo: string | null = null;

  if (code.length >= 3 && code.length <= 64) {
    const [invitation] = await (await getDb())
      .select({ tokenCiphertext: invitations.tokenCiphertext })
      .from(invitations)
      .where(eq(invitations.code, code))
      .limit(1);

    if (invitation?.tokenCiphertext) {
      try {
        const token = await decryptToken(
          invitation.tokenCiphertext,
          getRuntimeValue("LINK_ENCRYPTION_KEY"),
        );
        redirectTo = `/t/${encodeURIComponent(token)}`;
      } catch {
        redirectTo = null;
      }
    }
  }

  if (!redirectTo) {
    const failure = await recordCodeAccessFailure(request);
    if (failure.blocked) return rateLimited(failure.retryAfter);
    return NextResponse.json(INVALID_RESPONSE, {
      status: 404,
      headers: { "Cache-Control": "no-store" },
    });
  }

  await clearCodeAccessFailures(request);
  return NextResponse.json(
    { redirectTo },
    { headers: { "Cache-Control": "no-store" } },
  );
}
