import type { MetadataRoute } from "next";

import { getCatalogBundle } from "@/app/lib/catalog/load-catalog";
import { appLocales } from "@/app/lib/i18n/locales";
import { resolveSiteUrl } from "@/app/lib/seo/page-metadata";

const STATIC_PATHS: ReadonlyArray<{
  path: string;
  changeFrequency: MetadataRoute.Sitemap[number]["changeFrequency"];
  priority: number;
}> = [
  { path: "/", changeFrequency: "daily", priority: 1 },
  { path: "/catalog", changeFrequency: "daily", priority: 0.9 },
  { path: "/delivery", changeFrequency: "monthly", priority: 0.5 },
  { path: "/returns", changeFrequency: "monthly", priority: 0.5 },
  { path: "/public-offer", changeFrequency: "monthly", priority: 0.4 },
];

const toAbsoluteUrl = (siteUrl: string, path: string): string => {
  const normalizedPath = path.startsWith("/") ? path : `/${path}`;
  return `${siteUrl}${normalizedPath}`;
};

const toLocalizedPath = (path: string, locale: string): string => {
  if (path === "/") {
    return `/${locale}`;
  }
  return `/${locale}${path}`;
};

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const siteUrl = resolveSiteUrl() ?? "http://localhost:3000";
  const now = new Date();
  const catalogBundle = await getCatalogBundle();

  const staticPages: MetadataRoute.Sitemap = appLocales.flatMap((locale) =>
    STATIC_PATHS.map((page) => ({
      url: toAbsoluteUrl(siteUrl, toLocalizedPath(page.path, locale)),
      changeFrequency: page.changeFrequency,
      priority: page.priority,
      lastModified: now,
    })),
  );

  const productPages: MetadataRoute.Sitemap = appLocales.flatMap((locale) =>
    catalogBundle.products.map((product) => ({
      url: toAbsoluteUrl(siteUrl, `/${locale}/product/${product.id}`),
      changeFrequency: "weekly",
      priority: 0.8,
      lastModified: product.updatedAt ?? product.createdAt ?? now.toISOString(),
    })),
  );

  return [...staticPages, ...productPages];
}
