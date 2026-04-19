/** Order: RU → UA → EN (as in UI) */
export const appLocales = ["ru", "uk", "en"] as const;

export type AppLocale = (typeof appLocales)[number];

export const defaultLocale: AppLocale = "uk";

export const isAppLocale = (value: string): value is AppLocale =>
  (appLocales as readonly string[]).includes(value);
