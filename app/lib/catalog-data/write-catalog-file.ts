import "server-only";

import { rename, writeFile } from "node:fs/promises";
import path from "node:path";

import type { CatalogBundle } from "@/app/lib/catalog/bundle";

import { CATALOG_JSON_RELATIVE_PATH } from "./constants";

const serializeCatalogBundle = (bundle: CatalogBundle): string =>
  `${JSON.stringify(bundle, null, 2)}\n`;

/**
 * Writes the full catalog bundle atomically (write temp file → rename).
 * Server-only; keeps mock file as single source on disk for admin + future API.
 */
export const writeCatalogBundleToFile = async (bundle: CatalogBundle): Promise<void> => {
  const targetPath = path.join(process.cwd(), CATALOG_JSON_RELATIVE_PATH);
  const tempPath = `${targetPath}.tmp.${process.pid}.${Date.now()}`;
  const payload = serializeCatalogBundle(bundle);
  await writeFile(tempPath, payload, "utf8");
  await rename(tempPath, targetPath);
};
