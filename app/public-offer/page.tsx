import { ArrowLeft } from "lucide-react";
import Link from "next/link";
import { getLocale, getTranslations } from "next-intl/server";

import { LandingBackground } from "@/app/components/landing/landing-background";
import { LandingFooter } from "@/app/components/landing/landing-footer";
import { LandingHeader } from "@/app/components/landing/landing-header";
import { SectionShell } from "@/app/components/landing/section-shell";
import { LanguageTransition } from "@/components/language-transition";
import { loadPublicOfferText } from "@/app/lib/legal/load-public-offer";

import { PublicOfferBlocks } from "./public-offer-blocks";

export const generateMetadata = async () => {
  const offerTranslations = await getTranslations("PublicOffer");
  return {
    title: offerTranslations("metaTitle"),
    description: offerTranslations("metaDescription"),
  };
};

export default async function PublicOfferPage() {
  const locale = await getLocale();
  const offerTranslations = await getTranslations("PublicOffer");
  const text = await loadPublicOfferText(locale);

  return (
    <div className="relative flex min-h-dvh w-full flex-col overflow-x-clip bg-background text-foreground">
      <LandingBackground />

      <LandingHeader />

      <LanguageTransition>
        <main className="flex w-full flex-1 flex-col pb-20 pt-8">
          <SectionShell>
            <div className="mx-auto w-full max-w-3xl">
              <Link
                href="/"
                className="inline-flex items-center gap-2 text-sm font-medium text-muted-foreground transition hover:text-foreground"
              >
                <ArrowLeft className="h-4 w-4 shrink-0" aria-hidden strokeWidth={2} />
                {offerTranslations("backHome")}
              </Link>

              <header className="mt-8 border-b border-border pb-8">
                <h1 className="font-display text-2xl font-bold tracking-tight text-foreground sm:text-3xl">
                  {offerTranslations("title")}
                </h1>
                <p className="mt-3 text-sm text-muted-foreground">
                  {offerTranslations("subtitle")}
                </p>
              </header>

              <PublicOfferBlocks text={text} />
            </div>
          </SectionShell>
        </main>

        <LandingFooter />
      </LanguageTransition>
    </div>
  );
}
