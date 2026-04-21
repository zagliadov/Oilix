import Link from "next/link";

type ProductDetailBreadcrumbProps = {
  catalogLabel: string;
  catalogHref: string;
  categoryLabel: string;
  productTitle: string;
};

export const ProductDetailBreadcrumb = ({
  catalogLabel,
  catalogHref,
  categoryLabel,
  productTitle,
}: ProductDetailBreadcrumbProps) => {
  return (
    <nav aria-label="Breadcrumb" className="text-sm text-muted-foreground">
      <ol className="flex flex-wrap items-center gap-x-2 gap-y-1">
        <li>
          <Link
            href={catalogHref}
            className="font-medium text-muted-foreground transition hover:text-foreground"
          >
            {catalogLabel}
          </Link>
        </li>
        <li aria-hidden className="text-border">
          /
        </li>
        <li className="max-w-[min(100%,12rem)] truncate sm:max-w-none" title={categoryLabel}>
          {categoryLabel}
        </li>
        <li aria-hidden className="text-border">
          /
        </li>
        <li className="min-w-0 max-w-full truncate font-medium text-foreground" title={productTitle}>
          {productTitle}
        </li>
      </ol>
    </nav>
  );
};
