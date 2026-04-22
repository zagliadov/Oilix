export type {
  AntifreezeProduct,
  BrakeFluidDot,
  BrakeFluidProduct,
  Brand,
  CategoryId,
  FilterProduct,
  FilterRole,
  MoneyAmountUah,
  MotorOilProduct,
  OtherConsumableProduct,
  PricedLine,
  ProductCategory,
  ProductId,
  SparkPlugProduct,
  StoreProduct,
  StoreProductKindMap,
} from "./types";
export { ProductKind } from "./types";
export type { CatalogBundle, CatalogIndexes } from "./bundle";
export { buildCatalogIndexes } from "./indexes";
export {
  getBrandByIdInCatalog,
  getBrandNameForProduct,
  getCategoryByIdInCatalog,
  getProductCardImageUrlInCatalog,
  getProductIdParams,
  getStoreProductByIdInCatalog,
} from "./catalog-lookups";
export {
  getDiscountPercent,
  getEffectivePriceUah,
  isPromoProduct,
  selectPromoProducts,
} from "./pricing";
export {
  getProductCardSpecLine,
  PRODUCT_KIND_VALUES,
  type ProductCardSpecContext,
} from "./display";
export {
  buildProductSearchHaystack,
  CATALOG_SORT_IDS,
  computeEffectivePriceBounds,
  createInitialCatalogQueryModel,
  filterCatalogProducts,
  normalizeCatalogSearchQuery,
  productMatchesSearch,
  runCatalogQuery,
  sortCatalogProducts,
  type CatalogQueryContext,
  type CatalogQueryModel,
  type CatalogSortId,
  type StockAvailabilityFilter,
} from "./catalog-query";
export {
  getCrossSellProducts,
  getRelatedProducts,
} from "./product-relations";
