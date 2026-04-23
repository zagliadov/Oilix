import "server-only";

import { eq, asc } from "drizzle-orm";
import { revalidateTag, updateTag } from "next/cache";
import * as _ from "lodash";

import { buildStoreProductFromRow } from "@/app/lib/catalog/db-mappers";
import {
  toProductInsert,
  toProductUpdate,
} from "@/app/lib/catalog/persist-store-product-to-db";
import type { StoreProduct } from "@/app/lib/catalog/types/product";
import { getDb } from "@/app/lib/db/client";
import { products } from "@/app/lib/db/schema";

const invalidateCatalog = (): void => {
  updateTag("catalog");
  revalidateTag("catalog", "default");
};

export const listProducts = async (): Promise<StoreProduct[]> => {
  const db = getDb();
  const rows = await db
    .select()
    .from(products)
    .orderBy(asc(products.id));
  const out: StoreProduct[] = [];
  for (const row of rows) {
    const product = buildStoreProductFromRow(row);
    if (product === null) {
      throw new Error(`Invalid product in database: ${row.id}`);
    }
    out.push(product);
  }
  return _.orderBy(out, [(product) => product.id.toLowerCase()], ["asc"]);
};

export const getProductById = async (
  id: string,
): Promise<StoreProduct | undefined> => {
  const db = getDb();
  const rows = await db.select().from(products).where(eq(products.id, id));
  if (rows.length === 0) {
    return undefined;
  }
  return buildStoreProductFromRow(rows[0]) ?? undefined;
};

export const createProduct = async (product: StoreProduct): Promise<void> => {
  const db = getDb();
  await db.insert(products).values(toProductInsert(product));
  invalidateCatalog();
};

export const updateProduct = async (product: StoreProduct): Promise<void> => {
  const db = getDb();
  await db
    .update(products)
    .set(toProductUpdate(product))
    .where(eq(products.id, product.id));
  invalidateCatalog();
};

export const deleteProductById = async (id: string): Promise<void> => {
  const existing = await getProductById(id);
  if (existing === undefined) {
    throw new Error(`Product "${id}" not found.`);
  }
  const db = getDb();
  await db.delete(products).where(eq(products.id, id));
  invalidateCatalog();
};
