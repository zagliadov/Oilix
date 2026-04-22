import type { Brand } from "./types/brand";
import type { BrandId, CategoryId, ProductId } from "./types/shared";
import type { ProductCategory } from "./types/category";
import type { StoreProduct } from "./types/product";

/** JSON / API root shape: `brands`, `categories`, `products`. */
export type CatalogBundle = {
  brands: Brand[];
  categories: ProductCategory[];
  products: StoreProduct[];
  /**
   * Primary (or first) image app URL for cards and PDP — from `product_images` when using DB.
   * Not part of JSON seed; omitted when the bundle is only file-backed.
   */
  productCardImageUrlByProductId?: Partial<Record<ProductId, string>>;
};

export type CatalogIndexes = {
  bundle: CatalogBundle;
  brandById: Map<BrandId, Brand>;
  categoryById: Map<CategoryId, ProductCategory>;
  productById: Map<ProductId, StoreProduct>;
  /** One resolved image per product (primary preferred), for UI that does not query `product_images` again. */
  productCardImageUrlByProductId: Map<ProductId, string>;
};
