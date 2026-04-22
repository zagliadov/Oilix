"use client";

import { useContext } from "react";

import type { CatalogIndexes } from "@/app/lib/catalog";

import { StorefrontCatalogContext } from "./storefront-catalog-provider";

export const useStorefrontCatalog = (): CatalogIndexes => {
  const context = useContext(StorefrontCatalogContext);
  if (context === null) {
    throw new Error(
      "useStorefrontCatalog must be used within StorefrontCatalogProvider",
    );
  }
  return context;
};
