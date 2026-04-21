import "server-only";

import * as _ from "lodash";

import type { CatalogBundle } from "@/app/lib/catalog/bundle";
import type { StoreProduct } from "@/app/lib/catalog/types/product";

import { readCatalogBundleFromFile } from "./read-catalog-file";
import { writeCatalogBundleToFile } from "./write-catalog-file";

const persistBundle = async (bundle: CatalogBundle): Promise<void> => {
  await writeCatalogBundleToFile(bundle);
};

export const listProducts = async (): Promise<StoreProduct[]> => {
  const bundle = await readCatalogBundleFromFile();
  return _.orderBy(bundle.products, [(product) => product.id.toLowerCase()], ["asc"]);
};

export const getProductById = async (
  id: string,
): Promise<StoreProduct | undefined> => {
  const bundle = await readCatalogBundleFromFile();
  return _.find(bundle.products, { id });
};

export const createProduct = async (product: StoreProduct): Promise<void> => {
  const bundle = await readCatalogBundleFromFile();
  const exists = _.some(bundle.products, { id: product.id });
  if (exists) {
    throw new Error(`Product id "${product.id}" already exists.`);
  }
  const nextBundle: CatalogBundle = {
    ...bundle,
    products: [...bundle.products, product],
  };
  await persistBundle(nextBundle);
};

export const updateProduct = async (product: StoreProduct): Promise<void> => {
  const bundle = await readCatalogBundleFromFile();
  const index = _.findIndex(bundle.products, { id: product.id });
  if (index === -1) {
    throw new Error(`Product "${product.id}" not found.`);
  }
  const nextProducts = [...bundle.products];
  nextProducts[index] = product;
  const nextBundle: CatalogBundle = {
    ...bundle,
    products: nextProducts,
  };
  await persistBundle(nextBundle);
};

export const deleteProductById = async (id: string): Promise<void> => {
  const bundle = await readCatalogBundleFromFile();
  const nextProducts = _.reject(bundle.products, { id });
  if (nextProducts.length === bundle.products.length) {
    throw new Error(`Product "${id}" not found.`);
  }
  const nextBundle: CatalogBundle = {
    ...bundle,
    products: nextProducts,
  };
  await persistBundle(nextBundle);
};
