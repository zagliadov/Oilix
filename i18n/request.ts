import { getRequestConfig } from "next-intl/server";

import { defaultLocale } from "@/app/lib/i18n/locales";
import { getUserLocale } from "@/app/lib/services/locale";

export default getRequestConfig(async () => {
  const locale = await getUserLocale();

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
