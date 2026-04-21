/**
 * Stable string identifiers — mirror future API `id` / slug fields.
 * Branded types document intent without runtime overhead.
 */
export type BrandId = string;

export type CategoryId = string;

export type ProductId = string;

/** Primary shop currency in mocks; API can map to Money with currency code. */
export type MoneyAmountUah = number;

/** Pricing fields shared by every purchasable SKU (mock or API row). */
export type PricedLine = {
  priceUah: MoneyAmountUah;
  /** Percent off base price; when set and > 0, SKU is treated as promo. */
  promoDiscountPercent?: number;
};
