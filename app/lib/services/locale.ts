import { cookies } from "next/headers";

import {
  defaultLocale,
  isAppLocale,
  type AppLocale,
} from "@/app/lib/i18n/locales";

export { appLocales, defaultLocale, type AppLocale } from "@/app/lib/i18n/locales";

const COOKIE_NAME = "NEXT_LOCALE";

export const getUserLocale = async (): Promise<AppLocale> => {
  const store = await cookies();
  const value = store.get(COOKIE_NAME)?.value;
  if (value && isAppLocale(value)) {
    return value;
  }
  return defaultLocale;
};
