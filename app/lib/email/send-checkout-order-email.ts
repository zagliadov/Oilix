import "server-only";

import type { CheckoutSubmitPayload } from "@/app/lib/checkout/types";

import { formatCheckoutOrderEmail } from "./format-checkout-order-email";
import {
  getOrderFromAddress,
  getOrderNotificationToEmails,
  getResendApiKey,
  isSmtpOrderSendingConfigured,
} from "./order-email-config";
import { sendOrderEmailViaSmtp } from "./send-order-email-smtp";

const sendOrderEmailViaResend = async (
  payload: CheckoutSubmitPayload,
): Promise<{ ok: true } | { ok: false }> => {
  const apiKey = getResendApiKey();
  const from = getOrderFromAddress();
  const to = getOrderNotificationToEmails();
  if (apiKey === undefined || from === undefined || to.length === 0) {
    return { ok: false };
  }

  const { subject, text, html, replyTo } = formatCheckoutOrderEmail(payload);

  const response = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${apiKey}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      from,
      to,
      reply_to: replyTo,
      subject,
      text,
      html,
    }),
  });

  if (!response.ok) {
    if (process.env.NODE_ENV === "development") {
      const errBody = await response.text();
      console.error("[checkout email] Resend error", response.status, errBody);
    }
    return { ok: false };
  }

  return { ok: true };
};

/**
 * Order of delivery: **SMTP (e.g. Google)** if all SMTP env vars are set, otherwise **Resend** if set.
 */
export const sendCheckoutOrderEmail = async (
  payload: CheckoutSubmitPayload,
): Promise<{ ok: true } | { ok: false }> => {
  if (isSmtpOrderSendingConfigured()) {
    return sendOrderEmailViaSmtp(payload);
  }
  return sendOrderEmailViaResend(payload);
};
