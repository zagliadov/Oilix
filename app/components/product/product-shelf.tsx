import * as _ from "lodash";

import { ProductCard, type ProductCardLabels } from "@/app/components/catalog/product-card";
import type { CatalogIndexes } from "@/app/lib/catalog";
import type { StoreProduct } from "@/app/lib/catalog/types/product";

type ProductShelfProps = {
  title: string;
  products: readonly StoreProduct[];
  labels: ProductCardLabels;
  catalog: CatalogIndexes;
  /** Optional id for landmark / anchor navigation */
  sectionId?: string;
};

export const ProductShelf = ({
  title,
  products,
  labels,
  catalog,
  sectionId,
}: ProductShelfProps) => {
  if (products.length === 0) {
    return null;
  }

  return (
    <section
      id={sectionId}
      className="scroll-mt-24 border-t border-border pt-12 dark:border-white/10"
      aria-labelledby={sectionId !== undefined ? `${sectionId}-heading` : undefined}
    >
      <h2
        id={sectionId !== undefined ? `${sectionId}-heading` : undefined}
        className="font-display text-xl font-bold tracking-tight text-foreground sm:text-2xl"
      >
        {title}
      </h2>
      <ul className="mt-6 grid list-none grid-cols-1 gap-5 p-0 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {_.map(products, (item) => (
          <li key={item.id} className="min-w-0">
            <ProductCard product={item} labels={labels} catalog={catalog} />
          </li>
        ))}
      </ul>
    </section>
  );
};
