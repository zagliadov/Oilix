import Link from "next/link";

import { ProductImagePlaceholder } from "@/app/components/landing/product-image-placeholder";
import { formatPriceUah } from "@/app/lib/format-price";
import {
  getDiscountPercent,
  getEffectivePriceUah,
  type CatalogProduct,
} from "@/app/lib/mocks/catalog-products";
import { CatalogCartIconButton } from "@/components/cart/catalog-cart-icon-button";

export type ProductCardLabels = {
  noImage: string;
  volumeUnit: string;
  currency: string;
  viewProduct: string;
  promoBadge: string;
};

type ProductCardProps = {
  product: CatalogProduct;
  labels: ProductCardLabels;
};

export const ProductCard = ({ product, labels }: ProductCardProps) => {
  const discountPercent = getDiscountPercent(product);
  const effectivePriceUah = getEffectivePriceUah(product);
  const ariaLabel = `${labels.viewProduct}: ${product.brand} ${product.name}`;

  return (
    <article className="flex h-full flex-col rounded-md border border-border bg-card shadow-[0_1px_0_0_rgba(0,0,0,0.04)] transition-colors hover:border-brand/20 dark:border-white/[0.08] dark:bg-white/[0.03] dark:shadow-none dark:hover:border-brand/25">
      <Link
        href={`/product/${product.id}`}
        className="group block flex flex-1 flex-col p-4 pb-3 no-underline outline-none transition focus-visible:ring-2 focus-visible:ring-brand/40 focus-visible:ring-offset-2 focus-visible:ring-offset-background"
        aria-label={ariaLabel}
      >
        <div className="relative">
          <ProductImagePlaceholder label={labels.noImage} />
          {discountPercent !== null ? (
            <span className="absolute left-2 top-2 rounded bg-brand px-2 py-0.5 text-[0.6875rem] font-bold uppercase tracking-wide text-white">
              −{discountPercent}% · {labels.promoBadge}
            </span>
          ) : null}
        </div>
        <div className="mt-4 flex flex-1 flex-col">
          <p className="text-[0.6875rem] font-semibold uppercase tracking-wider text-muted-foreground">
            {product.brand}
          </p>
          <h3 className="font-display mt-1 text-base font-semibold leading-snug text-foreground group-hover:text-brand">
            {product.name}
          </h3>
          <p className="mt-2 text-sm text-muted-foreground">
            {product.viscosity} · {product.volumeLiters} {labels.volumeUnit}
          </p>
          <div className="mt-auto pt-4">
            {discountPercent !== null ? (
              <p className="text-sm text-muted-foreground line-through tabular-nums">
                {formatPriceUah(product.priceUah)} {labels.currency}
              </p>
            ) : null}
            <p className="text-lg font-semibold tabular-nums text-foreground">
              {formatPriceUah(effectivePriceUah)} {labels.currency}
            </p>
          </div>
        </div>
      </Link>
      <div className="flex items-center justify-end border-t border-border/60 px-3 py-2 dark:border-white/10">
        <CatalogCartIconButton productId={product.id} />
      </div>
    </article>
  );
};
