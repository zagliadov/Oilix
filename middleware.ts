import { NextResponse, type NextRequest } from "next/server";

import { ADMIN_SESSION_COOKIE_NAME } from "@/app/lib/admin/auth/cookie-name";
import { getSessionSecret } from "@/app/lib/admin/auth/env";
import { verifyAdminSessionToken } from "@/app/lib/admin/auth/session-token";

const LOGIN_PATH = "/admin/login";

export const config = {
  matcher: ["/admin/:path*"],
};

export const middleware = async (request: NextRequest) => {
  const { pathname } = request.nextUrl;

  if (pathname === LOGIN_PATH) {
    const secret = getSessionSecret();
    if (secret === undefined) {
      return NextResponse.next();
    }
    const token = request.cookies.get(ADMIN_SESSION_COOKIE_NAME)?.value;
    if (token === undefined) {
      return NextResponse.next();
    }
    const valid = await verifyAdminSessionToken(token, secret);
    if (valid) {
      return NextResponse.redirect(new URL("/admin", request.url));
    }
    return NextResponse.next();
  }

  if (pathname.startsWith("/admin")) {
    const secret = getSessionSecret();
    if (secret === undefined) {
      return NextResponse.redirect(new URL(LOGIN_PATH, request.url));
    }
    const token = request.cookies.get(ADMIN_SESSION_COOKIE_NAME)?.value;
    if (token === undefined) {
      return NextResponse.redirect(new URL(LOGIN_PATH, request.url));
    }
    const valid = await verifyAdminSessionToken(token, secret);
    if (!valid) {
      const loginUrl = new URL(LOGIN_PATH, request.url);
      return NextResponse.redirect(loginUrl);
    }
  }

  return NextResponse.next();
};
