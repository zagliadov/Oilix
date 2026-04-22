import "server-only";

import { asc, desc } from "drizzle-orm";

import { getDb } from "@/app/lib/db/client";
import { brands, categories, productImages, products } from "@/app/lib/db/schema";
import type { CatalogBundle } from "@/app/lib/catalog/bundle";
import {
  buildStoreProductFromRow,
  mapBrands,
  mapCategories,
} from "@/app/lib/catalog/db-mappers";
import type { StoreProduct } from "@/app/lib/catalog/types/product";

/**
 * Load full catalog from Postgres (pooled `DATABASE_URL`).
 */
export const loadCatalogFromDatabase = async (): Promise<CatalogBundle> => {
  const db = getDb();
  const [brandRows, categoryRows, productRows, imageRows] = await Promise.all([
    db.select().from(brands).orderBy(asc(brands.id)),
    db.select().from(categories).orderBy(asc(categories.id)),
    db.select().from(products).orderBy(asc(products.id)),
    db
      .select()
      .from(productImages)
      .orderBy(
        asc(productImages.productId),
        desc(productImages.isPrimary),
        asc(productImages.sortOrder),
        asc(productImages.id),
      ),
  ]);
  const mapped: StoreProduct[] = [];
  for (const row of productRows) {
    const product = buildStoreProductFromRow(row);
    if (product === null) {
      throw new Error(
        `Invalid product row in database (id=${row.id}, kind=${row.kind})`,
      );
    }
    mapped.push(product);
  }
  const productCardImageUrlByProductId: Partial<Record<string, string>> = {};
  for (const imageRow of imageRows) {
    if (productCardImageUrlByProductId[imageRow.productId] === undefined) {
      productCardImageUrlByProductId[imageRow.productId] = imageRow.url;
    }
  }
  return {
    brands: mapBrands(brandRows),
    categories: mapCategories(categoryRows),
    products: mapped,
    productCardImageUrlByProductId,
  };
};
