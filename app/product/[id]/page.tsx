import { ArrowLeft } from "lucide-react";
import Link from "next/link";
import { notFound } from "next/navigation";
import { getTranslations } from "next-intl/server";

import { LandingBackground } from "@/app/components/landing/landing-background";
import { LandingFooter } from "@/app/components/landing/landing-footer";
import { LandingHeader } from "@/app/components/landing/landing-header";
import { ProductImagePlaceholder } from "@/app/components/landing/product-image-placeholder";
import { SectionShell } from "@/app/components/landing/section-shell";
import { formatPriceUah } from "@/app/lib/format-price";
import { AddToCartButton } from "@/components/cart/add-to-cart-button";
import { LanguageTransition } from "@/components/language-transition";
import { NavHashLink } from "@/components/nav-hash-link";
import {
  catalogProducts,
  getCatalogProductById,
  getDiscountPercent,
  getEffectivePriceUah,
} from "@/app/lib/mocks/catalog-products";

type ProductPageProps = {
  params: Promise<{ id: string }>;
};

export const dynamicParams = false;

export const generateStaticParams = () =>
  catalogProducts.map((product) => ({ id: product.id }));

export const generateMetadata = async ({ params }: ProductPageProps) => {
  const { id } = await params;
  const product = getCatalogProductById(id);
  const productTranslations = await getTranslations("Product");

  if (!product) {
    return {
      title: productTranslations("notFoundTitle"),
    };
  }

  const priceFormatted = formatPriceUah(getEffectivePriceUah(product));

  return {
    title: productTranslations("metaTitle", {
      brand: product.brand,
      name: product.name,
    }),
    description: productTranslations("metaDescription", {
      brand: product.brand,
      name: product.name,
      viscosity: product.viscosity,
      volumeLiters: String(product.volumeLiters),
      price: priceFormatted,
    }),
  };
};

export default async function ProductPage({ params }: ProductPageProps) {
  const { id } = await params;
  const product = getCatalogProductById(id);

  if (!product) {
    notFound();
  }

  const landingTranslations = await getTranslations("Landing");
  const productTranslations = await getTranslations("Product");
  const discountPercent = getDiscountPercent(product);
  const effectivePriceUah = getEffectivePriceUah(product);

  return (
    <div className="relative flex min-h-dvh w-full flex-col overflow-x-clip bg-background text-foreground">
      <LandingBackground />

      <LandingHeader />

      <LanguageTransition>
        <main className="flex w-full flex-1 flex-col pb-20 pt-8">
          <SectionShell>
            <Link
              href="/catalog"
              className="inline-flex items-center gap-2 text-sm font-medium text-muted-foreground transition hover:text-foreground"
            >
              <ArrowLeft
                className="h-4 w-4 shrink-0"
                aria-hidden
                strokeWidth={2}
              />
              {productTranslations("backToCatalog")}
            </Link>

            <div className="mt-10 grid gap-10 lg:grid-cols-2 lg:gap-16">
              <ProductImagePlaceholder
                label={landingTranslations("products.noImage")}
                className="lg:sticky lg:top-24"
              />

              <div>
                <p className="text-[0.6875rem] font-semibold uppercase tracking-wider text-muted-foreground">
                  {product.brand}
                </p>
                <div className="mt-2 flex flex-wrap items-center gap-2">
                  <h1 className="font-display text-2xl font-bold tracking-tight text-foreground sm:text-3xl">
                    {product.name}
                  </h1>
                  {discountPercent !== null ? (
                    <span className="rounded bg-brand px-2 py-0.5 text-xs font-bold uppercase tracking-wide text-white">
                      −{discountPercent}% · {landingTranslations("products.promoBadge")}
                    </span>
                  ) : null}
                </div>
                <p className="mt-4 text-base leading-[1.5] text-muted-foreground">
                  {productTranslations("lead")}
                </p>

                <dl className="mt-8 space-y-4 rounded-md border border-border bg-card p-6 dark:border-white/[0.08] dark:bg-white/[0.03]">
                  <div className="flex flex-col gap-1 sm:flex-row sm:items-baseline sm:justify-between sm:gap-4">
                    <dt className="text-sm text-muted-foreground">
                      {productTranslations("viscosity")}
                    </dt>
                    <dd className="font-medium text-foreground">
                      {product.viscosity}
                    </dd>
                  </div>
                  <div className="flex flex-col gap-1 sm:flex-row sm:items-baseline sm:justify-between sm:gap-4">
                    <dt className="text-sm text-muted-foreground">
                      {productTranslations("volume")}
                    </dt>
                    <dd className="font-medium text-foreground">
                      {product.volumeLiters}{" "}
                      {landingTranslations("products.volumeUnit")}
                    </dd>
                  </div>
                  <div className="flex flex-col gap-1 sm:flex-row sm:items-baseline sm:justify-between sm:gap-4">
                    <dt className="text-sm text-muted-foreground">
                      {productTranslations("price")}
                    </dt>
                    <dd className="text-right">
                      {discountPercent !== null ? (
                        <p className="text-sm text-muted-foreground line-through tabular-nums">
                          {formatPriceUah(product.priceUah)}{" "}
                          {landingTranslations("products.currency")}
                        </p>
                      ) : null}
                      <p className="text-lg font-semibold tabular-nums text-foreground">
                        {formatPriceUah(effectivePriceUah)}{" "}
                        {landingTranslations("products.currency")}
                      </p>
                    </dd>
                  </div>
                </dl>

                <div className="mt-8 flex w-full flex-col gap-3 sm:flex-row sm:flex-wrap sm:items-start">
                  <AddToCartButton productId={product.id} variant="primary" />
                  <NavHashLink
                    hash="contact"
                    className="inline-flex w-full items-center justify-center rounded-md border border-border bg-transparent px-7 py-3.5 text-base font-medium text-foreground transition hover:bg-muted/50 dark:border-white/15 sm:w-auto"
                  >
                    {productTranslations("orderCta")}
                  </NavHashLink>
                </div>
              </div>
            </div>
          </SectionShell>
        </main>

        <LandingFooter />
      </LanguageTransition>
    </div>
  );
}
