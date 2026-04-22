import { frameAspectFromAspectClass } from "@/app/lib/ui/frame-aspect";

type ProductImagePlaceholderProps = {
  label: string;
  className?: string;
  /** Hint for aspect, e.g. `aspect-[3/4]`. */
  aspectClassName?: string;
  /** When set, skips recomputing (same as `frameAspectFromAspectClass(aspectClassName)`). */
  frameAspect?: string;
};

/**
 * `public/no_image.png` is a combined asset: [light | dark] side by side. The inner strip is
 * 200% of the frame width; in `.dark` we shift by 50% of that strip so the right (dark) tile shows.
 */
export const ProductImagePlaceholder = ({
  label,
  className = "",
  aspectClassName = "aspect-square",
  frameAspect: frameAspectProp,
}: ProductImagePlaceholderProps) => {
  const frameAspect = frameAspectProp ?? frameAspectFromAspectClass(aspectClassName);
  return (
    <div
      className={`relative min-w-0 w-full overflow-hidden rounded-md border border-border ${className}`}
      style={{ aspectRatio: frameAspect }}
    >
      <div className="absolute inset-0 overflow-hidden">
        <div
          className="relative h-full w-[200%] transition-transform duration-200 ease-out will-change-transform dark:-translate-x-1/2"
        >
          {/* eslint-disable-next-line @next/next/no-img-element -- /public no_image: dual-theme sprite */}
          <img
            src="/no_image.png"
            alt=""
            className="absolute left-0 top-0 h-full w-full object-cover"
          />
        </div>
      </div>
      <span className="sr-only">{label}</span>
    </div>
  );
};
