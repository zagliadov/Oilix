import catalogBundle from "@/data/catalog.json";

/**
 * `priceUah` — базовая цена товара.
 * Если задан `promoDiscountPercent` (> 0), товар в акции на главной, цена продажи = `getEffectivePriceUah`.
 */
export type CatalogProduct = {
  id: string;
  brand: string;
  name: string;
  viscosity: string;
  volumeLiters: number;
  priceUah: number;
  /** Скидка в % от базовой цены; если задано, товар попадает в блок акций на главной. */
  promoDiscountPercent?: number;
};

type CatalogBundle = {
  products: CatalogProduct[];
};

const bundle = catalogBundle as CatalogBundle;

export const catalogProducts: CatalogProduct[] = bundle.products;

export const getCatalogProductById = (
  id: string,
): CatalogProduct | undefined =>
  catalogProducts.find((product) => product.id === id);

export const isPromoProduct = (product: CatalogProduct): boolean =>
  product.promoDiscountPercent != null && product.promoDiscountPercent > 0;

/** Цена продажи с учётом скидки; без скидки = `priceUah`. */
export const getEffectivePriceUah = (product: CatalogProduct): number => {
  const discount = product.promoDiscountPercent;
  if (discount === undefined || discount <= 0) {
    return product.priceUah;
  }
  return Math.round(product.priceUah * (1 - discount / 100));
};

/** Промо-блок на главной: все товары с `promoDiscountPercent > 0`, порядок как в массиве `products` в JSON. */
export const getPromoProducts = (): CatalogProduct[] =>
  catalogProducts.filter(isPromoProduct);

/** Процент для бейджа (из той же скидки в JSON). */
export const getDiscountPercent = (product: CatalogProduct): number | null => {
  if (!isPromoProduct(product)) {
    return null;
  }
  return product.promoDiscountPercent ?? null;
};
