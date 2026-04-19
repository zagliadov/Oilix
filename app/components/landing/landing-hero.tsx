import * as _ from "lodash";
import { getTranslations } from "next-intl/server";

import { SectionShell } from "@/app/components/landing/section-shell";
import { NavHashLink } from "@/components/nav-hash-link";
import { ScrollReveal } from "@/components/motion/scroll-reveal";
import {
  isStringArray,
  requireLandingMessage,
} from "@/app/lib/i18n/message-guards";

export const LandingHero = async () => {
  const landingTranslations = await getTranslations("Landing");
  const heroPills = requireLandingMessage(
    landingTranslations.raw("hero.pills"),
    isStringArray,
    "Landing.hero.pills",
  );

  return (
    <ScrollReveal as="section" className="relative w-full pb-20 pt-16 sm:pt-24">
      <SectionShell>
        <div className="flex flex-wrap gap-2">
          {_.map(heroPills, (pill) => (
            <span
              key={pill}
              className="rounded-md border border-[var(--pill-border)] bg-[var(--pill-bg)] px-3 py-1.5 text-[0.8125rem] font-medium leading-none text-muted-foreground"
            >
              {pill}
            </span>
          ))}
        </div>
        <h1 className="font-display mt-8 max-w-6xl text-[clamp(2.5rem,5vw+1rem,4.5rem)] font-bold leading-[1.05] tracking-tight text-foreground">
          {landingTranslations("hero.title")}
        </h1>
        <p className="mt-6 max-w-3xl text-base leading-[1.5] text-muted-foreground sm:text-lg sm:leading-[1.5] xl:max-w-4xl">
          {landingTranslations("hero.lead")}
        </p>
        <div className="mt-10 flex flex-wrap gap-4">
          <NavHashLink
            hash="contact"
            className="inline-flex items-center justify-center rounded-md bg-brand px-7 py-3.5 text-base font-medium text-white shadow-[0_0_40px_-8px_var(--glow)] transition hover:brightness-110 active:brightness-95"
          >
            {landingTranslations("hero.ctaPrimary")}
          </NavHashLink>
          <NavHashLink
            hash="promo"
            className="inline-flex items-center justify-center rounded-md border border-border bg-muted/50 px-7 py-3.5 text-base font-medium text-foreground transition hover:bg-muted dark:border-white/15 dark:bg-white/[0.04] dark:hover:border-white/25 dark:hover:bg-white/[0.07]"
          >
            {landingTranslations("hero.ctaSecondary")}
          </NavHashLink>
        </div>
      </SectionShell>
    </ScrollReveal>
  );
};
