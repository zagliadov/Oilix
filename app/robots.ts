import type { MetadataRoute } from "next";

import { resolveSiteUrl } from "@/app/lib/seo/page-metadata";

export default function robots(): MetadataRoute.Robots {
  const siteUrl = resolveSiteUrl() ?? "http://localhost:3000";

  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        disallow: ["/admin", "/api"],
      },
    ],
    sitemap: `${siteUrl}/sitemap.xml`,
    host: siteUrl,
  };
}
