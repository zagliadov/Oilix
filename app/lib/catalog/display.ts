import * as _ from "lodash";

import type { FilterRole } from "./types/product";
import type { StoreProduct, StoreProductKindMap } from "./types/product";
import { ProductKind } from "./types/product";

export type ProductCardSpecContext = {
  volumeUnit: string;
  filterRoleLabel: (role: FilterRole) => string;
  freezePointUnitLabel: string;
};

type ProductCardSpecLineStrategyTable = {
  [Kind in keyof StoreProductKindMap]: (
    product: StoreProductKindMap[Kind],
    context: ProductCardSpecContext,
  ) => string;
};

const productCardSpecLineStrategies: ProductCardSpecLineStrategyTable = {
  [ProductKind.MotorOil]: (product, context) =>
    `${product.viscosity} · ${product.volumeLiters} ${context.volumeUnit}`,
  [ProductKind.Filter]: (product, context) => {
    const role = context.filterRoleLabel(product.filterRole);
    return product.partNumber !== undefined ? `${role} · ${product.partNumber}` : role;
  },
  [ProductKind.Antifreeze]: (product, context) => {
    const spec =
      product.specification !== undefined ? ` · ${product.specification}` : "";
    return `${product.volumeLiters} ${context.volumeUnit}${spec} · ${product.freezePointC}${context.freezePointUnitLabel}`;
  },
  [ProductKind.BrakeFluid]: (product, context) =>
    `${product.dot} · ${product.volumeLiters} ${context.volumeUnit}`,
  [ProductKind.SparkPlug]: (product, context) => {
    void context;
    const extra =
      product.heatRange !== undefined ? ` · ${product.heatRange}` : "";
    return `${product.thread}${extra}`;
  },
  [ProductKind.OtherConsumable]: (product, context) => {
    void context;
    return product.summary;
  },
};

/** Stable order for guards, CMS sync, or exhaustive runtime checks */
export const PRODUCT_KIND_VALUES = _.values(ProductKind) as ProductKind[];

/** One-line spec for cards, cart lines, and compact lists */
export const getProductCardSpecLine = (
  product: StoreProduct,
  context: ProductCardSpecContext,
): string => {
  const run = productCardSpecLineStrategies[product.kind] as (
    item: StoreProduct,
    cardContext: ProductCardSpecContext,
  ) => string;
  return run(product, context);
};
