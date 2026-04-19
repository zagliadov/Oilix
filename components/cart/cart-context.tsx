"use client";

import * as _ from "lodash";
import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";

import { CART_STORAGE_KEY, type CartLine } from "@/app/lib/cart/cart-types";
import { getCatalogProductById } from "@/app/lib/mocks/catalog-products";

type CartContextValue = {
  lines: CartLine[];
  isReady: boolean;
  totalQuantity: number;
  totalPriceUah: number;
  addProduct: (productId: string, quantity?: number) => void;
  setLineQuantity: (productId: string, quantity: number) => void;
  removeLine: (productId: string) => void;
  clearCart: () => void;
};

const CartContext = createContext<CartContextValue | null>(null);

const parseStoredLines = (raw: string | null): CartLine[] => {
  if (!raw) {
    return [];
  }
  try {
    const parsed: unknown = JSON.parse(raw);
    if (!Array.isArray(parsed)) {
      return [];
    }
    return _.compact(
      _.map(parsed, (entry) => {
        if (
          entry &&
          typeof entry === "object" &&
          "productId" in entry &&
          "quantity" in entry &&
          typeof (entry as CartLine).productId === "string" &&
          typeof (entry as CartLine).quantity === "number"
        ) {
          const productId = (entry as CartLine).productId;
          if (!getCatalogProductById(productId)) {
            return null;
          }
          const quantity = Math.floor((entry as CartLine).quantity);
          if (quantity < 1) {
            return null;
          }
          return {
            productId,
            quantity: Math.min(quantity, 999),
          };
        }
        return null;
      }),
    );
  } catch {
    return [];
  }
};

export const CartProvider = ({ children }: { children: ReactNode }) => {
  const [lines, setLines] = useState<CartLine[]>([]);
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    if (typeof window === "undefined") {
      return;
    }
    // Hydrate from localStorage after mount (SSR-safe default []).
    queueMicrotask(() => {
      setLines(parseStoredLines(localStorage.getItem(CART_STORAGE_KEY)));
      setIsReady(true);
    });
  }, []);

  useEffect(() => {
    if (!isReady || typeof window === "undefined") {
      return;
    }
    if (lines.length === 0) {
      localStorage.removeItem(CART_STORAGE_KEY);
      return;
    }
    localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(lines));
  }, [lines, isReady]);

  const addProduct = useCallback((productId: string, quantity: number = 1) => {
    const addAmount = Math.max(1, Math.min(999, Math.floor(quantity)));
    setLines((previous) => {
      const existing = _.find(previous, (line) => line.productId === productId);
      if (!existing) {
        return [...previous, { productId, quantity: addAmount }];
      }
      return _.map(previous, (line) =>
        line.productId === productId
          ? {
              ...line,
              quantity: Math.min(999, line.quantity + addAmount),
            }
          : line,
      );
    });
  }, []);

  const setLineQuantity = useCallback((productId: string, quantity: number) => {
    const nextQuantity = Math.floor(quantity);
    if (nextQuantity < 1) {
      setLines((previous) =>
        _.filter(previous, (line) => line.productId !== productId),
      );
      return;
    }
    setLines((previous) => {
      const capped = Math.min(999, nextQuantity);
      const existing = _.find(previous, (line) => line.productId === productId);
      if (!existing) {
        return [...previous, { productId, quantity: capped }];
      }
      return _.map(previous, (line) =>
        line.productId === productId ? { ...line, quantity: capped } : line,
      );
    });
  }, []);

  const removeLine = useCallback((productId: string) => {
    setLines((previous) =>
      _.filter(previous, (line) => line.productId !== productId),
    );
  }, []);

  const clearCart = useCallback(() => {
    setLines([]);
  }, []);

  const totalQuantity = useMemo(
    () =>
      _.sumBy(
        _.filter(lines, (line) => Boolean(getCatalogProductById(line.productId))),
        (line) => line.quantity,
      ),
    [lines],
  );

  const totalPriceUah = useMemo(
    () =>
      _.sumBy(lines, (line) => {
        const product = getCatalogProductById(line.productId);
        if (!product) {
          return 0;
        }
        return product.priceUah * line.quantity;
      }),
    [lines],
  );

  const value = useMemo(
    () => ({
      lines,
      isReady,
      totalQuantity,
      totalPriceUah,
      addProduct,
      setLineQuantity,
      removeLine,
      clearCart,
    }),
    [
      lines,
      isReady,
      totalQuantity,
      totalPriceUah,
      addProduct,
      setLineQuantity,
      removeLine,
      clearCart,
    ],
  );

  return (
    <CartContext.Provider value={value}>{children}</CartContext.Provider>
  );
};

export const useCart = (): CartContextValue => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error("useCart must be used within CartProvider");
  }
  return context;
};
