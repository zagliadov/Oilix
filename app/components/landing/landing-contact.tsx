import { getTranslations } from "next-intl/server";

import { SectionShell } from "@/app/components/landing/section-shell";
import { ScrollReveal } from "@/components/motion/scroll-reveal";
import {
  storefrontButtonPrimary,
  storefrontButtonPrimaryPaddingCompact,
  storefrontMarketingInput,
  storefrontSurfaceCard,
} from "@/components/ui/storefront";

export const LandingContact = async () => {
  const landingTranslations = await getTranslations("Landing");

  return (
    <ScrollReveal
      as="section"
      id="contact"
      className="w-full border-t border-border bg-gradient-to-b from-[var(--contact-from)] to-[var(--contact-to)] py-20"
    >
      <SectionShell>
        <div className="grid w-full gap-12 lg:grid-cols-2 lg:gap-16">
          <div>
            <h2 className="font-display text-2xl font-bold tracking-tight text-foreground sm:text-3xl">
              {landingTranslations("contact.title")}
            </h2>
            <p className="mt-4 max-w-2xl text-base leading-[1.5] text-muted-foreground sm:text-lg">
              {landingTranslations("contact.lead")}
            </p>
          </div>
          <form
            className={`flex w-full flex-col gap-4 p-6 sm:p-8 ${storefrontSurfaceCard}`}
            action="#"
            method="post"
          >
            <label className="flex flex-col gap-2 text-base">
              <span className="text-muted-foreground">
                {landingTranslations("contact.nameLabel")}
              </span>
              <input
                name="name"
                type="text"
                autoComplete="name"
                className={storefrontMarketingInput}
                placeholder={landingTranslations("placeholders.name")}
              />
            </label>
            <label className="flex flex-col gap-2 text-base">
              <span className="text-muted-foreground">
                {landingTranslations("contact.emailLabel")}
              </span>
              <input
                name="email"
                type="email"
                autoComplete="email"
                className={storefrontMarketingInput}
                placeholder={landingTranslations("placeholders.email")}
              />
            </label>
            <label className="flex flex-col gap-2 text-base">
              <span className="text-muted-foreground">
                {landingTranslations("contact.phoneLabel")}
              </span>
              <input
                name="phone"
                type="tel"
                autoComplete="tel"
                className={storefrontMarketingInput}
                placeholder={landingTranslations("placeholders.phone")}
              />
            </label>
            <p className="text-[0.8125rem] leading-[1.4] text-muted-foreground">
              {landingTranslations("contact.consent")}
            </p>
            <button
              type="submit"
              className={`mt-2 w-full ${storefrontButtonPrimary} ${storefrontButtonPrimaryPaddingCompact}`}
            >
              {landingTranslations("contact.submit")}
            </button>
          </form>
        </div>
      </SectionShell>
    </ScrollReveal>
  );
};
