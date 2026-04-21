import "server-only";

import { readFile } from "node:fs/promises";
import path from "node:path";

import type { CatalogBundle } from "@/app/lib/catalog/bundle";

import { CATALOG_JSON_RELATIVE_PATH } from "./constants";

const isCatalogBundleShape = (value: unknown): value is CatalogBundle => {
  if (value === null || typeof value !== "object") {
    return false;
  }
  const record = value as Record<string, unknown>;
  return (
    Array.isArray(record.brands) &&
    Array.isArray(record.categories) &&
    Array.isArray(record.products)
  );
};

/**
 * Reads and parses `data/catalog.json` from the filesystem (server-only).
 * Use this from Server Components, Route Handlers, and Server Actions — not from client components.
 */
export const readCatalogBundleFromFile = async (): Promise<CatalogBundle> => {
  const absolutePath = path.join(process.cwd(), CATALOG_JSON_RELATIVE_PATH);
  const raw = await readFile(absolutePath, "utf8");
  const parsed: unknown = JSON.parse(raw);
  if (!isCatalogBundleShape(parsed)) {
    throw new Error("Invalid catalog JSON: expected brands, categories, and products arrays.");
  }
  return parsed;
};
