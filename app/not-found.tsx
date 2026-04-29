import type { Metadata } from "next";
import Link from "next/link";
import { getLocale, getTranslations } from "next-intl/server";

import { buildLocalizedPath } from "@/app/lib/i18n/build-localized-path";
import { isAppLocale } from "@/app/lib/i18n/locales";
import { buildAbsoluteRouteMetadata } from "@/app/lib/seo/page-metadata";
import { LanguageTransition } from "@/components/language-transition";

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
    <div className="relative min-h-dvh overflow-hidden bg-[#f4f6fb] text-slate-900">
      <LanguageTransition>
        <main className="relative flex min-h-dvh w-full items-start px-6 pt-16 pb-10 sm:px-10 sm:pt-20 lg:px-16 lg:pt-24">
          <div
            className="absolute inset-0 bg-cover bg-center bg-no-repeat"
            style={{ backgroundImage: "url('/landing/image.png')" }}
          />

          <div className="relative z-10 w-full">
            <section className="max-w-2xl lg:pl-4">
              <p className="font-display text-[150px] font-bold leading-none tracking-tight text-[#c79a3b] sm:text-[210px] lg:text-[280px]">
                404
              </p>
              <h1 className="-mt-4 font-display text-5xl font-semibold tracking-tight text-[#b4872f] sm:text-6xl lg:text-7xl">
                {notFoundTranslations("title")}
              </h1>
              <p className="mt-6 max-w-xl text-xl leading-relaxed text-[#9c7832] sm:text-2xl">
                {notFoundTranslations("lead")}
              </p>
              <div className="mt-10 flex flex-wrap items-center gap-5">
                <Link
                  href={buildLocalizedPath("/", activeLocale)}
                  className="inline-flex h-16 items-center gap-3 rounded-2xl bg-[#c79a3b] px-9 text-lg font-semibold text-slate-950 shadow-[0_12px_28px_-12px_rgba(199,154,59,0.75)] transition hover:bg-[#b4872f]"
                >
                  <span aria-hidden="true" className="inline-flex h-7 w-7 items-center justify-center rounded-md bg-black/10">
                    <svg viewBox="0 0 24 24" fill="none" className="h-5 w-5" aria-hidden="true">
                      <path
                        d="M14 18l-6-6 6-6"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
                  </span>
                  {notFoundTranslations("backHome")}
                </Link>
                <Link
                  href={buildLocalizedPath("/catalog", activeLocale)}
                  className="inline-flex h-16 items-center rounded-2xl border border-[#a67c2d] bg-[#e2be73] px-9 text-lg font-semibold text-slate-950 transition hover:bg-[#d7b160]"
                >
                  {notFoundTranslations("goCatalog")}
                </Link>
              </div>
            </section>
          </div>
        </main>
      </LanguageTransition>
    </div>
  );
}
