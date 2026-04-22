/**
 * App-relative path for the blob image route. Persist this in the DB (e.g. `product_images.url`)
 * so private blobs are served via a server route that uses the read/write token.
 */
export const buildBlobImageApiPath = (blobPathname: string): string => {
  return `/api/blob/image?pathname=${encodeURIComponent(blobPathname)}`;
};

export const isProductImageBlobPathname = (value: string): boolean =>
  value.startsWith("product-images/") && !value.includes("..");
