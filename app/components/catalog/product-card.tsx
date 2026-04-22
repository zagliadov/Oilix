import Link from "next/link";

import {
  getBrandNameForProduct,
  getDiscountPercent,
  getEffectivePriceUah,
  getProductCardImageUrlInCatalog,
  getProductCardSpecLine,
  type CatalogIndexes,
  type ProductCardSpecContext,
  type StoreProduct,
} from "@/app/lib/catalog";
import { ProductCatalogImage } from "@/app/components/catalog/product-catalog-image";
import { formatPriceUah } from "@/app/lib/format-price";
import { CatalogCartIconButton } from "@/components/cart/catalog-cart-icon-button";
import {
  storefrontBadgePromoSolid,
  storefrontDividerTop,
  storefrontProductCard,
} from "@/components/ui/storefront";

export type ProductCardLabels = {
  noImage: string;
  volumeUnit: string;
  currency: string;
  viewProduct: string;
  promoBadge: string;
} & ProductCardSpecContext;

type ProductCardProps = {
  product: StoreProduct;
  labels: ProductCardLabels;
  catalog: CatalogIndexes;
};

export const ProductCard = ({ product, labels, catalog }: ProductCardProps) => {
  const discountPercent = getDiscountPercent(product);
  const effectivePriceUah = getEffectivePriceUah(product);
  const brandName = getBrandNameForProduct(product, catalog);
  const specLine = getProductCardSpecLine(product, labels);
  const ariaLabel = `${labels.viewProduct}: ${brandName} ${product.name}`;
  const cardImageUrl = getProductCardImageUrlInCatalog(product.id, catalog);

  return (
    <article className={`flex h-full w-full min-w-0 flex-col ${storefrontProductCard}`}>
      <Link
        href={`/product/${product.id}`}
        className="group flex flex-1 flex-col p-4 pb-3 no-underline outline-none transition focus-visible:ring-2 focus-visible:ring-brand/40 focus-visible:ring-offset-2 focus-visible:ring-offset-background"
        aria-label={ariaLabel}
      >
        <div className="relative w-full min-w-0">
          <ProductCatalogImage
            imageUrl={cardImageUrl}
            alt={`${brandName} ${product.name}`}
            noImageLabel={labels.noImage}
            aspectClassName="aspect-[3/4]"
            imageClassName="p-2 sm:p-3"
          />
          {discountPercent !== null ? (
            <span className={`absolute left-2 top-2 ${storefrontBadgePromoSolid}`}>
              −{discountPercent}% · {labels.promoBadge}
            </span>
          ) : null}
        </div>
        <div className="mt-4 flex flex-1 flex-col">
          <p className="text-[0.6875rem] font-semibold uppercase tracking-wider text-muted-foreground">
            {brandName}
          </p>
          <h3 className="font-display mt-1 text-base font-semibold leading-snug text-foreground group-hover:text-brand">
            {product.name}
          </h3>
          <p className="mt-2 text-sm text-muted-foreground">{specLine}</p>
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
      <div className={`flex items-center justify-end px-3 py-2 ${storefrontDividerTop}`}>
        <CatalogCartIconButton productId={product.id} />
      </div>
    </article>
  );
};
