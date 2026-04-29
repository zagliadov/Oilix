"use client";

import { ShoppingCart } from "lucide-react";
import Link from "next/link";
import { useLocale, useTranslations } from "next-intl";

import { buildLocalizedPath } from "@/app/lib/i18n/build-localized-path";
import { useCart } from "@/components/cart/cart-context";

type CartLinkButtonProps = {
  className?: string;
};

export const CartLinkButton = ({ className = "" }: CartLinkButtonProps) => {
  const cartTranslations = useTranslations("Cart");
  const locale = useLocale();
  const { totalQuantity } = useCart();

  return (
    <Link
      href={buildLocalizedPath("/cart", locale)}
      className={`relative flex h-10 w-10 shrink-0 items-center justify-center rounded-md border border-border/50 bg-background text-foreground shadow-sm transition hover:border-brand/30 hover:bg-muted/40 dark:border-white/10 dark:bg-zinc-900 dark:hover:border-brand/25 ${className}`}
      aria-label={cartTranslations("ariaCart")}
    >
      <ShoppingCart className="h-4.5 w-4.5" strokeWidth={2} aria-hidden />
      {totalQuantity > 0 ? (
        <span className="absolute -right-1 -top-1 flex h-4.5 min-w-4.5 items-center justify-center rounded-full bg-brand px-1 text-[0.625rem] font-bold leading-none text-white">
          {totalQuantity > 99 ? "99+" : totalQuantity}
        </span>
      ) : null}
    </Link>
  );
};
