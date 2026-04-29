import { getTranslations } from "next-intl/server";

import { LandingContactForm } from "@/app/components/landing/landing-contact-form";
import { SectionShell } from "@/app/components/landing/section-shell";
import { ScrollReveal } from "@/components/motion/scroll-reveal";

export const LandingContact = async () => {
  const landingTranslations = await getTranslations("Landing");

  return (
    <ScrollReveal
      as="section"
      id="contact"
      className="w-full border-t border-border bg-linear-to-b from-contact-from to-contact-to py-20"
    >
      <SectionShell>
        <div className="grid w-full gap-12 lg:grid-cols-2 lg:gap-16">
          <div>
            <h2 className="font-display text-2xl font-bold tracking-tight text-foreground sm:text-3xl">
              {landingTranslations("contact.title")}
            </h2>
            <p className="mt-4 max-w-2xl text-base leading-normal text-muted-foreground sm:text-lg">
              {landingTranslations("contact.lead")}
            </p>
          </div>
          <LandingContactForm />
        </div>
      </SectionShell>
    </ScrollReveal>
  );
};
