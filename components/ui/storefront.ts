/**
 * Shared storefront UI tokens (Tailwind class strings).
 * Keeps surfaces, CTAs, badges and typographic rhythm aligned with app/globals.css.
 */

/** Large panels: checkout form, order/cart summary, success states */
export const storefrontSurfacePanel =
  "rounded-2xl border border-border bg-card shadow-sm dark:border-white/10 dark:bg-white/3";

/** list rows, medium cards */
export const storefrontSurfaceCard =
  "rounded-xl border border-border bg-card shadow-sm dark:border-white/10 dark:bg-white/3";

/** Tinted blocks: pricing strip, soft emphasis */
export const storefrontSurfaceSoft =
  "rounded-xl border border-border bg-muted/15 dark:border-white/10 dark:bg-white/3";

/** Product grid cards (hover affordance) */
export const storefrontProductCard =
  "rounded-md border border-border bg-card shadow-[0_1px_0_0_rgba(0,0,0,0.04)] transition-colors hover:border-brand/20 dark:border-white/[0.08] dark:bg-white/[0.03] dark:shadow-none dark:hover:border-brand/25";

/** Primary CTA — brand fill */
export const storefrontButtonPrimary =
  "inline-flex items-center justify-center rounded-md bg-brand text-base font-medium text-white transition hover:brightness-110 active:brightness-95 disabled:opacity-60";

export const storefrontButtonPrimaryPadding = "px-7 py-3.5";

export const storefrontButtonPrimaryPaddingCompact = "px-6 py-3.5";

/** Secondary — outline on default background */
export const storefrontButtonSecondary =
  "inline-flex items-center justify-center rounded-md border border-border bg-transparent text-base font-medium text-foreground transition hover:bg-muted/50 dark:border-white/15";

export const storefrontButtonSecondaryMuted =
  "inline-flex items-center justify-center rounded-md border border-border text-sm font-medium text-muted-foreground transition hover:bg-muted/50 dark:border-white/12";

export const storefrontButtonSecondaryPadding = "px-6 py-3.5";

/** Hero / landing secondary CTA — muted fill */
export const storefrontButtonSecondarySoft =
  "inline-flex items-center justify-center rounded-md border border-border bg-muted/50 text-base font-medium text-foreground transition hover:bg-muted dark:border-white/15 dark:bg-white/[0.04] dark:hover:border-white/25 dark:hover:bg-white/[0.07]";

/** Stepper wrapper (cart qty, add-to-cart inline) */
export const storefrontQuantityRail =
  "inline-flex items-center overflow-hidden rounded-md border border-border bg-background dark:border-white/10";

/** Compact cart secondary variant (add-to-cart stepper) */
export const storefrontQuantityRailOnCard =
  "inline-flex items-center justify-center gap-0 overflow-hidden rounded-md border border-border bg-card dark:border-white/10 dark:bg-white/[0.03]";

/** Promo: solid label (cards, PDP price) */
export const storefrontBadgePromoSolid =
  "rounded-md bg-brand px-2 py-0.5 text-[0.6875rem] font-bold uppercase tracking-wide text-white";

/** Promo: outline / tinted (PDP title chip) */
export const storefrontBadgePromoSoft =
  "rounded-md border border-brand/25 bg-brand/10 px-2 py-0.5 text-xs font-bold uppercase tracking-wide text-brand dark:bg-brand/15";

/** Main H1 on inner routes */
export const storefrontHeadingPage =
  "font-display text-2xl font-bold tracking-tight text-foreground sm:text-3xl";

/** Section H2 (checkout blocks, summaries) */
export const storefrontHeadingSection = "font-display text-lg font-semibold text-foreground";

/** Success / emphasis panel title */
export const storefrontHeadingEmphasis =
  "font-display text-xl font-semibold text-foreground sm:text-2xl";

/** Standard divider under page intro */
export const storefrontHeaderRule = "border-b border-border pb-8";

/** List row separators */
export const storefrontRowDivider =
  "border-b border-border/60 dark:border-white/10";

/** Footer strip above card actions */
export const storefrontDividerTop =
  "border-t border-border/60 dark:border-white/10";

/** Inline text link, brand */
export const storefrontLinkBrand = "font-medium text-brand transition hover:underline";

/** Compact icon / ghost control on cards (min ~44×44 touch target) */
export const storefrontIconButton =
  "relative flex h-11 w-11 shrink-0 items-center justify-center rounded-md border border-border bg-background text-foreground transition hover:border-brand/40 hover:bg-brand/10 disabled:opacity-50 dark:border-white/12 dark:bg-zinc-950/80";

/** Focus ring for native controls (inputs, selects) */
export const storefrontControlFocus =
  "outline-none ring-brand/0 transition focus:border-brand/40 focus:ring-2 focus:ring-brand/25";

/** Empty / dashed placeholder regions */
export const storefrontEmptyState =
  "rounded-2xl border border-dashed border-border bg-muted/10 dark:border-white/12 dark:bg-white/3";

/** Loading skeleton block */
export const storefrontSkeleton = "rounded-xl bg-muted animate-pulse";

/** Standalone marketing form inputs (server sections without FormField) */
export const storefrontMarketingInput =
  "w-full rounded-md border border-border bg-background px-4 py-3 text-base text-foreground outline-none placeholder:text-muted-foreground focus-visible:border-brand/40 focus-visible:ring-2 focus-visible:ring-brand/25 dark:border-white/12 dark:bg-white/3";

/** Catalog toolbar: search, sort, filters (focus matches checkout inputs via :focus) */
export const storefrontCatalogControl =
  "w-full rounded-md border border-border bg-background py-2.5 text-base text-foreground outline-none transition ring-brand/0 dark:border-white/12 focus:border-brand/40 focus:ring-2 focus:ring-brand/25";

/** Inline empty / no-results dashed cell */
export const storefrontEmptyStateInline =
  "rounded-xl border border-dashed border-border bg-muted/15 px-6 py-12 text-center dark:border-white/12";
