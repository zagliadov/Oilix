import * as _ from "lodash";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";
import { getTranslations } from "next-intl/server";

import { ProductCard } from "@/app/components/catalog/product-card";
import { LandingBackground } from "@/app/components/landing/landing-background";
import { LandingFooter } from "@/app/components/landing/landing-footer";
import { LandingHeader } from "@/app/components/landing/landing-header";
import { SectionShell } from "@/app/components/landing/section-shell";
import { catalogProducts } from "@/app/lib/mocks/catalog-products";
import { LanguageTransition } from "@/components/language-transition";

export const generateMetadata = async () => {
  const catalogTranslations = await getTranslations("Catalog");
  return {
    title: catalogTranslations("metaTitle"),
    description: catalogTranslations("metaDescription"),
  };
};

export default async function CatalogPage() {
  const catalogTranslations = await getTranslations("Catalog");
  const landingTranslations = await getTranslations("Landing");

  const labels = {
    noImage: landingTranslations("products.noImage"),
    volumeUnit: landingTranslations("products.volumeUnit"),
    currency: landingTranslations("products.currency"),
    viewProduct: landingTranslations("products.viewProduct"),
    promoBadge: landingTranslations("products.promoBadge"),
  };

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

              <ul className="mt-12 grid w-full list-none grid-cols-1 gap-6 p-0 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                {_.map(catalogProducts, (product) => (
                  <li key={product.id}>
                    <ProductCard product={product} labels={labels} />
                  </li>
                ))}
              </ul>
            </div>
          </SectionShell>
        </main>

        <LandingFooter />
      </LanguageTransition>
    </div>
  );
}
