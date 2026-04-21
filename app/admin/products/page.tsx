import type { Metadata } from "next";
import Link from "next/link";
import * as _ from "lodash";

import { readCatalogBundleFromFile } from "@/app/lib/catalog-data/read-catalog-file";
import { AdminShell } from "@/components/admin/admin-shell";
import { DeleteProductButton } from "@/components/admin/delete-product-button";
import { storefrontButtonPrimary, storefrontButtonPrimaryPaddingCompact } from "@/components/ui/storefront";

export const metadata: Metadata = {
  title: "Products — Admin — Oilix",
  robots: { index: false, follow: false },
};

export default async function AdminProductsPage() {
  const bundle = await readCatalogBundleFromFile();
  const brandById = _.keyBy(bundle.brands, "id");
  const categoryById = _.keyBy(bundle.categories, "id");
  const products = _.orderBy(bundle.products, [(product) => product.id.toLowerCase()], ["asc"]);

  return (
    <AdminShell title="Products">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <p className="text-sm text-muted-foreground">
          {products.length} product{products.length === 1 ? "" : "s"} in{" "}
          <code className="font-mono text-xs text-foreground">data/catalog.json</code>
        </p>
        <Link
          href="/admin/products/new"
          className={`self-start sm:self-auto ${storefrontButtonPrimary} ${storefrontButtonPrimaryPaddingCompact} text-sm`}
        >
          Add product
        </Link>
      </div>

      <div className="mt-8 overflow-x-auto rounded-xl border border-border dark:border-white/10">
        <table className="w-full min-w-[640px] border-collapse text-left text-sm">
          <thead>
            <tr className="border-b border-border bg-muted/30 dark:border-white/10 dark:bg-white/3">
              <th className="px-4 py-3 font-semibold text-foreground">ID</th>
              <th className="px-4 py-3 font-semibold text-foreground">Name</th>
              <th className="px-4 py-3 font-semibold text-foreground">Brand</th>
              <th className="px-4 py-3 font-semibold text-foreground">Category</th>
              <th className="px-4 py-3 font-semibold text-foreground">Kind</th>
              <th className="px-4 py-3 font-semibold text-foreground tabular-nums">Price (₴)</th>
              <th className="px-4 py-3 font-semibold text-foreground">Stock</th>
              <th className="px-4 py-3 font-semibold text-foreground">Actions</th>
            </tr>
          </thead>
          <tbody>
            {_.map(products, (product) => {
              const brand = brandById[product.brandId];
              const category = categoryById[product.categoryId];
              const brandLabel = brand?.name ?? product.brandId;
              const categoryLabel = category?.name ?? product.categoryId;
              return (
                <tr
                  key={product.id}
                  className="border-b border-border/60 last:border-0 dark:border-white/10"
                >
                  <td className="px-4 py-3 font-mono text-xs tabular-nums text-muted-foreground">
                    {product.id}
                  </td>
                  <td className="max-w-[200px] truncate px-4 py-3 font-medium text-foreground">
                    {product.name}
                  </td>
                  <td className="px-4 py-3 text-muted-foreground">{brandLabel}</td>
                  <td className="px-4 py-3 text-muted-foreground">{categoryLabel}</td>
                  <td className="px-4 py-3 text-muted-foreground">{product.kind}</td>
                  <td className="px-4 py-3 tabular-nums text-foreground">{product.priceUah}</td>
                  <td className="px-4 py-3 text-muted-foreground">
                    {product.inStock ? "Yes" : "No"}
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex flex-wrap items-center gap-2">
                      <Link
                        href={`/admin/products/${encodeURIComponent(product.id)}/edit`}
                        className="text-sm font-medium text-brand transition hover:underline"
                      >
                        Edit
                      </Link>
                      <DeleteProductButton productId={product.id} />
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </AdminShell>
  );
}
