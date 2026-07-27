import type { NextRequest, NextResponse } from "next/server";
import { eq } from "drizzle-orm";
import { getDb } from "@/db";
import { loginAttempts } from "@/db/schema";
import {
  decodeBase64Url,
  encodeBase64Url,
  hmac,
  safeEqual,
  sha256Hex,
} from "../crypto";
import { getRuntimeValue } from "./runtime-env";
import { hasAllowedOrigin } from "./public-origin";

const COOKIE_NAME = "school_session";
const SESSION_DURATION_SECONDS = 8 * 60 * 60;
const RATE_WINDOW_MS = 15 * 60 * 1000;
const MAX_FAILURES = 5;

type SessionPayload = {
  exp: number;
};

export function isSameOrigin(request: NextRequest): boolean {
  return hasAllowedOrigin(request);
}

export async function verifyAdminPassword(
  request: NextRequest,
  password: string,
): Promise<{ ok: boolean; blocked: boolean; retryAfter: number }> {
  const db = await getDb();
  const now = Date.now();
  const address =
    request.headers.get("cf-connecting-ip") ??
    request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ??
    "unknown";
  const attemptKey = await sha256Hex(
    `${getRuntimeValue("SESSION_SECRET")}:${address}`,
  );
  const [attempt] = await db
    .select({
      failures: loginAttempts.failures,
      windowStartedAt: loginAttempts.windowStartedAt,
      blockedUntil: loginAttempts.blockedUntil,
    })
    .from(loginAttempts)
    .where(eq(loginAttempts.key, attemptKey))
    .limit(1);

  if (attempt && attempt.blockedUntil > now) {
    return {
      ok: false,
      blocked: true,
      retryAfter: Math.ceil((attempt.blockedUntil - now) / 1000),
    };
  }

  const expected = await sha256Hex(getRuntimeValue("ADMIN_PASSWORD"));
  const received = await sha256Hex(password);

  if (safeEqual(expected, received)) {
    await db.delete(loginAttempts).where(eq(loginAttempts.key, attemptKey));
    return { ok: true, blocked: false, retryAfter: 0 };
  }

  const stillInWindow =
    attempt && now - attempt.windowStartedAt < RATE_WINDOW_MS;
  const failures = stillInWindow ? attempt.failures + 1 : 1;
  const windowStartedAt = stillInWindow ? attempt.windowStartedAt : now;
  const blockedUntil =
    failures >= MAX_FAILURES ? now + RATE_WINDOW_MS : 0;

  await db
    .insert(loginAttempts)
    .values({
      key: attemptKey,
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
    ok: false,
    blocked: blockedUntil > now,
    retryAfter:
      blockedUntil > now ? Math.ceil((blockedUntil - now) / 1000) : 0,
  };
}

export async function createSessionToken(): Promise<string> {
  const payload = encodeBase64Url(
    JSON.stringify({
      exp: Math.floor(Date.now() / 1000) + SESSION_DURATION_SECONDS,
    } satisfies SessionPayload),
  );
  const signature = await hmac(payload, getRuntimeValue("SESSION_SECRET"));
  return `${payload}.${signature}`;
}

export async function isAdmin(request: NextRequest): Promise<boolean> {
  const token = request.cookies.get(COOKIE_NAME)?.value;
  if (!token) return false;

  const [payload, signature, extra] = token.split(".");
  if (!payload || !signature || extra) return false;

  const expected = await hmac(payload, getRuntimeValue("SESSION_SECRET"));
  if (!safeEqual(expected, signature)) return false;

  try {
    const parsed = JSON.parse(decodeBase64Url(payload)) as SessionPayload;
    return Number.isInteger(parsed.exp) && parsed.exp > Date.now() / 1000;
  } catch {
    return false;
  }
}

export function setSessionCookie(
  response: NextResponse,
  token: string,
  request: NextRequest,
): void {
  response.cookies.set({
    name: COOKIE_NAME,
    value: token,
    httpOnly: true,
    secure: new URL(request.url).protocol === "https:",
    sameSite: "strict",
    path: "/",
    maxAge: SESSION_DURATION_SECONDS,
  });
}

export function clearSessionCookie(
  response: NextResponse,
  request: NextRequest,
): void {
  response.cookies.set({
    name: COOKIE_NAME,
    value: "",
    httpOnly: true,
    secure: new URL(request.url).protocol === "https:",
    sameSite: "strict",
    path: "/",
    maxAge: 0,
  });
}
