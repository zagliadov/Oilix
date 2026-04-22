"use client";

import Link from "next/link";
import { useActionState, useState } from "react";

import {
  type ProductFormActionState,
  createProductAction,
  updateProductAction,
} from "@/app/lib/admin/products/product-actions";
import { ProductKind } from "@/app/lib/catalog/types/product";
import type { StoreProduct } from "@/app/lib/catalog/types/product";
import { renderProductKindFieldBlock } from "@/components/admin/product-form-kind-blocks";
import {
  storefrontButtonPrimary,
  storefrontButtonPrimaryPaddingCompact,
  storefrontButtonSecondary,
  storefrontButtonSecondaryPadding,
} from "@/components/ui/storefront";

type BrandOption = { id: string; name: string };
type CategoryOption = { id: string; name: string };

const KIND_OPTIONS: readonly { value: ProductKind; label: string }[] = [
  { value: ProductKind.MotorOil, label: "Моторное масло" },
  { value: ProductKind.Filter, label: "Фильтр" },
  { value: ProductKind.Antifreeze, label: "Антифриз" },
  { value: ProductKind.BrakeFluid, label: "Тормозная жидкость" },
  { value: ProductKind.SparkPlug, label: "Свеча зажигания" },
  { value: ProductKind.OtherConsumable, label: "Прочий расходник" },
];

const inputClass =
  "w-full rounded-md border border-border bg-background px-3 py-2.5 text-base text-foreground outline-none focus-visible:border-brand/40 focus-visible:ring-2 focus-visible:ring-brand/25 dark:border-white/12 dark:bg-white/3";

const labelClass = "block text-sm font-medium text-foreground";

const initialFormState: ProductFormActionState = { ok: true };

type ProductFormProps = {
  mode: "create" | "edit";
  brands: readonly BrandOption[];
  categories: readonly CategoryOption[];
  initialProduct?: StoreProduct;
};

export const ProductForm = ({
  mode,
  brands,
  categories,
  initialProduct,
}: ProductFormProps) => {
  const initialKind = initialProduct?.kind ?? ProductKind.MotorOil;
  const [kind, setKind] = useState<ProductKind>(initialKind);

  const action = mode === "create" ? createProductAction : updateProductAction;
  const [state, formAction, isPending] = useActionState(
    action,
    initialFormState,
  );

  return (
    <form action={formAction} className="space-y-8">
      {mode === "edit" && initialProduct !== undefined ? (
        <input type="hidden" name="id" value={initialProduct.id} />
      ) : null}

      <div className="grid gap-6 sm:grid-cols-2">
        <div className="space-y-2 sm:col-span-2">
          <label htmlFor="product-kind" className={labelClass}>
            Тип
          </label>
          {mode === "edit" && initialProduct !== undefined ? (
            <>
              <input type="hidden" name="kind" value={initialProduct.kind} />
              <p
                id="product-kind"
                className="rounded-md border border-border bg-muted/20 px-3 py-2.5 text-sm text-muted-foreground dark:border-white/10"
              >
                {KIND_OPTIONS.find(
                  (option) => option.value === initialProduct.kind,
                )?.label ?? initialProduct.kind}
              </p>
            </>
          ) : (
            <select
              id="product-kind"
              name="kind"
              value={kind}
              onChange={(event) => {
                setKind(event.target.value as ProductKind);
              }}
              className={inputClass}
            >
              {KIND_OPTIONS.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          )}
        </div>

        <div className="space-y-2">
          <label htmlFor="brandId" className={labelClass}>
            Бренд
          </label>
          <select
            id="brandId"
            name="brandId"
            required
            defaultValue={initialProduct?.brandId ?? ""}
            className={inputClass}
          >
            <option value="" disabled>
              Выберите бренд
            </option>
            {brands.map((brand) => (
              <option key={brand.id} value={brand.id}>
                {brand.name}
              </option>
            ))}
          </select>
        </div>

        <div className="space-y-2">
          <label htmlFor="categoryId" className={labelClass}>
            Категория
          </label>
          <select
            id="categoryId"
            name="categoryId"
            required
            defaultValue={initialProduct?.categoryId ?? ""}
            className={inputClass}
          >
            <option value="" disabled>
              Выберите категорию
            </option>
            {categories.map((category) => (
              <option key={category.id} value={category.id}>
                {category.name}
              </option>
            ))}
          </select>
        </div>

        <div className="space-y-2 sm:col-span-2">
          <label htmlFor="name" className={labelClass}>
            Название
          </label>
          <input
            id="name"
            name="name"
            type="text"
            required
            defaultValue={initialProduct?.name ?? ""}
            className={inputClass}
          />
        </div>

        <div className="space-y-2">
          <label htmlFor="priceUah" className={labelClass}>
            Цена (₴)
          </label>
          <input
            id="priceUah"
            name="priceUah"
            type="number"
            inputMode="numeric"
            min={0}
            required
            defaultValue={initialProduct?.priceUah ?? ""}
            className={inputClass}
          />
        </div>

        <div className="space-y-2">
          <label htmlFor="promoDiscountPercent" className={labelClass}>
            Скидка по акции (%)
          </label>
          <input
            id="promoDiscountPercent"
            name="promoDiscountPercent"
            type="number"
            inputMode="numeric"
            min={0}
            max={100}
            defaultValue={initialProduct?.promoDiscountPercent ?? ""}
            placeholder="Необязательно"
            className={inputClass}
          />
        </div>

        <div className="flex items-center gap-2 pt-8 sm:col-span-2">
          <input
            id="inStock"
            name="inStock"
            type="checkbox"
            defaultChecked={initialProduct?.inStock ?? true}
            className="h-4 w-4 rounded border-border text-brand focus:ring-brand"
          />
          <label
            htmlFor="inStock"
            className="text-sm font-medium text-foreground"
          >
            В наличии
          </label>
        </div>

        <div className="space-y-2 sm:col-span-2">
          <label htmlFor="article" className={labelClass}>
            Артикул (необязательно)
          </label>
          <input
            id="article"
            name="article"
            type="text"
            defaultValue={initialProduct?.article ?? ""}
            className={inputClass}
          />
        </div>

        <div className="space-y-2 sm:col-span-2">
          <label htmlFor="description" className={labelClass}>
            Описание (необязательно)
          </label>
          <textarea
            id="description"
            name="description"
            rows={4}
            defaultValue={initialProduct?.description ?? ""}
            className={`${inputClass} resize-y`}
          />
        </div>
      </div>

      <div
        key={kind}
        className="space-y-4 rounded-xl border border-border bg-muted/10 p-4 dark:border-white/10 dark:bg-white/3"
      >
        <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
          Поля по типу товара
        </p>
        {renderProductKindFieldBlock(kind, {
          initialProduct,
          inputClass,
          labelClass,
        })}
      </div>

      {state.ok === false &&
      state.errors !== undefined &&
      state.errors.length > 0 ? (
        <div className="rounded-md border border-destructive/40 bg-destructive/10 px-4 py-3 text-sm text-destructive">
          <ul className="list-inside list-disc space-y-1">
            {state.errors.map((message) => (
              <li key={message}>{message}</li>
            ))}
          </ul>
        </div>
      ) : null}

      {mode === "edit" && state.saved === true ? (
        <div
          className="rounded-md border border-emerald-500/35 bg-emerald-500/10 px-4 py-3 text-sm text-emerald-800 dark:text-emerald-200/95"
          role="status"
        >
          Изменения сохранены.
        </div>
      ) : null}

      <div className="flex flex-wrap gap-3">
        <button
          type="submit"
          disabled={isPending}
          className={`${storefrontButtonPrimary} ${storefrontButtonPrimaryPaddingCompact}`}
        >
          {isPending
            ? "Сохранение…"
            : mode === "create"
              ? "Создать товар"
              : "Сохранить"}
        </button>
        <Link
          href="/admin/products"
          className={`inline-flex items-center justify-center ${storefrontButtonSecondary} ${storefrontButtonSecondaryPadding} text-sm`}
        >
          Отмена
        </Link>
      </div>
    </form>
  );
};
