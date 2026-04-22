import type { Metadata } from "next";

import { readCatalogBundleFromFile } from "@/app/lib/catalog-data/read-catalog-file";
import { suggestNextProductId } from "@/app/lib/catalog-data/product-ids";
import { AdminShell } from "@/components/admin/admin-shell";
import { ProductForm } from "@/components/admin/product-form";

export const metadata: Metadata = {
  title: "Новый товар — Админка — Oilix",
  robots: { index: false, follow: false },
};

export default async function AdminNewProductPage() {
  const bundle = await readCatalogBundleFromFile();
  const nextId = suggestNextProductId(bundle.products);

  return (
    <AdminShell title="Новый товар">
      <p className="text-sm text-muted-foreground">
        Id при сохранении: <span className="font-mono text-foreground">{nextId}</span>
      </p>
      <div className="mt-8 w-full">
        <ProductForm
          mode="create"
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
