import * as _ from "lodash";

import catalogJson from "@/data/catalog.json";

import { selectPromoProducts } from "./pricing";
import type { Brand } from "./types/brand";
import type { BrandId, CategoryId, ProductId } from "./types/shared";
import type { ProductCategory } from "./types/category";
import type { StoreProduct } from "./types/product";

/** JSON root shape — mirrors future API payload (`brands`, `categories`, `products`). */
export type CatalogBundle = {
  brands: Brand[];
  categories: ProductCategory[];
  products: StoreProduct[];
};

export type CatalogIndexes = {
  bundle: CatalogBundle;
  brandById: Map<BrandId, Brand>;
  categoryById: Map<CategoryId, ProductCategory>;
  productById: Map<ProductId, StoreProduct>;
};

const bundle = catalogJson as CatalogBundle;

const brandById = new Map<BrandId, Brand>(
  _.map(bundle.brands, (brand) => [brand.id, brand]),
);

const categoryById = new Map<CategoryId, ProductCategory>(
  _.map(bundle.categories, (category) => [category.id, category]),
);

const productById = new Map<ProductId, StoreProduct>(
  _.map(bundle.products, (product) => [product.id, product]),
);

export const catalogIndexes: CatalogIndexes = {
  bundle,
  brandById,
  categoryById,
  productById,
};

export const storeProducts: StoreProduct[] = bundle.products;

export const getStoreProductById = (
  id: string,
): StoreProduct | undefined => productById.get(id);

export const getBrandById = (id: BrandId): Brand | undefined =>
  brandById.get(id);

export const getCategoryById = (id: CategoryId): ProductCategory | undefined =>
  categoryById.get(id);

/** Resolves display name for headers, cards, and cart when only `brandId` is on the SKU. */
export const getBrandNameForProduct = (product: StoreProduct): string => {
  const brand = getBrandById(product.brandId);
  return brand !== undefined ? brand.name : product.brandId;
};

export const getPromoProducts = (): StoreProduct[] =>
  selectPromoProducts(storeProducts);
