"use client";

import * as _ from "lodash";
import { Minus, Plus, Trash2 } from "lucide-react";
import Link from "next/link";
import { useTranslations } from "next-intl";

import { ProductImagePlaceholder } from "@/app/components/landing/product-image-placeholder";
import { formatPriceUah } from "@/app/lib/format-price";
import { getCatalogProductById } from "@/app/lib/mocks/catalog-products";
import { useCart } from "@/components/cart/cart-context";
import { NavHashLink } from "@/components/nav-hash-link";

export const CartPageClient = () => {
  const cartTranslations = useTranslations("Cart");
  const landingTranslations = useTranslations("Landing");
  const { lines, isReady, totalQuantity, totalPriceUah, setLineQuantity, removeLine, clearCart } =
    useCart();

  if (!isReady) {
    return (
      <div className="mt-10 space-y-4" aria-hidden>
        <div className="h-32 animate-pulse rounded-md bg-muted" />
        <div className="h-32 animate-pulse rounded-md bg-muted" />
      </div>
    );
  }

  const validLines = _.filter(lines, (line) =>
    Boolean(getCatalogProductById(line.productId)),
  );

  if (validLines.length === 0) {
    return (
      <div className="mt-12 rounded-md border border-dashed border-border bg-muted/20 p-10 text-center dark:border-white/10">
        <p className="text-base text-muted-foreground">{cartTranslations("empty")}</p>
        <Link
          href="/#range"
          className="mt-6 inline-flex items-center justify-center rounded-md bg-brand px-6 py-3 text-base font-medium text-white transition hover:brightness-110"
        >
          {cartTranslations("goToCatalog")}
        </Link>
      </div>
    );
  }

  return (
    <div className="mt-10">
      <ul className="list-none space-y-4 p-0">
        {_.map(validLines, (line) => {
          const product = getCatalogProductById(line.productId);
          if (!product) {
            return null;
          }
          const lineTotal = product.priceUah * line.quantity;
          return (
            <li
              key={line.productId}
              className="flex flex-col gap-4 rounded-md border border-border bg-card p-4 sm:flex-row sm:items-center sm:gap-6 dark:border-white/[0.08] dark:bg-white/[0.03]"
            >
              <Link
                href={`/product/${product.id}`}
                className="flex shrink-0 gap-4 sm:items-center"
              >
                <div className="w-24 shrink-0 sm:w-28">
                  <ProductImagePlaceholder
                    label={landingTranslations("products.noImage")}
                    className="aspect-square"
                  />
                </div>
                <div className="min-w-0 flex-1">
                  <p className="text-[0.6875rem] font-semibold uppercase tracking-wider text-muted-foreground">
                    {product.brand}
                  </p>
                  <p className="font-display mt-1 font-semibold text-foreground">{product.name}</p>
                  <p className="mt-1 text-sm text-muted-foreground">
                    {product.viscosity} · {product.volumeLiters}{" "}
                    {landingTranslations("products.volumeUnit")}
                  </p>
                </div>
              </Link>

              <div className="flex flex-1 flex-wrap items-center justify-between gap-4 sm:justify-end">
                <div className="inline-flex items-center overflow-hidden rounded-md border border-border dark:border-white/10">
                  <button
                    type="button"
                    onClick={() => {
                      setLineQuantity(line.productId, line.quantity - 1);
                    }}
                    className="flex h-10 w-10 items-center justify-center transition hover:bg-muted/60"
                    aria-label={cartTranslations("decreaseQty")}
                  >
                    <Minus className="h-4 w-4" strokeWidth={2} aria-hidden />
                  </button>
                  <span className="min-w-[2rem] text-center text-sm font-semibold tabular-nums">
                    {line.quantity}
                  </span>
                  <button
                    type="button"
                    onClick={() => {
                      setLineQuantity(line.productId, line.quantity + 1);
                    }}
                    className="flex h-10 w-10 items-center justify-center transition hover:bg-muted/60"
                    aria-label={cartTranslations("increaseQty")}
                  >
                    <Plus className="h-4 w-4" strokeWidth={2} aria-hidden />
                  </button>
                </div>

                <div className="text-right">
                  <p className="text-xs text-muted-foreground">
                    {formatPriceUah(product.priceUah)} {landingTranslations("products.currency")} ×{" "}
                    {line.quantity}
                  </p>
                  <p className="mt-1 text-lg font-semibold tabular-nums text-foreground">
                    {formatPriceUah(lineTotal)} {landingTranslations("products.currency")}
                  </p>
                </div>

                <button
                  type="button"
                  onClick={() => {
                    removeLine(line.productId);
                  }}
                  className="flex h-10 w-10 shrink-0 items-center justify-center rounded-md text-muted-foreground transition hover:bg-destructive/10 hover:text-destructive"
                  aria-label={cartTranslations("removeLine")}
                >
                  <Trash2 className="h-4 w-4" strokeWidth={2} aria-hidden />
                </button>
              </div>
            </li>
          );
        })}
      </ul>

      <div className="mt-10 flex flex-col gap-6 border-t border-border pt-8 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <p className="text-sm text-muted-foreground">{cartTranslations("totalItems")}</p>
          <p className="mt-1 font-display text-xl font-bold tabular-nums text-foreground">
            {totalQuantity}
          </p>
        </div>
        <div className="text-left sm:text-right">
          <p className="text-sm text-muted-foreground">{cartTranslations("totalSum")}</p>
          <p className="mt-1 font-display text-2xl font-bold tabular-nums text-foreground">
            {formatPriceUah(totalPriceUah)} {landingTranslations("products.currency")}
          </p>
        </div>
      </div>

      <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:flex-wrap">
        <button
          type="button"
          onClick={() => {
            clearCart();
          }}
          className="inline-flex items-center justify-center rounded-md border border-border px-5 py-3 text-sm font-medium text-muted-foreground transition hover:bg-muted/60 dark:border-white/12"
        >
          {cartTranslations("clearCart")}
        </button>
        <NavHashLink
          hash="contact"
          className="inline-flex flex-1 items-center justify-center rounded-md bg-brand px-7 py-3.5 text-base font-medium text-white transition hover:brightness-110 sm:flex-none"
        >
          {cartTranslations("checkoutCta")}
        </NavHashLink>
      </div>
    </div>
  );
};
