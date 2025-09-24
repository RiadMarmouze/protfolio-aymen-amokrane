// middleware.ts
import { NextRequest, NextResponse } from "next/server";

const COOKIE_NAME = process.env.SESSION_COOKIE_NAME || "__session";

// Tweak these to match your app:
const PUBLIC_LOGIN_PATH = "/login";
const DEFAULT_AFTER_LOGIN = "/admin";
const PROTECTED_PREFIXES = ["/admin", "/api/respond"];

/** Utility: does pathname start with any of the given prefixes? */
function startsWithAny(pathname: string, prefixes: string[]) {
  return prefixes.some((p) => pathname === p || pathname.startsWith(p));
}

export function middleware(req: NextRequest) {
  const { pathname, searchParams } = req.nextUrl;
  const hasSession = Boolean(req.cookies.get(COOKIE_NAME)?.value);

  // If a signed-in user hits the login page, send them somewhere useful.
  if (pathname === PUBLIC_LOGIN_PATH && hasSession) {
    const nextParam = searchParams.get("next");
    const redirectPath =
      nextParam && nextParam.startsWith("/") ? nextParam : DEFAULT_AFTER_LOGIN;

    const url = req.nextUrl.clone();
    url.pathname = redirectPath;
    url.search = ""; // drop any leftover params
    return NextResponse.redirect(url);
  }

  // Only guard routes that truly require a cookie.
  const needsAuth = startsWithAny(pathname, PROTECTED_PREFIXES);
  if (!needsAuth) return NextResponse.next();

  // If we have the cookie, let the request pass. (Verification is server-side.)
  if (hasSession) return NextResponse.next();

  // No cookie:
  // - If it's an API route, return 401 (machines expect status codes, not redirects).
  if (pathname.startsWith("/api/")) {
    return new NextResponse(null, { status: 401 });
  }

  // - Otherwise, redirect to login with a reason + next param.
  const loginUrl = req.nextUrl.clone();
  loginUrl.pathname = PUBLIC_LOGIN_PATH;
  loginUrl.searchParams.set("reason", "auth");
  // Preserve the original path + query so we can send the user back after login.
  const original = pathname + (req.nextUrl.search || "");
  loginUrl.searchParams.set("next", original);
  return NextResponse.redirect(loginUrl);
}

// Match only what we need: protected app pages, protected API endpoint, and login page (for the auto-redirect).
export const config = {
  matcher: ["/admin/:path*", "/api/respond", "/login"],
};
