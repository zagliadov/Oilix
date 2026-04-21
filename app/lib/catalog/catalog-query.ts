import * as _ from "lodash";

import { getEffectivePriceUah } from "./pricing";
import type { BrandId, CategoryId } from "./types/shared";
import type { StoreProduct } from "./types/product";
import { ProductKind } from "./types/product";

export const normalizeCatalogSearchQuery = (query: string): string =>
  query.toLowerCase().trim().replace(/\s+/g, " ");

export const buildProductSearchHaystack = (
  product: StoreProduct,
  brandDisplayName: string,
): string => {
  const tokens: string[] = [
    product.name,
    product.id,
    brandDisplayName,
    product.article ?? "",
  ];
  if (product.kind === ProductKind.Filter && product.partNumber !== undefined) {
    tokens.push(product.partNumber);
  }
  return tokens
    .join(" ")
    .toLowerCase()
    .replace(/\s+/g, " ")
    .trim();
};

export const productMatchesSearch = (
  product: StoreProduct,
  brandDisplayName: string,
  normalizedQuery: string,
): boolean => {
  if (normalizedQuery === "") {
    return true;
  }
  const haystack = buildProductSearchHaystack(product, brandDisplayName);
  return haystack.includes(normalizedQuery);
};

export type CatalogSortId =
  | "price_asc"
  | "price_desc"
  | "name_asc"
  | "name_desc"
  | "brand_asc";

/** Stable iteration order for sort `<select>` and future URL sync. */
export const CATALOG_SORT_IDS: readonly CatalogSortId[] = [
  "price_asc",
  "price_desc",
  "name_asc",
  "name_desc",
  "brand_asc",
];

export type StockAvailabilityFilter = "all" | "in_stock" | "out_of_stock";

/**
 * Serializable view state for the catalog UI. Empty categoryIds / brandIds mean “no restriction”.
 * Price bounds use effective (promo) prices in ₴.
 */
export type CatalogQueryModel = {
  searchQuery: string;
  categoryIds: readonly CategoryId[];
  brandIds: readonly BrandId[];
  stock: StockAvailabilityFilter;
  priceMinUah: number;
  priceMaxUah: number;
  sort: CatalogSortId;
};

export const computeEffectivePriceBounds = (
  products: readonly StoreProduct[],
): { min: number; max: number } => {
  if (products.length === 0) {
    return { min: 0, max: 0 };
  }
  const prices = _.map(products, (product) => getEffectivePriceUah(product));
  return {
    min: _.min(prices) ?? 0,
    max: _.max(prices) ?? 0,
  };
};

export type CatalogQueryContext = {
  brandNameById: (brandId: BrandId) => string;
};

export const filterCatalogProducts = (
  products: readonly StoreProduct[],
  context: CatalogQueryContext,
  queryModel: CatalogQueryModel,
): StoreProduct[] => {
  const normalizedQuery = normalizeCatalogSearchQuery(queryModel.searchQuery);
  const categoryFilterActive = queryModel.categoryIds.length > 0;
  const categorySet = categoryFilterActive
    ? new Set(queryModel.categoryIds)
    : null;
  const brandFilterActive = queryModel.brandIds.length > 0;
  const brandSet = brandFilterActive ? new Set(queryModel.brandIds) : null;

  return _.filter(products, (product) => {
    const brandName = context.brandNameById(product.brandId);
    if (!productMatchesSearch(product, brandName, normalizedQuery)) {
      return false;
    }
    if (categorySet !== null && !categorySet.has(product.categoryId)) {
      return false;
    }
    if (brandSet !== null && !brandSet.has(product.brandId)) {
      return false;
    }
    if (queryModel.stock === "in_stock" && !product.inStock) {
      return false;
    }
    if (queryModel.stock === "out_of_stock" && product.inStock) {
      return false;
    }
    const price = getEffectivePriceUah(product);
    if (price < queryModel.priceMinUah || price > queryModel.priceMaxUah) {
      return false;
    }
    return true;
  });
};

const catalogSortStrategies: Record<
  CatalogSortId,
  (
    products: StoreProduct[],
    brandNameById: (brandId: BrandId) => string,
  ) => StoreProduct[]
> = {
  price_asc: (products, brandNameById) => {
    void brandNameById;
    return _.orderBy(products, [(product) => getEffectivePriceUah(product)], ["asc"]);
  },
  price_desc: (products, brandNameById) => {
    void brandNameById;
    return _.orderBy(products, [(product) => getEffectivePriceUah(product)], ["desc"]);
  },
  name_asc: (products, brandNameById) => {
    void brandNameById;
    return _.orderBy(products, [(product) => product.name.toLowerCase()], ["asc"]);
  },
  name_desc: (products, brandNameById) => {
    void brandNameById;
    return _.orderBy(products, [(product) => product.name.toLowerCase()], ["desc"]);
  },
  brand_asc: (products, brandNameById) =>
    _.orderBy(
      products,
      [
        (product) => brandNameById(product.brandId).toLowerCase(),
        (product) => product.name.toLowerCase(),
      ],
      ["asc", "asc"],
    ),
};

export const sortCatalogProducts = (
  products: readonly StoreProduct[],
  sort: CatalogSortId,
  brandNameById: (brandId: BrandId) => string,
): StoreProduct[] => {
  const list = [...products];
  const run = catalogSortStrategies[sort];
  return run(list, brandNameById);
};

export const runCatalogQuery = (
  products: readonly StoreProduct[],
  context: CatalogQueryContext,
  queryModel: CatalogQueryModel,
): StoreProduct[] => {
  const filtered = filterCatalogProducts(products, context, queryModel);
  return sortCatalogProducts(filtered, queryModel.sort, context.brandNameById);
};

export const createInitialCatalogQueryModel = (
  priceBounds: { min: number; max: number },
): CatalogQueryModel => ({
  searchQuery: "",
  categoryIds: [],
  brandIds: [],
  stock: "all",
  priceMinUah: priceBounds.min,
  priceMaxUah: priceBounds.max,
  sort: "price_asc",
});
