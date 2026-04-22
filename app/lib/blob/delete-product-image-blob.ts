import "server-only";

import { del } from "@vercel/blob";

import { getBlobReadWriteToken } from "./env";
import { isProductImageBlobPathname } from "./blob-image-api-path";

/**
 * Resolves a stored app URL (or legacy public blob URL) for `del()`.
 */
export const resolveBlobDeleteTarget = (storedUrl: string): string | null => {
  const trimmed = storedUrl.trim();
  if (trimmed === "") {
    return null;
  }
  if (trimmed.startsWith("/api/blob/image")) {
    const queryIndex = trimmed.indexOf("?");
    if (queryIndex === -1) {
      return null;
    }
    const params = new URLSearchParams(trimmed.slice(queryIndex + 1));
    const pathname = params.get("pathname");
    if (pathname === null) {
      return null;
    }
    if (!isProductImageBlobPathname(pathname)) {
      return null;
    }
    return pathname;
  }
  if (
    trimmed.startsWith("https://") &&
    (trimmed.includes(".public.blob.vercel-storage.com/") ||
      trimmed.includes("blob.vercel-storage.com/"))
  ) {
    return trimmed;
  }
  return null;
};

/**
 * Best-effort delete of a blob backing a `product_images.url` value. Idempotent
 * (ignores not-found and missing token).
 */
export const tryDeleteProductImageBlob = async (storedUrl: string): Promise<void> => {
  const token = getBlobReadWriteToken();
  if (token === undefined) {
    return;
  }
  const target = resolveBlobDeleteTarget(storedUrl);
  if (target === null) {
    return;
  }
  try {
    await del(target, { token });
  } catch {
    // Blob may already be removed or path unknown — avoid failing the admin flow.
  }
};
