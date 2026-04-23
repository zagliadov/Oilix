import Link from "next/link";

import type { AdminProductsSort } from "@/app/lib/admin/products/admin-products-filters";
import { DEFAULT_ADMIN_PRODUCTS_SORT } from "@/app/lib/admin/products/admin-products-filters";
import { storefrontButtonSecondary, storefrontButtonSecondaryPadding } from "@/components/ui/storefront";

const inputClass =
  "w-full min-w-0 rounded-md border border-border bg-background px-3 py-2.5 text-sm text-foreground outline-none focus-visible:border-brand/40 focus-visible:ring-2 focus-visible:ring-brand/25 dark:border-white/12 dark:bg-white/3";
const labelClass = "text-xs font-medium text-muted-foreground";

type AdminProductsListToolbarProps = {
  defaultSearch: string;
  defaultSort: AdminProductsSort;
  showReset: boolean;
};

const SORT_OPTIONS: { value: AdminProductsSort; label: string }[] = [
  {
    value: "created-desc",
    label: "Создан: сначала новые",
  },
  {
    value: "created-asc",
    label: "Создан: сначала старые",
  },
  {
    value: "updated-desc",
    label: "Обновлён: сначала недавно обновлённые",
  },
  {
    value: "updated-asc",
    label: "Обновлён: сначала давно не обновлялся",
  },
  { value: "price-desc", label: "Цена: от большей к меньшей" },
  { value: "price-asc", label: "Цена: от меньшей к большей" },
  { value: "id-asc", label: "По коду (ID), по возрастанию" },
];

/**
 * GET form for /admin/products — `q` (search), `sort` (order).
 */
export const AdminProductsListToolbar = ({
  defaultSearch,
  defaultSort,
  showReset,
}: AdminProductsListToolbarProps) => {
  return (
    <form
      method="get"
      action="/admin/products"
      className="flex flex-col gap-4 rounded-xl border border-border bg-muted/20 p-4 dark:border-white/10 dark:bg-white/3 sm:flex-row sm:flex-wrap sm:items-end"
    >
      <div className="min-w-0 flex-1 sm:min-w-[200px]">
        <label htmlFor="admin-products-search" className={labelClass}>
          Поиск
        </label>
        <input
          id="admin-products-search"
          name="q"
          type="search"
          placeholder="Название, бренд, категория, тип…"
          defaultValue={defaultSearch}
          className={`mt-1.5 ${inputClass}`}
          autoComplete="off"
        />
      </div>
      <div className="w-full min-w-0 sm:w-auto sm:min-w-[220px]">
        <label htmlFor="admin-products-sort" className={labelClass}>
          Сортировка
        </label>
        <select
          id="admin-products-sort"
          name="sort"
          defaultValue={defaultSort}
          className={`mt-1.5 ${inputClass}`}
        >
          {SORT_OPTIONS.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
      </div>
      <div className="flex flex-wrap items-center gap-2">
        <button
          type="submit"
          className={`${storefrontButtonSecondary} ${storefrontButtonSecondaryPadding} text-sm whitespace-nowrap`}
        >
          Применить
        </button>
        {showReset ? (
          <Link
            href="/admin/products"
            className="text-sm font-medium text-brand transition hover:underline"
          >
            Сбросить
          </Link>
        ) : null}
      </div>
    </form>
  );
};

export const hasActiveListFilters = (
  search: string,
  sort: AdminProductsSort,
): boolean => {
  return search.length > 0 || sort !== DEFAULT_ADMIN_PRODUCTS_SORT;
};
