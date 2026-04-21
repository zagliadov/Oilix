import type { ProductCardSpecContext } from "@/app/lib/catalog";

/** Works with `getTranslations("Landing")` (RSC) and `useTranslations("Landing")` (client). */
export const buildProductCardSpecContextFromLanding = (
  translateLanding: (key: string) => string,
): ProductCardSpecContext => ({
  volumeUnit: translateLanding("products.volumeUnit"),
  filterRoleLabel: (role) =>
    translateLanding(`products.filterRole.${role}`),
  freezePointUnitLabel: translateLanding("products.freezePointUnit"),
});
