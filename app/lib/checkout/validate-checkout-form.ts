import type { CheckoutFormValues } from "./types";

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
/** Loose UA-style phone: digits with optional + at start, min 9 digits total */
const PHONE_DIGITS_MIN = 9;

const countDigits = (value: string): number => {
  const digits = value.replace(/\D/g, "");
  return digits.length;
};

export type CheckoutValidationKey = keyof CheckoutFormValues;

export type CheckoutFieldErrors = Partial<
  Record<CheckoutValidationKey, string>
>;

export type CheckoutValidationOptions = {
  npApiConfigured: boolean;
};

/**
 * Pure validation — returns error message **keys** relative to `Checkout.validation.*` in messages.
 */
export const validateCheckoutForm = (
  values: CheckoutFormValues,
  options: CheckoutValidationOptions,
): CheckoutFieldErrors => {
  const errors: CheckoutFieldErrors = {};

  const name = values.customerName.trim();
  if (name.length < 2) {
    errors.customerName = "nameMin";
  }

  if (countDigits(values.phone) < PHONE_DIGITS_MIN) {
    errors.phone = "phoneInvalid";
  }

  const email = values.email.trim();
  if (email === "" || !EMAIL_PATTERN.test(email)) {
    errors.email = "emailInvalid";
  }

  const city = values.city.trim();
  if (city.length < 2) {
    errors.city = "cityMin";
  }

  if (values.deliveryMethod === "") {
    errors.deliveryMethod = "required";
  }

  if (values.paymentMethod === "") {
    errors.paymentMethod = "required";
  }

  if (values.comment.length > 2000) {
    errors.comment = "commentMax";
  }

  if (values.deliveryMethod === "nova_poshta") {
    if (options.npApiConfigured) {
      if (values.npCityRef.trim() === "") {
        errors.npCityRef = "npCityRequired";
      }
      if (values.npWarehouseRef.trim() === "") {
        errors.npWarehouseRef = "npWarehouseRequired";
      }
    } else if (values.npBranchManual.trim().length < 3) {
      errors.npBranchManual = "npBranchManualMin";
    }
  }

  return errors;
};

export const hasCheckoutErrors = (errors: CheckoutFieldErrors): boolean =>
  Object.keys(errors).length > 0;
