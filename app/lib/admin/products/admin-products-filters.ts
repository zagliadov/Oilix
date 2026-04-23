import { DateTime } from "luxon";
import * as _ from "lodash";

import type { StoreProduct } from "@/app/lib/catalog/types/product";

/**
 * - created-* : по `createdAt`
 * - updated-* : по `updatedAt`
 * - `new` / `old` : устаревшие алиасы (как created-desc / created-asc)
 */
export const ADMIN_PRODUCTS_SORT_VALUES = [
  "created-desc",
  "created-asc",
  "updated-desc",
  "updated-asc",
  "new",
  "old",
  "price-asc",
  "price-desc",
  "id-asc",
] as const;

export type AdminProductsSort = (typeof ADMIN_PRODUCTS_SORT_VALUES)[number];

/** `new` / `old` are normalized to these keys before the strategy map lookup. */
type AdminProductsSortStrategyKey = Exclude<AdminProductsSort, "new" | "old">;

export const DEFAULT_ADMIN_PRODUCTS_SORT: AdminProductsSort = "created-desc";

const normalizeAdminProductsSort = (
  raw: AdminProductsSort,
): AdminProductsSortStrategyKey => {
  if (raw === "new") {
    return "created-desc";
  }
  if (raw === "old") {
    return "created-asc";
  }
  return raw;
};

export const parseAdminProductsSort = (
  value: string | string[] | undefined,
): AdminProductsSort => {
  const first = Array.isArray(value) ? value[0] : value;
  if (
    first !== undefined &&
    (ADMIN_PRODUCTS_SORT_VALUES as readonly string[]).includes(first)
  ) {
    return normalizeAdminProductsSort(first as AdminProductsSort);
  }
  return DEFAULT_ADMIN_PRODUCTS_SORT;
};

export const parseAdminProductsSearch = (
  value: string | string[] | undefined,
): string => {
  const first = Array.isArray(value) ? value[0] : value;
  if (first === undefined || typeof first !== "string") {
    return "";
  }
  return first.trim();
};

type RowLabels = {
  brandLabel: string;
  categoryLabel: string;
  kindLabel: string;
};

const productMatchesSearch = (
  product: StoreProduct,
  rowLabels: RowLabels,
  searchText: string,
): boolean => {
  const terms = searchText
    .split(/\s+/)
    .map((term) => term.toLowerCase())
    .filter((term) => term.length > 0);
  if (terms.length === 0) {
    return true;
  }
  const haystack = [
    product.name,
    rowLabels.brandLabel,
    rowLabels.categoryLabel,
    rowLabels.kindLabel,
    product.kind,
  ]
    .join(" \n ")
    .toLowerCase();
  return terms.every((term) => haystack.includes(term));
};

const MILLIS_MISSING_LOW = 0;
const MILLIS_MISSING_HIGH = Number.MAX_SAFE_INTEGER;

const fieldMillis = (
  iso: string | undefined,
  whenMissing: "low" | "high",
): number => {
  if (iso === undefined) {
    return whenMissing === "low" ? MILLIS_MISSING_LOW : MILLIS_MISSING_HIGH;
  }
  const dateTime = DateTime.fromISO(iso, { setZone: true });
  if (!dateTime.isValid) {
    return whenMissing === "low" ? MILLIS_MISSING_LOW : MILLIS_MISSING_HIGH;
  }
  return dateTime.toMillis();
};

const idCompare = (a: StoreProduct, b: StoreProduct): number =>
  a.id.localeCompare(b.id, "und", { numeric: true, sensitivity: "base" });

/**
 * Stable date sort: `desc` = larger timestamps first (newer first when column is "created" / "updated").
 * Rows without a valid date go to the end for desc and to the end for asc (whenMissing chosen accordingly).
 */
const sortByFieldMillis = (
  list: readonly StoreProduct[],
  getIso: (product: StoreProduct) => string | undefined,
  direction: "asc" | "desc",
  missingForAsc: "low" | "high",
  missingForDesc: "low" | "high",
): StoreProduct[] => {
  return [...list].sort((left, right) => {
    const leftMillis = fieldMillis(
      getIso(left),
      direction === "desc" ? missingForDesc : missingForAsc,
    );
    const rightMillis = fieldMillis(
      getIso(right),
      direction === "desc" ? missingForDesc : missingForAsc,
    );
    const primary =
      direction === "desc"
        ? rightMillis - leftMillis
        : leftMillis - rightMillis;
    if (primary !== 0) {
      return primary;
    }
    return idCompare(left, right);
  });
};

type AdminProductsSortStrategy = (
  list: readonly StoreProduct[],
) => StoreProduct[];

const sortByPriceUah: (order: "asc" | "desc") => AdminProductsSortStrategy = (
  order,
) => {
  return (list) =>
    [...list].sort((left, right) => {
      const byPrice =
        order === "asc"
          ? left.priceUah - right.priceUah
          : right.priceUah - left.priceUah;
      if (byPrice !== 0) {
        return byPrice;
      }
      return idCompare(left, right);
    });
};

const adminProductsSortStrategies: Record<
  AdminProductsSortStrategyKey,
  AdminProductsSortStrategy
> = {
  "price-asc": sortByPriceUah("asc"),
  "price-desc": sortByPriceUah("desc"),
  "id-asc": (list) =>
    // Natural / numeric order for ids like "1", "2", … "10" (not "1", "10", "11", "2").
    [...list].sort(idCompare),
  "created-desc": (list) =>
    // Newest first; invalid/missing at bottom.
    sortByFieldMillis(
      list,
      (product) => product.createdAt,
      "desc",
      "low",
      "low",
    ),
  "created-asc": (list) =>
    // Oldest first; invalid/missing at bottom.
    sortByFieldMillis(
      list,
      (product) => product.createdAt,
      "asc",
      "high",
      "low",
    ),
  "updated-desc": (list) =>
    sortByFieldMillis(
      list,
      (product) => product.updatedAt,
      "desc",
      "low",
      "low",
    ),
  "updated-asc": (list) =>
    sortByFieldMillis(
      list,
      (product) => product.updatedAt,
      "asc",
      "high",
      "low",
    ),
};

const sortAdminProducts = (
  list: readonly StoreProduct[],
  sort: AdminProductsSort,
): StoreProduct[] => {
  const key = normalizeAdminProductsSort(sort);
  return adminProductsSortStrategies[key](list);
};

type GetRowLabels = (product: StoreProduct) => RowLabels;

/**
 * Text search in name, brand, category, type (kind) + raw kind code; then sort.
 */
export const filterAndSortAdminProducts = (
  products: readonly StoreProduct[],
  searchText: string,
  sort: AdminProductsSort,
  getRowLabels: GetRowLabels,
): StoreProduct[] => {
  const next =
    searchText.length === 0
      ? [...products]
      : _.filter(products, (product) =>
          productMatchesSearch(product, getRowLabels(product), searchText),
        );
  return sortAdminProducts(next, sort);
};
