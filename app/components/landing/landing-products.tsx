import * as _ from "lodash";
import Link from "next/link";
import { getTranslations } from "next-intl/server";

import { ProductCard } from "@/app/components/catalog/product-card";
import { SectionShell } from "@/app/components/landing/section-shell";
import { ScrollReveal } from "@/components/motion/scroll-reveal";
import { StickyHeading } from "@/components/motion/sticky-heading";
import { buildProductCardSpecContextFromLanding } from "@/app/lib/i18n/product-card-spec-context";
import { getPromoProducts } from "@/app/lib/catalog";

export const LandingProducts = async () => {
  const landingTranslations = await getTranslations("Landing");
  const promoProducts = getPromoProducts();

  const labels = {
    noImage: landingTranslations("products.noImage"),
    currency: landingTranslations("products.currency"),
    viewProduct: landingTranslations("products.viewProduct"),
    promoBadge: landingTranslations("products.promoBadge"),
    ...buildProductCardSpecContextFromLanding((key) => landingTranslations(key)),
  };

  return (
    <section id="promo" className="w-full scroll-mt-20 py-20">
      <SectionShell>
        <StickyHeading>
          <h2 className="font-display text-2xl font-bold tracking-tight text-foreground sm:text-3xl">
            {landingTranslations("products.promoTitle")}
          </h2>
          <p className="mt-3 max-w-3xl text-base leading-[1.5] text-muted-foreground sm:text-lg">
            {landingTranslations("products.promoLead")}
          </p>
          <Link
            href="/catalog"
            className="mt-5 inline-flex text-sm font-semibold uppercase tracking-wide text-brand underline-offset-4 transition hover:underline"
          >
            {landingTranslations("products.viewFullCatalog")}
          </Link>
        </StickyHeading>
        <ul className="mt-10 grid w-full list-none grid-cols-1 gap-6 p-0 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {_.map(promoProducts, (product, productIndex) => (
            <ScrollReveal
              key={product.id}
              as="li"
              delay={productIndex * 0.035}
            >
              <ProductCard product={product} labels={labels} />
            </ScrollReveal>
          ))}
        </ul>
      </SectionShell>
    </section>
  );
};
