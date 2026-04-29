import type { Metadata } from "next";
import Link from "next/link";
import { getLocale, getTranslations } from "next-intl/server";

import { NotFoundLoopAudio } from "@/app/components/not-found/not-found-loop-audio";
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
    <div className="relative min-h-svh overflow-hidden bg-[#0a0a0c] text-slate-900">
      <NotFoundLoopAudio src="/landing/music.webm" />
      <LanguageTransition>
        <main className="relative flex min-h-svh w-full flex-col px-4 lg:min-h-dvh lg:flex-row lg:items-start lg:justify-start lg:px-16 lg:pb-10 lg:pt-24">
          {/* Mobile / tablet: anchor higher so face stays in upper half; desktop unchanged. */}
          <div
            className="absolute inset-0 bg-cover bg-no-repeat bg-position-[58%_28%] sm:bg-position-[56%_30%] lg:bg-center"
            style={{ backgroundImage: "url('/landing/image.png')" }}
            aria-hidden="true"
          />

          {/* Bottom readability strip — dark tint only, no solid card (mobile / tablet). */}
          <div
            className="pointer-events-none absolute inset-x-0 bottom-0 z-1 h-[min(52vh,480px)] bg-linear-to-t from-black/75 via-black/35 to-transparent lg:hidden"
            aria-hidden="true"
          />

          <div className="relative z-10 mt-auto w-full lg:mt-0 lg:flex-none">
            <section className="mx-auto w-full max-w-lg px-1 pb-[max(1.25rem,env(safe-area-inset-bottom))] pt-4 sm:max-w-2xl sm:px-2 lg:mx-0 lg:max-w-2xl lg:pb-0 lg:pl-4 lg:pt-0">
              <p className="font-display text-[clamp(4rem,16vw,8.5rem)] font-bold leading-[0.95] tracking-tight text-[#c79a3b] drop-shadow-[0_3px_14px_rgba(0,0,0,0.85)] sm:text-[clamp(5rem,13vw,10rem)] lg:text-[280px] lg:leading-none lg:drop-shadow-none">
                404
              </p>
              <h1 className="mt-1 font-display text-[1.6rem] font-semibold leading-tight tracking-tight text-[#e8c97a] drop-shadow-[0_2px_10px_rgba(0,0,0,0.9)] sm:text-4xl lg:-mt-4 lg:text-7xl lg:text-[#b4872f] lg:drop-shadow-none">
                {notFoundTranslations("title")}
              </h1>
              <p className="mt-3 max-w-xl text-[0.92rem] leading-snug text-[#f0e6cc] drop-shadow-[0_2px_8px_rgba(0,0,0,0.85)] sm:mt-4 sm:text-lg lg:mt-6 lg:text-2xl lg:leading-relaxed lg:text-[#9c7832] lg:drop-shadow-none">
                {notFoundTranslations("lead")}
              </p>
              <div className="mt-5 flex flex-col gap-3 sm:mt-7 lg:mt-10 lg:flex-row lg:flex-wrap lg:items-center lg:gap-5">
                <Link
                  href={buildLocalizedPath("/", activeLocale)}
                  className="inline-flex h-14 w-full shrink-0 items-center justify-center gap-3 rounded-2xl bg-[#c79a3b] px-6 text-base font-semibold text-slate-950 shadow-[0_12px_28px_-12px_rgba(199,154,59,0.75)] transition hover:bg-[#b4872f] sm:h-16 lg:w-auto lg:px-9 lg:text-lg"
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
                  className="inline-flex h-14 w-full shrink-0 items-center justify-center rounded-2xl border border-[#c49a45] bg-[#e2be73]/95 px-6 text-base font-semibold text-slate-950 transition hover:bg-[#d7b160] sm:h-16 lg:w-auto lg:px-9 lg:text-lg"
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
