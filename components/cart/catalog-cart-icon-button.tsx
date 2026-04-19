"use client";

import { ShoppingCart } from "lucide-react";
import { useTranslations } from "next-intl";

import { useCart } from "@/components/cart/cart-context";

type CatalogCartIconButtonProps = {
  productId: string;
};

export const CatalogCartIconButton = ({
  productId,
}: CatalogCartIconButtonProps) => {
  const cartTranslations = useTranslations("Cart");
  const { addProduct, lines, isReady } = useCart();
  const quantity = lines.find((line) => line.productId === productId)?.quantity ?? 0;

  return (
    <button
      type="button"
      onClick={(event) => {
        event.preventDefault();
        event.stopPropagation();
        addProduct(productId, 1);
      }}
      disabled={!isReady}
      className="relative flex h-10 w-10 shrink-0 items-center justify-center rounded-md border border-border bg-background text-foreground transition hover:border-brand/40 hover:bg-brand/10 disabled:opacity-50 dark:border-white/12 dark:bg-zinc-950/80"
      aria-label={cartTranslations("addToCartShort")}
    >
      <ShoppingCart className="h-[1.125rem] w-[1.125rem]" strokeWidth={2} aria-hidden />
      {quantity > 0 ? (
        <span className="absolute -right-1 -top-1 flex h-[1rem] min-w-[1rem] items-center justify-center rounded-full bg-brand px-0.5 text-[0.5625rem] font-bold leading-none text-white">
          {quantity > 99 ? "99+" : quantity}
        </span>
      ) : null}
    </button>
  );
};
