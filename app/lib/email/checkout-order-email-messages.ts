import type { AppLocale } from "@/app/lib/i18n/locales";
import { defaultLocale, isAppLocale } from "@/app/lib/i18n/locales";
import en from "@/messages/en.json";
import ru from "@/messages/ru.json";
import uk from "@/messages/uk.json";

const messagesByLocale = { en, ru, uk } as const;

export type CheckoutOrderEmailCopy = (typeof en)["Checkout"]["orderEmail"] & {
  delivery: (typeof en)["Checkout"]["delivery"];
  payment: (typeof en)["Checkout"]["payment"];
};

export type ShopOrderEmailCopy = (typeof en)["Checkout"]["shopOrderEmail"] & {
  delivery: (typeof en)["Checkout"]["delivery"];
  payment: (typeof en)["Checkout"]["payment"];
};

export const getCheckoutOrderEmailCopy = (locale: AppLocale): CheckoutOrderEmailCopy => {
  const pack = messagesByLocale[isAppLocale(locale) ? locale : defaultLocale];
  return {
    ...pack.Checkout.orderEmail,
    delivery: pack.Checkout.delivery,
    payment: pack.Checkout.payment,
  };
};

export const getShopOrderEmailCopy = (locale: AppLocale): ShopOrderEmailCopy => {
  const pack = messagesByLocale[isAppLocale(locale) ? locale : defaultLocale];
  return {
    ...pack.Checkout.shopOrderEmail,
    delivery: pack.Checkout.delivery,
    payment: pack.Checkout.payment,
  };
};
