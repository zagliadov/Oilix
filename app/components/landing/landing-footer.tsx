import Link from "next/link";
import { getLocale, getTranslations } from "next-intl/server";

import { buildLocalizedPath } from "@/app/lib/i18n/build-localized-path";
import { isAppLocale } from "@/app/lib/i18n/locales";
import { SectionShell } from "@/app/components/landing/section-shell";
import { ScrollReveal } from "@/components/motion/scroll-reveal";

export const LandingFooter = async () => {
  const locale = await getLocale();
  const activeLocale = isAppLocale(locale) ? locale : "uk";
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
            href={buildLocalizedPath("/catalog", activeLocale)}
            className="font-medium text-muted-foreground underline-offset-4 transition hover:text-foreground hover:underline"
          >
            {landingTranslations("footer.catalog")}
          </Link>
          <Link
            href={buildLocalizedPath("/delivery", activeLocale)}
            className="font-medium text-muted-foreground underline-offset-4 transition hover:text-foreground hover:underline"
          >
            {landingTranslations("footer.delivery")}
          </Link>
          <Link
            href={buildLocalizedPath("/public-offer", activeLocale)}
            className="font-medium text-muted-foreground underline-offset-4 transition hover:text-foreground hover:underline"
          >
            {landingTranslations("footer.publicOffer")}
          </Link>
          <Link
            href={buildLocalizedPath("/returns", activeLocale)}
            className="font-medium text-muted-foreground underline-offset-4 transition hover:text-foreground hover:underline"
          >
            {landingTranslations("footer.returns")}
          </Link>
          <Link
            href={buildLocalizedPath("/cart", activeLocale)}
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
