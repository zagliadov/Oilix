"use client";

import type { FormEvent } from "react";

import { deleteProductAction } from "@/app/lib/admin/products/product-actions";

type DeleteProductButtonProps = {
  productId: string;
};

export const DeleteProductButton = ({ productId }: DeleteProductButtonProps) => {
  const onConfirm = (event: FormEvent<HTMLFormElement>) => {
    if (!window.confirm(`Delete product "${productId}"? This cannot be undone.`)) {
      event.preventDefault();
    }
  };

  return (
    <form action={deleteProductAction} onSubmit={onConfirm}>
      <input type="hidden" name="id" value={productId} />
      <button
        type="submit"
        className="rounded-md border border-destructive/40 px-3 py-1.5 text-sm font-medium text-destructive transition hover:bg-destructive/10 dark:border-destructive/35"
      >
        Delete
      </button>
    </form>
  );
};
