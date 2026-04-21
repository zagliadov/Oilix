/**
 * Relative path from project root to the catalog JSON (mock source of truth on disk).
 * Admin and future migration code use fs; storefront continues to use the bundled import in `app/lib/catalog/bundle.ts`.
 */
export const CATALOG_JSON_RELATIVE_PATH = "data/catalog.json" as const;
