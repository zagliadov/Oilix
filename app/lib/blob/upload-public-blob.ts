import "server-only";

import { put, type PutBlobResult } from "@vercel/blob";

import { getBlobReadWriteToken } from "./env";
import { sanitizeUploadFilename } from "./sanitize-upload-filename";

export type UploadProductImageBlobInput = {
  /** Logical folder + filename inside the store, e.g. `product-images/my-sku/123-photo.png` */
  pathname: string;
  body: Blob | ArrayBuffer | ReadableStream<Uint8Array>;
  contentType?: string;
};

const PATHNAME_PATTERN = /^[a-zA-Z0-9][a-zA-Z0-9/._-]*$/;

const isValidBlobPathname = (pathname: string): boolean => {
  if (pathname.length === 0 || pathname.length > 512) {
    return false;
  }
  if (pathname.includes("..") || pathname.startsWith("/") || pathname.endsWith("/")) {
    return false;
  }
  return PATHNAME_PATTERN.test(pathname);
};

/**
 * Uploads a product image to Blob (private store). The returned pathname must be
 * exposed to the browser via {@link buildBlobImageApiPath} — direct blob URLs
 * are not useable in `<img>` for private blobs. Server-only.
 */
export const uploadProductImageBlob = async (
  input: UploadProductImageBlobInput,
): Promise<PutBlobResult> => {
  const token = getBlobReadWriteToken();
  if (token === undefined) {
    throw new Error("BLOB_READ_WRITE_TOKEN is not set.");
  }
  if (!isValidBlobPathname(input.pathname)) {
    throw new Error("Invalid blob pathname.");
  }
  return put(input.pathname, input.body, {
    access: "private",
    token,
    contentType: input.contentType,
    addRandomSuffix: true,
  });
};

/**
 * Builds a pathname under `product-images/{productId}/` with a safe filename stem.
 */
export const buildProductImagePathname = (
  productId: string,
  originalFilename: string,
): string => {
  const safeId = productId.replace(/[^a-zA-Z0-9_-]+/g, "-").slice(0, 64);
  if (safeId === "") {
    throw new Error("Invalid product id for blob path.");
  }
  const safeName = sanitizeUploadFilename(originalFilename);
  return `product-images/${safeId}/${Date.now()}-${safeName}`;
};
