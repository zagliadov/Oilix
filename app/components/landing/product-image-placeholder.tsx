import Image from "next/image";

type ProductImagePlaceholderProps = {
  label: string;
  className?: string;
};

export const ProductImagePlaceholder = ({
  label,
  className = "",
}: ProductImagePlaceholderProps) => (
  <div
    className={`relative aspect-square w-full overflow-hidden rounded-md border border-border bg-muted/30 shadow-[0_8px_30px_-12px_rgba(0,0,0,0.12)] transition-colors dark:border-white/10 dark:bg-zinc-900/40 dark:shadow-[inset_0_1px_0_0_rgba(255,255,255,0.06)] ${className}`}
  >
    <div className="absolute inset-0">
      <div className="relative h-full w-[200%] transition-transform duration-200 ease-out will-change-transform dark:-translate-x-1/2">
        <Image
          src="/no_image.png"
          alt=""
          fill
          quality={100}
          className="object-cover object-center"
          sizes="(max-width: 639px) 200vw, (max-width: 1023px) 100vw, (max-width: 1279px) 66vw, 50vw"
        />
      </div>
    </div>
    <span className="sr-only">{label}</span>
  </div>
);
