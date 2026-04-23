import * as _ from "lodash";

import type { CartLine } from "@/app/lib/cart/cart-types";
import { getCartLineSubtotalUah } from "@/app/lib/cart/cart-line-price";
import type { StoreProduct } from "@/app/lib/catalog/types/product";

import type {
  CheckoutFormValues,
  CheckoutPayloadLine,
  CheckoutNovaPoshtaDetails,
  CheckoutSubmitPayload,
} from "./types";

type ProductResolver = (productId: string) => StoreProduct | undefined;

type BuildCheckoutOptions = {
  npApiConfigured: boolean;
};

export const buildCheckoutSubmitPayload = (
  formValues: CheckoutFormValues,
  cartLines: readonly CartLine[],
  getProduct: ProductResolver,
  options: BuildCheckoutOptions,
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

  let novaPoshta: CheckoutNovaPoshtaDetails | undefined;
  if (formValues.deliveryMethod === "nova_poshta") {
    if (options.npApiConfigured) {
      novaPoshta = {
        source: "api",
        cityRef: formValues.npCityRef.trim(),
        cityName: formValues.npCityName.trim(),
        warehouseRef: formValues.npWarehouseRef.trim(),
        warehouseName: formValues.npWarehouseName.trim(),
      };
    } else {
      novaPoshta = {
        source: "manual",
        branchDescription: formValues.npBranchManual.trim(),
      };
    }
  }

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
    ...(novaPoshta !== undefined ? { novaPoshta } : {}),
  };
};
