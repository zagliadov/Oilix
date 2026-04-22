import "dotenv/config";
import { readFile } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

import { config } from "dotenv";
import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";

import type { CatalogBundle } from "../app/lib/catalog/bundle";
import { toProductInsert } from "../app/lib/catalog/persist-store-product-to-db";
import { brands, categories, products } from "../app/lib/db/schema";
import { SEED_CATALOG_RELATIVE_PATH } from "../app/lib/catalog-data/constants";

const projectRoot = path.join(path.dirname(fileURLToPath(import.meta.url)), "..");

config({ path: path.join(projectRoot, ".env.local") });
config();

const isCatalogShape = (value: unknown): value is CatalogBundle => {
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

const run = async (): Promise<void> => {
  const directUrl = process.env.DATABASE_URL_UNPOOLED ?? process.env.DATABASE_URL;
  if (directUrl === undefined || directUrl === "") {
    throw new Error("Set DATABASE_URL_UNPOOLED (or DATABASE_URL) for the seed script.");
  }

  const catalogPath = path.join(projectRoot, SEED_CATALOG_RELATIVE_PATH);
  const raw = await readFile(catalogPath, "utf8");
  const parsed: unknown = JSON.parse(raw);
  if (!isCatalogShape(parsed)) {
    throw new Error("Invalid catalog JSON.");
  }
  const bundle = parsed;

  const client = postgres(directUrl, { max: 1 });
  const db = drizzle(client, { schema: { brands, categories, products } });

  try {
    await client`
      TRUNCATE TABLE
        product_images,
        products,
        categories,
        brands
      RESTART IDENTITY CASCADE
    `;

    await db.insert(brands).values(
      bundle.brands.map((brand) => ({
        id: brand.id,
        slug: brand.slug,
        name: brand.name,
      })),
    );

    await db.insert(categories).values(
      bundle.categories.map((category) => ({
        id: category.id,
        slug: category.slug,
        name: category.name,
        primaryKind: category.primaryKind,
      })),
    );

    const now = new Date();
    for (const product of bundle.products) {
      await db.insert(products).values(toProductInsert(product, now));
    }
  } finally {
    await client.end({ timeout: 5 });
  }

  console.info(
    `Seeded: ${bundle.brands.length} brands, ${bundle.categories.length} categories, ${bundle.products.length} products.`,
  );
};

void run().catch((error: unknown) => {
  console.error(error);
  process.exit(1);
});
