"use client";

import { createContext, useMemo, type ReactNode } from "react";

import type { CatalogBundle, CatalogIndexes } from "@/app/lib/catalog/bundle";
import { buildCatalogIndexes } from "@/app/lib/catalog/indexes";

const StorefrontCatalogContext = createContext<CatalogIndexes | null>(null);

type StorefrontCatalogProviderProps = {
  bundle: CatalogBundle;
  children: ReactNode;
};

/**
 * Injects the latest catalog (Postgres) from the server so cart/checkout can resolve `productId`.
 */
export const StorefrontCatalogProvider = ({
  bundle,
  children,
}: StorefrontCatalogProviderProps) => {
  const value = useMemo(
    () => buildCatalogIndexes(bundle),
    [bundle],
  );

  return (
    <StorefrontCatalogContext.Provider value={value}>
      {children}
    </StorefrontCatalogContext.Provider>
  );
};

export { StorefrontCatalogContext };
