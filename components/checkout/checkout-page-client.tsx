"use client";

import * as _ from "lodash";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  useCallback,
  useEffect,
  useMemo,
  useState,
  type FormEvent,
} from "react";
import { useLocale, useTranslations } from "next-intl";

import { buildLocalizedPath } from "@/app/lib/i18n/build-localized-path";
import { CheckoutNovaPoshtaBlock } from "@/components/checkout/checkout-nova-poshta-block";
import { CheckoutOrderSummary } from "@/components/checkout/checkout-order-summary";
import { FormField, formInputClassName } from "@/components/forms/form-field";
import { buildCheckoutSubmitPayload } from "@/app/lib/checkout/build-checkout-payload";
import {
  defaultCheckoutFormValues,
  type CheckoutDeliveryMethod,
  type CheckoutFormValues,
  type CheckoutPaymentMethod,
} from "@/app/lib/checkout/types";
import {
  hasCheckoutErrors,
  validateCheckoutForm,
} from "@/app/lib/checkout/validate-checkout-form";
import { getStoreProductByIdInCatalog } from "@/app/lib/catalog";
import {
  defaultLocale,
  isAppLocale,
  type AppLocale,
} from "@/app/lib/i18n/locales";
import { useCart } from "@/components/cart/cart-context";
import { useStorefrontCatalog } from "@/components/storefront/use-storefront-catalog";
import {
  storefrontButtonPrimary,
  storefrontButtonPrimaryPaddingCompact,
  storefrontButtonSecondary,
  storefrontButtonSecondaryPadding,
  storefrontHeadingEmphasis,
  storefrontHeadingSection,
  storefrontSkeleton,
  storefrontSurfacePanel,
} from "@/components/ui/storefront";

const deliverySelectValues: readonly CheckoutDeliveryMethod[] = [
  "nova_poshta",
  "ukrposhta",
  "pickup",
];

const paymentSelectValues: readonly CheckoutPaymentMethod[] = [
  "cash",
  "card_on_delivery",
  "bank_transfer",
];

type CheckoutPageClientProps = {
  npApiConfigured: boolean;
};

export const CheckoutPageClient = ({ npApiConfigured }: CheckoutPageClientProps) => {
  const router = useRouter();
  const siteLocale = useLocale();
  const orderConfirmationLocale: AppLocale = isAppLocale(siteLocale)
    ? siteLocale
    : defaultLocale;
  const cartPath = buildLocalizedPath("/cart", orderConfirmationLocale);
  const homePath = buildLocalizedPath("/", orderConfirmationLocale);
  const catalogPath = buildLocalizedPath("/catalog", orderConfirmationLocale);
  const checkoutTranslations = useTranslations("Checkout");
  const landingTranslations = useTranslations("Landing");
  const { lines, isReady, totalPriceUah, clearCart } = useCart();
  const catalog = useStorefrontCatalog();

  const [formValues, setFormValues] = useState<CheckoutFormValues>(defaultCheckoutFormValues());
  const [fieldErrors, setFieldErrors] = useState<
    Partial<Record<keyof CheckoutFormValues, string>>
  >({});
  const [submitSuccess, setSubmitSuccess] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formSubmitError, setFormSubmitError] = useState<string | null>(null);

  const validLines = useMemo(
    () =>
      _.filter(lines, (line) =>
        Boolean(getStoreProductByIdInCatalog(line.productId, catalog)),
      ),
    [lines, catalog],
  );

  useEffect(() => {
    if (!isReady || submitSuccess) {
      return;
    }
    if (validLines.length === 0) {
      router.replace(cartPath);
    }
  }, [isReady, validLines.length, submitSuccess, router, cartPath]);

  const mapValidationToMessage = useCallback(
    (errorCode: string | undefined): string | undefined => {
      if (errorCode === undefined) {
        return undefined;
      }
      const key = `validation.${errorCode}`;
      return (checkoutTranslations as (translationKey: string) => string)(key);
    },
    [checkoutTranslations],
  );

  const handleChange = useCallback(
    <K extends keyof CheckoutFormValues>(field: K, value: CheckoutFormValues[K]) => {
      setFormSubmitError(null);
      setFormValues((previous) => {
        if (field === "deliveryMethod") {
          const deliveryMethod = value as CheckoutFormValues["deliveryMethod"];
          if (deliveryMethod !== "nova_poshta") {
            return {
              ...previous,
              deliveryMethod,
              npCityRef: "",
              npCityName: "",
              npWarehouseRef: "",
              npWarehouseName: "",
              npBranchManual: "",
            };
          }
          return { ...previous, deliveryMethod };
        }
        return { ...previous, [field]: value };
      });
      setFieldErrors((previous) => {
        if (previous[field] === undefined) {
          return previous;
        }
        const next = { ...previous };
        delete next[field];
        return next;
      });
    },
    [],
  );

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setFormSubmitError(null);
    const rawErrors = validateCheckoutForm(formValues, { npApiConfigured });
    if (hasCheckoutErrors(rawErrors)) {
      const next: Partial<Record<keyof CheckoutFormValues, string>> = {};
      (Object.keys(rawErrors) as (keyof CheckoutFormValues)[]).forEach((key) => {
        const code = rawErrors[key];
        const message = mapValidationToMessage(code);
        if (message !== undefined) {
          next[key] = message;
        }
      });
      setFieldErrors(next);
      return;
    }

    const payload = buildCheckoutSubmitPayload(
      formValues,
      validLines,
      (productId) => getStoreProductByIdInCatalog(productId, catalog) ?? undefined,
      { npApiConfigured, orderConfirmationLocale },
    );
    if (payload === null) {
      return;
    }

    if (process.env.NODE_ENV === "development") {
      console.info("[checkout] payload", payload);
    }

    setIsSubmitting(true);
    try {
      const response = await fetch("/api/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      if (response.ok) {
        clearCart();
        setSubmitSuccess(true);
        setFieldErrors({});
        return;
      }
      const errorBody = (await response
        .json()
        .catch((): { error?: string } => ({}))) as { error?: string };
      if (errorBody.error === "email_not_configured") {
        setFormSubmitError(tr("submitErrorService"));
        return;
      }
      if (errorBody.error === "send_failed") {
        setFormSubmitError(tr("submitErrorSend"));
        return;
      }
      if (errorBody.error === "invalid_payload") {
        setFormSubmitError(tr("submitErrorInvalid"));
        return;
      }
      setFormSubmitError(tr("submitErrorInvalid"));
    } catch {
      setFormSubmitError(tr("submitErrorNetwork"));
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!isReady) {
    return (
      <div className="mt-10 space-y-4" aria-hidden>
        {_.map(["skeleton-a", "skeleton-b"], (key) => (
          <div key={key} className={`h-40 ${storefrontSkeleton}`} />
        ))}
      </div>
    );
  }

  if (submitSuccess) {
    return (
      <div className={`mt-10 p-8 text-center sm:p-10 ${storefrontSurfacePanel}`}>
        <h2 className={storefrontHeadingEmphasis}>
          {checkoutTranslations("successTitle")}
        </h2>
        <p className="mt-3 text-muted-foreground">{checkoutTranslations("successLead")}</p>
        <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:justify-center">
          <Link
            href={homePath}
            className={`inline-flex items-center justify-center ${storefrontButtonSecondary} ${storefrontButtonSecondaryPadding} dark:border-white/12`}
          >
            {checkoutTranslations("backHome")}
          </Link>
          <Link
            href={catalogPath}
            className={`inline-flex items-center justify-center ${storefrontButtonPrimary} ${storefrontButtonPrimaryPaddingCompact}`}
          >
            {checkoutTranslations("backToCatalog")}
          </Link>
        </div>
      </div>
    );
  }

  const currency = landingTranslations("products.currency");
  const tr = checkoutTranslations;

  return (
    <div className="mt-10 lg:grid lg:grid-cols-12 lg:items-start lg:gap-10 xl:gap-12">
      <div className="lg:col-span-7 xl:col-span-8">
        <form
          onSubmit={handleSubmit}
          className={`space-y-6 p-6 sm:p-8 ${storefrontSurfacePanel}`}
          noValidate
        >
          <h2 className={storefrontHeadingSection}>
            {tr("formSectionTitle")}
          </h2>

          <FormField
            id="checkout-name"
            label={tr("fieldName")}
            required
            error={fieldErrors.customerName}
          >
            <input
              id="checkout-name"
              name="customerName"
              type="text"
              autoComplete="name"
              value={formValues.customerName}
              onChange={(event) => {
                handleChange("customerName", event.target.value);
              }}
              className={formInputClassName(Boolean(fieldErrors.customerName))}
              aria-invalid={Boolean(fieldErrors.customerName)}
              aria-describedby={
                fieldErrors.customerName !== undefined ? "checkout-name-error" : undefined
              }
            />
          </FormField>

          <div className="grid gap-6 sm:grid-cols-2">
            <FormField
              id="checkout-phone"
              label={tr("fieldPhone")}
              required
              error={fieldErrors.phone}
            >
              <input
                id="checkout-phone"
                name="phone"
                type="tel"
                autoComplete="tel"
                inputMode="tel"
                value={formValues.phone}
                onChange={(event) => {
                  handleChange("phone", event.target.value);
                }}
                className={formInputClassName(Boolean(fieldErrors.phone))}
                aria-invalid={Boolean(fieldErrors.phone)}
              />
            </FormField>
            <FormField
              id="checkout-email"
              label={tr("fieldEmail")}
              required
              error={fieldErrors.email}
            >
              <input
                id="checkout-email"
                name="email"
                type="email"
                autoComplete="email"
                value={formValues.email}
                onChange={(event) => {
                  handleChange("email", event.target.value);
                }}
                className={formInputClassName(Boolean(fieldErrors.email))}
                aria-invalid={Boolean(fieldErrors.email)}
              />
            </FormField>
          </div>

          {formValues.email.trim() !== "" ? (
            <div
              className="flex items-center justify-between gap-4 rounded-lg border border-border/80 bg-muted/15 px-4 py-3 dark:border-white/10 dark:bg-white/4"
            >
              <div className="min-w-0 flex-1">
                <p className="text-sm font-medium text-foreground">
                  {tr("fieldSendOrderCopyToEmail")}
                </p>
                <p className="mt-0.5 text-xs text-muted-foreground">
                  {tr("fieldSendOrderCopyToEmailHint")}
                </p>
              </div>
              <button
                type="button"
                role="switch"
                aria-checked={formValues.sendOrderCopyToEmail}
                aria-label={tr("fieldSendOrderCopyToEmail")}
                onClick={() => {
                  handleChange("sendOrderCopyToEmail", !formValues.sendOrderCopyToEmail);
                }}
                className={`relative h-7 w-12 shrink-0 rounded-full p-0.5 text-left transition focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand ${
                  formValues.sendOrderCopyToEmail
                    ? "border border-transparent bg-brand"
                    : "border border-border/60 bg-muted dark:border-white/10"
                }`}
              >
                <span
                  className={`block h-6 w-6 rounded-full bg-white shadow transition-transform duration-200 dark:bg-zinc-100 ${
                    formValues.sendOrderCopyToEmail ? "translate-x-5" : "translate-x-0"
                  }`}
                />
              </button>
            </div>
          ) : null}

          <FormField
            id="checkout-delivery"
            label={tr("fieldDelivery")}
            required
            error={fieldErrors.deliveryMethod}
          >
            <select
              id="checkout-delivery"
              name="deliveryMethod"
              value={formValues.deliveryMethod}
              onChange={(event) => {
                handleChange(
                  "deliveryMethod",
                  event.target.value as CheckoutDeliveryMethod | "",
                );
              }}
              className={formInputClassName(Boolean(fieldErrors.deliveryMethod))}
              aria-invalid={Boolean(fieldErrors.deliveryMethod)}
            >
              <option value="">{tr("selectPlaceholder")}</option>
              {_.map(deliverySelectValues, (value) => (
                <option key={value} value={value}>
                  {tr(`delivery.${value}`)}
                </option>
              ))}
            </select>
          </FormField>

          {formValues.deliveryMethod !== "" &&
          !(formValues.deliveryMethod === "nova_poshta" && npApiConfigured) ? (
            <FormField
              id="checkout-city"
              label={tr("fieldCity")}
              required
              error={fieldErrors.city}
            >
              <input
                id="checkout-city"
                name="city"
                type="text"
                autoComplete="address-level2"
                value={formValues.city}
                onChange={(event) => {
                  handleChange("city", event.target.value);
                }}
                className={formInputClassName(Boolean(fieldErrors.city))}
                aria-invalid={Boolean(fieldErrors.city)}
              />
            </FormField>
          ) : null}

          {formValues.deliveryMethod === "nova_poshta" ? (
            <CheckoutNovaPoshtaBlock
              formValues={formValues}
              fieldErrors={fieldErrors}
              isNpApiConfigured={npApiConfigured}
              onFieldChange={handleChange}
            />
          ) : null}

          <FormField
            id="checkout-payment"
            label={tr("fieldPayment")}
            required
            error={fieldErrors.paymentMethod}
          >
            <select
              id="checkout-payment"
              name="paymentMethod"
              value={formValues.paymentMethod}
              onChange={(event) => {
                handleChange(
                  "paymentMethod",
                  event.target.value as CheckoutPaymentMethod | "",
                );
              }}
              className={formInputClassName(Boolean(fieldErrors.paymentMethod))}
              aria-invalid={Boolean(fieldErrors.paymentMethod)}
            >
              <option value="">{tr("selectPlaceholder")}</option>
              {_.map(paymentSelectValues, (value) => (
                <option key={value} value={value}>
                  {tr(`payment.${value}`)}
                </option>
              ))}
            </select>
          </FormField>

          <FormField
            id="checkout-comment"
            label={tr("fieldComment")}
            description={tr("fieldCommentHint")}
            error={fieldErrors.comment}
          >
            <textarea
              id="checkout-comment"
              name="comment"
              rows={4}
              value={formValues.comment}
              onChange={(event) => {
                handleChange("comment", event.target.value);
              }}
              className={`${formInputClassName(Boolean(fieldErrors.comment))} min-h-24 resize-y`}
              aria-invalid={Boolean(fieldErrors.comment)}
            />
          </FormField>

          {formSubmitError !== null ? (
            <p className="text-sm text-amber-800 dark:text-amber-200/90" role="alert">
              {formSubmitError}
            </p>
          ) : null}

          <button
            type="submit"
            disabled={isSubmitting}
            className={`w-full sm:w-auto ${storefrontButtonPrimary} ${storefrontButtonPrimaryPaddingCompact} disabled:pointer-events-none disabled:opacity-60`}
          >
            {isSubmitting ? tr("submitSending") : tr("submit")}
          </button>
        </form>
      </div>

      <aside className="mt-10 lg:sticky lg:top-24 lg:col-span-5 lg:mt-0 xl:col-span-4">
        <CheckoutOrderSummary
          lines={validLines}
          totalUah={totalPriceUah}
          currency={currency}
          title={tr("summaryTitle")}
          subtotalLabel={tr("subtotal")}
          totalLabel={tr("total")}
          editCartLabel={tr("editCart")}
          cartHref={cartPath}
        />
      </aside>
    </div>
  );
};
