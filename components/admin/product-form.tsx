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
import {
  storefrontButtonPrimary,
  storefrontButtonPrimaryPaddingCompact,
  storefrontButtonSecondary,
  storefrontButtonSecondaryPadding,
} from "@/components/ui/storefront";

type BrandOption = { id: string; name: string };
type CategoryOption = { id: string; name: string };

const KIND_OPTIONS: readonly { value: ProductKind; label: string }[] = [
  { value: ProductKind.MotorOil, label: "Motor oil" },
  { value: ProductKind.Filter, label: "Filter" },
  { value: ProductKind.Antifreeze, label: "Antifreeze" },
  { value: ProductKind.BrakeFluid, label: "Brake fluid" },
  { value: ProductKind.SparkPlug, label: "Spark plug" },
  { value: ProductKind.OtherConsumable, label: "Other consumable" },
];

const FILTER_ROLES = [
  { value: "oil", label: "Oil" },
  { value: "air", label: "Air" },
  { value: "cabin", label: "Cabin" },
  { value: "fuel", label: "Fuel" },
] as const;

const DOT_OPTIONS = [
  { value: "DOT3", label: "DOT3" },
  { value: "DOT4", label: "DOT4" },
  { value: "DOT5.1", label: "DOT5.1" },
] as const;

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

export const ProductForm = ({ mode, brands, categories, initialProduct }: ProductFormProps) => {
  const initialKind = initialProduct?.kind ?? ProductKind.MotorOil;
  const [kind, setKind] = useState<ProductKind>(initialKind);

  const action = mode === "create" ? createProductAction : updateProductAction;
  const [state, formAction, isPending] = useActionState(action, initialFormState);

  return (
    <form action={formAction} className="space-y-8">
      {mode === "edit" && initialProduct !== undefined ? (
        <input type="hidden" name="id" value={initialProduct.id} />
      ) : null}

      <div className="grid gap-6 sm:grid-cols-2">
        <div className="space-y-2 sm:col-span-2">
          <label htmlFor="product-kind" className={labelClass}>
            Kind
          </label>
          {mode === "edit" && initialProduct !== undefined ? (
            <>
              <input type="hidden" name="kind" value={initialProduct.kind} />
              <p
                id="product-kind"
                className="rounded-md border border-border bg-muted/20 px-3 py-2.5 text-sm text-muted-foreground dark:border-white/10"
              >
                {KIND_OPTIONS.find((option) => option.value === initialProduct.kind)?.label ??
                  initialProduct.kind}
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
            Brand
          </label>
          <select
            id="brandId"
            name="brandId"
            required
            defaultValue={initialProduct?.brandId ?? ""}
            className={inputClass}
          >
            <option value="" disabled>
              Select brand
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
            Category
          </label>
          <select
            id="categoryId"
            name="categoryId"
            required
            defaultValue={initialProduct?.categoryId ?? ""}
            className={inputClass}
          >
            <option value="" disabled>
              Select category
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
            Name
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
            Price (₴)
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
            Promo discount (%)
          </label>
          <input
            id="promoDiscountPercent"
            name="promoDiscountPercent"
            type="number"
            inputMode="numeric"
            min={0}
            max={100}
            defaultValue={initialProduct?.promoDiscountPercent ?? ""}
            placeholder="Optional"
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
          <label htmlFor="inStock" className="text-sm font-medium text-foreground">
            In stock
          </label>
        </div>

        <div className="space-y-2 sm:col-span-2">
          <label htmlFor="article" className={labelClass}>
            Article (optional)
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
            Description (optional)
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

      <div key={kind} className="space-y-4 rounded-xl border border-border bg-muted/10 p-4 dark:border-white/10 dark:bg-white/3">
        <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
          Type-specific fields
        </p>
        {kind === ProductKind.MotorOil ? (
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <label htmlFor="viscosity" className={labelClass}>
                Viscosity
              </label>
              <input
                id="viscosity"
                name="viscosity"
                type="text"
                required
                defaultValue={initialProduct?.kind === ProductKind.MotorOil ? initialProduct.viscosity : ""}
                className={inputClass}
                placeholder="e.g. 5W-30"
              />
            </div>
            <div className="space-y-2">
              <label htmlFor="volumeLiters" className={labelClass}>
                Volume (L)
              </label>
              <input
                id="volumeLiters"
                name="volumeLiters"
                type="number"
                inputMode="decimal"
                step="0.1"
                min={0}
                required
                defaultValue={
                  initialProduct?.kind === ProductKind.MotorOil
                    ? String(initialProduct.volumeLiters)
                    : ""
                }
                className={inputClass}
              />
            </div>
          </div>
        ) : null}

        {kind === ProductKind.Filter ? (
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <label htmlFor="filterRole" className={labelClass}>
                Filter role
              </label>
              <select
                id="filterRole"
                name="filterRole"
                required
                defaultValue={
                  initialProduct?.kind === ProductKind.Filter ? initialProduct.filterRole : "oil"
                }
                className={inputClass}
              >
                {FILTER_ROLES.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            </div>
            <div className="space-y-2">
              <label htmlFor="partNumber" className={labelClass}>
                Part number (optional)
              </label>
              <input
                id="partNumber"
                name="partNumber"
                type="text"
                defaultValue={
                  initialProduct?.kind === ProductKind.Filter ? initialProduct.partNumber ?? "" : ""
                }
                className={inputClass}
              />
            </div>
          </div>
        ) : null}

        {kind === ProductKind.Antifreeze ? (
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <label htmlFor="freezePointC" className={labelClass}>
                Freeze point (°C)
              </label>
              <input
                id="freezePointC"
                name="freezePointC"
                type="number"
                inputMode="decimal"
                step="1"
                required
                defaultValue={
                  initialProduct?.kind === ProductKind.Antifreeze
                    ? String(initialProduct.freezePointC)
                    : ""
                }
                className={inputClass}
              />
            </div>
            <div className="space-y-2">
              <label htmlFor="specification" className={labelClass}>
                Specification (optional)
              </label>
              <input
                id="specification"
                name="specification"
                type="text"
                defaultValue={
                  initialProduct?.kind === ProductKind.Antifreeze
                    ? initialProduct.specification ?? ""
                    : ""
                }
                className={inputClass}
              />
            </div>
            <div className="space-y-2 sm:col-span-2">
              <label htmlFor="volumeLiters-af" className={labelClass}>
                Volume (L)
              </label>
              <input
                id="volumeLiters-af"
                name="volumeLiters"
                type="number"
                inputMode="decimal"
                step="0.1"
                min={0}
                required
                defaultValue={
                  initialProduct?.kind === ProductKind.Antifreeze
                    ? String(initialProduct.volumeLiters)
                    : ""
                }
                className={inputClass}
              />
            </div>
          </div>
        ) : null}

        {kind === ProductKind.BrakeFluid ? (
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <label htmlFor="dot" className={labelClass}>
                DOT
              </label>
              <select
                id="dot"
                name="dot"
                required
                defaultValue={
                  initialProduct?.kind === ProductKind.BrakeFluid ? initialProduct.dot : "DOT4"
                }
                className={inputClass}
              >
                {DOT_OPTIONS.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            </div>
            <div className="space-y-2">
              <label htmlFor="volumeLiters-bf" className={labelClass}>
                Volume (L)
              </label>
              <input
                id="volumeLiters-bf"
                name="volumeLiters"
                type="number"
                inputMode="decimal"
                step="0.1"
                min={0}
                required
                defaultValue={
                  initialProduct?.kind === ProductKind.BrakeFluid
                    ? String(initialProduct.volumeLiters)
                    : ""
                }
                className={inputClass}
              />
            </div>
          </div>
        ) : null}

        {kind === ProductKind.SparkPlug ? (
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-2 sm:col-span-2">
              <label htmlFor="thread" className={labelClass}>
                Thread
              </label>
              <input
                id="thread"
                name="thread"
                type="text"
                required
                defaultValue={
                  initialProduct?.kind === ProductKind.SparkPlug ? initialProduct.thread : ""
                }
                className={inputClass}
                placeholder="e.g. M14 x 1.25"
              />
            </div>
            <div className="space-y-2">
              <label htmlFor="electrode" className={labelClass}>
                Electrode (optional)
              </label>
              <input
                id="electrode"
                name="electrode"
                type="text"
                defaultValue={
                  initialProduct?.kind === ProductKind.SparkPlug
                    ? initialProduct.electrode ?? ""
                    : ""
                }
                className={inputClass}
              />
            </div>
            <div className="space-y-2">
              <label htmlFor="heatRange" className={labelClass}>
                Heat range (optional)
              </label>
              <input
                id="heatRange"
                name="heatRange"
                type="text"
                defaultValue={
                  initialProduct?.kind === ProductKind.SparkPlug
                    ? initialProduct.heatRange ?? ""
                    : ""
                }
                className={inputClass}
              />
            </div>
          </div>
        ) : null}

        {kind === ProductKind.OtherConsumable ? (
          <div className="space-y-2">
            <label htmlFor="summary" className={labelClass}>
              Summary
            </label>
            <input
              id="summary"
              name="summary"
              type="text"
              required
              defaultValue={
                initialProduct?.kind === ProductKind.OtherConsumable ? initialProduct.summary : ""
              }
              className={inputClass}
              placeholder="Short line for cards"
            />
          </div>
        ) : null}
      </div>

      {state.ok === false && state.errors !== undefined && state.errors.length > 0 ? (
        <div className="rounded-md border border-destructive/40 bg-destructive/10 px-4 py-3 text-sm text-destructive">
          <ul className="list-inside list-disc space-y-1">
            {state.errors.map((message) => (
              <li key={message}>{message}</li>
            ))}
          </ul>
        </div>
      ) : null}

      <div className="flex flex-wrap gap-3">
        <button
          type="submit"
          disabled={isPending}
          className={`${storefrontButtonPrimary} ${storefrontButtonPrimaryPaddingCompact}`}
        >
          {isPending ? "Saving…" : mode === "create" ? "Create product" : "Save changes"}
        </button>
        <Link
          href="/admin/products"
          className={`inline-flex items-center justify-center ${storefrontButtonSecondary} ${storefrontButtonSecondaryPadding} text-sm`}
        >
          Cancel
        </Link>
      </div>
    </form>
  );
};
