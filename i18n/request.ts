import { getRequestConfig } from "next-intl/server";
import { headers } from "next/headers";

import { defaultLocale, isAppLocale } from "@/app/lib/i18n/locales";
import { getUserLocale } from "@/app/lib/services/locale";

const REQUEST_LOCALE_HEADER = "x-oilix-locale";

export default getRequestConfig(async () => {
  const requestHeaders = await headers();
  const localeFromRequest = requestHeaders.get(REQUEST_LOCALE_HEADER);
  const locale = localeFromRequest !== null && isAppLocale(localeFromRequest)
    ? localeFromRequest
    : await getUserLocale();

  try {
    const messages = (await import(`../messages/${locale}.json`)).default;
    return { locale, messages };
  } catch (error) {
    console.error(
      `[i18n] Failed to load messages for locale "${locale}", using default`,
      error,
    );
    const messages = (await import(`../messages/${defaultLocale}.json`))
      .default;
    return { locale: defaultLocale, messages };
  }
});
