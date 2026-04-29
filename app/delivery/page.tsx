import * as _ from "lodash";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";
import { getLocale, getTranslations } from "next-intl/server";

import { buildLocalizedPath } from "@/app/lib/i18n/build-localized-path";
import { isAppLocale } from "@/app/lib/i18n/locales";
import { buildStorefrontSectionMetadata } from "@/app/lib/seo/storefront-section-metadata";
import { LandingBackground } from "@/app/components/landing/landing-background";
import { LandingFooter } from "@/app/components/landing/landing-footer";
import { LandingHeader } from "@/app/components/landing/landing-header";
import { SectionShell } from "@/app/components/landing/section-shell";
import { LanguageTransition } from "@/components/language-transition";
import { NavHashLink } from "@/components/nav-hash-link";

export const generateMetadata = async () =>
  buildStorefrontSectionMetadata("Delivery", "/delivery");

export default async function DeliveryPage() {
  const locale = await getLocale();
  const activeLocale = isAppLocale(locale) ? locale : "uk";
  const deliveryTranslations = await getTranslations("Delivery");
  const novaPoints = deliveryTranslations.raw("novaPoints") as string[];
  const ukrposhtaPoints = deliveryTranslations.raw("ukrposhtaPoints") as string[];

  return (
    <div className="relative flex min-h-dvh w-full flex-col overflow-x-clip bg-background text-foreground">
      <LandingBackground />

      <LandingHeader />

      <LanguageTransition>
        <main className="flex w-full flex-1 flex-col pb-20 pt-8">
          <SectionShell>
            <Link
              href={buildLocalizedPath("/", activeLocale)}
              className="inline-flex items-center gap-2 text-sm font-medium text-muted-foreground transition hover:text-foreground"
            >
              <ArrowLeft className="h-4 w-4 shrink-0" aria-hidden strokeWidth={2} />
              {deliveryTranslations("backHome")}
            </Link>

            <header className="mt-10 max-w-3xl">
              <h1 className="font-display text-2xl font-bold tracking-tight text-foreground sm:text-3xl">
                {deliveryTranslations("title")}
              </h1>
              <p className="mt-4 text-base leading-normal text-muted-foreground sm:text-lg">
                {deliveryTranslations("lead")}
              </p>
            </header>

            <div className="mt-12 grid gap-8 lg:grid-cols-2">
              <section className="rounded-md border border-border bg-card p-6 dark:border-white/8 dark:bg-white/3 sm:p-8">
                <h2 className="font-display text-lg font-semibold uppercase tracking-wide text-foreground">
                  {deliveryTranslations("novaTitle")}
                </h2>
                <p className="mt-3 text-base leading-normal text-muted-foreground">
                  {deliveryTranslations("novaLead")}
                </p>
                <ul className="mt-6 space-y-3 text-base leading-normal text-foreground/90 dark:text-zinc-300">
                  {_.map(novaPoints, (point) => (
                    <li key={point} className="flex gap-3">
                      <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-md bg-brand" aria-hidden />
                      <span>{point}</span>
                    </li>
                  ))}
                </ul>
              </section>

              <section className="rounded-md border border-border bg-card p-6 dark:border-white/8 dark:bg-white/3 sm:p-8">
                <h2 className="font-display text-lg font-semibold uppercase tracking-wide text-foreground">
                  {deliveryTranslations("ukrposhtaTitle")}
                </h2>
                <p className="mt-3 text-base leading-normal text-muted-foreground">
                  {deliveryTranslations("ukrposhtaLead")}
                </p>
                <ul className="mt-6 space-y-3 text-base leading-normal text-foreground/90 dark:text-zinc-300">
                  {_.map(ukrposhtaPoints, (point) => (
                    <li key={point} className="flex gap-3">
                      <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-md bg-brand" aria-hidden />
                      <span>{point}</span>
                    </li>
                  ))}
                </ul>
              </section>
            </div>

            <p className="mt-10 max-w-3xl rounded-md border border-brand/25 bg-brand-soft p-4 text-sm leading-normal text-muted-foreground dark:border-brand/20">
              {deliveryTranslations("note")}
            </p>

            <NavHashLink
              hash="contact"
              className="mt-8 inline-flex w-full items-center justify-center rounded-md bg-brand px-7 py-3.5 text-base font-medium text-white transition hover:brightness-110 active:brightness-95 sm:w-auto"
            >
              {deliveryTranslations("ctaOrder")}
            </NavHashLink>
          </SectionShell>
        </main>

        <LandingFooter />
      </LanguageTransition>
    </div>
  );
}
