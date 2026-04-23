import type { Metadata } from "next";
import { unstable_noStore } from "next/cache";

import { isBlobStorageConfigured } from "@/app/lib/blob";
import { loadCatalogFromDatabase } from "@/app/lib/catalog/load-catalog-from-db";
import { suggestNextProductId } from "@/app/lib/catalog-data/product-ids";
import { AdminShell } from "@/components/admin/admin-shell";
import { ProductForm } from "@/components/admin/product-form";

export const metadata: Metadata = {
  title: "Новый товар — Админка — Oilix",
  robots: { index: false, follow: false },
};

export default async function AdminNewProductPage() {
  unstable_noStore();
  const bundle = await loadCatalogFromDatabase();
  const suggestedNextId = suggestNextProductId(bundle.products);
  const blobConfigured = isBlobStorageConfigured();

  return (
    <AdminShell title="Новый товар">
      <div className="mt-2 w-full">
        <ProductForm
          mode="create"
          createSuccessFlow="inline-photo"
          blobConfigured={blobConfigured}
          suggestedNextId={suggestedNextId}
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
