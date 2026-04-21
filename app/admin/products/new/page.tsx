import type { Metadata } from "next";

import { readCatalogBundleFromFile } from "@/app/lib/catalog-data/read-catalog-file";
import { suggestNextProductId } from "@/app/lib/catalog-data/product-ids";
import { AdminShell } from "@/components/admin/admin-shell";
import { ProductForm } from "@/components/admin/product-form";

export const metadata: Metadata = {
  title: "New product — Admin — Oilix",
  robots: { index: false, follow: false },
};

export default async function AdminNewProductPage() {
  const bundle = await readCatalogBundleFromFile();
  const nextId = suggestNextProductId(bundle.products);

  return (
    <AdminShell title="New product">
      <p className="text-sm text-muted-foreground">
        Next id will be <span className="font-mono text-foreground">{nextId}</span> (assigned on save).
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
