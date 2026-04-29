import type { Metadata } from "next";
import Link from "next/link";
import { getLocale, getTranslations } from "next-intl/server";

import { LandingBackground } from "@/app/components/landing/landing-background";
import { LandingFooter } from "@/app/components/landing/landing-footer";
import { LandingHeader } from "@/app/components/landing/landing-header";
import { SectionShell } from "@/app/components/landing/section-shell";
import { buildLocalizedPath } from "@/app/lib/i18n/build-localized-path";
import { isAppLocale } from "@/app/lib/i18n/locales";
import { buildAbsoluteRouteMetadata } from "@/app/lib/seo/page-metadata";
import { LanguageTransition } from "@/components/language-transition";
import {
  storefrontButtonPrimary,
  storefrontButtonPrimaryPaddingCompact,
  storefrontButtonSecondary,
  storefrontButtonSecondaryPadding,
  storefrontSurfacePanel,
} from "@/components/ui/storefront";

export const generateMetadata = async (): Promise<Metadata> => {
  const locale = await getLocale();
  const activeLocale = isAppLocale(locale) ? locale : "uk";
  const notFoundTranslations = await getTranslations("NotFound");

  return {
    ...buildAbsoluteRouteMetadata({
      pageTitle: notFoundTranslations("metaTitle"),
      description: notFoundTranslations("metaDescription"),
      path: "/404",
      locale: activeLocale,
    }),
    robots: {
      index: false,
      follow: false,
    },
  };
};

export default async function NotFound() {
  const locale = await getLocale();
  const activeLocale = isAppLocale(locale) ? locale : "uk";
  const notFoundTranslations = await getTranslations("NotFound");

  return (
    <div className="relative flex min-h-dvh w-full flex-col overflow-x-clip bg-background text-foreground">
      <LandingBackground />
      <LandingHeader />
      <LanguageTransition>
        <main className="flex w-full flex-1 items-center py-16">
          <SectionShell>
            <div className={`mx-auto max-w-2xl p-8 text-center sm:p-12 ${storefrontSurfacePanel}`}>
              <p className="font-display text-sm font-semibold uppercase tracking-[0.2em] text-muted-foreground">
                404
              </p>
              <h1 className="mt-4 font-display text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
                {notFoundTranslations("title")}
              </h1>
              <p className="mt-4 text-base leading-normal text-muted-foreground sm:text-lg">
                {notFoundTranslations("lead")}
              </p>
              <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:justify-center">
                <Link
                  href={buildLocalizedPath("/", activeLocale)}
                  className={`inline-flex items-center justify-center ${storefrontButtonPrimary} ${storefrontButtonPrimaryPaddingCompact}`}
                >
                  {notFoundTranslations("backHome")}
                </Link>
                <Link
                  href={buildLocalizedPath("/catalog", activeLocale)}
                  className={`inline-flex items-center justify-center ${storefrontButtonSecondary} ${storefrontButtonSecondaryPadding}`}
                >
                  {notFoundTranslations("goCatalog")}
                </Link>
              </div>
            </div>
          </SectionShell>
        </main>
        <LandingFooter />
      </LanguageTransition>
    </div>
  );
}
