import type { BrandId, CategoryId, PricedLine, ProductId } from "./shared";

export type FilterRole = "oil" | "air" | "cabin" | "fuel";

export type BrakeFluidDot = "DOT3" | "DOT4" | "DOT5.1";

/** Discriminant for SKU shapes — use for Record strategies and API `kind` fields. */
export enum ProductKind {
  MotorOil = "motor_oil",
  Filter = "filter",
  Antifreeze = "antifreeze",
  BrakeFluid = "brake_fluid",
  SparkPlug = "spark_plug",
  OtherConsumable = "other_consumable",
}

type BaseStoreProduct = {
  id: ProductId;
  brandId: BrandId;
  categoryId: CategoryId;
  name: string;
  /** Whether the SKU is available (mock; future: inventory / ERP). */
  inStock: boolean;
  /** Vendor / catalog article for search and documents (optional). */
  article?: string;
  /** Short marketing / SEO body for product page (mock; future: CMS per locale). */
  description?: string;
  /** ISO 8601, set when the product row is loaded from Postgres. */
  createdAt?: string;
  /** ISO 8601, set when the product row is loaded from Postgres. */
  updatedAt?: string;
} & PricedLine;

export type MotorOilProduct = BaseStoreProduct & {
  kind: ProductKind.MotorOil;
  viscosity: string;
  volumeLiters: number;
};

export type FilterProduct = BaseStoreProduct & {
  kind: ProductKind.Filter;
  filterRole: FilterRole;
  /** Aftermarket / OEM reference shown on cards */
  partNumber?: string;
};

export type AntifreezeProduct = BaseStoreProduct & {
  kind: ProductKind.Antifreeze;
  volumeLiters: number;
  /** Typical display: down to −20 °C, etc. */
  freezePointC: number;
  specification?: string;
};

export type BrakeFluidProduct = BaseStoreProduct & {
  kind: ProductKind.BrakeFluid;
  volumeLiters: number;
  dot: BrakeFluidDot;
};

export type SparkPlugProduct = BaseStoreProduct & {
  kind: ProductKind.SparkPlug;
  thread: string;
  electrode?: string;
  heatRange?: string;
};

export type OtherConsumableProduct = BaseStoreProduct & {
  kind: ProductKind.OtherConsumable;
  /** Card / listing line until API exposes structured attributes */
  summary: string;
};

/**
 * Closed union of storefront SKUs — maps cleanly to a DB `product` row +
 * optional `kind`-specific table or JSON column.
 */
export type StoreProduct =
  | MotorOilProduct
  | FilterProduct
  | AntifreezeProduct
  | BrakeFluidProduct
  | SparkPlugProduct
  | OtherConsumableProduct;

export type StoreProductKindMap = {
  [ProductKind.MotorOil]: MotorOilProduct;
  [ProductKind.Filter]: FilterProduct;
  [ProductKind.Antifreeze]: AntifreezeProduct;
  [ProductKind.BrakeFluid]: BrakeFluidProduct;
  [ProductKind.SparkPlug]: SparkPlugProduct;
  [ProductKind.OtherConsumable]: OtherConsumableProduct;
};
