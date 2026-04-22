import path from "node:path";
import { fileURLToPath } from "node:url";

import type { NextConfig } from "next";
import createNextIntlPlugin from "next-intl/plugin";

const withNextIntl = createNextIntlPlugin();

const projectRoot = path.dirname(fileURLToPath(import.meta.url));

const nextConfig: NextConfig = {
  // Pin Turbopack root when another lockfile exists above this repo (e.g. in $HOME)
  turbopack: {
    root: projectRoot,
  },
  // Default is 1MB; admin product image upload allows up to 4MB in the action body.
  experimental: {
    serverActions: {
      bodySizeLimit: "5mb",
    },
  },
  // Next 16 narrows allowed `quality` values; keep defaults + custom values we actually use.
  images: {
    qualities: [75, 100],
  },
};

export default withNextIntl(nextConfig);
