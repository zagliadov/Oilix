import type { Metadata } from "next";
import Link from "next/link";
import { unstable_noStore } from "next/cache";
import * as _ from "lodash";

import {
  filterAndSortAdminProducts,
  parseAdminProductsSearch,
  parseAdminProductsSort,
} from "@/app/lib/admin/products/admin-products-filters";
import { loadCatalogFromDatabase } from "@/app/lib/catalog/load-catalog-from-db";
import { ProductKind } from "@/app/lib/catalog/types/product";
import {
  AdminProductsListToolbar,
  hasActiveListFilters,
} from "@/components/admin/admin-products-list-toolbar";
import { AdminShell } from "@/components/admin/admin-shell";
import { DeleteProductButton } from "@/components/admin/delete-product-button";
import { storefrontButtonPrimary, storefrontButtonPrimaryPaddingCompact } from "@/components/ui/storefront";

const KIND_LABEL_RU: Record<ProductKind, string> = {
  [ProductKind.MotorOil]: "Моторное масло",
  [ProductKind.Filter]: "Фильтр",
  [ProductKind.Antifreeze]: "Антифриз",
  [ProductKind.BrakeFluid]: "Тормозная жидкость",
  [ProductKind.SparkPlug]: "Свеча",
  [ProductKind.OtherConsumable]: "Прочее",
};

export const metadata: Metadata = {
  title: "Товары — Админка — Oilix",
  robots: { index: false, follow: false },
};

type AdminProductsPageProps = {
  searchParams?: Promise<Record<string, string | string[] | undefined>>;
};

export default async function AdminProductsPage({ searchParams }: AdminProductsPageProps) {
  unstable_noStore();
  const sp = (await searchParams) ?? {};
  const search = parseAdminProductsSearch(sp["q"]);
  const sort = parseAdminProductsSort(sp["sort"]);
  // Fresh DB read — avoid stale `unstable_cache` on `getCatalogBundle` so `createdAt` / `updatedAt` match the table.
  const bundle = await loadCatalogFromDatabase();
  const brandById = _.keyBy(bundle.brands, "id");
  const categoryById = _.keyBy(bundle.categories, "id");
  const totalCount = bundle.products.length;

  const getRowLabels = (product: (typeof bundle.products)[0]) => {
    const brand = brandById[product.brandId];
    const category = categoryById[product.categoryId];
    return {
      brandLabel: brand?.name ?? product.brandId,
      categoryLabel: category?.name ?? product.categoryId,
      kindLabel: KIND_LABEL_RU[product.kind] ?? product.kind,
    };
  };

  const products = filterAndSortAdminProducts(bundle.products, search, sort, getRowLabels);
  const listFiltersActive = hasActiveListFilters(search, sort);
  const totalNoun =
    totalCount === 1
      ? "товар"
      : totalCount >= 2 && totalCount <= 4
        ? "товара"
        : "товаров";

  return (
    <AdminShell title="Товары">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <p className="text-sm text-muted-foreground">
          {search.length > 0
            ? `Найдено: ${products.length} из ${totalCount} ${totalNoun}`
            : `В базе: ${totalCount} ${totalNoun}`}
        </p>
        <Link
          href="/admin/products/new"
          className={`self-start sm:self-auto ${storefrontButtonPrimary} ${storefrontButtonPrimaryPaddingCompact} text-sm`}
        >
          Добавить товар
        </Link>
      </div>

      <div className="mt-6">
        <AdminProductsListToolbar
          defaultSearch={search}
          defaultSort={sort}
          showReset={listFiltersActive}
        />
      </div>

      {products.length === 0 && search.length > 0 ? (
        <p className="mt-6 text-sm text-muted-foreground">Нет товаров, подходящих под поиск.</p>
      ) : null}

      <div className="mt-6 overflow-x-auto rounded-xl border border-border dark:border-white/10">
        <table className="w-full min-w-[640px] border-collapse text-left text-sm">
          <thead>
            <tr className="border-b border-border bg-muted/30 dark:border-white/10 dark:bg-white/3">
              <th className="px-4 py-3 font-semibold text-foreground">ID</th>
              <th className="px-4 py-3 font-semibold text-foreground">Название</th>
              <th className="px-4 py-3 font-semibold text-foreground">Бренд</th>
              <th className="px-4 py-3 font-semibold text-foreground">Категория</th>
              <th className="px-4 py-3 font-semibold text-foreground">Тип</th>
              <th className="px-4 py-3 font-semibold text-foreground tabular-nums">Цена (₴)</th>
              <th className="px-4 py-3 font-semibold text-foreground">Наличие</th>
              <th className="px-4 py-3 font-semibold text-foreground">Действия</th>
            </tr>
          </thead>
          <tbody>
            {_.map(products, (product) => {
              const brand = brandById[product.brandId];
              const category = categoryById[product.categoryId];
              const brandLabel = brand?.name ?? product.brandId;
              const categoryLabel = category?.name ?? product.categoryId;
              const kindLabel = KIND_LABEL_RU[product.kind] ?? product.kind;
              return (
                <tr
                  key={product.id}
                  className="border-b border-border/60 last:border-0 dark:border-white/10"
                >
                  <td className="px-4 py-3 font-mono text-xs tabular-nums text-muted-foreground">
                    {product.id}
                  </td>
                  <td className="max-w-[200px] truncate px-4 py-3 font-medium text-foreground">
                    {product.name}
                  </td>
                  <td className="px-4 py-3 text-muted-foreground">{brandLabel}</td>
                  <td className="px-4 py-3 text-muted-foreground">{categoryLabel}</td>
                  <td className="px-4 py-3 text-muted-foreground">{kindLabel}</td>
                  <td className="px-4 py-3 tabular-nums text-foreground">{product.priceUah}</td>
                  <td className="px-4 py-3 text-muted-foreground">
                    {product.inStock ? "Да" : "Нет"}
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex flex-wrap items-center gap-6">
                      <Link
                        href={`/admin/products/${encodeURIComponent(product.id)}/edit`}
                        className="text-sm font-medium text-brand transition hover:underline"
                      >
                        Правка
                      </Link>
                      <DeleteProductButton
                        productId={product.id}
                        productName={product.name}
                      />
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </AdminShell>
  );
}
