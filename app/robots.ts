import type { MetadataRoute } from "next";

import { appLocales } from "@/app/lib/i18n/locales";
import { resolveSiteUrl } from "@/app/lib/seo/page-metadata";

export default function robots(): MetadataRoute.Robots {
  const siteUrl = resolveSiteUrl() ?? "http://localhost:3000";
  const localizedAdminPaths = appLocales.map((locale) => `/${locale}/admin`);

  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        disallow: ["/admin", ...localizedAdminPaths],
      },
    ],
    sitemap: `${siteUrl}/sitemap.xml`,
    host: siteUrl,
  };
}
