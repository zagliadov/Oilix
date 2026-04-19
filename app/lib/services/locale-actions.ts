"use server";

import { cookies } from "next/headers";

import { isAppLocale } from "@/app/lib/i18n/locales";

const COOKIE_NAME = "NEXT_LOCALE";

export const setUserLocale = async (
  locale: string,
): Promise<{ ok: boolean }> => {
  if (!isAppLocale(locale)) {
    return { ok: false };
  }
  try {
    const store = await cookies();
    store.set(COOKIE_NAME, locale, {
      path: "/",
      maxAge: 60 * 60 * 24 * 365,
      sameSite: "lax",
    });
    return { ok: true };
  } catch (error) {
    console.error("[locale] Failed to set NEXT_LOCALE cookie", error);
    return { ok: false };
  }
};
