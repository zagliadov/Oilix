/**
 * HMAC-SHA256 session tokens using Web Crypto (works in Node Server Actions and Edge proxy).
 */

const MAX_AGE_SECONDS = 8 * 60 * 60;

const encoder = new TextEncoder();

const importHmacKey = async (secret: string): Promise<CryptoKey> =>
  crypto.subtle.importKey(
    "raw",
    encoder.encode(secret),
    { name: "HMAC", hash: "SHA-256" },
    false,
    ["sign", "verify"],
  );

const signatureToHex = (buffer: ArrayBuffer): string =>
  Array.from(new Uint8Array(buffer))
    .map((byte) => byte.toString(16).padStart(2, "0"))
    .join("");

const hexToBuffer = (hex: string): Uint8Array | null => {
  if (hex.length % 2 !== 0 || !/^[0-9a-f]+$/i.test(hex)) {
    return null;
  }
  return Uint8Array.from(hex.match(/.{2}/g)!.map((pair) => parseInt(pair, 16)));
};

export const createAdminSessionToken = async (secret: string): Promise<string> => {
  const exp = Math.floor(Date.now() / 1000) + MAX_AGE_SECONDS;
  const payload = String(exp);
  const key = await importHmacKey(secret);
  const signature = await crypto.subtle.sign("HMAC", key, encoder.encode(payload));
  return `${payload}.${signatureToHex(signature)}`;
};

export const verifyAdminSessionToken = async (
  token: string,
  secret: string,
): Promise<boolean> => {
  const separatorIndex = token.indexOf(".");
  if (separatorIndex <= 0) {
    return false;
  }
  const payload = token.slice(0, separatorIndex);
  const sigHex = token.slice(separatorIndex + 1);
  if (!/^\d+$/.test(payload)) {
    return false;
  }
  const expSeconds = parseInt(payload, 10);
  if (Number.isNaN(expSeconds)) {
    return false;
  }
  const nowSeconds = Math.floor(Date.now() / 1000);
  if (expSeconds < nowSeconds) {
    return false;
  }
  const sigBytes = hexToBuffer(sigHex);
  if (sigBytes === null) {
    return false;
  }
  const key = await importHmacKey(secret);
  const signatureCopy = new Uint8Array(sigBytes);
  const ok = await crypto.subtle.verify(
    "HMAC",
    key,
    signatureCopy,
    encoder.encode(payload),
  );
  return ok;
};
