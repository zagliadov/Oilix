import * as _ from "lodash";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";
import { notFound } from "next/navigation";
import { getLocale, getTranslations } from "next-intl/server";

import { ProductDetailBreadcrumb } from "@/app/components/product/product-detail-breadcrumb";
import { ProductDetailDescriptionSection } from "@/app/components/product/product-detail-description-section";
import { ProductDetailMetaStrip } from "@/app/components/product/product-detail-meta-strip";
import { ProductDetailPricing } from "@/app/components/product/product-detail-pricing";
import { ProductDetailSpecsSection } from "@/app/components/product/product-detail-specs-section";
import { ProductShelf } from "@/app/components/product/product-shelf";
import { LandingBackground } from "@/app/components/landing/landing-background";
import { LandingFooter } from "@/app/components/landing/landing-footer";
import { LandingHeader } from "@/app/components/landing/landing-header";
import { ProductCatalogImage } from "@/app/components/catalog/product-catalog-image";
import { SectionShell } from "@/app/components/landing/section-shell";
import { renderProductDetailSpecRows } from "@/app/components/catalog/product-detail-spec-rows";
import { formatPriceUah } from "@/app/lib/format-price";
import { getCatalogBundle } from "@/app/lib/catalog/load-catalog";
import { buildProductCardSpecContextFromLanding } from "@/app/lib/i18n/product-card-spec-context";
import { buildAbsoluteRouteMetadata, resolveAbsoluteUrl, resolveSiteUrl } from "@/app/lib/seo/page-metadata";
import { isAppLocale } from "@/app/lib/i18n/locales";
import type { ProductCardLabels } from "@/app/components/catalog/product-card";
import {
  buildCatalogIndexes,
  getBrandNameForProduct,
  getCategoryByIdInCatalog,
  getCrossSellProducts,
  getProductCardImageUrlInCatalog,
  getDiscountPercent,
  getEffectivePriceUah,
  getProductCardSpecLine,
  getProductIdParams,
  getRelatedProducts,
  getStoreProductByIdInCatalog,
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

export const generateStaticParams = async () => {
  const bundle = await getCatalogBundle();
  return getProductIdParams(buildCatalogIndexes(bundle));
};

export const generateMetadata = async ({ params }: ProductPageProps) => {
  const { id } = await params;
  const locale = await getLocale();
  const activeLocale = isAppLocale(locale) ? locale : "uk";
  const catalog = buildCatalogIndexes(await getCatalogBundle());
  const product = getStoreProductByIdInCatalog(id, catalog);
  const productTranslations = await getTranslations("Product");
  const landingTranslations = await getTranslations("Landing");
  const productPath = `/product/${id}`;

  if (!product) {
    return buildAbsoluteRouteMetadata({
      pageTitle: productTranslations("notFoundTitle"),
      description: productTranslations("notFoundMetaDescription"),
      path: productPath,
      locale: activeLocale,
    });
  }

  const priceFormatted = formatPriceUah(getEffectivePriceUah(product));
  const brandName = getBrandNameForProduct(product, catalog);
  const summary = getProductCardSpecLine(
    product,
    buildProductCardSpecContextFromLanding((key) => landingTranslations(key)),
  );
  const imageUrl = getProductCardImageUrlInCatalog(product.id, catalog);

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
    locale: activeLocale,
    ...(imageUrl !== undefined ? { imageUrl } : {}),
  });
};

export default async function ProductPage({ params }: ProductPageProps) {
  const { id } = await params;
  const locale = await getLocale();
  const activeLocale = isAppLocale(locale) ? locale : "uk";
  const catalog = buildCatalogIndexes(await getCatalogBundle());
  const product = getStoreProductByIdInCatalog(id, catalog);

  if (!product) {
    notFound();
  }

  const listForRelations = catalog.bundle.products;

  const landingTranslations = await getTranslations("Landing");
  const productTranslations = await getTranslations("Product");
  const discountPercent = getDiscountPercent(product);
  const effectivePriceUah = getEffectivePriceUah(product);
  const brandName = getBrandNameForProduct(product, catalog);
  const category = getCategoryByIdInCatalog(product.categoryId, catalog);
  const categoryName = category !== undefined ? category.name : product.categoryId;

  const specContext = buildProductCardSpecContextFromLanding((key) =>
    landingTranslations(key),
  );
  const specLine = getProductCardSpecLine(product, specContext);
  const heroImageUrl = getProductCardImageUrlInCatalog(product.id, catalog);

  const relatedProducts = getRelatedProducts(product, listForRelations, 4);
  const crossSellRaw = getCrossSellProducts(product, listForRelations, 8);
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
  const siteUrl = resolveSiteUrl() ?? "http://localhost:3000";
  const productUrl = resolveAbsoluteUrl(`/product/${product.id}`, activeLocale) ??
    `${siteUrl}/${activeLocale}/product/${product.id}`;
  const imageUrl = heroImageUrl !== undefined
    ? resolveAbsoluteUrl(heroImageUrl, activeLocale) ??
      (heroImageUrl.startsWith("http://") || heroImageUrl.startsWith("https://")
        ? heroImageUrl
        : `${siteUrl}${heroImageUrl}`)
    : undefined;
  const productStructuredData = {
    "@context": "https://schema.org",
    "@type": "Product",
    name: product.name,
    description: descriptionText,
    brand: {
      "@type": "Brand",
      name: brandName,
    },
    sku: product.id,
    category: categoryName,
    ...(imageUrl !== undefined ? { image: [imageUrl] } : {}),
    offers: {
      "@type": "Offer",
      url: productUrl,
      priceCurrency: "UAH",
      price: String(effectivePriceUah),
      availability: product.inStock
        ? "https://schema.org/InStock"
        : "https://schema.org/OutOfStock",
      itemCondition: "https://schema.org/NewCondition",
    },
  };
  const breadcrumbStructuredData = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      {
        "@type": "ListItem",
        position: 1,
        name: productTranslations("breadcrumbCatalog"),
        item: resolveAbsoluteUrl("/catalog", activeLocale) ?? `${siteUrl}/${activeLocale}/catalog`,
      },
      {
        "@type": "ListItem",
        position: 2,
        name: categoryName,
      },
      {
        "@type": "ListItem",
        position: 3,
        name: product.name,
        item: productUrl,
      },
    ],
  };

  return (
    <div className="relative flex min-h-dvh w-full flex-col overflow-x-clip bg-background text-foreground">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(productStructuredData),
        }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(breadcrumbStructuredData),
        }}
      />
      <LandingBackground />

      <LandingHeader />

      <LanguageTransition>
        <main className="flex w-full flex-1 flex-col pb-24 pt-8 sm:pb-20">
          <SectionShell>
            <Link
              href={`/${activeLocale}/catalog`}
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
                catalogHref={`/${activeLocale}/catalog`}
                categoryLabel={categoryName}
                productTitle={product.name}
              />
            </div>

            <div className="mt-8 grid gap-10 lg:grid-cols-12 lg:gap-12 xl:gap-16">
              <div className="lg:col-span-5 xl:col-span-5">
                <div className="lg:sticky lg:top-24">
                  <ProductCatalogImage
                    imageUrl={heroImageUrl}
                    alt={`${brandName} ${product.name}`}
                    noImageLabel={landingTranslations("products.noImage")}
                    aspectClassName="aspect-square"
                    imageClassName="p-3 sm:p-4"
                  />
                </div>
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
                catalog={catalog}
                locale={activeLocale}
              />
              <ProductShelf
                sectionId="cross-sell"
                title={productTranslations("crossSellTitle")}
                products={crossSellProducts}
                labels={cardLabels}
                catalog={catalog}
                locale={activeLocale}
              />
            </div>
          </SectionShell>
        </main>

        <LandingFooter />
      </LanguageTransition>
    </div>
  );
}
