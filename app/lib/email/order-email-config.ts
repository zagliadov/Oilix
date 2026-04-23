import "server-only";

/**
 * Recipients: comma-separated in `OILIX_ORDER_TO_EMAILS`.
 * Sending: **Google SMTP** (or any SMTP) via `OILIX_SMTP_*`, or **Resend** via `RESEND_API_KEY`.
 * If SMTP is fully configured, it is used first; otherwise Resend (if configured).
 */
export const getResendApiKey = (): string | undefined => {
  const raw = process.env.RESEND_API_KEY;
  if (raw === undefined) {
    return undefined;
  }
  const trimmed = raw.trim();
  return trimmed === "" ? undefined : trimmed;
};

const splitEmails = (raw: string | undefined): string[] => {
  if (raw === undefined) {
    return [];
  }
  return raw
    .split(",")
    .map((part) => part.trim())
    .filter((part) => part.length > 0);
};

/** One or more addresses; order copies go here. */
export const getOrderNotificationToEmails = (): string[] => {
  return splitEmails(process.env.OILIX_ORDER_TO_EMAILS);
};

/**
 * From header: "Site <email@domain.com>" or `email@domain.com`.
 * For Gmail SMTP, use the same account as `OILIX_SMTP_USER` (or an alias allowed in Google).
 */
export const getOrderFromAddress = (): string | undefined => {
  const raw = process.env.OILIX_ORDER_FROM;
  if (raw === undefined) {
    return undefined;
  }
  const trimmed = raw.trim();
  return trimmed === "" ? undefined : trimmed;
};

export const getSmtpHost = (): string | undefined => {
  const raw = process.env.OILIX_SMTP_HOST;
  if (raw === undefined) {
    return undefined;
  }
  const trimmed = raw.trim();
  return trimmed === "" ? undefined : trimmed;
};

export const getSmtpUser = (): string | undefined => {
  const raw = process.env.OILIX_SMTP_USER;
  if (raw === undefined) {
    return undefined;
  }
  const trimmed = raw.trim();
  return trimmed === "" ? undefined : trimmed;
};

export const getSmtpPassword = (): string | undefined => {
  const raw = process.env.OILIX_SMTP_PASS;
  if (raw === undefined) {
    return undefined;
  }
  return raw === "" ? undefined : raw;
};

/** Default 587 (STARTTLS). Use 465 with `OILIX_SMTP_SECURE=1` for implicit SSL. */
export const getSmtpPort = (): number => {
  const raw = process.env.OILIX_SMTP_PORT;
  if (raw === undefined || raw.trim() === "") {
    return 587;
  }
  const parsed = Number.parseInt(raw, 10);
  if (!Number.isFinite(parsed) || parsed <= 0) {
    return 587;
  }
  return parsed;
};

export const getSmtpSecure = (): boolean => {
  if (process.env.OILIX_SMTP_SECURE === "1" || process.env.OILIX_SMTP_SECURE === "true") {
    return true;
  }
  return getSmtpPort() === 465;
};

export const isSmtpOrderSendingConfigured = (): boolean => {
  return (
    getSmtpHost() !== undefined &&
    getSmtpUser() !== undefined &&
    getSmtpPassword() !== undefined &&
    getOrderFromAddress() !== undefined &&
    getOrderNotificationToEmails().length > 0
  );
};

const isResendOrderSendingConfigured = (): boolean => {
  return (
    getResendApiKey() !== undefined &&
    getOrderFromAddress() !== undefined &&
    getOrderNotificationToEmails().length > 0
  );
};

export const isOrderEmailSendingConfigured = (): boolean => {
  return isSmtpOrderSendingConfigured() || isResendOrderSendingConfigured();
};
