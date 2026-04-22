import * as _ from "lodash";

import type { CartLine } from "@/app/lib/cart/cart-types";
import { getCartLineSubtotalUah } from "@/app/lib/cart/cart-line-price";
import type { StoreProduct } from "@/app/lib/catalog/types/product";

import type {
  CheckoutFormValues,
  CheckoutPayloadLine,
  CheckoutSubmitPayload,
} from "./types";

type ProductResolver = (productId: string) => StoreProduct | undefined;

export const buildCheckoutSubmitPayload = (
  formValues: CheckoutFormValues,
  cartLines: readonly CartLine[],
  getProduct: ProductResolver,
): CheckoutSubmitPayload | null => {
  if (
    formValues.deliveryMethod === "" ||
    formValues.paymentMethod === ""
  ) {
    return null;
  }

  const resolvedLines: CheckoutPayloadLine[] = _.compact(
    _.map(cartLines, (line) => {
      const product = getProduct(line.productId);
      if (!product) {
        return null;
      }
      return {
        productId: line.productId,
        quantity: line.quantity,
        productName: product.name,
        lineTotalUah: getCartLineSubtotalUah(product, line.quantity),
      };
    }),
  );

  if (resolvedLines.length === 0) {
    return null;
  }

  const totalUah = _.sumBy(resolvedLines, (line) => line.lineTotalUah);

  const comment = formValues.comment.trim();

  return {
    customer: {
      name: formValues.customerName.trim(),
      phone: formValues.phone.trim(),
      email: formValues.email.trim(),
      city: formValues.city.trim(),
    },
    deliveryMethod: formValues.deliveryMethod,
    paymentMethod: formValues.paymentMethod,
    comment: comment === "" ? null : comment,
    lines: resolvedLines,
    totalUah,
    clientSubmittedAt: new Date().toISOString(),
    cartLines: [...cartLines],
  };
};
