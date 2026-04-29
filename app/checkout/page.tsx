import { ArrowLeft } from "lucide-react";
import Link from "next/link";
import { getLocale, getTranslations } from "next-intl/server";

import { buildLocalizedPath } from "@/app/lib/i18n/build-localized-path";
import { isAppLocale } from "@/app/lib/i18n/locales";
import { isNovaPoshtaApiConfigured } from "@/app/lib/nova-poshta/env";
import { buildStorefrontSectionMetadata } from "@/app/lib/seo/storefront-section-metadata";
import { CheckoutPageClient } from "@/components/checkout/checkout-page-client";
import { LandingBackground } from "@/app/components/landing/landing-background";
import { LandingFooter } from "@/app/components/landing/landing-footer";
import { LandingHeader } from "@/app/components/landing/landing-header";
import { SectionShell } from "@/app/components/landing/section-shell";
import { LanguageTransition } from "@/components/language-transition";

export const generateMetadata = async () =>
  ({
    ...(await buildStorefrontSectionMetadata("Checkout", "/checkout")),
    robots: {
      index: false,
      follow: true,
    },
  });

export default async function CheckoutPage() {
  const locale = await getLocale();
  const activeLocale = isAppLocale(locale) ? locale : "uk";
  const checkoutTranslations = await getTranslations("Checkout");
  const npApiConfigured = isNovaPoshtaApiConfigured();

  return (
    <div className="relative flex min-h-dvh w-full flex-col overflow-x-clip bg-background text-foreground">
      <LandingBackground />

      <LandingHeader />

      <LanguageTransition>
        <main className="flex w-full flex-1 flex-col pb-20 pt-8">
          <SectionShell>
            <div className="w-full">
              <div className="flex flex-wrap items-center gap-4">
                <Link
                  href={buildLocalizedPath("/cart", activeLocale)}
                  className="inline-flex items-center gap-2 text-sm font-medium text-muted-foreground transition hover:text-foreground"
                >
                  <ArrowLeft className="h-4 w-4 shrink-0" aria-hidden strokeWidth={2} />
                  {checkoutTranslations("backToCart")}
                </Link>
              </div>

              <header className="mt-8 border-b border-border pb-8">
                <h1 className="font-display text-2xl font-bold tracking-tight text-foreground sm:text-3xl">
                  {checkoutTranslations("title")}
                </h1>
                <p className="mt-3 max-w-2xl text-base text-muted-foreground">
                  {checkoutTranslations("lead")}
                </p>
              </header>

              <CheckoutPageClient npApiConfigured={npApiConfigured} />
            </div>
          </SectionShell>
        </main>

        <LandingFooter />
      </LanguageTransition>
    </div>
  );
}
