import catalogJson from "@/data/catalog.json";

export type CatalogProduct = {
  id: string;
  brand: string;
  name: string;
  viscosity: string;
  volumeLiters: number;
  priceUah: number;
};

export const catalogProducts: CatalogProduct[] = catalogJson as CatalogProduct[];

export const getCatalogProductById = (
  id: string,
): CatalogProduct | undefined =>
  catalogProducts.find((product) => product.id === id);
