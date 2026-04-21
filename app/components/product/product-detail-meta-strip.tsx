import { storefrontSurfaceSoft } from "@/components/ui/storefront";

type ProductDetailMetaStripProps = {
  articleLabel: string;
  articleValue: string;
  brandLabel: string;
  brandValue: string;
  stockLabel: string;
  inStock: boolean;
  inStockText: string;
  outOfStockText: string;
};

export const ProductDetailMetaStrip = ({
  articleLabel,
  articleValue,
  brandLabel,
  brandValue,
  stockLabel,
  inStock,
  inStockText,
  outOfStockText,
}: ProductDetailMetaStripProps) => {
  return (
    <dl className={`grid gap-3 px-4 py-3 text-sm sm:grid-cols-2 ${storefrontSurfaceSoft}`}>
      <div>
        <dt className="text-[0.6875rem] font-semibold uppercase tracking-wider text-muted-foreground">
          {brandLabel}
        </dt>
        <dd className="mt-0.5 font-medium text-foreground">{brandValue}</dd>
      </div>
      <div>
        <dt className="text-[0.6875rem] font-semibold uppercase tracking-wider text-muted-foreground">
          {articleLabel}
        </dt>
        <dd className="mt-0.5 font-mono text-sm font-medium tabular-nums text-foreground">
          {articleValue}
        </dd>
      </div>
      <div className="sm:col-span-2">
        <dt className="text-[0.6875rem] font-semibold uppercase tracking-wider text-muted-foreground">
          {stockLabel}
        </dt>
        <dd className="mt-1">
          <span
            className={
              inStock
                ? "inline-flex rounded-md bg-emerald-500/15 px-2.5 py-1 text-xs font-semibold uppercase tracking-wide text-emerald-700 dark:bg-emerald-500/20 dark:text-emerald-400"
                : "inline-flex rounded-md bg-amber-500/15 px-2.5 py-1 text-xs font-semibold uppercase tracking-wide text-amber-800 dark:bg-amber-500/20 dark:text-amber-200"
            }
          >
            {inStock ? inStockText : outOfStockText}
          </span>
        </dd>
      </div>
    </dl>
  );
};
