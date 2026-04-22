import "server-only";

import { getCatalogBundle } from "@/app/lib/catalog/load-catalog";

/**
 * @deprecated Use `getCatalogBundle` from `@/app/lib/catalog/load-catalog` — name kept for admin imports.
 * Catalog is loaded only from Postgres.
 */
export const readCatalogBundleFromFile = getCatalogBundle;
