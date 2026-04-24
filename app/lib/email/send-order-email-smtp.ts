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

export type SmtpMessage = {
  to: string | string[];
  subject: string;
  text: string;
  html: string;
  replyTo?: string;
};

/**
 * General SMTP send using the same credentials as order notifications.
 */
export const sendSmtpWithOrderConfig = async (
  message: SmtpMessage,
): Promise<boolean> => {
  const from = getOrderFromAddress();
  const host = getSmtpHost();
  const user = getSmtpUser();
  const pass = getSmtpPassword();
  if (from === undefined || host === undefined || user === undefined || pass === undefined) {
    return false;
  }

  const transporter = nodemailer.createTransport({
    host,
    port: getSmtpPort(),
    secure: getSmtpSecure(),
    auth: { user, pass },
  });

  try {
    await transporter.sendMail({
      from,
      to: message.to,
      subject: message.subject,
      text: message.text,
      html: message.html,
      replyTo: message.replyTo,
    });
    return true;
  } catch (error) {
    if (process.env.NODE_ENV === "development") {
      console.error("[email] SMTP error", error);
    }
    return false;
  }
};

export const sendOrderEmailViaSmtp = async (
  payload: CheckoutSubmitPayload,
): Promise<{ ok: true } | { ok: false }> => {
  const to = getOrderNotificationToEmails();
  if (to.length === 0) {
    return { ok: false };
  }

  const { subject, text, html, replyTo } = formatCheckoutOrderEmail(payload);
  const ok = await sendSmtpWithOrderConfig({ to, subject, text, html, replyTo });
  return ok ? { ok: true } : { ok: false };
};
