import type { BrandId } from "./shared";

/** Brand catalog entry — future: GET /brands, CMS, or join on product list. */
export type Brand = {
  id: BrandId;
  /** URL-safe handle */
  slug: string;
  /** Display name */
  name: string;
};
