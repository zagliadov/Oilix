import * as _ from "lodash";
import { getTranslations } from "next-intl/server";

import { SectionShell } from "@/app/components/landing/section-shell";
import {
  isStringArray,
  requireLandingMessage,
} from "@/app/lib/i18n/message-guards";

export const LandingQuality = async () => {
  const landingTranslations = await getTranslations("Landing");
  const bulletPoints = requireLandingMessage(
    landingTranslations.raw("quality.bullets"),
    isStringArray,
    "Landing.quality.bullets",
  );

  return (
    <section
      id="quality"
      className="w-full border-t border-border bg-[var(--section-deep)] py-20"
    >
      <SectionShell>
        <div className="grid w-full gap-10 lg:grid-cols-[1.1fr_0.9fr] lg:items-center">
          <div>
            <h2 className="font-display text-2xl font-bold tracking-tight text-foreground sm:text-3xl">
              {landingTranslations("quality.title")}
            </h2>
            <p className="mt-4 max-w-3xl text-base leading-[1.5] text-muted-foreground sm:text-lg">
              {landingTranslations("quality.lead")}
            </p>
            <ul className="mt-8 space-y-3 text-base leading-[1.5] text-foreground/90 dark:text-zinc-300">
              {_.map(bulletPoints, (bulletPoint) => (
                <li key={bulletPoint} className="flex gap-3">
                  <span className="mt-1 h-1.5 w-1.5 shrink-0 rounded-full bg-violet-600 dark:bg-violet-400" />
                  {bulletPoint}
                </li>
              ))}
            </ul>
          </div>
          <div className="rounded-2xl border border-violet-500/25 bg-[var(--accent-soft)] p-6 sm:p-8 dark:border-violet-500/20">
            <p className="font-display text-[0.875rem] font-semibold uppercase tracking-wider text-violet-700 dark:text-violet-200/90">
              {landingTranslations("quality.quoteLabel")}
            </p>
            <p className="mt-4 text-lg font-medium leading-[1.5] text-foreground">
              {landingTranslations("quality.quote")}
            </p>
            <p className="mt-6 text-base leading-[1.5] text-muted-foreground">
              {landingTranslations("quality.quoteFooter")}
            </p>
          </div>
        </div>
      </SectionShell>
    </section>
  );
};
