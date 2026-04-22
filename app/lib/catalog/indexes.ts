import * as _ from "lodash";

import type { Brand } from "@/app/lib/catalog/types/brand";
import type { BrandId, CategoryId, ProductId } from "@/app/lib/catalog/types/shared";
import type { ProductCategory } from "@/app/lib/catalog/types/category";
import type { StoreProduct } from "@/app/lib/catalog/types/product";

import type { CatalogBundle, CatalogIndexes } from "./bundle";

export const buildCatalogIndexes = (bundle: CatalogBundle): CatalogIndexes => {
  const brandById = new Map<BrandId, Brand>(
    _.map(bundle.brands, (brand) => [brand.id, brand]),
  );
  const categoryById = new Map<CategoryId, ProductCategory>(
    _.map(bundle.categories, (category) => [category.id, category]),
  );
  const productById = new Map<ProductId, StoreProduct>(
    _.map(bundle.products, (product) => [product.id, product]),
  );
  const productCardImageUrlByProductId = new Map<ProductId, string>();
  const fromBundle = bundle.productCardImageUrlByProductId;
  if (fromBundle !== undefined) {
    for (const [productId, url] of Object.entries(fromBundle)) {
      if (typeof url === "string" && url !== "") {
        productCardImageUrlByProductId.set(productId as ProductId, url);
      }
    }
  }
  return {
    bundle,
    brandById,
    categoryById,
    productById,
    productCardImageUrlByProductId,
  };
};
