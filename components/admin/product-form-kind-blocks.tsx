import type { ReactNode } from "react";

import { ProductKind } from "@/app/lib/catalog/types/product";
import type { StoreProduct } from "@/app/lib/catalog/types/product";

const FILTER_ROLES = [
  { value: "oil", label: "Масло" },
  { value: "air", label: "Воздух" },
  { value: "cabin", label: "Салон" },
  { value: "fuel", label: "Топливо" },
] as const;

const DOT_OPTIONS = [
  { value: "DOT3", label: "DOT3" },
  { value: "DOT4", label: "DOT4" },
  { value: "DOT5.1", label: "DOT5.1" },
] as const;

export type ProductKindFieldContext = {
  initialProduct: StoreProduct | undefined;
  inputClass: string;
  labelClass: string;
};

const productKindFieldBlocks: Record<
  ProductKind,
  (context: ProductKindFieldContext) => ReactNode
> = {
  [ProductKind.MotorOil]: ({ initialProduct, inputClass, labelClass }) => (
    <div className="grid gap-4 sm:grid-cols-2">
      <div className="space-y-2">
        <label htmlFor="viscosity" className={labelClass}>
          Вязкость
        </label>
        <input
          id="viscosity"
          name="viscosity"
          type="text"
          required
          defaultValue={
            initialProduct?.kind === ProductKind.MotorOil ? initialProduct.viscosity : ""
          }
          className={inputClass}
          placeholder="например 5W-30"
        />
      </div>
      <div className="space-y-2">
        <label htmlFor="volumeLiters" className={labelClass}>
          Объём (л)
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
  ),

  [ProductKind.Filter]: ({ initialProduct, inputClass, labelClass }) => (
    <div className="grid gap-4 sm:grid-cols-2">
      <div className="space-y-2">
        <label htmlFor="filterRole" className={labelClass}>
          Тип фильтра
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
          Номер детали (необязательно)
        </label>
        <input
          id="partNumber"
          name="partNumber"
          type="text"
          defaultValue={
            initialProduct?.kind === ProductKind.Filter ? (initialProduct.partNumber ?? "") : ""
          }
          className={inputClass}
        />
      </div>
    </div>
  ),

  [ProductKind.Antifreeze]: ({ initialProduct, inputClass, labelClass }) => (
    <div className="grid gap-4 sm:grid-cols-2">
      <div className="space-y-2">
        <label htmlFor="freezePointC" className={labelClass}>
          Температура замерзания (°C)
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
          Спецификация (необязательно)
        </label>
        <input
          id="specification"
          name="specification"
          type="text"
          defaultValue={
            initialProduct?.kind === ProductKind.Antifreeze
              ? (initialProduct.specification ?? "")
              : ""
          }
          className={inputClass}
        />
      </div>
      <div className="space-y-2 sm:col-span-2">
        <label htmlFor="volumeLiters-af" className={labelClass}>
          Объём (л)
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
  ),

  [ProductKind.BrakeFluid]: ({ initialProduct, inputClass, labelClass }) => (
    <div className="grid gap-4 sm:grid-cols-2">
      <div className="space-y-2">
        <label htmlFor="dot" className={labelClass}>
          Класс DOT
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
          Объём (л)
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
  ),

  [ProductKind.SparkPlug]: ({ initialProduct, inputClass, labelClass }) => (
    <div className="grid gap-4 sm:grid-cols-2">
      <div className="space-y-2 sm:col-span-2">
        <label htmlFor="thread" className={labelClass}>
          Резьба
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
          placeholder="например M14 × 1.25"
        />
      </div>
      <div className="space-y-2">
        <label htmlFor="electrode" className={labelClass}>
          Электрод (необязательно)
        </label>
        <input
          id="electrode"
          name="electrode"
          type="text"
          defaultValue={
            initialProduct?.kind === ProductKind.SparkPlug
              ? (initialProduct.electrode ?? "")
              : ""
          }
          className={inputClass}
        />
      </div>
      <div className="space-y-2">
        <label htmlFor="heatRange" className={labelClass}>
          Калильность (необязательно)
        </label>
        <input
          id="heatRange"
          name="heatRange"
          type="text"
          defaultValue={
            initialProduct?.kind === ProductKind.SparkPlug
              ? (initialProduct.heatRange ?? "")
              : ""
          }
          className={inputClass}
        />
      </div>
    </div>
  ),

  [ProductKind.OtherConsumable]: ({ initialProduct, inputClass, labelClass }) => (
    <div className="space-y-2">
      <label htmlFor="summary" className={labelClass}>
        Краткое описание
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
        placeholder="Строка для карточек"
      />
    </div>
  ),
};

/**
 * Renders the block of fields for the selected `ProductKind` (strategy map over enum).
 */
export const renderProductKindFieldBlock = (
  kind: ProductKind,
  context: ProductKindFieldContext,
): ReactNode => productKindFieldBlocks[kind](context);
