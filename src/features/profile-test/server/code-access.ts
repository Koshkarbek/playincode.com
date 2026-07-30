import type { NextRequest } from "next/server";
import { eq } from "drizzle-orm";
import { getDb } from "@/db";
import { loginAttempts } from "@/db/schema";
import { sha256Hex } from "@/features/profile-test/crypto";
import { getRuntimeValue } from "./runtime-env";

const RATE_WINDOW_MS = 15 * 60 * 1000;
const MAX_FAILURES = 5;

async function attemptKey(request: NextRequest): Promise<string> {
  const address =
    request.headers.get("cf-connecting-ip") ??
    request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ??
    "unknown";
  return sha256Hex(
    `${getRuntimeValue("SESSION_SECRET")}:test-code:${address}`,
  );
}

export async function getCodeAccessBlock(
  request: NextRequest,
): Promise<{ blocked: boolean; retryAfter: number }> {
  const db = await getDb();
  const now = Date.now();
  const key = await attemptKey(request);
  const [attempt] = await db
    .select({ blockedUntil: loginAttempts.blockedUntil })
    .from(loginAttempts)
    .where(eq(loginAttempts.key, key))
    .limit(1);

  const blockedUntil = attempt?.blockedUntil ?? 0;
  return {
    blocked: blockedUntil > now,
    retryAfter:
      blockedUntil > now ? Math.ceil((blockedUntil - now) / 1000) : 0,
  };
}

export async function recordCodeAccessFailure(
  request: NextRequest,
): Promise<{ blocked: boolean; retryAfter: number }> {
  const db = await getDb();
  const now = Date.now();
  const key = await attemptKey(request);
  const [attempt] = await db
    .select({
      failures: loginAttempts.failures,
      windowStartedAt: loginAttempts.windowStartedAt,
    })
    .from(loginAttempts)
    .where(eq(loginAttempts.key, key))
    .limit(1);

  const stillInWindow =
    attempt && now - attempt.windowStartedAt < RATE_WINDOW_MS;
  const failures = stillInWindow ? attempt.failures + 1 : 1;
  const windowStartedAt = stillInWindow ? attempt.windowStartedAt : now;
  const blockedUntil =
    failures >= MAX_FAILURES ? now + RATE_WINDOW_MS : 0;

  await db
    .insert(loginAttempts)
    .values({
      key,
      failures,
      windowStartedAt,
      blockedUntil,
      updatedAt: now,
    })
    .onConflictDoUpdate({
      target: loginAttempts.key,
      set: {
        failures,
        windowStartedAt,
        blockedUntil,
        updatedAt: now,
      },
    });

  return {
    blocked: blockedUntil > now,
    retryAfter:
      blockedUntil > now ? Math.ceil((blockedUntil - now) / 1000) : 0,
  };
}

export async function clearCodeAccessFailures(
  request: NextRequest,
): Promise<void> {
  const db = await getDb();
  await db
    .delete(loginAttempts)
    .where(eq(loginAttempts.key, await attemptKey(request)));
}
