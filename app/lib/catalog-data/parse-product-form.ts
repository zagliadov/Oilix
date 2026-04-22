import * as _ from "lodash";

import type { CatalogBundle } from "@/app/lib/catalog/bundle";
import {
  ProductKind,
  type BrakeFluidDot,
  type FilterRole,
  type StoreProduct,
} from "@/app/lib/catalog/types/product";

const PRODUCT_KIND_VALUES: readonly ProductKind[] = [
  ProductKind.MotorOil,
  ProductKind.Filter,
  ProductKind.Antifreeze,
  ProductKind.BrakeFluid,
  ProductKind.SparkPlug,
  ProductKind.OtherConsumable,
];

const BRAKE_DOT_VALUES: readonly BrakeFluidDot[] = ["DOT3", "DOT4", "DOT5.1"];

const FILTER_ROLE_VALUES: readonly FilterRole[] = ["oil", "air", "cabin", "fuel"];

const isProductKind = (value: string): value is ProductKind =>
  PRODUCT_KIND_VALUES.includes(value as ProductKind);

const getString = (formData: FormData, key: string): string => {
  const raw = formData.get(key);
  return typeof raw === "string" ? raw.trim() : "";
};

const getOptionalString = (formData: FormData, key: string): string | undefined => {
  const value = getString(formData, key);
  return value === "" ? undefined : value;
};

const getRequiredInt = (
  formData: FormData,
  key: string,
  errors: string[],
  label: string,
): number | null => {
  const raw = getString(formData, key);
  if (raw === "") {
    errors.push(`Поле «${label}» обязательно.`);
    return null;
  }
  const value = Number.parseInt(raw, 10);
  if (Number.isNaN(value)) {
    errors.push(`«${label}» должно быть целым числом.`);
    return null;
  }
  return value;
};

const getRequiredFloat = (
  formData: FormData,
  key: string,
  errors: string[],
  label: string,
): number | null => {
  const raw = getString(formData, key);
  if (raw === "") {
    errors.push(`Поле «${label}» обязательно.`);
    return null;
  }
  const value = Number.parseFloat(raw);
  if (Number.isNaN(value)) {
    errors.push(`«${label}» должно быть числом.`);
    return null;
  }
  return value;
};

const getOptionalPromoPercent = (
  formData: FormData,
  errors: string[],
): number | undefined => {
  const raw = getString(formData, "promoDiscountPercent");
  if (raw === "") {
    return undefined;
  }
  const value = Number.parseInt(raw, 10);
  if (Number.isNaN(value) || value < 0 || value > 100) {
    errors.push("Скидка по акции должна быть от 0 до 100.");
    return undefined;
  }
  return value === 0 ? undefined : value;
};

export type ParseProductFormMode =
  | { mode: "create"; productId: string }
  | { mode: "edit"; productId: string };

export type ParseProductFormResult =
  | { ok: true; product: StoreProduct }
  | { ok: false; errors: string[] };

const validateBrandAndCategory = (
  bundle: CatalogBundle,
  brandId: string,
  categoryId: string,
  errors: string[],
): void => {
  const brandFound = _.some(bundle.brands, { id: brandId });
  if (!brandFound) {
    errors.push("Неизвестный бренд.");
  }
  const categoryFound = _.some(bundle.categories, { id: categoryId });
  if (!categoryFound) {
    errors.push("Неизвестная категория.");
  }
};

export const parseProductFromFormData = (
  formData: FormData,
  bundle: CatalogBundle,
  mode: ParseProductFormMode,
): ParseProductFormResult => {
  const errors: string[] = [];

  if (mode.mode === "edit") {
    const submittedId = getString(formData, "id");
    if (submittedId !== mode.productId) {
      errors.push("Id товара не совпадает.");
    }
  }

  const kindRaw = getString(formData, "kind");
  if (!isProductKind(kindRaw)) {
    errors.push("Недопустимый тип товара.");
  }

  const productId = mode.productId;
  if (productId === "") {
    errors.push("Не указан id товара.");
  }

  const brandId = getString(formData, "brandId");
  const categoryId = getString(formData, "categoryId");
  const name = getString(formData, "name");
  if (name === "") {
    errors.push("Укажите название.");
  }

  const priceUah = getRequiredInt(formData, "priceUah", errors, "Цена (₴)");
  const inStock = formData.get("inStock") === "on";
  const article = getOptionalString(formData, "article");
  const description = getOptionalString(formData, "description");
  const promoDiscountPercent = getOptionalPromoPercent(formData, errors);

  if (brandId === "") {
    errors.push("Выберите бренд.");
  }
  if (categoryId === "") {
    errors.push("Выберите категорию.");
  }

  if (errors.length > 0 || !isProductKind(kindRaw) || priceUah === null) {
    return {
      ok: false,
      errors: errors.length > 0 ? errors : ["Некорректные данные формы."],
    };
  }

  validateBrandAndCategory(bundle, brandId, categoryId, errors);
  if (errors.length > 0) {
    return { ok: false, errors };
  }

  const base = {
    id: productId,
    brandId,
    categoryId,
    name,
    inStock,
    article,
    description,
    priceUah,
    ...(promoDiscountPercent !== undefined
      ? { promoDiscountPercent }
      : {}),
  };

  let product: StoreProduct;

  switch (kindRaw) {
    case ProductKind.MotorOil: {
      const viscosity = getString(formData, "viscosity");
      const volumeLiters = getRequiredFloat(formData, "volumeLiters", errors, "Объём (л)");
      if (viscosity === "") {
        errors.push("Укажите вязкость.");
      }
      if (volumeLiters === null || errors.length > 0) {
        return { ok: false, errors };
      }
      product = {
        ...base,
        kind: ProductKind.MotorOil,
        viscosity,
        volumeLiters,
      };
      break;
    }
    case ProductKind.Filter: {
      const filterRoleRaw = getString(formData, "filterRole");
      const partNumber = getOptionalString(formData, "partNumber");
      if (!FILTER_ROLE_VALUES.includes(filterRoleRaw as FilterRole)) {
        errors.push("Недопустимая роль фильтра.");
      }
      if (errors.length > 0) {
        return { ok: false, errors };
      }
      product = {
        ...base,
        kind: ProductKind.Filter,
        filterRole: filterRoleRaw as FilterRole,
        partNumber,
      };
      break;
    }
    case ProductKind.Antifreeze: {
      const volumeLiters = getRequiredFloat(formData, "volumeLiters", errors, "Объём (л)");
      const freezePointC = getRequiredFloat(
        formData,
        "freezePointC",
        errors,
        "Температура замерзания (°C)",
      );
      const specification = getOptionalString(formData, "specification");
      if (volumeLiters === null || freezePointC === null || errors.length > 0) {
        return { ok: false, errors };
      }
      product = {
        ...base,
        kind: ProductKind.Antifreeze,
        volumeLiters,
        freezePointC,
        specification,
      };
      break;
    }
    case ProductKind.BrakeFluid: {
      const volumeLiters = getRequiredFloat(formData, "volumeLiters", errors, "Объём (л)");
      const dotRaw = getString(formData, "dot");
      if (!BRAKE_DOT_VALUES.includes(dotRaw as BrakeFluidDot)) {
        errors.push("Недопустимая маркировка DOT.");
      }
      if (volumeLiters === null || errors.length > 0) {
        return { ok: false, errors };
      }
      product = {
        ...base,
        kind: ProductKind.BrakeFluid,
        volumeLiters,
        dot: dotRaw as BrakeFluidDot,
      };
      break;
    }
    case ProductKind.SparkPlug: {
      const thread = getString(formData, "thread");
      const electrode = getOptionalString(formData, "electrode");
      const heatRange = getOptionalString(formData, "heatRange");
      if (thread === "") {
        errors.push("Укажите резьбу.");
      }
      if (errors.length > 0) {
        return { ok: false, errors };
      }
      product = {
        ...base,
        kind: ProductKind.SparkPlug,
        thread,
        electrode,
        heatRange,
      };
      break;
    }
    case ProductKind.OtherConsumable: {
      const summary = getString(formData, "summary");
      if (summary === "") {
        errors.push("Укажите краткое описание.");
      }
      if (errors.length > 0) {
        return { ok: false, errors };
      }
      product = {
        ...base,
        kind: ProductKind.OtherConsumable,
        summary,
      };
      break;
    }
    default: {
      return { ok: false, errors: ["Неподдерживаемый тип товара."] };
    }
  }

  if (errors.length > 0) {
    return { ok: false, errors };
  }

  return { ok: true, product };
};
