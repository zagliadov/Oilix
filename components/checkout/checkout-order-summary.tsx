"use client";

import * as _ from "lodash";
import Link from "next/link";

import { formatPriceUah } from "@/app/lib/format-price";
import {
  getBrandNameForProduct,
  getEffectivePriceUah,
  getStoreProductByIdInCatalog,
} from "@/app/lib/catalog";
import type { CartLine } from "@/app/lib/cart/cart-types";
import { useStorefrontCatalog } from "@/components/storefront/use-storefront-catalog";
import {
  storefrontHeadingSection,
  storefrontLinkBrand,
  storefrontRowDivider,
  storefrontSurfacePanel,
} from "@/components/ui/storefront";

type CheckoutOrderSummaryProps = {
  lines: readonly CartLine[];
  totalUah: number;
  currency: string;
  title: string;
  subtotalLabel: string;
  totalLabel: string;
  editCartLabel: string;
  cartHref: string;
};

export const CheckoutOrderSummary = ({
  lines,
  totalUah,
  currency,
  title,
  subtotalLabel,
  totalLabel,
  editCartLabel,
  cartHref,
}: CheckoutOrderSummaryProps) => {
  const catalog = useStorefrontCatalog();
  const validLines = _.filter(lines, (line) =>
    Boolean(getStoreProductByIdInCatalog(line.productId, catalog)),
  );

  return (
    <div className={`p-6 ${storefrontSurfacePanel}`}>
      <div className="flex items-start justify-between gap-3">
        <h2 className={storefrontHeadingSection}>{title}</h2>
        <Link href={cartHref} className={`shrink-0 text-sm ${storefrontLinkBrand}`}>
          {editCartLabel}
        </Link>
      </div>
      <ul className="mt-4 max-h-72 list-none space-y-3 overflow-y-auto p-0">
        {_.map(validLines, (line) => {
          const product = getStoreProductByIdInCatalog(line.productId, catalog);
          if (!product) {
            return null;
          }
          const unit = getEffectivePriceUah(product);
          const lineTotal = unit * line.quantity;
          const brand = getBrandNameForProduct(product, catalog);
          return (
            <li
              key={line.productId}
              className={`flex justify-between gap-3 pb-3 last:border-0 last:pb-0 ${storefrontRowDivider}`}
            >
              <div className="min-w-0">
                <p className="truncate text-sm font-medium text-foreground">{product.name}</p>
                <p className="text-xs text-muted-foreground">{brand}</p>
                <p className="mt-1 text-xs tabular-nums text-muted-foreground">
                  {formatPriceUah(unit)} {currency} × {line.quantity}
                </p>
              </div>
              <p className="shrink-0 text-sm font-semibold tabular-nums text-foreground">
                {formatPriceUah(lineTotal)} {currency}
              </p>
            </li>
          );
        })}
      </ul>
      <div className="mt-4 space-y-2 border-t border-border pt-4 dark:border-white/10">
        <div className="flex justify-between text-sm text-muted-foreground">
          <span>{subtotalLabel}</span>
          <span className="font-medium tabular-nums text-foreground">
            {formatPriceUah(totalUah)} {currency}
          </span>
        </div>
        <div className="flex justify-between font-display text-lg font-bold text-foreground">
          <span>{totalLabel}</span>
          <span className="tabular-nums">
            {formatPriceUah(totalUah)} {currency}
          </span>
        </div>
      </div>
    </div>
  );
};
