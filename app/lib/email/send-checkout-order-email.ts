import "server-only";

import type { CheckoutSubmitPayload } from "@/app/lib/checkout/types";

import { formatCustomerOrderConfirmationEmail } from "./format-customer-confirmation-email";
import { formatCheckoutOrderEmail } from "./format-checkout-order-email";
import {
  getOrderFromAddress,
  getOrderNotificationToEmails,
  getResendApiKey,
  isResendOrderSendingConfigured,
  isSmtpOrderSendingConfigured,
} from "./order-email-config";
import { type SmtpMessage, sendSmtpWithOrderConfig } from "./send-order-email-smtp";

const sendResendMessage = async (message: SmtpMessage): Promise<boolean> => {
  const apiKey = getResendApiKey();
  const from = getOrderFromAddress();
  if (apiKey === undefined || from === undefined) {
    return false;
  }
  const response = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${apiKey}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      from,
      to: message.to,
      subject: message.subject,
      text: message.text,
      html: message.html,
      ...(message.replyTo !== undefined ? { reply_to: message.replyTo } : {}),
    }),
  });
  if (!response.ok) {
    if (process.env.NODE_ENV === "development") {
      const errBody = await response.text();
      console.error("[checkout email] Resend error", response.status, errBody);
    }
    return false;
  }
  return true;
};

export const sendShopEmailMessageWithFailover = async (
  message: SmtpMessage,
): Promise<{ ok: true } | { ok: false }> => {
  if (isSmtpOrderSendingConfigured()) {
    const smtpResult = await sendSmtpWithOrderConfig(message);
    if (smtpResult) {
      return { ok: true };
    }
    if (isResendOrderSendingConfigured()) {
      if (process.env.NODE_ENV === "development") {
        console.warn("[checkout email] SMTP failed, retrying via Resend");
      }
      const resendOk = await sendResendMessage(message);
      return resendOk ? { ok: true } : { ok: false };
    }
    return { ok: false };
  }
  const resendOk = await sendResendMessage(message);
  return resendOk ? { ok: true } : { ok: false };
};

const CUSTOMER_EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const sendCustomerOrderCopyIfRequested = async (
  payload: CheckoutSubmitPayload,
): Promise<void> => {
  if (!payload.sendOrderCopyToEmail) {
    return;
  }
  const toAddress = payload.customer.email.trim();
  if (!CUSTOMER_EMAIL_PATTERN.test(toAddress)) {
    return;
  }

  const { subject, text, html } = formatCustomerOrderConfirmationEmail(payload);
  const shopInbox = getOrderNotificationToEmails()[0];
  const message: SmtpMessage = {
    to: toAddress,
    subject,
    text,
    html,
    ...(shopInbox !== undefined && shopInbox !== toAddress
      ? { replyTo: shopInbox }
      : {}),
  };

  if (isSmtpOrderSendingConfigured()) {
    const smtpOk = await sendSmtpWithOrderConfig(message);
    if (smtpOk) {
      return;
    }
    if (isResendOrderSendingConfigured()) {
      if (process.env.NODE_ENV === "development") {
        console.warn(
          "[checkout email] customer copy: SMTP failed, trying Resend",
        );
      }
      const resendOk = await sendResendMessage(message);
      if (!resendOk && process.env.NODE_ENV === "development") {
        console.warn(
          "[checkout email] customer copy could not be sent (check logs)",
        );
      }
    }
    return;
  }

  if (isResendOrderSendingConfigured()) {
    const resendOk = await sendResendMessage(message);
    if (!resendOk && process.env.NODE_ENV === "development") {
      console.warn(
        "[checkout email] customer copy could not be sent (check logs)",
      );
    }
  }
};

/**
 * 1) **SMTP** to shop; on failure, **Resend** (failover).
 * 2) If only Resend, send to shop via Resend.
 * 3) If `sendOrderCopyToEmail` and customer email is valid, send a second **confirmation** to the customer (best-effort; does not change API success for the shop).
 */
export const sendCheckoutOrderEmail = async (
  payload: CheckoutSubmitPayload,
): Promise<{ ok: true } | { ok: false }> => {
  const to = getOrderNotificationToEmails();
  if (to.length === 0) {
    return { ok: false };
  }
  const { subject, text, html, replyTo } = formatCheckoutOrderEmail(payload);
  const shop = await sendShopEmailMessageWithFailover({
    to,
    subject,
    text,
    html,
    ...(replyTo !== undefined ? { replyTo } : {}),
  });

  if (!shop.ok) {
    return { ok: false };
  }

  try {
    await sendCustomerOrderCopyIfRequested(payload);
  } catch (error) {
    if (process.env.NODE_ENV === "development") {
      console.error("[checkout email] customer copy exception", error);
    }
  }

  return { ok: true };
};
