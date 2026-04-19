import fs from "fs/promises";
import path from "path";

import { defaultLocale, type AppLocale, isAppLocale } from "@/app/lib/i18n/locales";

const publicOfferFileName: Record<AppLocale, string> = {
  uk: "public-offer-uk.txt",
  ru: "public-offer-ru.txt",
  en: "public-offer-en.txt",
};

export const loadPublicOfferText = async (
  locale: string,
): Promise<string> => {
  const resolvedLocale: AppLocale = isAppLocale(locale) ? locale : defaultLocale;
  const fileName = publicOfferFileName[resolvedLocale];
  const filePath = path.join(process.cwd(), "data", fileName);

  try {
    return await fs.readFile(filePath, "utf8");
  } catch {
    const fallbackPath = path.join(
      process.cwd(),
      "data",
      publicOfferFileName[defaultLocale],
    );
    return fs.readFile(fallbackPath, "utf8");
  }
};
