import * as _ from "lodash";

import { getEffectivePriceUah } from "@/app/lib/catalog";
import type { StoreProduct } from "@/app/lib/catalog/types/product";

import type { CartLine } from "./cart-types";

/** Subtotal for one cart line (effective unit price × quantity). */
export const getCartLineSubtotalUah = (
  product: StoreProduct,
  quantity: number,
): number => getEffectivePriceUah(product) * quantity;

type ProductResolver = (productId: string) => StoreProduct | undefined;

/** Cart total in ₴ for valid catalog lines only. */
export const getCartSubtotalUahFromLines = (
  lines: readonly CartLine[],
  getProduct: ProductResolver,
): number =>
  _.sumBy(lines, (line) => {
    const product = getProduct(line.productId);
    if (!product) {
      return 0;
    }
    return getCartLineSubtotalUah(product, line.quantity);
  });
