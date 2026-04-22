import "server-only";

import { unstable_cache } from "next/cache";

import { loadCatalogFromDatabase } from "@/app/lib/catalog/load-catalog-from-db";

/**
 * Full catalog from Postgres (pooled `DATABASE_URL`). Invalidated via `revalidateTag("catalog", "default")`.
 */
export const getCatalogBundle = unstable_cache(
  loadCatalogFromDatabase,
  ["oilix-catalog-bundle-v1"],
  { tags: ["catalog"] },
);
