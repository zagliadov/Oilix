import { getTranslations } from "next-intl/server";
import type { Metadata } from "next";

import { buildSegmentRouteMetadata } from "./page-metadata";

type StorefrontSectionNamespace =
  | "Catalog"
  | "Cart"
  | "Checkout"
  | "Delivery"
  | "PublicOffer"
  | "Returns";

/**
 * Metadata for main storefront routes: short tab segment + full title for Open Graph via `Metadata.pageTitle`.
 */
export const buildStorefrontSectionMetadata = async (
  namespace: StorefrontSectionNamespace,
  path: string,
): Promise<Metadata> => {
  const sectionTranslations = await getTranslations(namespace);
  const metadataTranslations = await getTranslations("Metadata");
  const segmentTitle = sectionTranslations("metaTitle");
  return buildSegmentRouteMetadata({
    segmentTitle,
    pageTitle: metadataTranslations("pageTitle", { segment: segmentTitle }),
    description: sectionTranslations("metaDescription"),
    path,
  });
};
