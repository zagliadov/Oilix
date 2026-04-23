"use server";

import { revalidatePath } from "next/cache";

import { requireAdminSession } from "@/app/lib/admin/auth/require-admin";
import { logAdminProductImages } from "@/app/lib/debug/log-admin-product-images";
import {
  buildBlobImageApiPath,
  buildProductImagePathname,
  isBlobStorageConfigured,
  tryDeleteProductImageBlob,
  uploadProductImageBlob,
} from "@/app/lib/blob";
import {
  deleteAllProductImagesForProduct,
  insertProductImage,
  listProductImagesByProductId,
} from "@/app/lib/catalog-data/product-image-repository";
import { getProductById } from "@/app/lib/catalog-data/product-repository";

const MAX_IMAGE_BYTES = 4 * 1024 * 1024;

const ALLOWED_MIME = new Set([
  "image/jpeg",
  "image/png",
  "image/webp",
  "image/gif",
  "image/svg+xml",
]);

export type ProductImageUploadSaved = {
  id: number;
  url: string;
  alt: string | null;
  isPrimary: boolean;
};

export type ProductImageUploadState = {
  ok: boolean;
  error?: string;
  /** Set after a successful save so the client can call `router.refresh()`. */
  uploaded?: boolean;
  /** Returned from the action so the UI can show a preview even before RSC refetch. */
  savedImage?: ProductImageUploadSaved;
};

export type ProductImageDeleteState = {
  ok: boolean;
  error?: string;
  /** When true, all product image rows and blobs for this product were removed. */
  deleted?: boolean;
};

export const deleteProductImageAction = async (
  _previous: ProductImageDeleteState | undefined,
  formData: FormData,
): Promise<ProductImageDeleteState> => {
  await requireAdminSession();
  const productIdRaw = formData.get("productId");
  const productId = typeof productIdRaw === "string" ? productIdRaw.trim() : "";
  if (productId === "") {
    return { ok: false, error: "Не указан id товара." };
  }
  const product = await getProductById(productId);
  if (product === undefined) {
    return { ok: false, error: "Товар не найден." };
  }
  const existingImages = await listProductImagesByProductId(productId);
  if (existingImages.length === 0) {
    return { ok: true, deleted: false };
  }
  for (const image of existingImages) {
    await tryDeleteProductImageBlob(image.url);
  }
  await deleteAllProductImagesForProduct(productId);
  logAdminProductImages("deleteProductImageAction: removed all images for product", {
    productId,
    previousCount: existingImages.length,
  });
  revalidatePath("/admin/products");
  revalidatePath(`/admin/products/${encodeURIComponent(productId)}/edit`);
  return { ok: true, deleted: true };
};

export const uploadProductImageAction = async (
  _previous: ProductImageUploadState | undefined,
  formData: FormData,
): Promise<ProductImageUploadState> => {
  await requireAdminSession();
  if (!isBlobStorageConfigured()) {
    return { ok: false, error: "Хранилище Blob не настроено (нет BLOB_READ_WRITE_TOKEN)." };
  }
  const productIdRaw = formData.get("productId");
  const productId = typeof productIdRaw === "string" ? productIdRaw.trim() : "";
  if (productId === "") {
    return { ok: false, error: "Не указан id товара." };
  }
  const file = formData.get("file");
  if (file === null || !(file instanceof File)) {
    return { ok: false, error: "Выберите файл изображения." };
  }
  if (file.size === 0) {
    return { ok: false, error: "Файл пустой." };
  }
  if (file.size > MAX_IMAGE_BYTES) {
    return { ok: false, error: "Размер изображения не больше 4 МБ." };
  }
  const type = file.type.toLowerCase();
  if (type === "" || !ALLOWED_MIME.has(type)) {
    return { ok: false, error: "Допустимы JPEG, PNG, WebP, GIF или SVG." };
  }
  const product = await getProductById(productId);
  if (product === undefined) {
    return { ok: false, error: "Товар не найден." };
  }
  // Replace, not stack: remove previous DB rows and delete old blobs in storage.
  const previousImages = await listProductImagesByProductId(productId);
  for (const image of previousImages) {
    await tryDeleteProductImageBlob(image.url);
  }
  if (previousImages.length > 0) {
    await deleteAllProductImagesForProduct(productId);
  }
  const pathname = buildProductImagePathname(
    productId,
    file.name,
  );
  const arrayBuffer = await file.arrayBuffer();
  const result = await uploadProductImageBlob({
    pathname,
    body: arrayBuffer,
    contentType: type,
  });
  const imageUrl = buildBlobImageApiPath(result.pathname);
  const altRaw = formData.get("alt");
  const alt =
    typeof altRaw === "string" && altRaw.trim() !== ""
      ? altRaw.trim()
      : undefined;
  const saved = await insertProductImage({
    productId,
    url: imageUrl,
    alt,
  });
  logAdminProductImages("uploadProductImageAction: saved row (server/terminal)", {
    productId,
    id: saved.id,
    url: saved.url,
  });
  revalidatePath("/admin/products");
  revalidatePath(`/admin/products/${encodeURIComponent(productId)}/edit`);
  return {
    ok: true,
    uploaded: true,
    savedImage: {
      id: saved.id,
      url: saved.url,
      alt: saved.alt,
      isPrimary: saved.isPrimary,
    },
  };
};
