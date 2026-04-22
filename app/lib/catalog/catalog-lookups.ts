import type { BrandId, CategoryId, ProductId } from "@/app/lib/catalog/types/shared";
import type { Brand } from "@/app/lib/catalog/types/brand";
import type { ProductCategory } from "@/app/lib/catalog/types/category";
import type { StoreProduct } from "@/app/lib/catalog/types/product";

import type { CatalogIndexes } from "./bundle";

export const getStoreProductByIdInCatalog = (
  id: string,
  catalog: CatalogIndexes,
): StoreProduct | undefined => catalog.productById.get(id);

/** App URL (e.g. `/api/blob/image?...`) for the card / PDP when stored in `product_images`. */
export const getProductCardImageUrlInCatalog = (
  productId: ProductId,
  catalog: CatalogIndexes,
): string | undefined => catalog.productCardImageUrlByProductId.get(productId);

export const getBrandByIdInCatalog = (
  id: BrandId,
  catalog: CatalogIndexes,
): Brand | undefined => catalog.brandById.get(id);

export const getCategoryByIdInCatalog = (
  id: CategoryId,
  catalog: CatalogIndexes,
): ProductCategory | undefined => catalog.categoryById.get(id);

/**
 * Resolves display brand name for cards, cart, and headers.
 */
export const getBrandNameForProduct = (
  product: StoreProduct,
  catalog: Pick<CatalogIndexes, "brandById">,
): string => {
  const brand = catalog.brandById.get(product.brandId);
  return brand !== undefined ? brand.name : product.brandId;
};

/**
 * Ids in stable order for `generateStaticParams` and sitemap-style lists.
 */
export const getProductIdParams = (catalog: CatalogIndexes): { id: string }[] =>
  Array.from(catalog.productById.keys(), (id) => ({ id }));
