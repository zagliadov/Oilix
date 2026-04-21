"use client";

import * as _ from "lodash";
import { ChevronDown, Search, SlidersHorizontal } from "lucide-react";
import { useMemo, useState, type ReactNode } from "react";
import { useTranslations } from "next-intl";

import { ProductCard, type ProductCardLabels } from "@/app/components/catalog/product-card";
import { buildProductCardSpecContextFromLanding } from "@/app/lib/i18n/product-card-spec-context";
import {
  CATALOG_SORT_IDS,
  createInitialCatalogQueryModel,
  runCatalogQuery,
  type CatalogQueryModel,
  type CatalogSortId,
  type StockAvailabilityFilter,
} from "@/app/lib/catalog/catalog-query";
import type { Brand } from "@/app/lib/catalog/types/brand";
import type { ProductCategory } from "@/app/lib/catalog/types/category";
import type { BrandId, CategoryId } from "@/app/lib/catalog/types/shared";
import type { StoreProduct } from "@/app/lib/catalog/types/product";
import {
  storefrontButtonSecondaryMuted,
  storefrontCatalogControl,
  storefrontEmptyStateInline,
  storefrontSurfaceCard,
} from "@/components/ui/storefront";

type CatalogExplorerProps = {
  products: StoreProduct[];
  brands: readonly Brand[];
  categories: readonly ProductCategory[];
  priceBounds: { min: number; max: number };
};

const toggleId = <T extends string>(
  current: readonly T[],
  id: T,
): T[] => {
  const next = current.includes(id)
    ? _.filter(current, (entry) => entry !== id)
    : [...current, id];
  return next;
};

const clampPriceToBounds = (
  value: number,
  bounds: { min: number; max: number },
): number => _.clamp(value, bounds.min, bounds.max);

export const CatalogExplorer = ({
  products,
  brands,
  categories,
  priceBounds,
}: CatalogExplorerProps) => {
  const catalogTranslations = useTranslations("Catalog");
  const landingTranslations = useTranslations("Landing");

  const cardLabels: ProductCardLabels = useMemo(
    () => ({
      noImage: landingTranslations("products.noImage"),
      currency: landingTranslations("products.currency"),
      viewProduct: landingTranslations("products.viewProduct"),
      promoBadge: landingTranslations("products.promoBadge"),
      ...buildProductCardSpecContextFromLanding((key) => landingTranslations(key)),
    }),
    [landingTranslations],
  );

  const brandNameById = useMemo(() => {
    const map = new Map<BrandId, string>(
      _.map(brands, (brand) => [brand.id, brand.name]),
    );
    return (brandId: BrandId): string => map.get(brandId) ?? brandId;
  }, [brands]);

  const catalogQueryContext = useMemo(
    () => ({ brandNameById }),
    [brandNameById],
  );

  const [queryModel, setQueryModel] = useState<CatalogQueryModel>(() =>
    createInitialCatalogQueryModel(priceBounds),
  );

  const visibleProducts = useMemo(
    () => runCatalogQuery(products, catalogQueryContext, queryModel),
    [products, catalogQueryContext, queryModel],
  );

  const sortedBrands = useMemo(
    () => _.orderBy(brands, [(brand) => brand.name.toLowerCase()], ["asc"]),
    [brands],
  );

  const sortedCategories = useMemo(
    () => _.orderBy(categories, [(category) => category.name.toLowerCase()], ["asc"]),
    [categories],
  );

  const sortOptionLabels = useMemo(
    () =>
      ({
        price_asc: catalogTranslations("explorer.sort.price_asc"),
        price_desc: catalogTranslations("explorer.sort.price_desc"),
        name_asc: catalogTranslations("explorer.sort.name_asc"),
        name_desc: catalogTranslations("explorer.sort.name_desc"),
        brand_asc: catalogTranslations("explorer.sort.brand_asc"),
      }) satisfies Record<CatalogSortId, string>,
    [catalogTranslations],
  );

  const resetFilters = () => {
    setQueryModel(createInitialCatalogQueryModel(priceBounds));
  };

  const onSearchChange = (value: string) => {
    setQueryModel((previous) => ({ ...previous, searchQuery: value }));
  };

  const onSortChange = (sort: CatalogSortId) => {
    setQueryModel((previous) => ({ ...previous, sort }));
  };

  const onStockChange = (stock: StockAvailabilityFilter) => {
    setQueryModel((previous) => ({ ...previous, stock }));
  };

  const onPriceMinChange = (raw: number) => {
    const min = clampPriceToBounds(raw, priceBounds);
    setQueryModel((previous) => {
      const max = Math.max(previous.priceMaxUah, min);
      return { ...previous, priceMinUah: min, priceMaxUah: max };
    });
  };

  const onPriceMaxChange = (raw: number) => {
    const max = clampPriceToBounds(raw, priceBounds);
    setQueryModel((previous) => {
      const min = Math.min(previous.priceMinUah, max);
      return { ...previous, priceMinUah: min, priceMaxUah: max };
    });
  };

  const toggleCategory = (categoryId: CategoryId) => {
    setQueryModel((previous) => ({
      ...previous,
      categoryIds: toggleId(previous.categoryIds, categoryId),
    }));
  };

  const toggleBrand = (brandId: BrandId) => {
    setQueryModel((previous) => ({
      ...previous,
      brandIds: toggleId(previous.brandIds, brandId),
    }));
  };

  return (
    <div className="mt-8 flex w-full flex-col gap-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between sm:gap-6">
        <label className="relative block min-w-0 flex-1">
          <span className="sr-only">{catalogTranslations("explorer.searchAria")}</span>
          <Search
            className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground"
            aria-hidden
            strokeWidth={2}
          />
          <input
            type="search"
            value={queryModel.searchQuery}
            onChange={(event) => {
              onSearchChange(event.target.value);
            }}
            placeholder={catalogTranslations("explorer.searchPlaceholder")}
            className={`${storefrontCatalogControl} pl-10 pr-3`}
            autoComplete="off"
            enterKeyHint="search"
          />
        </label>

        <div className="flex w-full flex-col gap-2 sm:w-auto sm:min-w-[12rem]">
          <label
            className="text-xs font-medium uppercase tracking-wide text-muted-foreground"
            htmlFor="catalog-sort"
          >
            {catalogTranslations("explorer.sortLabel")}
          </label>
          <div className="relative">
            <select
              id="catalog-sort"
              value={queryModel.sort}
              onChange={(event) => {
                onSortChange(event.target.value as CatalogSortId);
              }}
              className={`${storefrontCatalogControl} appearance-none pl-3 pr-9`}
            >
              {_.map(CATALOG_SORT_IDS, (sortId) => (
                <option key={sortId} value={sortId}>
                  {sortOptionLabels[sortId]}
                </option>
              ))}
            </select>
            <ChevronDown
              className="pointer-events-none absolute right-2.5 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground"
              aria-hidden
              strokeWidth={2}
            />
          </div>
        </div>
      </div>

      <details className={`group ${storefrontSurfaceCard}`}>
        <summary className="flex cursor-pointer list-none items-center justify-between gap-3 px-4 py-3 text-sm font-semibold text-foreground [&::-webkit-details-marker]:hidden">
          <span className="inline-flex items-center gap-2">
            <SlidersHorizontal className="h-4 w-4 text-muted-foreground" aria-hidden />
            {catalogTranslations("explorer.filtersHeading")}
          </span>
          <ChevronDown className="h-4 w-4 shrink-0 text-muted-foreground transition group-open:rotate-180" aria-hidden />
        </summary>
        <div className="space-y-6 border-t border-border px-4 pb-4 pt-2 dark:border-white/10">
          <StockRow
            label={catalogTranslations("explorer.stockLabel")}
            value={queryModel.stock}
            onChange={onStockChange}
            allLabel={catalogTranslations("explorer.stock.all")}
            inLabel={catalogTranslations("explorer.stock.in_stock")}
            outLabel={catalogTranslations("explorer.stock.out_of_stock")}
          />

          <div className="grid gap-4 sm:grid-cols-2">
            <fieldset>
              <legend className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
                {catalogTranslations("explorer.categoryHeading")}
              </legend>
              <ul className="mt-2 max-h-40 list-none space-y-2 overflow-y-auto p-0 sm:max-h-48">
                {_.map(sortedCategories, (category) => {
                  const checked = queryModel.categoryIds.includes(category.id);
                  return (
                    <li key={category.id}>
                      <label className="flex cursor-pointer items-start gap-2 text-sm">
                        <input
                          type="checkbox"
                          checked={checked}
                          onChange={() => {
                            toggleCategory(category.id);
                          }}
                          className="mt-0.5 rounded border-border text-brand focus:ring-brand"
                        />
                        <span>{category.name}</span>
                      </label>
                    </li>
                  );
                })}
              </ul>
            </fieldset>

            <fieldset>
              <legend className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
                {catalogTranslations("explorer.brandHeading")}
              </legend>
              <ul className="mt-2 max-h-40 list-none space-y-2 overflow-y-auto p-0 sm:max-h-48">
                {_.map(sortedBrands, (brand) => {
                  const checked = queryModel.brandIds.includes(brand.id);
                  return (
                    <li key={brand.id}>
                      <label className="flex cursor-pointer items-start gap-2 text-sm">
                        <input
                          type="checkbox"
                          checked={checked}
                          onChange={() => {
                            toggleBrand(brand.id);
                          }}
                          className="mt-0.5 rounded border-border text-brand focus:ring-brand"
                        />
                        <span>{brand.name}</span>
                      </label>
                    </li>
                  );
                })}
              </ul>
            </fieldset>
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <label className="flex flex-col gap-1">
              <span className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
                {catalogTranslations("explorer.priceMin")}
              </span>
              <input
                type="number"
                inputMode="numeric"
                min={priceBounds.min}
                max={priceBounds.max}
                value={queryModel.priceMinUah}
                onChange={(event) => {
                  const parsed = Number.parseInt(event.target.value, 10);
                  if (Number.isNaN(parsed)) {
                    return;
                  }
                  onPriceMinChange(parsed);
                }}
                className={`${storefrontCatalogControl} px-3 py-2 tabular-nums`}
              />
            </label>
            <label className="flex flex-col gap-1">
              <span className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
                {catalogTranslations("explorer.priceMax")}
              </span>
              <input
                type="number"
                inputMode="numeric"
                min={priceBounds.min}
                max={priceBounds.max}
                value={queryModel.priceMaxUah}
                onChange={(event) => {
                  const parsed = Number.parseInt(event.target.value, 10);
                  if (Number.isNaN(parsed)) {
                    return;
                  }
                  onPriceMaxChange(parsed);
                }}
                className={`${storefrontCatalogControl} px-3 py-2 tabular-nums`}
              />
            </label>
          </div>

          <p className="text-xs text-muted-foreground">
            {catalogTranslations("explorer.priceHint", {
              min: String(priceBounds.min),
              max: String(priceBounds.max),
            })}
          </p>

          <button
            type="button"
            onClick={resetFilters}
            className={`inline-flex w-full sm:w-auto px-4 py-2.5 ${storefrontButtonSecondaryMuted}`}
          >
            {catalogTranslations("explorer.reset")}
          </button>
        </div>
      </details>

      <p className="text-sm text-muted-foreground">
        {catalogTranslations("explorer.results", {
          count: visibleProducts.length,
          total: products.length,
        })}
      </p>

      {visibleProducts.length === 0 ? (
        <div className={storefrontEmptyStateInline}>
          <p className="text-base text-muted-foreground">
            {catalogTranslations("explorer.noResults")}
          </p>
        </div>
      ) : (
        <ul className="grid w-full list-none grid-cols-1 gap-6 p-0 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {_.map(visibleProducts, (product) => (
            <li key={product.id}>
              <ProductCard product={product} labels={cardLabels} />
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

type StockRowProps = {
  label: string;
  value: StockAvailabilityFilter;
  onChange: (next: StockAvailabilityFilter) => void;
  allLabel: string;
  inLabel: string;
  outLabel: string;
};

const StockRow = ({
  label,
  value,
  onChange,
  allLabel,
  inLabel,
  outLabel,
}: StockRowProps): ReactNode => (
  <fieldset>
    <legend className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
      {label}
    </legend>
    <div className="mt-2 flex flex-col gap-2 sm:flex-row sm:flex-wrap">
      {_.map(
        [
          ["all", allLabel],
          ["in_stock", inLabel],
          ["out_of_stock", outLabel],
        ] as const,
        ([stockValue, text]) => (
          <label
            key={stockValue}
            className="inline-flex cursor-pointer items-center gap-2 rounded-md border border-transparent px-3 py-2 text-sm has-[:checked]:border-brand/30 has-[:checked]:bg-brand/5 dark:has-[:checked]:bg-brand/10"
          >
            <input
              type="radio"
              name="catalog-stock"
              value={stockValue}
              checked={value === stockValue}
              onChange={() => {
                onChange(stockValue);
              }}
              className="border-border text-brand focus:ring-brand"
            />
            {text}
          </label>
        ),
      )}
    </div>
  </fieldset>
);
