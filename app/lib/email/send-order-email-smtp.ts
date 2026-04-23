import "server-only";

import nodemailer from "nodemailer";

import type { CheckoutSubmitPayload } from "@/app/lib/checkout/types";

import { formatCheckoutOrderEmail } from "./format-checkout-order-email";
import {
  getOrderFromAddress,
  getOrderNotificationToEmails,
  getSmtpHost,
  getSmtpPassword,
  getSmtpPort,
  getSmtpSecure,
  getSmtpUser,
} from "./order-email-config";

export const sendOrderEmailViaSmtp = async (
  payload: CheckoutSubmitPayload,
): Promise<{ ok: true } | { ok: false }> => {
  const from = getOrderFromAddress();
  const to = getOrderNotificationToEmails();
  const host = getSmtpHost();
  const user = getSmtpUser();
  const pass = getSmtpPassword();
  if (
    from === undefined ||
    to.length === 0 ||
    host === undefined ||
    user === undefined ||
    pass === undefined
  ) {
    return { ok: false };
  }

  const { subject, text, html, replyTo } = formatCheckoutOrderEmail(payload);

  const transporter = nodemailer.createTransport({
    host,
    port: getSmtpPort(),
    secure: getSmtpSecure(),
    auth: { user, pass },
  });

  try {
    await transporter.sendMail({
      from,
      to,
      subject,
      text,
      html,
      replyTo,
    });
    return { ok: true };
  } catch (error) {
    if (process.env.NODE_ENV === "development") {
      console.error("[checkout email] SMTP error", error);
    }
    return { ok: false };
  }
};
