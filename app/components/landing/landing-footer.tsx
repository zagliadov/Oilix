import Link from "next/link";
import { getTranslations } from "next-intl/server";

import { SectionShell } from "@/app/components/landing/section-shell";
import { ScrollReveal } from "@/components/motion/scroll-reveal";

export const LandingFooter = async () => {
  const landingTranslations = await getTranslations("Landing");

  return (
    <ScrollReveal
      as="footer"
      className="w-full border-t border-border py-10"
      duration={0.5}
    >
      <SectionShell className="flex flex-col items-center gap-4 text-center text-xs text-muted-foreground">
        <nav
          aria-label="Legal"
          className="flex flex-wrap items-center justify-center gap-x-5 gap-y-2"
        >
          <Link
            href="/catalog"
            className="font-medium text-muted-foreground underline-offset-4 transition hover:text-foreground hover:underline"
          >
            {landingTranslations("footer.catalog")}
          </Link>
          <Link
            href="/delivery"
            className="font-medium text-muted-foreground underline-offset-4 transition hover:text-foreground hover:underline"
          >
            {landingTranslations("footer.delivery")}
          </Link>
          <Link
            href="/public-offer"
            className="font-medium text-muted-foreground underline-offset-4 transition hover:text-foreground hover:underline"
          >
            {landingTranslations("footer.publicOffer")}
          </Link>
          <Link
            href="/returns"
            className="font-medium text-muted-foreground underline-offset-4 transition hover:text-foreground hover:underline"
          >
            {landingTranslations("footer.returns")}
          </Link>
          <Link
            href="/cart"
            className="font-medium text-muted-foreground underline-offset-4 transition hover:text-foreground hover:underline"
          >
            {landingTranslations("footer.cart")}
          </Link>
        </nav>
        <p>
          {landingTranslations("footer.copyright", {
            year: new Date().getFullYear(),
          })}
        </p>
      </SectionShell>
    </ScrollReveal>
  );
};
