import * as _ from "lodash";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";
import { getTranslations } from "next-intl/server";

import { LandingBackground } from "@/app/components/landing/landing-background";
import { LandingFooter } from "@/app/components/landing/landing-footer";
import { LandingHeader } from "@/app/components/landing/landing-header";
import { SectionShell } from "@/app/components/landing/section-shell";
import { LanguageTransition } from "@/components/language-transition";

const consumerProtectionLawUrl =
  "https://zakon.rada.gov.ua/cgi-bin/laws/main.cgi?nreg=1023-12";

export const generateMetadata = async () => {
  const returnsTranslations = await getTranslations("Returns");
  return {
    title: returnsTranslations("metaTitle"),
    description: returnsTranslations("metaDescription"),
  };
};

export default async function ReturnsPage() {
  const returnsTranslations = await getTranslations("Returns");
  const introSteps = returnsTranslations.raw("introSteps") as string[];
  const documents = returnsTranslations.raw("documents") as string[];
  const rulesBullets = returnsTranslations.raw("rulesBullets") as string[];

  return (
    <div className="relative flex min-h-dvh w-full flex-col overflow-x-clip bg-background text-foreground">
      <LandingBackground />

      <LandingHeader />

      <LanguageTransition>
        <main className="flex w-full flex-1 flex-col pb-20 pt-8">
          <SectionShell>
            <div className="w-full">
              <Link
                href="/"
                className="inline-flex items-center gap-2 text-sm font-medium text-muted-foreground transition hover:text-foreground"
              >
                <ArrowLeft className="h-4 w-4 shrink-0" aria-hidden strokeWidth={2} />
                {returnsTranslations("backHome")}
              </Link>

              <header className="mt-10 border-b border-border pb-8">
                <h1 className="font-display text-2xl font-bold tracking-tight text-foreground sm:text-3xl">
                  {returnsTranslations("title")}
                </h1>
                <p className="mt-3 text-base leading-[1.5] text-muted-foreground sm:text-lg">
                  {returnsTranslations("subtitle")}
                </p>
              </header>

              <section className="mt-10">
                <h2 className="font-display text-lg font-semibold uppercase tracking-wide text-foreground">
                  {returnsTranslations("introTitle")}
                </h2>
                <ol className="mt-5 list-decimal space-y-3 pl-5 text-base leading-[1.6] text-foreground/90 dark:text-zinc-300">
                  {_.map(introSteps, (step) => (
                    <li key={step}>{step}</li>
                  ))}
                </ol>
              </section>

              <section className="mt-10 rounded-md border border-border bg-card p-6 dark:border-white/[0.08] dark:bg-white/[0.03] sm:p-8">
                <h2 className="font-display text-lg font-semibold uppercase tracking-wide text-foreground">
                  {returnsTranslations("documentsTitle")}
                </h2>
                <ul className="mt-5 space-y-3 text-base leading-[1.6] text-foreground/90 dark:text-zinc-300">
                  {_.map(documents, (item) => (
                    <li key={item} className="flex gap-3">
                      <span
                        className="mt-2 h-1.5 w-1.5 shrink-0 rounded-md bg-brand"
                        aria-hidden
                      />
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </section>

              <section className="mt-10">
                <h2 className="font-display text-lg font-semibold uppercase tracking-wide text-foreground">
                  {returnsTranslations("rulesTitle")}
                </h2>
                <p className="mt-4 text-base leading-[1.6] text-muted-foreground">
                  {returnsTranslations("rulesLead")}
                </p>
                <ul className="mt-5 space-y-3 text-base leading-[1.6] text-foreground/90 dark:text-zinc-300">
                  {_.map(rulesBullets, (item) => (
                    <li key={item} className="flex gap-3">
                      <span
                        className="mt-2 h-1.5 w-1.5 shrink-0 rounded-md bg-brand"
                        aria-hidden
                      />
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </section>

              <p className="mt-10 rounded-md border border-brand/25 bg-[var(--accent-soft)] p-4 text-sm leading-[1.6] text-muted-foreground dark:border-brand/20">
                {returnsTranslations("deliveryNote")}
              </p>

              <section className="mt-10 border-t border-border pt-10">
                <h2 className="font-display text-lg font-semibold uppercase tracking-wide text-foreground">
                  {returnsTranslations("lawTitle")}
                </h2>
                <p className="mt-3 text-base leading-[1.6] text-muted-foreground">
                  {returnsTranslations("lawLead")}
                </p>
                <p className="mt-4">
                  <a
                    href={consumerProtectionLawUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-base font-medium text-brand underline-offset-4 transition hover:underline"
                  >
                    {returnsTranslations("lawLinkLabel")}
                  </a>
                </p>
              </section>
            </div>
          </SectionShell>
        </main>

        <LandingFooter />
      </LanguageTransition>
    </div>
  );
}
