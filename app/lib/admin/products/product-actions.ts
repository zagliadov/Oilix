"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

import { requireAdminSession } from "@/app/lib/admin/auth/require-admin";
import { parseProductFromFormData } from "@/app/lib/catalog-data/parse-product-form";
import {
  createProduct,
  deleteProductById,
  getProductById,
  updateProduct,
} from "@/app/lib/catalog-data/product-repository";
import { readCatalogBundleFromFile } from "@/app/lib/catalog-data/read-catalog-file";
import { suggestNextProductId } from "@/app/lib/catalog-data/product-ids";

export type ProductFormActionState = {
  ok: boolean;
  errors?: string[];
};

export const createProductAction = async (
  _previousState: ProductFormActionState | undefined,
  formData: FormData,
): Promise<ProductFormActionState> => {
  await requireAdminSession();
  const bundle = await readCatalogBundleFromFile();
  const newId = suggestNextProductId(bundle.products);
  const parsed = parseProductFromFormData(formData, bundle, {
    mode: "create",
    productId: newId,
  });
  if (!parsed.ok) {
    return { ok: false, errors: parsed.errors };
  }
  await createProduct(parsed.product);
  revalidatePath("/admin/products");
  redirect("/admin/products");
};

export const updateProductAction = async (
  _previousState: ProductFormActionState | undefined,
  formData: FormData,
): Promise<ProductFormActionState> => {
  await requireAdminSession();
  const idRaw = formData.get("id");
  const id = typeof idRaw === "string" ? idRaw.trim() : "";
  if (id === "") {
    return { ok: false, errors: ["Product id is missing."] };
  }
  const bundle = await readCatalogBundleFromFile();
  const parsed = parseProductFromFormData(formData, bundle, {
    mode: "edit",
    productId: id,
  });
  if (!parsed.ok) {
    return { ok: false, errors: parsed.errors };
  }
  const existing = await getProductById(id);
  if (existing === undefined) {
    return { ok: false, errors: ["Product no longer exists."] };
  }
  await updateProduct(parsed.product);
  revalidatePath("/admin/products");
  redirect("/admin/products");
};

export const deleteProductAction = async (formData: FormData): Promise<void> => {
  await requireAdminSession();
  const idRaw = formData.get("id");
  const id = typeof idRaw === "string" ? idRaw.trim() : "";
  if (id === "") {
    redirect("/admin/products");
  }
  await deleteProductById(id);
  revalidatePath("/admin/products");
  redirect("/admin/products");
};
