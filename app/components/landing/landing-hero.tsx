import * as _ from "lodash";
import { getTranslations } from "next-intl/server";

import { SectionShell } from "@/app/components/landing/section-shell";
import { NavHashLink } from "@/components/nav-hash-link";
import { ScrollReveal } from "@/components/motion/scroll-reveal";
import {
  storefrontButtonPrimary,
  storefrontButtonPrimaryPadding,
  storefrontButtonSecondarySoft,
} from "@/components/ui/storefront";
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
              className="rounded-md border border-pill-border bg-pill-bg px-3 py-1.5 text-[0.8125rem] font-medium leading-none text-muted-foreground"
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
            className={`${storefrontButtonPrimary} ${storefrontButtonPrimaryPadding} shadow-cta-glow`}
          >
            {landingTranslations("hero.ctaPrimary")}
          </NavHashLink>
          <NavHashLink
            hash="promo"
            className={`${storefrontButtonSecondarySoft} ${storefrontButtonPrimaryPadding}`}
          >
            {landingTranslations("hero.ctaSecondary")}
          </NavHashLink>
        </div>
      </SectionShell>
    </ScrollReveal>
  );
};
