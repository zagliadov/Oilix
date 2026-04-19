export type CatalogProduct = {
  id: string;
  brand: string;
  name: string;
  viscosity: string;
  volumeLiters: number;
  priceUah: number;
};

export const catalogProducts: CatalogProduct[] = [
  {
    id: "1",
    brand: "Castrol",
    name: "EDGE Titanium FST",
    viscosity: "5W-30",
    volumeLiters: 4,
    priceUah: 1299,
  },
  {
    id: "2",
    brand: "Mobil",
    name: "1 ESP x2",
    viscosity: "5W-30",
    volumeLiters: 5,
    priceUah: 2199,
  },
  {
    id: "3",
    brand: "Shell",
    name: "Helix Ultra ECT",
    viscosity: "5W-40",
    volumeLiters: 4,
    priceUah: 1549,
  },
  {
    id: "4",
    brand: "Liqui Moly",
    name: "Top Tec 4200",
    viscosity: "5W-30",
    volumeLiters: 5,
    priceUah: 2399,
  },
  {
    id: "5",
    brand: "Motul",
    name: "8100 X-cess",
    viscosity: "5W-40",
    volumeLiters: 5,
    priceUah: 2699,
  },
  {
    id: "6",
    brand: "TotalEnergies",
    name: "Quartz Ineo MC3",
    viscosity: "5W-30",
    volumeLiters: 4,
    priceUah: 1199,
  },
  {
    id: "7",
    brand: "Valvoline",
    name: "SynPower MST",
    viscosity: "5W-30",
    volumeLiters: 4,
    priceUah: 1399,
  },
  {
    id: "8",
    brand: "Petronas",
    name: "Syntium 7000 E",
    viscosity: "5W-30",
    volumeLiters: 4,
    priceUah: 1349,
  },
  {
    id: "9",
    brand: "Elf",
    name: "Evolution Full-Tech FE",
    viscosity: "5W-30",
    volumeLiters: 4,
    priceUah: 1099,
  },
  {
    id: "10",
    brand: "Mannol",
    name: "Energy Combi LL",
    viscosity: "5W-30",
    volumeLiters: 4,
    priceUah: 899,
  },
  {
    id: "11",
    brand: "Castrol",
    name: "Magnatec A5",
    viscosity: "5W-30",
    volumeLiters: 4,
    priceUah: 999,
  },
  {
    id: "12",
    brand: "Shell",
    name: "Helix HX8 ECT",
    viscosity: "5W-40",
    volumeLiters: 4,
    priceUah: 949,
  },
  {
    id: "13",
    brand: "Mobil",
    name: "Super 3000 X1",
    viscosity: "5W-40",
    volumeLiters: 4,
    priceUah: 849,
  },
  {
    id: "14",
    brand: "Liqui Moly",
    name: "Molygen New Generation",
    viscosity: "5W-40",
    volumeLiters: 5,
    priceUah: 1899,
  },
  {
    id: "15",
    brand: "Motul",
    name: "8100 Eco-nergy",
    viscosity: "5W-30",
    volumeLiters: 5,
    priceUah: 2299,
  },
  {
    id: "16",
    brand: "TotalEnergies",
    name: "Quartz 9000 Energy",
    viscosity: "0W-30",
    volumeLiters: 4,
    priceUah: 1449,
  },
  {
    id: "17",
    brand: "Valvoline",
    name: "Restore & Protect",
    viscosity: "5W-30",
    volumeLiters: 4,
    priceUah: 1599,
  },
  {
    id: "18",
    brand: "Castrol",
    name: "GTX Ultraclean",
    viscosity: "10W-40",
    volumeLiters: 4,
    priceUah: 649,
  },
  {
    id: "19",
    brand: "Shell",
    name: "Helix Ultra Professional AV-L",
    viscosity: "0W-30",
    volumeLiters: 5,
    priceUah: 1999,
  },
  {
    id: "20",
    brand: "Liqui Moly",
    name: "Special Tec AA",
    viscosity: "5W-20",
    volumeLiters: 4,
    priceUah: 1699,
  },
];

export const getCatalogProductById = (
  id: string,
): CatalogProduct | undefined =>
  catalogProducts.find((product) => product.id === id);
