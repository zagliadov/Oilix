"use client";

import { useCallback, useEffect, useId, useState } from "react";

import { deleteProductAction } from "@/app/lib/admin/products/product-actions";

type DeleteProductButtonProps = {
  productId: string;
  productName: string;
};

export const DeleteProductButton = ({
  productId,
  productName,
}: DeleteProductButtonProps) => {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const titleId = useId();

  const onClose = useCallback(() => {
    setIsDialogOpen(false);
  }, []);

  useEffect(() => {
    if (!isDialogOpen) {
      return;
    }
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        onClose();
      }
    };
    window.addEventListener("keydown", onKeyDown);
    return () => {
      window.removeEventListener("keydown", onKeyDown);
    };
  }, [isDialogOpen, onClose]);

  useEffect(() => {
    if (!isDialogOpen) {
      return;
    }
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = previousOverflow;
    };
  }, [isDialogOpen]);

  return (
    <>
      <button
        type="button"
        onClick={() => {
          setIsDialogOpen(true);
        }}
        className="rounded-md border border-destructive/40 px-3 py-1.5 text-sm font-medium text-destructive transition hover:bg-destructive/10 dark:border-destructive/35"
      >
        Удалить
      </button>

      {isDialogOpen ? (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4"
          role="dialog"
          aria-modal="true"
          aria-labelledby={titleId}
        >
          <button
            type="button"
            className="absolute inset-0 bg-black/60"
            onClick={onClose}
            aria-label="Закрыть"
          />
          <div
            className="relative z-10 w-full max-w-md rounded-xl border border-border bg-background p-5 shadow-lg dark:border-white/12 dark:bg-zinc-950"
          >
            <h2 id={titleId} className="text-base font-semibold text-foreground">
              Удалить товар?
            </h2>
            <p className="mt-2 text-sm text-muted-foreground">
              «{productName}» ({productId}) будет удалён безвозвратно.
            </p>
            <div className="mt-5 flex flex-wrap items-center justify-end gap-3">
              <button
                type="button"
                onClick={onClose}
                className="rounded-md border border-border px-3 py-1.5 text-sm font-medium text-foreground transition hover:bg-muted/40 dark:border-white/15"
              >
                Отмена
              </button>
              <form action={deleteProductAction} className="inline">
                <input type="hidden" name="id" value={productId} />
                <button
                  type="submit"
                  className="inline-flex items-center justify-center rounded-md bg-destructive px-4 py-2 text-sm font-medium text-white transition hover:bg-destructive/90!"
                >
                  Удалить
                </button>
              </form>
            </div>
          </div>
        </div>
      ) : null}
    </>
  );
};
