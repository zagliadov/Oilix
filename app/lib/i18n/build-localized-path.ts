import { appLocales, defaultLocale, isAppLocale, type AppLocale } from "@/app/lib/i18n/locales";

const localePrefixPattern = new RegExp(`^/(${appLocales.join("|")})(?=/|$)`);

export const buildLocalizedPath = (
  path: string,
  localeInput: string | AppLocale,
): string => {
  const locale = isAppLocale(localeInput) ? localeInput : defaultLocale;
  const normalizedPath = path.startsWith("/") ? path : `/${path}`;
  const pathWithoutLocale = normalizedPath.replace(localePrefixPattern, "") || "/";
  if (pathWithoutLocale === "/") {
    return `/${locale}`;
  }
  return `/${locale}${pathWithoutLocale}`;
};
