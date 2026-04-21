import type { ReactNode } from "react";

type ProductDetailSpecsSectionProps = {
  title: string;
  children: ReactNode;
};

export const ProductDetailSpecsSection = ({
  title,
  children,
}: ProductDetailSpecsSectionProps) => {
  return (
    <section aria-labelledby="product-specs-heading" className="mt-10">
      <h2
        id="product-specs-heading"
        className="font-display text-lg font-semibold text-foreground"
      >
        {title}
      </h2>
      <dl className="mt-4 space-y-4 rounded-xl border border-border bg-card p-5 dark:border-white/10 dark:bg-white/3">
        {children}
      </dl>
    </section>
  );
};
