"use client";

import { Minus, Plus, ShoppingCart } from "lucide-react";
import { useTranslations } from "next-intl";

import { useCart } from "@/components/cart/cart-context";
import { getStoreProductById } from "@/app/lib/catalog";
import {
  storefrontButtonPrimary,
  storefrontButtonPrimaryPadding,
  storefrontButtonSecondary,
  storefrontQuantityRailOnCard,
} from "@/components/ui/storefront";

type AddToCartButtonProps = {
  productId: string;
  variant?: "primary" | "secondary";
};

export const AddToCartButton = ({
  productId,
  variant = "primary",
}: AddToCartButtonProps) => {
  const cartTranslations = useTranslations("Cart");
  const { lines, addProduct, setLineQuantity, isReady } = useCart();
  const product = getStoreProductById(productId);
  const line = lines.find((entry) => entry.productId === productId);
  const quantity = line?.quantity ?? 0;

  if (!product) {
    return null;
  }

  const baseClass =
    variant === "primary"
      ? `w-full gap-2 sm:w-auto ${storefrontButtonPrimary} ${storefrontButtonPrimaryPadding}`
      : `${storefrontButtonSecondary} gap-1.5 bg-card px-3 py-2 text-sm hover:border-brand/30 hover:bg-muted/40 dark:bg-white/[0.03]`;

  if (!isReady) {
    return (
      <div
        className={
          variant === "primary"
            ? "h-13 w-full animate-pulse rounded-md bg-muted sm:w-48"
            : "h-9 w-24 animate-pulse rounded-md bg-muted"
        }
        aria-hidden
      />
    );
  }

  if (quantity < 1) {
    return (
      <button
        type="button"
        onClick={() => {
          addProduct(productId, 1);
        }}
        className={baseClass}
      >
        <ShoppingCart className="h-5 w-5 shrink-0" strokeWidth={2} aria-hidden />
        {cartTranslations("addToCart")}
      </button>
    );
  }

  return (
    <div
      className={
        variant === "primary"
          ? "flex w-full flex-col gap-3 sm:w-auto sm:flex-row sm:items-center"
          : "flex flex-col gap-2"
      }
    >
      <div
        className={`${storefrontQuantityRailOnCard} ${variant === "primary" ? "sm:min-w-44" : ""}`}
      >
        <button
          type="button"
          onClick={() => {
            setLineQuantity(productId, quantity - 1);
          }}
          className="flex h-12 w-12 shrink-0 items-center justify-center text-foreground transition hover:bg-muted/60"
          aria-label={cartTranslations("decreaseQty")}
        >
          <Minus className="h-4 w-4" strokeWidth={2} aria-hidden />
        </button>
        <span className="min-w-10 text-center text-base font-semibold tabular-nums">
          {quantity}
        </span>
        <button
          type="button"
          onClick={() => {
            setLineQuantity(productId, quantity + 1);
          }}
          className="flex h-12 w-12 shrink-0 items-center justify-center text-foreground transition hover:bg-muted/60"
          aria-label={cartTranslations("increaseQty")}
        >
          <Plus className="h-4 w-4" strokeWidth={2} aria-hidden />
        </button>
      </div>
      <p className="text-center text-sm text-muted-foreground sm:text-left">
        {cartTranslations("inCartHint")}
      </p>
    </div>
  );
};
