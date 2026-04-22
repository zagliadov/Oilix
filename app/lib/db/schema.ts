import {
  boolean,
  bigserial,
  index,
  integer,
  jsonb,
  pgTable,
  smallint,
  text,
  timestamp,
} from "drizzle-orm/pg-core";

export const brands = pgTable("brands", {
  id: text("id").primaryKey(),
  slug: text("slug").notNull().unique(),
  name: text("name").notNull(),
  createdAt: timestamp("created_at", { withTimezone: true })
    .notNull()
    .defaultNow(),
  updatedAt: timestamp("updated_at", { withTimezone: true })
    .notNull()
    .defaultNow(),
});

export const categories = pgTable("categories", {
  id: text("id").primaryKey(),
  slug: text("slug").notNull().unique(),
  name: text("name").notNull(),
  primaryKind: text("primary_kind").notNull(),
  createdAt: timestamp("created_at", { withTimezone: true })
    .notNull()
    .defaultNow(),
  updatedAt: timestamp("updated_at", { withTimezone: true })
    .notNull()
    .defaultNow(),
});

export const products = pgTable(
  "products",
  {
    id: text("id").primaryKey(),
    brandId: text("brand_id")
      .notNull()
      .references(() => brands.id, { onDelete: "restrict" }),
    categoryId: text("category_id")
      .notNull()
      .references(() => categories.id, { onDelete: "restrict" }),
    name: text("name").notNull(),
    kind: text("kind").notNull(),
    priceUah: integer("price_uah").notNull(),
    promoDiscountPercent: smallint("promo_discount_percent"),
    inStock: boolean("in_stock").notNull(),
    article: text("article"),
    description: text("description"),
    details: jsonb("details").$type<Record<string, unknown>>().notNull(),
    createdAt: timestamp("created_at", { withTimezone: true })
      .notNull()
      .defaultNow(),
    updatedAt: timestamp("updated_at", { withTimezone: true })
      .notNull()
      .defaultNow(),
  },
  (table) => [index("products_brand_id_idx").on(table.brandId), index("products_category_id_idx").on(table.categoryId), index("products_kind_idx").on(table.kind)],
);

export const productImages = pgTable(
  "product_images",
  {
    id: bigserial("id", { mode: "number" }).primaryKey(),
    productId: text("product_id")
      .notNull()
      .references(() => products.id, { onDelete: "cascade" }),
    url: text("url").notNull(),
    alt: text("alt"),
    sortOrder: smallint("sort_order").notNull().default(0),
    isPrimary: boolean("is_primary").notNull().default(false),
    createdAt: timestamp("created_at", { withTimezone: true })
      .notNull()
      .defaultNow(),
  },
  (table) => [index("product_images_product_id_idx").on(table.productId)],
);
