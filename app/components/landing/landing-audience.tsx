import * as _ from "lodash";
import { getTranslations } from "next-intl/server";

import { SectionShell } from "@/app/components/landing/section-shell";
import {
  isStringArray,
  requireLandingMessage,
} from "@/app/lib/i18n/message-guards";

export const LandingAudience = async () => {
  const landingTranslations = await getTranslations("Landing");
  const audiencePoints = requireLandingMessage(
    landingTranslations.raw("audience.points"),
    isStringArray,
    "Landing.audience.points",
  );

  return (
    <section
      id="audience"
      className="w-full border-t border-border bg-[var(--section)] py-20"
    >
      <SectionShell>
        <h2 className="font-display text-2xl font-bold tracking-tight text-foreground sm:text-3xl">
          {landingTranslations("audience.title")}
        </h2>
        <p className="mt-3 max-w-3xl text-base leading-[1.5] text-muted-foreground sm:text-lg">
          {landingTranslations("audience.lead")}
        </p>
        <ul className="mt-10 grid w-full gap-4 sm:grid-cols-2 lg:grid-cols-2 xl:grid-cols-4">
          {_.map(audiencePoints, (point) => (
            <li
              key={point}
              className="rounded-2xl border border-border bg-card p-5 text-base leading-[1.5] text-foreground/90 shadow-[inset_0_1px_0_0_rgba(255,255,255,0.04)] dark:text-zinc-300"
            >
              <span className="mr-2 text-violet-600 dark:text-violet-400">—</span>
              {point}
            </li>
          ))}
        </ul>
      </SectionShell>
    </section>
  );
};
