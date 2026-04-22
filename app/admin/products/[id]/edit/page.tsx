import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { unstable_noStore as noStore } from "next/cache";

import { isBlobStorageConfigured } from "@/app/lib/blob";
import { logAdminProductImages } from "@/app/lib/debug/log-admin-product-images";
import { listProductImagesByProductId } from "@/app/lib/catalog-data/product-image-repository";
import { readCatalogBundleFromFile } from "@/app/lib/catalog-data/read-catalog-file";
import { getProductById } from "@/app/lib/catalog-data/product-repository";
import { AdminShell } from "@/components/admin/admin-shell";
import { ProductImageUploadBlock } from "@/components/admin/product-image-upload-block";
import { ProductForm } from "@/components/admin/product-form";

export const dynamic = "force-dynamic";

type AdminEditProductPageProps = {
  params: Promise<{ id: string }>;
};

export async function generateMetadata({ params }: AdminEditProductPageProps): Promise<Metadata> {
  const { id } = await params;
  return {
    title: `Редактирование ${id} — Админка — Oilix`,
    robots: { index: false, follow: false },
  };
}

export default async function AdminEditProductPage({ params }: AdminEditProductPageProps) {
  noStore();
  const { id } = await params;
  const decodedId = decodeURIComponent(id);
  const product = await getProductById(decodedId);
  if (product === undefined) {
    notFound();
  }

  const bundle = await readCatalogBundleFromFile();
  logAdminProductImages("AdminEditProductPage: before listProductImagesByProductId", {
    productId: product.id,
    decodedId,
  });
  const productImages = await listProductImagesByProductId(product.id);
  logAdminProductImages("AdminEditProductPage: after listProductImagesByProductId", {
    productId: product.id,
    imageCount: productImages.length,
  });
  const blobConfigured = isBlobStorageConfigured();
  logAdminProductImages("AdminEditProductPage: blob storage", { blobConfigured });

  return (
    <AdminShell title={`Редактирование: ${product.name}`}>
      <div className="w-full space-y-10">
        <section className="space-y-4">
          <div>
            <h2 className="text-lg font-semibold tracking-tight text-foreground">
              Фото товара
            </h2>
            <p className="mt-1 text-sm text-muted-foreground">
              Файлы хранятся в Vercel Blob; новая загрузка заменяет предыдущие изображения (одно фото
              на товар).
            </p>
          </div>
          <ProductImageUploadBlock
            key={product.id}
            productId={product.id}
            blobConfigured={blobConfigured}
            images={productImages.map((image) => ({
              id: image.id,
              url: image.url,
              alt: image.alt,
              isPrimary: image.isPrimary,
            }))}
          />
        </section>
        <ProductForm
          mode="edit"
          initialProduct={product}
          brands={bundle.brands.map((brand) => ({ id: brand.id, name: brand.name }))}
          categories={bundle.categories.map((category) => ({
            id: category.id,
            name: category.name,
          }))}
        />
      </div>
    </AdminShell>
  );
}
