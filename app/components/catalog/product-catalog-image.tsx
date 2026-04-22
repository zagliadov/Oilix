import { frameAspectFromAspectClass } from "@/app/lib/ui/frame-aspect";
import { ProductImagePlaceholder } from "@/app/components/landing/product-image-placeholder";

type ProductCatalogImageProps = {
  imageUrl: string | undefined;
  alt: string;
  noImageLabel: string;
  className?: string;
  /** Frame ratio hint, e.g. `aspect-square` (1:1) or `aspect-[3/4]` (portrait). */
  aspectClassName?: string;
  imageClassName?: string;
};

/**
 * Product photo (same-origin `/api/blob/image` or placeholder).
 * Uses inline `aspect-ratio` so the frame always - has height (Tailwind `aspect-*` alone can be dropped from CSS).
 */
export const ProductCatalogImage = ({
  imageUrl,
  alt,
  noImageLabel,
  className = "",
  aspectClassName = "aspect-square",
  imageClassName,
}: ProductCatalogImageProps) => {
  const frameAspect = frameAspectFromAspectClass(aspectClassName);
  if (imageUrl === undefined || imageUrl === "") {
    return (
      <ProductImagePlaceholder
        label={noImageLabel}
        className={className}
        aspectClassName={aspectClassName}
        frameAspect={frameAspect}
      />
    );
  }
  return (
    <div
      className={`relative min-w-0 w-full overflow-hidden rounded-md border border-border bg-muted/20 dark:border-white/10 ${className}`}
      style={{ aspectRatio: frameAspect }}
    >
      {/* eslint-disable-next-line @next/next/no-img-element -- same-origin /api/blob/image */}
      <img
        src={imageUrl}
        alt={alt}
        className={`absolute inset-0 box-border h-full w-full object-contain object-center ${imageClassName ?? "p-2"}`}
        loading="lazy"
        decoding="async"
      />
    </div>
  );
};
