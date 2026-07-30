import { NextRequest, NextResponse } from "next/server";

const DEFAULT_LOCALE = "ru";

export function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;

  if (pathname === "/ru" || pathname.startsWith("/ru/")) {
    const url = request.nextUrl.clone();
    url.pathname = pathname.replace(/^\/ru/, "") || "/";
    return NextResponse.redirect(url, 308);
  }

  const isEn = pathname === "/en" || pathname.startsWith("/en/");
  const locale = isEn ? "en" : DEFAULT_LOCALE;

  const requestHeaders = new Headers(request.headers);
  requestHeaders.set("x-locale", locale);
  requestHeaders.set("x-pathname", pathname);

  if (!isEn) {
    const url = request.nextUrl.clone();
    url.pathname = `/${DEFAULT_LOCALE}${pathname === "/" ? "" : pathname}`;
    return NextResponse.rewrite(url, {
      request: { headers: requestHeaders },
    });
  }

  return NextResponse.next({ request: { headers: requestHeaders } });
}

export const config = {
  matcher: [
    "/((?!_next|api|assets|t(?:/|$)|school(?:/|$)|profile-test(?:/|$)|opengraph-image|twitter-image|icon|apple-icon|favicon.ico|robots.txt|sitemap.xml|manifest.webmanifest|llms.txt|.*\\..*).*)",
  ],
};
