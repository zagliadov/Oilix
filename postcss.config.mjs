import path from "node:path";
import { fileURLToPath } from "node:url";

// Pin `base` to the project dir so `@tailwindcss/postcss` resolves `@import "tailwindcss"`
// from this repo even when cwd / NFT tracing sends the issuer one level up.
const projectRoot = path.dirname(fileURLToPath(import.meta.url));

const config = {
  plugins: {
    "@tailwindcss/postcss": {
      base: projectRoot,
    },
  },
};

export default config;
