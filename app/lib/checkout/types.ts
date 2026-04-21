import type { CartLine } from "@/app/lib/cart/cart-types";

/** Mirrors future API enums / DB values. */
export type CheckoutDeliveryMethod = "nova_poshta" | "ukrposhta" | "pickup";

export type CheckoutPaymentMethod = "cash" | "card_on_delivery" | "bank_transfer";

/** Raw form state (controlled inputs). */
export type CheckoutFormValues = {
  customerName: string;
  phone: string;
  email: string;
  city: string;
  deliveryMethod: CheckoutDeliveryMethod | "";
  paymentMethod: CheckoutPaymentMethod | "";
  comment: string;
};

export const defaultCheckoutFormValues = (): CheckoutFormValues => ({
  customerName: "",
  phone: "",
  email: "",
  city: "",
  deliveryMethod: "",
  paymentMethod: "",
  comment: "",
});

/** Resolved line for ERP / API payload. */
export type CheckoutPayloadLine = {
  productId: string;
  quantity: number;
  productName: string;
  lineTotalUah: number;
};

/**
 * Payload ready for POST /orders (or email CRM).
 * Keep field names stable when wiring the API.
 */
export type CheckoutSubmitPayload = {
  customer: {
    name: string;
    phone: string;
    email: string;
    city: string;
  };
  deliveryMethod: CheckoutDeliveryMethod;
  paymentMethod: CheckoutPaymentMethod;
  comment: string | null;
  lines: CheckoutPayloadLine[];
  totalUah: number;
  /** ISO 8601 — set at submit time */
  clientSubmittedAt: string;
  /** Snapshot of raw cart lines for reconciliation */
  cartLines: CartLine[];
};
