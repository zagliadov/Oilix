"use client";

import {
  useActionState,
  useCallback,
  useEffect,
  useId,
  useMemo,
  useState,
} from "react";
import { useRouter } from "next/navigation";

import {
  type ProductImageDeleteState,
  type ProductImageUploadState,
  deleteProductImageAction,
  uploadProductImageAction,
} from "@/app/lib/admin/products/product-image-actions";
import {
  storefrontButtonPrimary,
  storefrontButtonPrimaryPaddingCompact,
  storefrontButtonSecondary,
  storefrontButtonSecondaryPadding,
} from "@/components/ui/storefront";

const initial: ProductImageUploadState = { ok: true };

const initialDelete: ProductImageDeleteState = { ok: true };

const textInputClass =
  "w-full rounded-md border border-border bg-background px-3 py-2.5 text-base text-foreground outline-none focus-visible:border-brand/40 focus-visible:ring-2 focus-visible:ring-brand/25 dark:border-white/12 dark:bg-white/3";

const labelClass = "text-sm font-medium text-foreground";

const fileFieldClass =
  "flex min-h-11 w-full max-w-xl items-center gap-3 rounded-lg border border-border bg-background px-3 py-2 outline-none focus-within:border-brand/40 focus-within:ring-2 focus-within:ring-brand/25 dark:border-white/12 dark:bg-white/3";

type ProductImageUploadBlockProps = {
  productId: string;
  blobConfigured: boolean;
  images: readonly {
    id: number;
    url: string;
    alt: string | null;
    isPrimary: boolean;
  }[];
};

/**
 * Same-origin relative paths must stay relative so the browser uses the page host
 * (localhost vs 127.0.0.1). Forcing http://localhost broke `img` when the tab is 127.0.0.1.
 */
const resolveImageSrc = (url: string): string => {
  if (url.startsWith("http://") || url.startsWith("https://")) {
    return url;
  }
  if (url.startsWith("/")) {
    return url;
  }
  return `/${url}`;
};

export const ProductImageUploadBlock = ({
  productId,
  blobConfigured,
  images,
}: ProductImageUploadBlockProps) => {
  const router = useRouter();
  const [state, formAction, isPending] = useActionState(
    uploadProductImageAction,
    initial,
  );
  const [deleteState, deleteFormAction, isDeletePending] = useActionState(
    deleteProductImageAction,
    initialDelete,
  );
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [selectedFileName, setSelectedFileName] = useState<string | null>(null);
  const fileInputId = useId();
  const altInputId = useId();
  const deleteDialogTitleId = useId();

  const onCloseDeleteDialog = useCallback(() => {
    setIsDeleteDialogOpen(false);
  }, []);
  const chooseFileButtonClass =
    `${storefrontButtonSecondary} shrink-0 cursor-pointer rounded-md border px-3.5 py-2 text-sm font-medium ` +
    "disabled:cursor-not-allowed disabled:opacity-60";

  useEffect(() => {
    if (state.uploaded === true) {
      router.refresh();
    }
  }, [state.uploaded, router]);

  useEffect(() => {
    if (deleteState.deleted === true) {
      setIsDeleteDialogOpen(false);
      router.refresh();
    }
  }, [deleteState.deleted, router]);

  useEffect(() => {
    if (!isDeleteDialogOpen) {
      return;
    }
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        onCloseDeleteDialog();
      }
    };
    window.addEventListener("keydown", onKeyDown);
    return () => {
      window.removeEventListener("keydown", onKeyDown);
    };
  }, [isDeleteDialogOpen, onCloseDeleteDialog]);

  useEffect(() => {
    if (!isDeleteDialogOpen) {
      return;
    }
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = previousOverflow;
    };
  }, [isDeleteDialogOpen]);

  const displayImages = useMemo(() => {
    if (images.length > 0) {
      return [...images];
    }
    if (state.savedImage !== undefined) {
      return [state.savedImage];
    }
    return [];
  }, [images, state.savedImage]);

  const firstImageForForm = displayImages[0];

  return (
    <div className="space-y-6">
      {displayImages.length > 0 ? (
        <ul className="grid w-full max-w-md gap-3">
          {displayImages.map((image) => (
            <li
              key={image.id}
              className="overflow-hidden rounded-xl border border-border dark:border-white/12"
            >
              <div className="border-b border-border bg-muted/30 dark:border-white/10">
                <p className="px-2 py-1.5 text-xs font-medium text-foreground">Текущее фото</p>
                <p className="px-2 pb-1.5 text-xs text-muted-foreground">
                  Alt в базе:{" "}
                  {image.alt !== null && image.alt !== "" ? image.alt : "— (не задано)"}
                </p>
              </div>
              {/* Checkerboard + flex so the image is not collapsed (absolute + 0 intrinsic size). */}
              <div className="relative w-full border-t border-border bg-[repeating-conic-gradient(#e4e4e7_0%_25%,#fafafa_0%_50%)] bg-size-[20px_20px] dark:border-white/10 dark:bg-[repeating-conic-gradient(#3f3f46_0%_25%,#27272a_0%_50%)] dark:bg-size-[20px_20px]">
                <div className="flex min-h-64 w-full items-center justify-center p-2 sm:min-h-72">
                  {/* eslint-disable-next-line @next/next/no-img-element -- app blob proxy or same-origin path */}
                  <img
                    src={resolveImageSrc(image.url)}
                    alt={image.alt ?? "Фото товара"}
                    className="h-auto max-h-72 w-auto max-w-full object-contain drop-shadow-sm sm:max-h-80"
                    loading="eager"
                    decoding="async"
                  />
                </div>
                {image.isPrimary ? (
                  <span className="absolute left-3 top-3 z-10 rounded bg-foreground/90 px-2 py-0.5 text-xs font-medium text-background">
                    Основное
                  </span>
                ) : null}
              </div>
            </li>
          ))}
        </ul>
      ) : (
        <p className="text-sm text-muted-foreground">
          Для этого товара ещё нет фото. После загрузки превью появится здесь.
        </p>
      )}

      {displayImages.length > 0 ? (
        <button
          type="button"
          disabled={isDeletePending || isPending}
          onClick={() => {
            setIsDeleteDialogOpen(true);
          }}
          className={
            `${storefrontButtonSecondary} ${storefrontButtonSecondaryPadding} text-sm ` +
            "border-destructive/40 text-destructive hover:bg-destructive/10 dark:border-destructive/35"
          }
        >
          Удалить фото
        </button>
      ) : null}

      {isDeleteDialogOpen ? (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4"
          role="dialog"
          aria-modal="true"
          aria-labelledby={deleteDialogTitleId}
        >
          <button
            type="button"
            className="absolute inset-0 bg-black/60"
            onClick={onCloseDeleteDialog}
            aria-label="Закрыть"
          />
          <div className="relative z-10 w-full max-w-md rounded-xl border border-border bg-background p-5 shadow-lg dark:border-white/12 dark:bg-zinc-950">
            <h2
              id={deleteDialogTitleId}
              className="text-base font-semibold text-foreground"
            >
              Удалить фото?
            </h2>
            <p className="mt-2 text-sm text-muted-foreground">
              Файл в хранилище и запись в базе будут удалены. Позже можно загрузить другое
              изображение.
            </p>
            {deleteState.ok === false && deleteState.error !== undefined ? (
              <p className="mt-3 text-sm text-destructive" role="alert">
                {deleteState.error}
              </p>
            ) : null}
            <div className="mt-5 flex flex-wrap items-center justify-end gap-3">
              <button
                type="button"
                onClick={onCloseDeleteDialog}
                className="rounded-md border border-border px-3 py-1.5 text-sm font-medium text-foreground transition hover:bg-muted/40 dark:border-white/15"
              >
                Отмена
              </button>
              <form action={deleteFormAction} className="inline">
                <input type="hidden" name="productId" value={productId} />
                <button
                  type="submit"
                  disabled={isDeletePending || isPending}
                  className="inline-flex items-center justify-center rounded-md bg-destructive px-4 py-2 text-sm font-medium text-white transition hover:bg-destructive/90!"
                >
                  {isDeletePending ? "Удаление…" : "Удалить фото"}
                </button>
              </form>
            </div>
          </div>
        </div>
      ) : null}

      <div className="rounded-xl border border-dashed border-border/80 bg-muted/5 p-4 dark:border-white/15 dark:bg-white/2">
        {blobConfigured ? (
          <form action={formAction} className="space-y-4">
            <input type="hidden" name="productId" value={productId} />
            <div className="space-y-2">
              <div className={labelClass}>Добавить изображение</div>
              <p className="text-xs text-muted-foreground">
                JPEG, PNG, WebP, GIF или SVG · до 4&nbsp;МБ · заменяет текущее фото
              </p>
              <div className={fileFieldClass}>
                <input
                  id={fileInputId}
                  name="file"
                  type="file"
                  accept="image/jpeg,image/png,image/webp,image/gif,image/svg+xml"
                  className="sr-only"
                  disabled={isPending}
                  required
                  onChange={(event) => {
                    const file = event.target.files?.[0];
                    setSelectedFileName(
                      file !== undefined && file.name !== "" ? file.name : null,
                    );
                  }}
                  aria-label="Выбрать файл изображения"
                />
                <label htmlFor={fileInputId} className={chooseFileButtonClass}>
                  Выбрать файл
                </label>
                <span
                  className="min-w-0 flex-1 truncate text-sm text-muted-foreground"
                  title={selectedFileName ?? undefined}
                >
                  {selectedFileName ?? "Файл не выбран"}
                </span>
              </div>
            </div>
            <div className="space-y-1.5">
              <label htmlFor={altInputId} className={labelClass}>
                Alt-текст (необязательно)
              </label>
              <input
                key={firstImageForForm !== undefined ? `alt-${firstImageForForm.id}` : "alt-new"}
                id={altInputId}
                name="alt"
                type="text"
                className={textInputClass}
                defaultValue={firstImageForForm?.alt ?? ""}
                disabled={isPending}
                maxLength={500}
                placeholder="Кратко для скринридеров"
              />
            </div>
            {state.ok === false && state.error !== undefined ? (
              <p className="text-sm text-destructive" role="alert">
                {state.error}
              </p>
            ) : null}
            {state.uploaded === true && state.savedImage === undefined && images.length === 0 ? (
              <p className="text-sm text-muted-foreground" role="status">
                Изображение сохранено. Обновляем превью…
              </p>
            ) : null}
            <div>
              <button
                type="submit"
                className={
                  storefrontButtonPrimary + " " + storefrontButtonPrimaryPaddingCompact
                }
                disabled={isPending}
              >
                {isPending ? "Загрузка…" : "Загрузить изображение"}
              </button>
            </div>
          </form>
        ) : (
          <p className="text-sm text-muted-foreground">
            Укажите BLOB_READ_WRITE_TOKEN в окружении, чтобы включить загрузку в Vercel Blob.
          </p>
        )}
      </div>
    </div>
  );
};
