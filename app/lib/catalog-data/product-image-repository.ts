import "server-only";

import { eq, asc, max } from "drizzle-orm";
import { revalidateTag, updateTag } from "next/cache";

import { logAdminProductImages } from "@/app/lib/debug/log-admin-product-images";
import { getDb } from "@/app/lib/db/client";
import { productImages } from "@/app/lib/db/schema";

const invalidateCatalog = (): void => {
  // `updateTag` (Server Action paths) expires `unstable_cache` immediately; `revalidateTag` alone
  // can leave stale catalog HTML without fresh `product_images` URLs (cards show placeholders).
  updateTag("catalog");
  revalidateTag("catalog", "default");
};

export type ProductImageRecord = {
  id: number;
  productId: string;
  url: string;
  alt: string | null;
  sortOrder: number;
  isPrimary: boolean;
  createdAt: Date;
};

export const listProductImagesByProductId = async (
  productId: string,
): Promise<ProductImageRecord[]> => {
  logAdminProductImages("listProductImagesByProductId: querying DB", { productId });
  const db = getDb();
  const rows = await db
    .select()
    .from(productImages)
    .where(eq(productImages.productId, productId))
    .orderBy(asc(productImages.sortOrder), asc(productImages.id));
  logAdminProductImages("listProductImagesByProductId: query done", {
    productId,
    rowCount: rows.length,
    rowIds: rows.map((row) => row.id),
    urls: rows.map((row) => row.url),
  });
  return rows.map((row) => ({
    id: row.id,
    productId: row.productId,
    url: row.url,
    alt: row.alt,
    sortOrder: row.sortOrder,
    isPrimary: row.isPrimary,
    createdAt: row.createdAt,
  }));
};

export type InsertedProductImage = {
  id: number;
  url: string;
  alt: string | null;
  isPrimary: boolean;
};

export const insertProductImage = async (input: {
  productId: string;
  url: string;
  alt?: string;
}): Promise<InsertedProductImage> => {
  const db = getDb();
  const [aggregate] = await db
    .select({ maxOrder: max(productImages.sortOrder) })
    .from(productImages)
    .where(eq(productImages.productId, input.productId));
  const maxOrder = aggregate?.maxOrder;
  const hasNone = maxOrder === null || maxOrder === undefined;
  const nextOrder = hasNone ? 0 : maxOrder + 1;
  const isPrimary = hasNone;

  const [row] = await db
    .insert(productImages)
    .values({
      productId: input.productId,
      url: input.url,
      alt: input.alt,
      sortOrder: nextOrder,
      isPrimary,
    })
    .returning({
      id: productImages.id,
      url: productImages.url,
      alt: productImages.alt,
      isPrimary: productImages.isPrimary,
    });
  if (row === undefined) {
    throw new Error("Failed to insert product image row.");
  }
  invalidateCatalog();
  return {
    id: row.id,
    url: row.url,
    alt: row.alt,
    isPrimary: row.isPrimary,
  };
};

/** Removes all image rows for a product (e.g. before replacing the photo). */
export const deleteAllProductImagesForProduct = async (productId: string): Promise<void> => {
  const db = getDb();
  await db.delete(productImages).where(eq(productImages.productId, productId));
  invalidateCatalog();
};
