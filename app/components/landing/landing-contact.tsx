import { getTranslations } from "next-intl/server";

import { SectionShell } from "@/app/components/landing/section-shell";
import { ScrollReveal } from "@/components/motion/scroll-reveal";

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
            className="flex w-full flex-col gap-4 rounded-md border border-border bg-card p-6 sm:p-8"
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
                className="w-full rounded-md border border-[var(--input-border)] bg-[var(--input-bg)] px-4 py-3 text-base text-foreground outline-none ring-brand/30 placeholder:text-muted-foreground focus:ring-2 focus:ring-brand/40"
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
                className="w-full rounded-md border border-[var(--input-border)] bg-[var(--input-bg)] px-4 py-3 text-base text-foreground outline-none ring-brand/30 placeholder:text-muted-foreground focus:ring-2 focus:ring-brand/40"
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
                className="w-full rounded-md border border-[var(--input-border)] bg-[var(--input-bg)] px-4 py-3 text-base text-foreground outline-none ring-brand/30 placeholder:text-muted-foreground focus:ring-2 focus:ring-brand/40"
                placeholder={landingTranslations("placeholders.phone")}
              />
            </label>
            <p className="text-[0.8125rem] leading-[1.4] text-muted-foreground">
              {landingTranslations("contact.consent")}
            </p>
            <button
              type="submit"
              className="mt-2 rounded-md bg-brand py-3.5 text-base font-medium text-white transition hover:brightness-110 active:brightness-95"
            >
              {landingTranslations("contact.submit")}
            </button>
          </form>
        </div>
      </SectionShell>
    </ScrollReveal>
  );
};
