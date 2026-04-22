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
};

export default withNextIntl(nextConfig);
