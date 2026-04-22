import {
  ProductKind,
  type BrakeFluidDot,
  type FilterRole,
  type StoreProduct,
} from "@/app/lib/catalog/types/product";
import type { ProductCategory } from "@/app/lib/catalog/types/category";

import type { brands, categories, products } from "@/app/lib/db/schema";

type BrandRow = typeof brands.$inferSelect;
type CategoryRow = typeof categories.$inferSelect;
type ProductRow = typeof products.$inferSelect;

const isRecord = (value: unknown): value is Record<string, unknown> =>
  value !== null && typeof value === "object" && !Array.isArray(value);

const getNumber = (obj: Record<string, unknown>, key: string): number | undefined => {
  const v = obj[key];
  return typeof v === "number" && !Number.isNaN(v) ? v : undefined;
};

const getString = (obj: Record<string, unknown>, key: string): string | undefined => {
  const v = obj[key];
  return typeof v === "string" ? v : undefined;
};

export const buildStoreProductFromRow = (row: ProductRow): StoreProduct | null => {
  const d = isRecord(row.details) ? row.details : null;
  if (d === null) {
    return null;
  }
  const base = {
    id: row.id,
    brandId: row.brandId,
    categoryId: row.categoryId,
    name: row.name,
    inStock: row.inStock,
    priceUah: row.priceUah,
    article: row.article ?? undefined,
    description: row.description ?? undefined,
    promoDiscountPercent:
      row.promoDiscountPercent === null
        ? undefined
        : row.promoDiscountPercent,
  } as const;
  const kind = row.kind;
  if (kind === ProductKind.MotorOil) {
    return {
      ...base,
      kind: ProductKind.MotorOil,
      viscosity: getString(d, "viscosity") ?? "",
      volumeLiters: getNumber(d, "volumeLiters") ?? 0,
    };
  }
  if (kind === ProductKind.Filter) {
    return {
      ...base,
      kind: ProductKind.Filter,
      filterRole: (getString(d, "filterRole") ?? "oil") as FilterRole,
      partNumber: getString(d, "partNumber"),
    };
  }
  if (kind === ProductKind.Antifreeze) {
    return {
      ...base,
      kind: ProductKind.Antifreeze,
      volumeLiters: getNumber(d, "volumeLiters") ?? 0,
      freezePointC: getNumber(d, "freezePointC") ?? 0,
      specification: getString(d, "specification"),
    };
  }
  if (kind === ProductKind.BrakeFluid) {
    return {
      ...base,
      kind: ProductKind.BrakeFluid,
      volumeLiters: getNumber(d, "volumeLiters") ?? 0,
      dot: (getString(d, "dot") ?? "DOT4") as BrakeFluidDot,
    };
  }
  if (kind === ProductKind.SparkPlug) {
    return {
      ...base,
      kind: ProductKind.SparkPlug,
      thread: getString(d, "thread") ?? "",
      electrode: getString(d, "electrode"),
      heatRange: getString(d, "heatRange"),
    };
  }
  if (kind === ProductKind.OtherConsumable) {
    return {
      ...base,
      kind: ProductKind.OtherConsumable,
      summary: getString(d, "summary") ?? "",
    };
  }
  return null;
};

export const extractDetailsForKind = (product: StoreProduct): Record<string, unknown> => {
  switch (product.kind) {
    case ProductKind.MotorOil:
      return { viscosity: product.viscosity, volumeLiters: product.volumeLiters };
    case ProductKind.Filter: {
      return {
        filterRole: product.filterRole,
        ...(product.partNumber !== undefined
          ? { partNumber: product.partNumber }
          : {}),
      };
    }
    case ProductKind.Antifreeze: {
      return {
        volumeLiters: product.volumeLiters,
        freezePointC: product.freezePointC,
        ...(product.specification !== undefined
          ? { specification: product.specification }
          : {}),
      };
    }
    case ProductKind.BrakeFluid: {
      return { volumeLiters: product.volumeLiters, dot: product.dot };
    }
    case ProductKind.SparkPlug: {
      return {
        thread: product.thread,
        ...(product.electrode !== undefined
          ? { electrode: product.electrode }
          : {}),
        ...(product.heatRange !== undefined
          ? { heatRange: product.heatRange }
          : {}),
      };
    }
    case ProductKind.OtherConsumable: {
      return { summary: product.summary };
    }
    default: {
      const _x: never = product;
      return _x;
    }
  }
};

export const mapBrands = (rows: readonly BrandRow[]) =>
  rows.map((row) => ({ id: row.id, slug: row.slug, name: row.name }));

export const mapCategories = (rows: readonly CategoryRow[]): ProductCategory[] =>
  rows.map((row) => ({
    id: row.id,
    slug: row.slug,
    name: row.name,
    primaryKind: row.primaryKind as ProductCategory["primaryKind"],
  }));
