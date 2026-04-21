import * as _ from "lodash";

import { getEffectivePriceUah, isPromoProduct } from "./pricing";
import type { StoreProduct } from "./types/product";

/**
 * Same category, excluding current SKU — prefers same brand, then lower effective price.
 */
export const getRelatedProducts = (
  current: StoreProduct,
  catalog: readonly StoreProduct[],
  limit: number = 4,
): StoreProduct[] => {
  const peers = _.filter(
    catalog,
    (item) =>
      item.id !== current.id && item.categoryId === current.categoryId,
  );
  const ordered = _.orderBy(
    peers,
    [
      (item) => (item.brandId === current.brandId ? 0 : 1),
      (item) => getEffectivePriceUah(item),
    ],
    ["asc", "asc"],
  );
  return _.take(ordered, limit);
};

/**
 * Cross-sell: promos outside this category, then same brand in other categories, then other SKUs by price.
 */
export const getCrossSellProducts = (
  current: StoreProduct,
  catalog: readonly StoreProduct[],
  limit: number = 4,
): StoreProduct[] => {
  const others = _.filter(catalog, (item) => item.id !== current.id);
  const promoOutsideCategory = _.filter(
    others,
    (item) =>
      item.categoryId !== current.categoryId && isPromoProduct(item),
  );
  const sameBrandDifferentCategory = _.filter(
    others,
    (item) =>
      item.brandId === current.brandId &&
      item.categoryId !== current.categoryId,
  );

  const pickedIds = new Set<string>([
    ..._.map(promoOutsideCategory, (item) => item.id),
    ..._.map(sameBrandDifferentCategory, (item) => item.id),
  ]);

  const remaining = _.filter(others, (item) => !pickedIds.has(item.id));
  const remainingOrdered = _.orderBy(
    remaining,
    [(item) => getEffectivePriceUah(item)],
    ["asc"],
  );

  const merged = _.uniqBy(
    [
      ...promoOutsideCategory,
      ...sameBrandDifferentCategory,
      ...remainingOrdered,
    ],
    "id",
  );
  return _.take(merged, limit);
};
