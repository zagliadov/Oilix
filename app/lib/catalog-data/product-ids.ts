import * as _ from "lodash";

import type { StoreProduct } from "@/app/lib/catalog/types/product";

/**
 * Picks the next string id used in mock data (numeric increment when possible).
 */
export const suggestNextProductId = (products: readonly StoreProduct[]): string => {
  const numericCandidateList = _.map(products, (product) => {
    const parsed = Number.parseInt(product.id, 10);
    return Number.isNaN(parsed) ? null : parsed;
  });
  const definedNumeric = _.filter(
    numericCandidateList,
    (value): value is number => value !== null,
  );
  if (definedNumeric.length === 0) {
    return "1";
  }
  const max = Math.max(...definedNumeric);
  return String(max + 1);
};
