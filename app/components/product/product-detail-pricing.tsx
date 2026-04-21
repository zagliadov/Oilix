import { formatPriceUah } from "@/app/lib/format-price";
import { storefrontBadgePromoSolid, storefrontSurfaceSoft } from "@/components/ui/storefront";

type ProductDetailPricingProps = {
  currencyLabel: string;
  basePriceUah: number;
  effectivePriceUah: number;
  discountPercent: number | null;
  priceLabel: string;
  saveLabel: string;
  promoBadgeWord: string;
};

export const ProductDetailPricing = ({
  currencyLabel,
  basePriceUah,
  effectivePriceUah,
  discountPercent,
  priceLabel,
  saveLabel,
  promoBadgeWord,
}: ProductDetailPricingProps) => {
  const hasPromo = discountPercent !== null;
  const savingsUah = hasPromo ? Math.max(0, basePriceUah - effectivePriceUah) : 0;

  return (
    <div className={`p-5 ${storefrontSurfaceSoft}`}>
      <div className="flex flex-wrap items-baseline justify-between gap-3">
        <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
          {priceLabel}
        </p>
        {hasPromo ? (
          <span className={`${storefrontBadgePromoSolid} py-1 text-xs`}>
            −{discountPercent}% · {promoBadgeWord}
          </span>
        ) : null}
      </div>
      <div className="mt-3 flex flex-col gap-1">
        {hasPromo ? (
          <p className="text-sm text-muted-foreground line-through tabular-nums">
            {formatPriceUah(basePriceUah)} {currencyLabel}
          </p>
        ) : null}
        <p className="font-display text-3xl font-bold tabular-nums tracking-tight text-foreground sm:text-4xl">
          {formatPriceUah(effectivePriceUah)} {currencyLabel}
        </p>
        {hasPromo && savingsUah > 0 ? (
          <p className="text-sm text-muted-foreground">
            {saveLabel}: {formatPriceUah(savingsUah)} {currencyLabel}
          </p>
        ) : null}
      </div>
    </div>
  );
};
