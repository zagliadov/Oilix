import "server-only";

import { formatLandingContactEmail } from "./format-landing-contact-email";
import { getOrderNotificationToEmails } from "./order-email-config";
import { sendShopEmailMessageWithFailover } from "./send-checkout-order-email";
import type { LandingContactEmailPayload } from "./format-landing-contact-email";

export const sendLandingContactEmail = async (
  payload: LandingContactEmailPayload,
): Promise<{ ok: true } | { ok: false }> => {
  const to = getOrderNotificationToEmails();
  if (to.length === 0) {
    return { ok: false };
  }
  const { subject, text, html, replyTo } = formatLandingContactEmail(payload);
  return sendShopEmailMessageWithFailover({ to, subject, text, html, replyTo });
};
