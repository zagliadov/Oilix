"use client";

import { Minus, Plus, ShoppingCart } from "lucide-react";
import { useTranslations } from "next-intl";

import { useCart } from "@/components/cart/cart-context";
import { getCatalogProductById } from "@/app/lib/mocks/catalog-products";

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
  const product = getCatalogProductById(productId);
  const line = lines.find((entry) => entry.productId === productId);
  const quantity = line?.quantity ?? 0;

  if (!product) {
    return null;
  }

  const baseClass =
    variant === "primary"
      ? "inline-flex w-full items-center justify-center gap-2 rounded-md bg-brand px-7 py-3.5 text-base font-medium text-white transition hover:brightness-110 active:brightness-95 sm:w-auto"
      : "inline-flex items-center justify-center gap-1.5 rounded-md border border-border bg-card px-3 py-2 text-sm font-medium text-foreground transition hover:border-brand/30 hover:bg-muted/40 dark:border-white/10 dark:bg-white/[0.03]";

  if (!isReady) {
    return (
      <div
        className={
          variant === "primary"
            ? "h-[3.25rem] w-full animate-pulse rounded-md bg-muted sm:w-48"
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
        className={`inline-flex items-center justify-center gap-0 overflow-hidden rounded-md border border-border bg-card dark:border-white/10 dark:bg-white/[0.03] ${variant === "primary" ? "sm:min-w-[11rem]" : ""}`}
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
        <span className="min-w-[2.5rem] text-center text-base font-semibold tabular-nums">
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
