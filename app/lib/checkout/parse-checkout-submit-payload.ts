import * as _ from "lodash";
import { DateTime } from "luxon";

import type { CartLine } from "@/app/lib/cart/cart-types";
import { resolveOrderConfirmationLocale } from "@/app/lib/i18n/locales";
import { isNovaPoshtaApiConfigured } from "@/app/lib/nova-poshta/env";

import type {
  CheckoutDeliveryMethod,
  CheckoutNovaPoshtaDetails,
  CheckoutPayloadLine,
  CheckoutPaymentMethod,
  CheckoutSubmitPayload,
} from "./types";

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const PHONE_DIGITS_MIN = 9;

const countDigits = (value: string): number => {
  return value.replace(/\D/g, "").length;
};

const DELIVERY_METHODS: readonly CheckoutDeliveryMethod[] = [
  "nova_poshta",
  "ukrposhta",
  "pickup",
];

const PAYMENT_METHODS: readonly CheckoutPaymentMethod[] = [
  "cash",
  "card_on_delivery",
  "bank_transfer",
];

const isRecord = (value: unknown): value is Record<string, unknown> => {
  return typeof value === "object" && value !== null && !Array.isArray(value);
};

const isDeliveryMethod = (value: unknown): value is CheckoutDeliveryMethod => {
  return (
    typeof value === "string" && _.includes(DELIVERY_METHODS, value as never)
  );
};

const isPaymentMethod = (value: unknown): value is CheckoutPaymentMethod => {
  return typeof value === "string" && _.includes(PAYMENT_METHODS, value as never);
};

const isCartLine = (value: unknown): value is CartLine => {
  if (!isRecord(value)) {
    return false;
  }
  const { productId, quantity } = value;
  return (
    typeof productId === "string" &&
    productId.trim() !== "" &&
    typeof quantity === "number" &&
    Number.isFinite(quantity) &&
    Number.isInteger(quantity) &&
    quantity > 0
  );
};

const isPayloadLine = (value: unknown): value is CheckoutPayloadLine => {
  if (!isRecord(value)) {
    return false;
  }
  const { productId, quantity, productName, lineTotalUah } = value;
  return (
    typeof productId === "string" &&
    productId.trim() !== "" &&
    typeof quantity === "number" &&
    Number.isInteger(quantity) &&
    quantity > 0 &&
    typeof productName === "string" &&
    productName.trim() !== "" &&
    typeof lineTotalUah === "number" &&
    Number.isFinite(lineTotalUah) &&
    lineTotalUah >= 0
  );
};

const isNovaPoshta = (
  value: unknown,
  options: { npApiConfigured: boolean },
): value is CheckoutNovaPoshtaDetails => {
  if (!isRecord(value)) {
    return false;
  }
  if (value.source === "api") {
    if (!options.npApiConfigured) {
      return false;
    }
    return (
      typeof value.cityRef === "string" &&
      value.cityRef.trim() !== "" &&
      typeof value.cityName === "string" &&
      value.cityName.trim() !== "" &&
      typeof value.warehouseRef === "string" &&
      value.warehouseRef.trim() !== "" &&
      typeof value.warehouseName === "string" &&
      value.warehouseName.trim() !== ""
    );
  }
  if (value.source === "manual") {
    if (options.npApiConfigured) {
      return false;
    }
    return (
      typeof value.branchDescription === "string" &&
      value.branchDescription.trim().length >= 3
    );
  }
  return false;
};

export type ParseCheckoutPayloadResult =
  | { ok: true; payload: CheckoutSubmitPayload }
  | { ok: false };

/**
 * Server-side: validate JSON body shape before email / persistence.
 * Uses current `NPAPI` presence to mirror client Nova Poshta rules.
 */
export const parseCheckoutSubmitPayload = (body: unknown): ParseCheckoutPayloadResult => {
  if (!isRecord(body)) {
    return { ok: false };
  }

  const npApiConfigured = isNovaPoshtaApiConfigured();

  const customerRaw = body.customer;
  if (!isRecord(customerRaw)) {
    return { ok: false };
  }
  const name = customerRaw.name;
  const phone = customerRaw.phone;
  const email = customerRaw.email;
  const city = customerRaw.city;
  if (
    typeof name !== "string" ||
    name.trim().length < 2 ||
    typeof phone !== "string" ||
    countDigits(phone) < PHONE_DIGITS_MIN ||
    typeof city !== "string"
  ) {
    return { ok: false };
  }
  if (typeof email !== "string" || !EMAIL_PATTERN.test(email.trim())) {
    return { ok: false };
  }

  if (!isDeliveryMethod(body.deliveryMethod)) {
    return { ok: false };
  }
  if (!isPaymentMethod(body.paymentMethod)) {
    return { ok: false };
  }

  if (
    body.sendOrderCopyToEmail === undefined ||
    typeof body.sendOrderCopyToEmail !== "boolean"
  ) {
    return { ok: false };
  }

  if (body.comment === undefined) {
    return { ok: false };
  }
  const commentRaw = body.comment;
  if (commentRaw === null) {
    // ok
  } else if (typeof commentRaw === "string") {
    if (commentRaw.length > 2000) {
      return { ok: false };
    }
  } else {
    return { ok: false };
  }

  const clientSubmittedAt = body.clientSubmittedAt;
  if (typeof clientSubmittedAt !== "string") {
    return { ok: false };
  }
  if (!DateTime.fromISO(clientSubmittedAt).isValid) {
    return { ok: false };
  }

  if (!Array.isArray(body.lines) || body.lines.length === 0) {
    return { ok: false };
  }
  const lines: CheckoutPayloadLine[] = [];
  for (const line of body.lines) {
    if (!isPayloadLine(line)) {
      return { ok: false };
    }
    lines.push({
      productId: line.productId,
      quantity: line.quantity,
      productName: line.productName,
      lineTotalUah: line.lineTotalUah,
    });
  }

  if (typeof body.totalUah !== "number" || !Number.isFinite(body.totalUah)) {
    return { ok: false };
  }
  const sumUah = _.sumBy(lines, (line) => line.lineTotalUah);
  if (Math.abs(sumUah - body.totalUah) > 0.01) {
    return { ok: false };
  }

  if (!Array.isArray(body.cartLines)) {
    return { ok: false };
  }
  const cartLines: CartLine[] = [];
  for (const line of body.cartLines) {
    if (!isCartLine(line)) {
      return { ok: false };
    }
    cartLines.push({ productId: line.productId, quantity: line.quantity });
  }

  if (cartLines.length !== lines.length) {
    return { ok: false };
  }
  for (let index = 0; index < lines.length; index += 1) {
    const line = lines[index];
    const cartLine = cartLines[index];
    if (
      line === undefined ||
      cartLine === undefined ||
      line.productId !== cartLine.productId ||
      line.quantity !== cartLine.quantity
    ) {
      return { ok: false };
    }
  }

  let novaPoshta: CheckoutNovaPoshtaDetails | undefined;
  if (body.deliveryMethod === "nova_poshta") {
    if (!isRecord(body.novaPoshta) || !isNovaPoshta(body.novaPoshta, { npApiConfigured })) {
      return { ok: false };
    }
    const np = body.novaPoshta;
    if (np.source === "api") {
      novaPoshta = {
        source: "api",
        cityRef: np.cityRef.trim(),
        cityName: np.cityName.trim(),
        warehouseRef: np.warehouseRef.trim(),
        warehouseName: np.warehouseName.trim(),
      };
    } else {
      novaPoshta = {
        source: "manual",
        branchDescription: np.branchDescription.trim(),
      };
    }
  } else if (body.novaPoshta !== undefined) {
    return { ok: false };
  }

  const orderConfirmationLocale = resolveOrderConfirmationLocale(
    body.orderConfirmationLocale,
  );

  const deliveryMethod: CheckoutDeliveryMethod = body.deliveryMethod;
  const paymentMethod: CheckoutPaymentMethod = body.paymentMethod;
  const comment: string | null =
    commentRaw === null || (typeof commentRaw === "string" && commentRaw === "")
      ? null
      : (commentRaw as string);

  const cityTrimmed = city.trim();
  const resolvedCustomerCity =
    deliveryMethod === "nova_poshta" &&
    npApiConfigured &&
    novaPoshta !== undefined &&
    novaPoshta.source === "api"
      ? novaPoshta.cityName
      : cityTrimmed;
  if (resolvedCustomerCity.length < 2) {
    return { ok: false };
  }

  const payload: CheckoutSubmitPayload = {
    customer: {
      name: name.trim(),
      phone: phone.trim(),
      email: email.trim(),
      city: resolvedCustomerCity,
    },
    deliveryMethod,
    paymentMethod,
    comment,
    lines,
    totalUah: body.totalUah,
    clientSubmittedAt,
    cartLines,
    sendOrderCopyToEmail: body.sendOrderCopyToEmail,
    orderConfirmationLocale,
    ...(novaPoshta !== undefined ? { novaPoshta } : {}),
  };

  return { ok: true, payload };
};
