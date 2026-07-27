import { NextRequest, NextResponse } from "next/server";
import {
  clearSessionCookie,
  createSessionToken,
  isAdmin,
  isSameOrigin,
  setSessionCookie,
  verifyAdminPassword,
} from "@/features/profile-test/server/admin-auth";

export async function GET(request: NextRequest) {
  return NextResponse.json({ authenticated: await isAdmin(request) });
}

export async function POST(request: NextRequest) {
  if (!isSameOrigin(request)) {
    return NextResponse.json({ error: "invalid_origin" }, { status: 403 });
  }

  let body: { password?: unknown };
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "invalid_request" }, { status: 400 });
  }

  if (typeof body.password !== "string" || body.password.length > 256) {
    return NextResponse.json({ error: "invalid_request" }, { status: 400 });
  }

  const result = await verifyAdminPassword(request, body.password);
  if (!result.ok) {
    return NextResponse.json(
      {
        error: result.blocked ? "rate_limited" : "wrong_password",
        retryAfter: result.retryAfter,
      },
      {
        status: result.blocked ? 429 : 401,
        headers:
          result.retryAfter > 0
            ? { "Retry-After": String(result.retryAfter) }
            : undefined,
      },
    );
  }

  const response = NextResponse.json({ authenticated: true });
  setSessionCookie(response, await createSessionToken(), request);
  return response;
}

export async function DELETE(request: NextRequest) {
  if (!isSameOrigin(request)) {
    return NextResponse.json({ error: "invalid_origin" }, { status: 403 });
  }
  const response = NextResponse.json({ authenticated: false });
  clearSessionCookie(response, request);
  return response;
}
