import type { CategoryId } from "./shared";
import type { ProductKind } from "./product";

/**
 * Navigation / taxonomy slice. `primaryKind` is the dominant product shape in this bucket
 * (many-to-one vs products.kind — useful for faceted search later).
 */
export type ProductCategory = {
  id: CategoryId;
  slug: string;
  name: string;
  /** Expected discriminant for most products in this category */
  primaryKind: ProductKind;
};
