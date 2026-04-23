import * as _ from "lodash";

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

const PRODUCT_KIND_STRINGS = _.values(ProductKind) as string[];

const isRecord = (value: unknown): value is Record<string, unknown> =>
  _.isPlainObject(value);

const getNumber = (
  obj: Record<string, unknown>,
  key: string,
): number | undefined => {
  const value = obj[key];
  if (_.isNumber(value) && !Number.isNaN(value)) {
    return value;
  }
  return undefined;
};

const getString = (
  obj: Record<string, unknown>,
  key: string,
): string | undefined => {
  const value = obj[key];
  if (_.isString(value)) {
    return value;
  }
  return undefined;
};

const isProductKind = (value: string): value is ProductKind =>
  _.includes(PRODUCT_KIND_STRINGS, value);

const buildBaseFields = (row: ProductRow) => {
  const fromRow = _.pick(row, [
    "id",
    "brandId",
    "categoryId",
    "name",
    "inStock",
    "priceUah",
  ]);
  return _.assign({}, fromRow, {
    article: row.article ?? undefined,
    description: row.description ?? undefined,
    createdAt: row.createdAt.toISOString(),
    updatedAt: row.updatedAt.toISOString(),
    promoDiscountPercent:
      row.promoDiscountPercent === null ? undefined : row.promoDiscountPercent,
  });
};

type ProductBaseFields = ReturnType<typeof buildBaseFields>;

type FromDetailsBuilder = (
  details: Record<string, unknown>,
  base: ProductBaseFields,
) => StoreProduct;

const storeProductFromRowByKind: Record<ProductKind, FromDetailsBuilder> = {
  [ProductKind.MotorOil]: (details, base) => ({
    ...base,
    kind: ProductKind.MotorOil,
    viscosity: getString(details, "viscosity") ?? "",
    volumeLiters: getNumber(details, "volumeLiters") ?? 0,
  }),
  [ProductKind.Filter]: (details, base) => ({
    ...base,
    kind: ProductKind.Filter,
    filterRole: (getString(details, "filterRole") ?? "oil") as FilterRole,
    partNumber: getString(details, "partNumber"),
  }),
  [ProductKind.Antifreeze]: (details, base) => ({
    ...base,
    kind: ProductKind.Antifreeze,
    volumeLiters: getNumber(details, "volumeLiters") ?? 0,
    freezePointC: getNumber(details, "freezePointC") ?? 0,
    specification: getString(details, "specification"),
  }),
  [ProductKind.BrakeFluid]: (details, base) => ({
    ...base,
    kind: ProductKind.BrakeFluid,
    volumeLiters: getNumber(details, "volumeLiters") ?? 0,
    dot: (getString(details, "dot") ?? "DOT4") as BrakeFluidDot,
  }),
  [ProductKind.SparkPlug]: (details, base) => ({
    ...base,
    kind: ProductKind.SparkPlug,
    thread: getString(details, "thread") ?? "",
    electrode: getString(details, "electrode"),
    heatRange: getString(details, "heatRange"),
  }),
  [ProductKind.OtherConsumable]: (details, base) => ({
    ...base,
    kind: ProductKind.OtherConsumable,
    summary: getString(details, "summary") ?? "",
  }),
};

export const buildStoreProductFromRow = (
  row: ProductRow,
): StoreProduct | null => {
  const details = isRecord(row.details) ? row.details : null;
  if (details === null) {
    return null;
  }
  if (!isProductKind(row.kind)) {
    return null;
  }
  const base = buildBaseFields(row);
  return storeProductFromRowByKind[row.kind](details, base);
};

type DetailsForKindExtractor = (
  product: StoreProduct,
) => Record<string, unknown>;

const pickDefined = <T extends object>(value: T): Record<string, unknown> => {
  return _.omitBy(value, (fieldValue) => _.isUndefined(fieldValue)) as Record<
    string,
    unknown
  >;
};

const extractDetailsForKindByKind: Record<
  ProductKind,
  DetailsForKindExtractor
> = {
  [ProductKind.MotorOil]: (product) => {
    const motorOil = product as Extract<
      StoreProduct,
      { kind: ProductKind.MotorOil }
    >;
    return {
      viscosity: motorOil.viscosity,
      volumeLiters: motorOil.volumeLiters,
    };
  },
  [ProductKind.Filter]: (product) => {
    const filter = product as Extract<
      StoreProduct,
      { kind: ProductKind.Filter }
    >;
    return pickDefined({
      filterRole: filter.filterRole,
      partNumber: filter.partNumber,
    });
  },
  [ProductKind.Antifreeze]: (product) => {
    const antifreeze = product as Extract<
      StoreProduct,
      { kind: ProductKind.Antifreeze }
    >;
    return pickDefined({
      volumeLiters: antifreeze.volumeLiters,
      freezePointC: antifreeze.freezePointC,
      specification: antifreeze.specification,
    });
  },
  [ProductKind.BrakeFluid]: (product) => {
    const brake = product as Extract<
      StoreProduct,
      { kind: ProductKind.BrakeFluid }
    >;
    return { volumeLiters: brake.volumeLiters, dot: brake.dot };
  },
  [ProductKind.SparkPlug]: (product) => {
    const plug = product as Extract<
      StoreProduct,
      { kind: ProductKind.SparkPlug }
    >;
    return pickDefined({
      thread: plug.thread,
      electrode: plug.electrode,
      heatRange: plug.heatRange,
    });
  },
  [ProductKind.OtherConsumable]: (product) => {
    const other = product as Extract<
      StoreProduct,
      { kind: ProductKind.OtherConsumable }
    >;
    return { summary: other.summary };
  },
};

export const extractDetailsForKind = (
  product: StoreProduct,
): Record<string, unknown> => {
  return extractDetailsForKindByKind[product.kind](product);
};

export const mapBrands = (rows: readonly BrandRow[]) =>
  _.map(rows, (row) => _.pick(row, ["id", "slug", "name"]));

export const mapCategories = (
  rows: readonly CategoryRow[],
): ProductCategory[] =>
  _.map(rows, (row) => ({
    id: row.id,
    slug: row.slug,
    name: row.name,
    primaryKind: row.primaryKind as ProductCategory["primaryKind"],
  }));
