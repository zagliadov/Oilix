import type { PricedLine } from "./types";
import type { StoreProduct } from "./types/product";

export const isPromoProduct = (product: PricedLine): boolean =>
  product.promoDiscountPercent != null && product.promoDiscountPercent > 0;

export const getEffectivePriceUah = (product: PricedLine): number => {
  const discount = product.promoDiscountPercent;
  if (discount === undefined || discount <= 0) {
    return product.priceUah;
  }
  return Math.round(product.priceUah * (1 - discount / 100));
};

export const getDiscountPercent = (product: PricedLine): number | null => {
  if (!isPromoProduct(product)) {
    return null;
  }
  return product.promoDiscountPercent ?? null;
};

export const selectPromoProducts = (products: StoreProduct[]): StoreProduct[] =>
  products.filter(isPromoProduct);
