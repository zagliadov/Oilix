"use client";

import { Minus, Plus, Trash2 } from "lucide-react";
import Link from "next/link";

import { ProductImagePlaceholder } from "@/app/components/landing/product-image-placeholder";
import { formatPriceUah } from "@/app/lib/format-price";
import type { ProductCardSpecContext } from "@/app/lib/catalog";
import { getCartLineSubtotalUah } from "@/app/lib/cart/cart-line-price";
import type { CartLine } from "@/app/lib/cart/cart-types";
import {
  getBrandNameForProduct,
  getEffectivePriceUah,
  getProductCardSpecLine,
  getStoreProductById,
} from "@/app/lib/catalog";
import {
  storefrontQuantityRail,
  storefrontSurfaceCard,
} from "@/components/ui/storefront";

type CartLineTranslations = {
  decreaseQty: string;
  increaseQty: string;
  removeLine: string;
  unitPrice: string;
  lineSubtotal: string;
};

type CartLineRowProps = {
  line: CartLine;
  noImageLabel: string;
  currency: string;
  specContext: ProductCardSpecContext;
  labels: CartLineTranslations;
  onQuantityChange: (productId: string, quantity: number) => void;
  onRemove: (productId: string) => void;
};

export const CartLineRow = ({
  line,
  noImageLabel,
  currency,
  specContext,
  labels,
  onQuantityChange,
  onRemove,
}: CartLineRowProps) => {
  const product = getStoreProductById(line.productId);
  if (!product) {
    return null;
  }

  const brandName = getBrandNameForProduct(product);
  const specLine = getProductCardSpecLine(product, specContext);
  const unitPriceUah = getEffectivePriceUah(product);
  const lineSubtotalUah = getCartLineSubtotalUah(product, line.quantity);

  return (
    <li className={storefrontSurfaceCard}>
      <div className="flex flex-col gap-4 p-4 sm:flex-row sm:items-center sm:justify-between sm:gap-6 sm:p-5">
        <Link
          href={`/product/${product.id}`}
          className="group flex min-w-0 flex-1 gap-4"
        >
          <div className="w-20 shrink-0 overflow-hidden rounded-lg border border-border/60 bg-muted/20 dark:border-white/10 sm:w-22">
            <ProductImagePlaceholder label={noImageLabel} className="aspect-square" />
          </div>
          <div className="min-w-0 flex-1">
            <p className="text-[0.6875rem] font-semibold uppercase tracking-wider text-muted-foreground">
              {brandName}
            </p>
            <p className="font-display mt-1 text-base font-semibold leading-snug text-foreground group-hover:text-brand sm:text-lg">
              {product.name}
            </p>
            <p className="mt-1.5 text-sm text-muted-foreground">{specLine}</p>
            <p className="mt-2 text-xs text-muted-foreground">
              {labels.unitPrice}:{" "}
              <span className="font-medium tabular-nums text-foreground">
                {formatPriceUah(unitPriceUah)} {currency}
              </span>
            </p>
          </div>
        </Link>

        <div className="flex flex-col gap-4 border-t border-border/60 pt-4 sm:flex-row sm:items-center sm:border-t-0 sm:pt-0 dark:border-white/10">
          <div className="flex items-center justify-between gap-4 sm:justify-end">
            <span className="text-xs font-medium uppercase tracking-wide text-muted-foreground sm:hidden">
              {labels.lineSubtotal}
            </span>
            <div className={storefrontQuantityRail}>
              <button
                type="button"
                onClick={() => {
                  onQuantityChange(line.productId, line.quantity - 1);
                }}
                className="flex min-h-11 min-w-11 items-center justify-center transition hover:bg-muted/70 active:bg-muted"
                aria-label={labels.decreaseQty}
              >
                <Minus className="h-4 w-4" strokeWidth={2} aria-hidden />
              </button>
              <span className="min-w-10 px-2 text-center text-sm font-semibold tabular-nums">
                {line.quantity}
              </span>
              <button
                type="button"
                onClick={() => {
                  onQuantityChange(line.productId, line.quantity + 1);
                }}
                className="flex min-h-11 min-w-11 items-center justify-center transition hover:bg-muted/70 active:bg-muted"
                aria-label={labels.increaseQty}
              >
                <Plus className="h-4 w-4" strokeWidth={2} aria-hidden />
              </button>
            </div>
          </div>

          <div className="flex flex-1 items-center justify-between gap-4 sm:min-w-40 sm:flex-none sm:flex-col sm:items-end sm:text-right">
            <div>
              <p className="hidden text-xs font-medium uppercase tracking-wide text-muted-foreground sm:block">
                {labels.lineSubtotal}
              </p>
              <p className="font-display text-xl font-bold tabular-nums text-foreground sm:mt-1">
                {formatPriceUah(lineSubtotalUah)} {currency}
              </p>
              <p className="mt-0.5 text-xs tabular-nums text-muted-foreground">
                {formatPriceUah(unitPriceUah)} {currency} × {line.quantity}
              </p>
            </div>
            <button
              type="button"
              onClick={() => {
                onRemove(line.productId);
              }}
              className="inline-flex min-h-11 min-w-11 shrink-0 items-center justify-center rounded-md border border-transparent text-muted-foreground transition hover:border-destructive/40 hover:bg-destructive/10 hover:text-destructive"
              aria-label={labels.removeLine}
            >
              <Trash2 className="h-4 w-4" strokeWidth={2} aria-hidden />
            </button>
          </div>
        </div>
      </div>
    </li>
  );
};
