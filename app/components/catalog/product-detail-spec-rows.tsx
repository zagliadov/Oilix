import type { ReactNode } from "react";

import type { ProductCardSpecContext } from "@/app/lib/catalog/display";
import type { StoreProduct, StoreProductKindMap } from "@/app/lib/catalog/types/product";
import { ProductKind } from "@/app/lib/catalog/types/product";

export type ProductDetailSpecContext = {
  productTranslations: (key: string) => string;
  landingTranslations: (key: string) => string;
  cardSpecContext: ProductCardSpecContext;
};

const SpecRow = ({ label, value }: { label: string; value: ReactNode }) => (
  <div className="flex flex-col gap-1 sm:flex-row sm:items-baseline sm:justify-between sm:gap-4">
    <dt className="text-sm text-muted-foreground">{label}</dt>
    <dd className="font-medium text-foreground">{value}</dd>
  </div>
);

type ProductDetailSpecStrategyTable = {
  [Kind in keyof StoreProductKindMap]: (
    product: StoreProductKindMap[Kind],
    context: ProductDetailSpecContext,
  ) => ReactNode;
};

const productDetailSpecStrategies: ProductDetailSpecStrategyTable = {
  [ProductKind.MotorOil]: (product, detailContext) => (
    <>
      <SpecRow
        label={detailContext.productTranslations("viscosity")}
        value={product.viscosity}
      />
      <SpecRow
        label={detailContext.productTranslations("volume")}
        value={
          <>
            {product.volumeLiters}{" "}
            {detailContext.landingTranslations("products.volumeUnit")}
          </>
        }
      />
    </>
  ),
  [ProductKind.Filter]: (product, detailContext) => (
    <>
      <SpecRow
        label={detailContext.productTranslations("filterType")}
        value={detailContext.landingTranslations(
          `products.filterRole.${product.filterRole}`,
        )}
      />
      {product.partNumber !== undefined ? (
        <SpecRow
          label={detailContext.productTranslations("partNumber")}
          value={product.partNumber}
        />
      ) : null}
    </>
  ),
  [ProductKind.Antifreeze]: (product, detailContext) => (
    <>
      <SpecRow
        label={detailContext.productTranslations("volume")}
        value={
          <>
            {product.volumeLiters}{" "}
            {detailContext.landingTranslations("products.volumeUnit")}
          </>
        }
      />
      <SpecRow
        label={detailContext.productTranslations("freezePoint")}
        value={
          <>
            {product.freezePointC}
            {detailContext.cardSpecContext.freezePointUnitLabel}
          </>
        }
      />
      {product.specification !== undefined ? (
        <SpecRow
          label={detailContext.productTranslations("specification")}
          value={product.specification}
        />
      ) : null}
    </>
  ),
  [ProductKind.BrakeFluid]: (product, detailContext) => (
    <>
      <SpecRow
        label={detailContext.productTranslations("dotRating")}
        value={product.dot}
      />
      <SpecRow
        label={detailContext.productTranslations("volume")}
        value={
          <>
            {product.volumeLiters}{" "}
            {detailContext.landingTranslations("products.volumeUnit")}
          </>
        }
      />
    </>
  ),
  [ProductKind.SparkPlug]: (product, detailContext) => (
    <>
      <SpecRow
        label={detailContext.productTranslations("thread")}
        value={product.thread}
      />
      {product.electrode !== undefined ? (
        <SpecRow
          label={detailContext.productTranslations("electrode")}
          value={product.electrode}
        />
      ) : null}
      {product.heatRange !== undefined ? (
        <SpecRow
          label={detailContext.productTranslations("heatRange")}
          value={product.heatRange}
        />
      ) : null}
    </>
  ),
  [ProductKind.OtherConsumable]: (product, detailContext) => (
    <SpecRow
      label={detailContext.productTranslations("details")}
      value={product.summary}
    />
  ),
};

export const renderProductDetailSpecRows = (
  product: StoreProduct,
  detailContext: ProductDetailSpecContext,
): ReactNode => {
  const render = productDetailSpecStrategies[product.kind] as (
    storeProduct: StoreProduct,
    context: ProductDetailSpecContext,
  ) => ReactNode;
  return render(product, detailContext);
};
