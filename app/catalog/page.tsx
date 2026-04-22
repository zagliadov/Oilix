import { ArrowLeft } from "lucide-react";
import Link from "next/link";
import { getTranslations } from "next-intl/server";

import { buildStorefrontSectionMetadata } from "@/app/lib/seo/storefront-section-metadata";
import { CatalogExplorer } from "@/app/components/catalog/catalog-explorer";
import { LandingBackground } from "@/app/components/landing/landing-background";
import { LandingFooter } from "@/app/components/landing/landing-footer";
import { LandingHeader } from "@/app/components/landing/landing-header";
import { SectionShell } from "@/app/components/landing/section-shell";
import { buildCatalogIndexes, computeEffectivePriceBounds } from "@/app/lib/catalog";
import { getCatalogBundle } from "@/app/lib/catalog/load-catalog";
import { LanguageTransition } from "@/components/language-transition";

export const generateMetadata = async () =>
  buildStorefrontSectionMetadata("Catalog", "/catalog");

export default async function CatalogPage() {
  const catalogTranslations = await getTranslations("Catalog");

  const catalog = buildCatalogIndexes(await getCatalogBundle());
  const { brands, categories, products: storeProducts } = catalog.bundle;
  const priceBounds = computeEffectivePriceBounds(storeProducts);

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
                {catalogTranslations("backHome")}
              </Link>

              <header className="mt-10 border-b border-border pb-8">
                <h1 className="font-display text-2xl font-bold tracking-tight text-foreground sm:text-3xl">
                  {catalogTranslations("title")}
                </h1>
                <p className="mt-3 max-w-3xl text-base leading-[1.5] text-muted-foreground sm:text-lg">
                  {catalogTranslations("lead")}
                </p>
              </header>

              <CatalogExplorer
                products={storeProducts}
                brands={brands}
                categories={categories}
                priceBounds={priceBounds}
                catalog={catalog}
              />
            </div>
          </SectionShell>
        </main>

        <LandingFooter />
      </LanguageTransition>
    </div>
  );
}
