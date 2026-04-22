import { extractDetailsForKind } from "@/app/lib/catalog/db-mappers";
import type { StoreProduct } from "@/app/lib/catalog/types/product";
import { products } from "@/app/lib/db/schema";

type ProductInsert = typeof products.$inferInsert;

export const toProductInsert = (product: StoreProduct, now: Date = new Date()): ProductInsert => ({
  id: product.id,
  brandId: product.brandId,
  categoryId: product.categoryId,
  name: product.name,
  kind: product.kind,
  priceUah: product.priceUah,
  promoDiscountPercent: product.promoDiscountPercent ?? null,
  inStock: product.inStock,
  article: product.article ?? null,
  description: product.description ?? null,
  details: extractDetailsForKind(product),
  createdAt: now,
  updatedAt: now,
});

export const toProductUpdate = (product: StoreProduct, now: Date = new Date()) => ({
  brandId: product.brandId,
  categoryId: product.categoryId,
  name: product.name,
  kind: product.kind,
  priceUah: product.priceUah,
  promoDiscountPercent: product.promoDiscountPercent ?? null,
  inStock: product.inStock,
  article: product.article ?? null,
  description: product.description ?? null,
  details: extractDetailsForKind(product),
  updatedAt: now,
});
