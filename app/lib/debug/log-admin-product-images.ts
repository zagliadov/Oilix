/**
 * Debug logs for admin product image flow. Enabled in `next dev` or when
 * OILIX_DEBUG_PRODUCT_IMAGES=1 in env (server / terminal). Browser only checks NODE_ENV.
 */
const isLogEnabled = (): boolean =>
  process.env.NODE_ENV === "development" || process.env.OILIX_DEBUG_PRODUCT_IMAGES === "1";

export const logAdminProductImages = (message: string, data?: unknown): void => {
  if (!isLogEnabled()) {
    return;
  }
  const tag = "[oilix:admin:product-images]";
  if (data === undefined) {
    // eslint-disable-next-line no-console -- intentional debug
    console.log(tag, message);
  } else {
    // eslint-disable-next-line no-console -- intentional debug
    console.log(tag, message, data);
  }
};
