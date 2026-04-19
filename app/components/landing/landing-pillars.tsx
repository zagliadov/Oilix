import * as _ from "lodash";
import { getTranslations } from "next-intl/server";

import { SectionShell } from "@/app/components/landing/section-shell";
import {
  isPillarItemArray,
  requireLandingMessage,
} from "@/app/lib/i18n/message-guards";

export const LandingPillars = async () => {
  const landingTranslations = await getTranslations("Landing");
  const pillarItems = requireLandingMessage(
    landingTranslations.raw("pillars.items"),
    isPillarItemArray,
    "Landing.pillars.items",
  );

  return (
    <section className="w-full py-20">
      <SectionShell>
        <h2 className="font-display text-2xl font-bold tracking-tight text-foreground sm:text-3xl">
          {landingTranslations("pillars.title")}
        </h2>
        <p className="mt-3 max-w-3xl text-base leading-[1.5] text-muted-foreground sm:text-lg">
          {landingTranslations("pillars.lead")}
        </p>
        <div className="mt-12 grid w-full gap-6 lg:grid-cols-3">
          {_.map(pillarItems, (pillar) => (
            <article
              key={pillar.title}
              className="flex flex-col rounded-2xl border border-border bg-gradient-to-b from-muted/70 to-transparent p-6 dark:from-white/[0.06]"
            >
              <h3 className="font-display text-lg font-semibold uppercase tracking-wide text-foreground">
                {pillar.title}
              </h3>
              <p className="mt-3 flex-1 text-base leading-[1.5] text-muted-foreground">
                {pillar.body}
              </p>
            </article>
          ))}
        </div>
      </SectionShell>
    </section>
  );
};
