import { NextResponse, type NextRequest } from "next/server";

import { ADMIN_SESSION_COOKIE_NAME } from "@/app/lib/admin/auth/cookie-name";
import { getSessionSecret } from "@/app/lib/admin/auth/env";
import { appLocales, defaultLocale, isAppLocale, type AppLocale } from "@/app/lib/i18n/locales";
import { verifyAdminSessionToken } from "@/app/lib/admin/auth/session-token";

const LOGIN_PATH = "/admin/login";
const LOCALE_COOKIE_NAME = "NEXT_LOCALE";
const REQUEST_LOCALE_HEADER = "x-oilix-locale";

export const config = {
  matcher: ["/admin/:path*", "/((?!api|_next|_vercel|.*\\..*).*)"],
};

export const proxy = async (request: NextRequest) => {
  const { pathname } = request.nextUrl;
  const localePattern = new RegExp(`^/(${appLocales.join("|")})(?=/|$)`);
  const localeMatch = pathname.match(localePattern);
  const localeFromPath = localeMatch !== null ? localeMatch[1] : undefined;
  const pathnameWithoutLocale = localeMatch === null
    ? pathname
    : pathname.replace(localePattern, "") || "/";
  const localizedLoginPath = localeFromPath === undefined
    ? LOGIN_PATH
    : `/${localeFromPath}${LOGIN_PATH}`;
  const localizedAdminRootPath = localeFromPath === undefined
    ? "/admin"
    : `/${localeFromPath}/admin`;

  if (pathnameWithoutLocale === LOGIN_PATH) {
    const secret = getSessionSecret();
    if (secret === undefined) {
      if (localeFromPath === undefined) {
        return NextResponse.next();
      }
      return NextResponse.rewrite(
        new URL(`${pathnameWithoutLocale}${request.nextUrl.search}`, request.url),
      );
    }
    const token = request.cookies.get(ADMIN_SESSION_COOKIE_NAME)?.value;
    if (token === undefined) {
      if (localeFromPath === undefined) {
        return NextResponse.next();
      }
      return NextResponse.rewrite(
        new URL(`${pathnameWithoutLocale}${request.nextUrl.search}`, request.url),
      );
    }
    const valid = await verifyAdminSessionToken(token, secret);
    if (valid) {
      return NextResponse.redirect(new URL(localizedAdminRootPath, request.url));
    }
    if (localeFromPath === undefined) {
      return NextResponse.next();
    }
    return NextResponse.rewrite(
      new URL(`${pathnameWithoutLocale}${request.nextUrl.search}`, request.url),
    );
  }

  if (pathnameWithoutLocale.startsWith("/admin")) {
    const secret = getSessionSecret();
    if (secret === undefined) {
      return NextResponse.redirect(new URL(localizedLoginPath, request.url));
    }
    const token = request.cookies.get(ADMIN_SESSION_COOKIE_NAME)?.value;
    if (token === undefined) {
      return NextResponse.redirect(new URL(localizedLoginPath, request.url));
    }
    const valid = await verifyAdminSessionToken(token, secret);
    if (!valid) {
      const loginUrl = new URL(localizedLoginPath, request.url);
      return NextResponse.redirect(loginUrl);
    }
    if (localeFromPath !== undefined) {
      return NextResponse.rewrite(
        new URL(`${pathnameWithoutLocale}${request.nextUrl.search}`, request.url),
      );
    }
  }

  if (localeMatch !== null) {
    const locale = localeMatch[1];
    if (!isAppLocale(locale)) {
      return NextResponse.next();
    }

    const rewriteUrl = new URL(
      `${pathnameWithoutLocale}${request.nextUrl.search}`,
      request.url,
    );
    const requestHeaders = new Headers(request.headers);
    requestHeaders.set(REQUEST_LOCALE_HEADER, locale);
    const response = NextResponse.rewrite(rewriteUrl, {
      request: {
        headers: requestHeaders,
      },
    });
    response.cookies.set(LOCALE_COOKIE_NAME, locale, {
      path: "/",
      maxAge: 60 * 60 * 24 * 365,
      sameSite: "lax",
    });
    return response;
  }

  const localeFromCookie = request.cookies.get(LOCALE_COOKIE_NAME)?.value;
  const activeLocale: AppLocale =
    localeFromCookie !== undefined && isAppLocale(localeFromCookie)
    ? localeFromCookie
    : defaultLocale;
  const redirectUrl = new URL(
    `/${activeLocale}${pathname}${request.nextUrl.search}`,
    request.url,
  );
  return NextResponse.redirect(redirectUrl);
};
