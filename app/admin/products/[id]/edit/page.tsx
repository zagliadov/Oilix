import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { readCatalogBundleFromFile } from "@/app/lib/catalog-data/read-catalog-file";
import { getProductById } from "@/app/lib/catalog-data/product-repository";
import { AdminShell } from "@/components/admin/admin-shell";
import { ProductForm } from "@/components/admin/product-form";

type AdminEditProductPageProps = {
  params: Promise<{ id: string }>;
};

export async function generateMetadata({ params }: AdminEditProductPageProps): Promise<Metadata> {
  const { id } = await params;
  return {
    title: `Edit product ${id} — Admin — Oilix`,
    robots: { index: false, follow: false },
  };
}

export default async function AdminEditProductPage({ params }: AdminEditProductPageProps) {
  const { id } = await params;
  const decodedId = decodeURIComponent(id);
  const product = await getProductById(decodedId);
  if (product === undefined) {
    notFound();
  }

  const bundle = await readCatalogBundleFromFile();

  return (
    <AdminShell title={`Edit product ${product.name}`}>
      <div className="w-full">
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
