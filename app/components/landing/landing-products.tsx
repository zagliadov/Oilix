import * as _ from "lodash";
import Link from "next/link";
import { getTranslations } from "next-intl/server";

import { SectionShell } from "@/app/components/landing/section-shell";
import { ProductImagePlaceholder } from "@/app/components/landing/product-image-placeholder";
import { CatalogCartIconButton } from "@/components/cart/catalog-cart-icon-button";
import { ScrollReveal } from "@/components/motion/scroll-reveal";
import { StickyHeading } from "@/components/motion/sticky-heading";
import { formatPriceUah } from "@/app/lib/format-price";
import { catalogProducts } from "@/app/lib/mocks/catalog-products";

export const LandingProducts = async () => {
  const landingTranslations = await getTranslations("Landing");

  return (
    <section id="range" className="w-full scroll-mt-20 py-20">
      <SectionShell>
        <StickyHeading>
          <h2 className="font-display text-2xl font-bold tracking-tight text-foreground sm:text-3xl">
            {landingTranslations("products.title")}
          </h2>
          <p className="mt-3 max-w-3xl text-base leading-[1.5] text-muted-foreground sm:text-lg">
            {landingTranslations("products.lead")}
          </p>
        </StickyHeading>
        <ul className="grid w-full list-none grid-cols-1 gap-6 p-0 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {_.map(catalogProducts, (product, productIndex) => (
            <ScrollReveal
              key={product.id}
              as="li"
              delay={productIndex * 0.035}
            >
              <article className="flex h-full flex-col rounded-md border border-border bg-card shadow-[0_1px_0_0_rgba(0,0,0,0.04)] transition-colors hover:border-brand/20 dark:border-white/[0.08] dark:bg-white/[0.03] dark:shadow-none dark:hover:border-brand/25">
                <Link
                  href={`/product/${product.id}`}
                  className="group block flex flex-1 flex-col p-4 pb-3 no-underline outline-none transition focus-visible:ring-2 focus-visible:ring-brand/40 focus-visible:ring-offset-2 focus-visible:ring-offset-background"
                  aria-label={`${landingTranslations("products.viewProduct")}: ${product.brand} ${product.name}`}
                >
                  <ProductImagePlaceholder
                    label={landingTranslations("products.noImage")}
                  />
                  <div className="mt-4 flex flex-1 flex-col">
                    <p className="text-[0.6875rem] font-semibold uppercase tracking-wider text-muted-foreground">
                      {product.brand}
                    </p>
                    <h3 className="font-display mt-1 text-base font-semibold leading-snug text-foreground group-hover:text-brand">
                      {product.name}
                    </h3>
                    <p className="mt-2 text-sm text-muted-foreground">
                      {product.viscosity} · {product.volumeLiters}{" "}
                      {landingTranslations("products.volumeUnit")}
                    </p>
                    <p className="mt-auto pt-4 text-lg font-semibold tabular-nums text-foreground">
                      {formatPriceUah(product.priceUah)}{" "}
                      {landingTranslations("products.currency")}
                    </p>
                  </div>
                </Link>
                <div className="flex items-center justify-end border-t border-border/60 px-3 py-2 dark:border-white/10">
                  <CatalogCartIconButton productId={product.id} />
                </div>
              </article>
            </ScrollReveal>
          ))}
        </ul>
      </SectionShell>
    </section>
  );
};
