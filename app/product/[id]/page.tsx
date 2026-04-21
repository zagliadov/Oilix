import * as _ from "lodash";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";
import { notFound } from "next/navigation";
import { getTranslations } from "next-intl/server";

import { ProductDetailBreadcrumb } from "@/app/components/product/product-detail-breadcrumb";
import { ProductDetailDescriptionSection } from "@/app/components/product/product-detail-description-section";
import { ProductDetailMetaStrip } from "@/app/components/product/product-detail-meta-strip";
import { ProductDetailPricing } from "@/app/components/product/product-detail-pricing";
import { ProductDetailSpecsSection } from "@/app/components/product/product-detail-specs-section";
import { ProductShelf } from "@/app/components/product/product-shelf";
import { LandingBackground } from "@/app/components/landing/landing-background";
import { LandingFooter } from "@/app/components/landing/landing-footer";
import { LandingHeader } from "@/app/components/landing/landing-header";
import { ProductImagePlaceholder } from "@/app/components/landing/product-image-placeholder";
import { SectionShell } from "@/app/components/landing/section-shell";
import { renderProductDetailSpecRows } from "@/app/components/catalog/product-detail-spec-rows";
import { formatPriceUah } from "@/app/lib/format-price";
import { buildAbsoluteRouteMetadata } from "@/app/lib/seo/page-metadata";
import { buildProductCardSpecContextFromLanding } from "@/app/lib/i18n/product-card-spec-context";
import type { ProductCardLabels } from "@/app/components/catalog/product-card";
import {
  getBrandNameForProduct,
  getCategoryById,
  getCrossSellProducts,
  getDiscountPercent,
  getEffectivePriceUah,
  getProductCardSpecLine,
  getRelatedProducts,
  getStoreProductById,
  storeProducts,
} from "@/app/lib/catalog";
import { AddToCartButton } from "@/components/cart/add-to-cart-button";
import { LanguageTransition } from "@/components/language-transition";
import { NavHashLink } from "@/components/nav-hash-link";
import {
  storefrontBadgePromoSoft,
  storefrontButtonPrimaryPadding,
  storefrontButtonSecondary,
} from "@/components/ui/storefront";

type ProductPageProps = {
  params: Promise<{ id: string }>;
};

export const dynamicParams = false;

export const generateStaticParams = () =>
  storeProducts.map((product) => ({ id: product.id }));

export const generateMetadata = async ({ params }: ProductPageProps) => {
  const { id } = await params;
  const product = getStoreProductById(id);
  const productTranslations = await getTranslations("Product");
  const landingTranslations = await getTranslations("Landing");
  const productPath = `/product/${id}`;

  if (!product) {
    return buildAbsoluteRouteMetadata({
      pageTitle: productTranslations("notFoundTitle"),
      description: productTranslations("notFoundMetaDescription"),
      path: productPath,
    });
  }

  const priceFormatted = formatPriceUah(getEffectivePriceUah(product));
  const brandName = getBrandNameForProduct(product);
  const summary = getProductCardSpecLine(
    product,
    buildProductCardSpecContextFromLanding((key) => landingTranslations(key)),
  );

  return buildAbsoluteRouteMetadata({
    pageTitle: productTranslations("metaTitle", {
      brand: brandName,
      name: product.name,
    }),
    description: productTranslations("metaDescription", {
      brand: brandName,
      name: product.name,
      summary,
      price: priceFormatted,
    }),
    path: productPath,
  });
};

export default async function ProductPage({ params }: ProductPageProps) {
  const { id } = await params;
  const product = getStoreProductById(id);

  if (!product) {
    notFound();
  }

  const landingTranslations = await getTranslations("Landing");
  const productTranslations = await getTranslations("Product");
  const discountPercent = getDiscountPercent(product);
  const effectivePriceUah = getEffectivePriceUah(product);
  const brandName = getBrandNameForProduct(product);
  const category = getCategoryById(product.categoryId);
  const categoryName = category !== undefined ? category.name : product.categoryId;

  const specContext = buildProductCardSpecContextFromLanding((key) =>
    landingTranslations(key),
  );
  const specLine = getProductCardSpecLine(product, specContext);

  const relatedProducts = getRelatedProducts(product, storeProducts, 4);
  const crossSellRaw = getCrossSellProducts(product, storeProducts, 8);
  const relatedIds = new Set(_.map(relatedProducts, (item) => item.id));
  const crossSellProducts = _.take(
    _.filter(crossSellRaw, (item) => !relatedIds.has(item.id)),
    4,
  );

  const articleDisplay = product.article !== undefined ? product.article : `#${product.id}`;

  const cardLabels: ProductCardLabels = {
    noImage: landingTranslations("products.noImage"),
    currency: landingTranslations("products.currency"),
    viewProduct: landingTranslations("products.viewProduct"),
    promoBadge: landingTranslations("products.promoBadge"),
    ...specContext,
  };

  const descriptionText =
    product.description !== undefined && product.description !== ""
      ? product.description
      : productTranslations("lead");

  return (
    <div className="relative flex min-h-dvh w-full flex-col overflow-x-clip bg-background text-foreground">
      <LandingBackground />

      <LandingHeader />

      <LanguageTransition>
        <main className="flex w-full flex-1 flex-col pb-24 pt-8 sm:pb-20">
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

            <div className="mt-6">
              <ProductDetailBreadcrumb
                catalogLabel={productTranslations("breadcrumbCatalog")}
                catalogHref="/catalog"
                categoryLabel={categoryName}
                productTitle={product.name}
              />
            </div>

            <div className="mt-8 grid gap-10 lg:grid-cols-12 lg:gap-12 xl:gap-16">
              <div className="lg:col-span-5 xl:col-span-5">
                <ProductImagePlaceholder
                  label={landingTranslations("products.noImage")}
                  className="lg:sticky lg:top-24"
                />
              </div>

              <div className="flex flex-col lg:col-span-7 xl:col-span-7">
                <div className="flex flex-wrap items-start gap-3">
                  <h1 className="font-display text-2xl font-bold tracking-tight text-foreground sm:text-3xl xl:text-4xl">
                    {product.name}
                  </h1>
                  {discountPercent !== null ? (
                    <span className={`mt-1 ${storefrontBadgePromoSoft}`}>
                      {landingTranslations("products.promoBadge")}
                    </span>
                  ) : null}
                </div>

                <p className="mt-3 text-sm leading-normal text-muted-foreground sm:text-base">
                  {specLine}
                </p>

                <div className="mt-6">
                  <ProductDetailMetaStrip
                    articleLabel={productTranslations("article")}
                    articleValue={articleDisplay}
                    brandLabel={productTranslations("brand")}
                    brandValue={brandName}
                    stockLabel={productTranslations("stockLabel")}
                    inStock={product.inStock}
                    inStockText={productTranslations("stockInStock")}
                    outOfStockText={productTranslations("stockOutOfStock")}
                  />
                </div>

                <div className="mt-6">
                  <ProductDetailPricing
                    currencyLabel={landingTranslations("products.currency")}
                    basePriceUah={product.priceUah}
                    effectivePriceUah={effectivePriceUah}
                    discountPercent={discountPercent}
                    priceLabel={productTranslations("price")}
                    saveLabel={productTranslations("saveAmount")}
                    promoBadgeWord={landingTranslations("products.promoBadge")}
                  />
                </div>

                <div className="mt-6 flex w-full flex-col gap-3 sm:flex-row sm:flex-wrap sm:items-start">
                  <AddToCartButton productId={product.id} variant="primary" />
                  <NavHashLink
                    hash="contact"
                    className={`inline-flex w-full sm:w-auto ${storefrontButtonSecondary} ${storefrontButtonPrimaryPadding} dark:border-white/15`}
                  >
                    {productTranslations("orderCta")}
                  </NavHashLink>
                </div>

                <ProductDetailDescriptionSection
                  title={productTranslations("descriptionHeading")}
                  text={descriptionText}
                />

                <ProductDetailSpecsSection title={productTranslations("specsHeading")}>
                  {renderProductDetailSpecRows(product, {
                    productTranslations,
                    landingTranslations,
                    cardSpecContext: specContext,
                  })}
                </ProductDetailSpecsSection>
              </div>
            </div>

            <div className="mt-16 space-y-16">
              <ProductShelf
                sectionId="related-products"
                title={productTranslations("relatedTitle")}
                products={relatedProducts}
                labels={cardLabels}
              />
              <ProductShelf
                sectionId="cross-sell"
                title={productTranslations("crossSellTitle")}
                products={crossSellProducts}
                labels={cardLabels}
              />
            </div>
          </SectionShell>
        </main>

        <LandingFooter />
      </LanguageTransition>
    </div>
  );
}
