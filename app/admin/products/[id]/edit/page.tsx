import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { unstable_noStore as noStore } from "next/cache";
import * as _ from "lodash";

import { isBlobStorageConfigured } from "@/app/lib/blob";
import { logAdminProductImages } from "@/app/lib/debug/log-admin-product-images";
import { getCatalogBundle } from "@/app/lib/catalog/load-catalog";
import { listProductImagesByProductId } from "@/app/lib/catalog-data/product-image-repository";
import { getProductById } from "@/app/lib/catalog-data/product-repository";
import { AdminShell } from "@/components/admin/admin-shell";
import { ProductImageUploadBlock } from "@/components/admin/product-image-upload-block";
import { ProductForm } from "@/components/admin/product-form";

export const dynamic = "force-dynamic";

type AdminEditProductPageProps = {
  params: Promise<{ id: string }>;
};

export async function generateMetadata({
  params,
}: AdminEditProductPageProps): Promise<Metadata> {
  const id = (await params)?.id ?? "";
  return {
    title: id
      ? `Редактирование ${id} — Админка — Oilix`
      : "Редактирование — Админка — Oilix",
    robots: { index: false, follow: false },
  };
}

export default async function AdminEditProductPage({
  params,
}: AdminEditProductPageProps) {
  noStore();
  const id = (await params)?.id;
  if (id === undefined || id === "") {
    notFound();
  }
  const decodedId = decodeURIComponent(id);
  const product = await getProductById(decodedId);
  if (product === undefined) {
    notFound();
  }

  const bundle = await getCatalogBundle();
  logAdminProductImages(
    "AdminEditProductPage: before listProductImagesByProductId",
    {
      productId: product.id,
      decodedId,
    },
  );
  const productImages = await listProductImagesByProductId(product.id);
  logAdminProductImages(
    "AdminEditProductPage: after listProductImagesByProductId",
    {
      productId: product.id,
      imageCount: productImages.length,
    },
  );
  const blobConfigured = isBlobStorageConfigured();
  logAdminProductImages("AdminEditProductPage: blob storage", {
    blobConfigured,
  });

  return (
    <AdminShell
      title={`Редактирование: ${(product.name?.trim() ?? "") || product.id}`}
    >
      <div className="w-full space-y-10">
        <section className="space-y-4">
          <div>
            <h2 className="text-lg font-semibold tracking-tight text-foreground">
              Фото товара
            </h2>
            <p className="mt-1 text-sm text-muted-foreground">
              Файлы хранятся в Vercel Blob; новая загрузка заменяет предыдущие
              изображения (одно фото на товар).
            </p>
          </div>
          <ProductImageUploadBlock
            key={product.id}
            productId={product.id}
            blobConfigured={blobConfigured}
            images={_.map(productImages, (image) =>
              _.pick(image, ["id", "url", "alt", "isPrimary"]),
            )}
          />
        </section>
        <ProductForm
          mode="edit"
          initialProduct={product}
          brands={_.map(bundle?.brands ?? [], (brand) =>
            _.pick(brand, ["id", "name"]),
          )}
          categories={_.map(bundle?.categories ?? [], (category) =>
            _.pick(category, ["id", "name"]),
          )}
        />
      </div>
    </AdminShell>
  );
}
