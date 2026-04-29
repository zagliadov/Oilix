const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const PHONE_DIGITS_MIN = 9;
const NAME_MAX_LENGTH = 200;
const EMAIL_MAX_LENGTH = 254;
const PHONE_MAX_LENGTH = 40;

const countDigits = (value: string): number => {
  return value.replace(/\D/g, "").length;
};

const isRecord = (value: unknown): value is Record<string, unknown> => {
  return typeof value === "object" && value !== null && !Array.isArray(value);
};

export type LandingContactSubmitPayload = {
  name: string;
  email: string;
  phone: string;
};

export const parseLandingContactSubmitPayload = (
  body: unknown,
):
  | { ok: true; payload: LandingContactSubmitPayload }
  | { ok: false } => {
  if (!isRecord(body)) {
    return { ok: false };
  }
  const { name: rawName, email: rawEmail, phone: rawPhone } = body;
  if (typeof rawName !== "string" || typeof rawEmail !== "string" || typeof rawPhone !== "string") {
    return { ok: false };
  }
  const name = rawName.trim();
  const email = rawEmail.trim();
  const phone = rawPhone.trim();
  if (
    name.length === 0 ||
    name.length > NAME_MAX_LENGTH ||
    !EMAIL_PATTERN.test(email) ||
    email.length > EMAIL_MAX_LENGTH ||
    phone.length === 0 ||
    phone.length > PHONE_MAX_LENGTH ||
    countDigits(phone) < PHONE_DIGITS_MIN
  ) {
    return { ok: false };
  }
  return { ok: true, payload: { name, email, phone } };
};
