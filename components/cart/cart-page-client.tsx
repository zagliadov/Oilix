"use client";

import * as _ from "lodash";
import { ShoppingBag } from "lucide-react";
import Link from "next/link";
import { useTranslations } from "next-intl";

import { CartLineRow } from "@/components/cart/cart-line-row";
import { buildProductCardSpecContextFromLanding } from "@/app/lib/i18n/product-card-spec-context";
import { formatPriceUah } from "@/app/lib/format-price";
import { getStoreProductByIdInCatalog } from "@/app/lib/catalog";
import { useCart } from "@/components/cart/cart-context";
import { useStorefrontCatalog } from "@/components/storefront/use-storefront-catalog";
import {
  storefrontButtonPrimary,
  storefrontButtonPrimaryPaddingCompact,
  storefrontButtonSecondary,
  storefrontButtonSecondaryMuted,
  storefrontEmptyState,
  storefrontHeadingSection,
  storefrontLinkBrand,
  storefrontSkeleton,
  storefrontSurfacePanel,
} from "@/components/ui/storefront";

export const CartPageClient = () => {
  const cartTranslations = useTranslations("Cart");
  const landingTranslations = useTranslations("Landing");
  const catalog = useStorefrontCatalog();
  const {
    lines,
    isReady,
    lineCount,
    totalQuantity,
    totalPriceUah,
    setLineQuantity,
    removeLine,
    clearCart,
  } = useCart();

  const specContext = buildProductCardSpecContextFromLanding((key) =>
    landingTranslations(key),
  );

  const lineRowLabels = {
    decreaseQty: cartTranslations("decreaseQty"),
    increaseQty: cartTranslations("increaseQty"),
    removeLine: cartTranslations("removeLine"),
    unitPrice: cartTranslations("unitPrice"),
    lineSubtotal: cartTranslations("lineSubtotal"),
  };

  if (!isReady) {
    return (
      <div className="mt-10 space-y-4" aria-hidden>
        {_.map(["a", "b", "c"], (key) => (
          <div key={key} className={`h-36 sm:h-32 ${storefrontSkeleton}`} />
        ))}
      </div>
    );
  }

  const validLines = _.filter(lines, (line) =>
    Boolean(getStoreProductByIdInCatalog(line.productId, catalog)),
  );

  if (validLines.length === 0) {
    return (
      <div className={`mt-12 flex flex-col items-center px-6 py-14 text-center ${storefrontEmptyState}`}>
        <div className="flex h-16 w-16 items-center justify-center rounded-full bg-muted/60 dark:bg-white/5">
          <ShoppingBag className="h-8 w-8 text-muted-foreground" strokeWidth={1.5} aria-hidden />
        </div>
        <h2 className="font-display mt-6 text-xl font-semibold text-foreground">
          {cartTranslations("emptyTitle")}
        </h2>
        <p className="mt-2 max-w-md text-base text-muted-foreground">
          {cartTranslations("empty")}
        </p>
        <p className="mt-2 max-w-md text-sm text-muted-foreground">
          {cartTranslations("emptyHint")}
        </p>
        <div className="mt-8 flex w-full max-w-sm flex-col gap-3 sm:flex-row sm:justify-center">
          <Link
            href="/catalog"
            className={`inline-flex flex-1 sm:flex-none ${storefrontButtonPrimary} ${storefrontButtonPrimaryPaddingCompact}`}
          >
            {cartTranslations("goToCatalog")}
          </Link>
          <Link
            href="/"
            className={`inline-flex flex-1 sm:flex-none ${storefrontButtonSecondary} px-6 py-3.5 dark:border-white/15`}
          >
            {cartTranslations("backHome")}
          </Link>
        </div>
      </div>
    );
  }

  const currency = landingTranslations("products.currency");
  const noImage = landingTranslations("products.noImage");

  return (
    <div className="mt-10 lg:grid lg:grid-cols-12 lg:items-start lg:gap-10 xl:gap-12">
      <div className="lg:col-span-7 xl:col-span-8">
        <ul className="list-none space-y-4 p-0">
          {_.map(validLines, (line) => (
            <CartLineRow
              key={line.productId}
              line={line}
              noImageLabel={noImage}
              currency={currency}
              specContext={specContext}
              labels={lineRowLabels}
              onQuantityChange={setLineQuantity}
              onRemove={removeLine}
            />
          ))}
        </ul>
      </div>

      <aside className="mt-10 lg:sticky lg:top-24 lg:col-span-5 lg:mt-0 xl:col-span-4">
        <div className={`p-6 ${storefrontSurfacePanel}`}>
          <h2 className={storefrontHeadingSection}>
            {cartTranslations("summaryTitle")}
          </h2>
          <p className="mt-4 text-sm text-muted-foreground">
            {cartTranslations("positionsSummary", {
              lines: lineCount,
              units: totalQuantity,
            })}
          </p>
          <dl className="mt-4 space-y-3 text-sm">
            <div className="flex justify-between gap-4 border-b border-border/80 pb-3 dark:border-white/10">
              <dt>{cartTranslations("subtotal")}</dt>
              <dd className="font-semibold tabular-nums text-foreground">
                {formatPriceUah(totalPriceUah)} {currency}
              </dd>
            </div>
            <div className="flex items-baseline justify-between gap-4 pt-1">
              <dt className="text-base font-semibold text-foreground">
                {cartTranslations("total")}
              </dt>
              <dd className="font-display text-2xl font-bold tabular-nums text-foreground">
                {formatPriceUah(totalPriceUah)} {currency}
              </dd>
            </div>
          </dl>
          <p className="mt-4 text-xs leading-relaxed text-muted-foreground">
            {cartTranslations("summaryNote")}
          </p>
          <div className="mt-6 flex flex-col gap-3">
            <Link
              href="/checkout"
              className={`w-full ${storefrontButtonPrimary} ${storefrontButtonPrimaryPaddingCompact}`}
            >
              {cartTranslations("checkoutCta")}
            </Link>
            <button
              type="button"
              onClick={() => {
                clearCart();
              }}
              className={`w-full px-5 py-3 ${storefrontButtonSecondaryMuted}`}
            >
              {cartTranslations("clearCart")}
            </button>
            <Link href="/catalog" className={`text-center text-sm ${storefrontLinkBrand}`}>
              {cartTranslations("continueShopping")}
            </Link>
          </div>
        </div>
      </aside>
    </div>
  );
};
