"use client";

import { ShoppingCart } from "lucide-react";
import Link from "next/link";
import { useTranslations } from "next-intl";

import { useCart } from "@/components/cart/cart-context";

type CartLinkButtonProps = {
  className?: string;
};

export const CartLinkButton = ({ className = "" }: CartLinkButtonProps) => {
  const cartTranslations = useTranslations("Cart");
  const { totalQuantity } = useCart();

  return (
    <Link
      href="/cart"
      className={`relative flex h-10 w-10 shrink-0 items-center justify-center rounded-md border border-border/50 bg-background text-foreground shadow-sm transition hover:border-brand/30 hover:bg-muted/40 dark:border-white/10 dark:bg-zinc-900 dark:hover:border-brand/25 ${className}`}
      aria-label={cartTranslations("ariaCart")}
    >
      <ShoppingCart className="h-[1.125rem] w-[1.125rem]" strokeWidth={2} aria-hidden />
      {totalQuantity > 0 ? (
        <span className="absolute -right-1 -top-1 flex h-[1.125rem] min-w-[1.125rem] items-center justify-center rounded-full bg-brand px-1 text-[0.625rem] font-bold leading-none text-white">
          {totalQuantity > 99 ? "99+" : totalQuantity}
        </span>
      ) : null}
    </Link>
  );
};
