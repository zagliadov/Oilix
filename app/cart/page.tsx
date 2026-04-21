import { ArrowLeft } from "lucide-react";
import Link from "next/link";
import { getTranslations } from "next-intl/server";

import { buildStorefrontSectionMetadata } from "@/app/lib/seo/storefront-section-metadata";
import { LandingBackground } from "@/app/components/landing/landing-background";
import { LandingFooter } from "@/app/components/landing/landing-footer";
import { LandingHeader } from "@/app/components/landing/landing-header";
import { SectionShell } from "@/app/components/landing/section-shell";
import { CartPageClient } from "@/components/cart/cart-page-client";
import { LanguageTransition } from "@/components/language-transition";

export const generateMetadata = async () =>
  buildStorefrontSectionMetadata("Cart", "/cart");

export default async function CartPage() {
  const cartTranslations = await getTranslations("Cart");

  return (
    <div className="relative flex min-h-dvh w-full flex-col overflow-x-clip bg-background text-foreground">
      <LandingBackground />

      <LandingHeader />

      <LanguageTransition>
        <main className="flex w-full flex-1 flex-col pb-20 pt-8">
          <SectionShell>
            <div className="w-full">
              <Link
                href="/"
                className="inline-flex items-center gap-2 text-sm font-medium text-muted-foreground transition hover:text-foreground"
              >
                <ArrowLeft className="h-4 w-4 shrink-0" aria-hidden strokeWidth={2} />
                {cartTranslations("backHome")}
              </Link>

              <header className="mt-10 border-b border-border pb-8">
                <h1 className="font-display text-2xl font-bold tracking-tight text-foreground sm:text-3xl">
                  {cartTranslations("title")}
                </h1>
                <p className="mt-3 text-base text-muted-foreground">
                  {cartTranslations("lead")}
                </p>
              </header>

              <CartPageClient />
            </div>
          </SectionShell>
        </main>

        <LandingFooter />
      </LanguageTransition>
    </div>
  );
}
