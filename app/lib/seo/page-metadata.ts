import type { Metadata } from "next";

import { appLocales, defaultLocale, type AppLocale } from "@/app/lib/i18n/locales";

const APP_LOCALE_TO_HREFLANG: Record<AppLocale, string> = {
  ru: "ru-RU",
  uk: "uk-UA",
  en: "en-US",
};

/**
 * Optional absolute site URL for canonical URLs & Open Graph (`https://example.com`).
 * Set `NEXT_PUBLIC_SITE_URL` in deployment; metadata still works without it.
 */
export const resolveSiteUrl = (): string | undefined => {
  const raw = process.env.NEXT_PUBLIC_SITE_URL?.trim();
  if (raw === undefined || raw === "") {
    return undefined;
  }
  const normalized = raw.endsWith("/") ? raw.slice(0, -1) : raw;
  try {
    return new URL(`${normalized}/`).toString().replace(/\/$/, "");
  } catch {
    return undefined;
  }
};

export const resolveMetadataBase = (): Metadata["metadataBase"] => {
  const siteUrl = resolveSiteUrl();
  if (siteUrl === undefined) {
    return new URL("http://localhost:3000");
  }
  try {
    return new URL(`${siteUrl}/`);
  } catch {
    return new URL("http://localhost:3000");
  }
};

const buildLocalePath = (path: string, locale: AppLocale): string => {
  const normalizedPath = path.startsWith("/") ? path : `/${path}`;
  if (normalizedPath === "/") {
    return `/${locale}`;
  }
  return `/${locale}${normalizedPath}`;
};

const toCanonicalUrl = (
  metadataBase: Metadata["metadataBase"],
  path: string,
): string | undefined => {
  if (metadataBase === undefined || metadataBase === null) {
    return undefined;
  }
  const normalizedPath = path.startsWith("/") ? path : `/${path}`;
  try {
    return new URL(normalizedPath, metadataBase).toString();
  } catch {
    return undefined;
  }
};

export const resolveAbsoluteUrl = (
  path: string,
  locale: AppLocale = defaultLocale,
): string | undefined => {
  return toCanonicalUrl(resolveMetadataBase(), buildLocalePath(path, locale));
};

const DEFAULT_SOCIAL_IMAGE_PATH = "/opengraph-image";

const socialMetadata = (input: {
  pageTitle: string;
  description: string;
  canonicalUrl: string | undefined;
  imageUrl?: string;
}): Pick<Metadata, "openGraph" | "twitter"> => ({
  openGraph: {
    title: input.pageTitle,
    description: input.description,
    ...(input.canonicalUrl !== undefined ? { url: input.canonicalUrl } : {}),
    images: [input.imageUrl ?? DEFAULT_SOCIAL_IMAGE_PATH],
  },
  twitter: {
    card: "summary_large_image",
    title: input.pageTitle,
    description: input.description,
    images: [input.imageUrl ?? DEFAULT_SOCIAL_IMAGE_PATH],
  },
});

export type SegmentRouteMetadataInput = {
  /** Short segment filled into the root `title.template` (e.g. "Cart"). */
  segmentTitle: string;
  /** Full title for Open Graph / Twitter (e.g. "Cart | Oilix"). */
  pageTitle: string;
  description: string;
  path: string;
  imageUrl?: string;
  locale?: AppLocale;
};

/**
 * Public route that uses the root layout title template for the browser tab.
 */
export const buildSegmentRouteMetadata = ({
  segmentTitle,
  pageTitle,
  description,
  path,
  imageUrl,
  locale = defaultLocale,
}: SegmentRouteMetadataInput): Metadata => {
  const metadataBase = resolveMetadataBase();
  const canonicalUrl = toCanonicalUrl(
    metadataBase,
    buildLocalePath(path, locale),
  );
  const languageAlternates = Object.fromEntries(
    appLocales
      .map((locale) => ({
        hreflang: APP_LOCALE_TO_HREFLANG[locale],
        url: toCanonicalUrl(metadataBase, buildLocalePath(path, locale)),
      }))
      .filter((entry): entry is { hreflang: string; url: string } => entry.url !== undefined)
      .map((entry) => [entry.hreflang, entry.url]),
  );
  const xDefaultAlternate = toCanonicalUrl(metadataBase, buildLocalePath(path, defaultLocale));

  return {
    title: segmentTitle,
    description,
    ...(canonicalUrl !== undefined
      ? {
        alternates: {
          canonical: canonicalUrl,
          languages: {
            ...languageAlternates,
            ...(xDefaultAlternate !== undefined ? { "x-default": xDefaultAlternate } : {}),
          },
        },
      }
      : {}),
    ...socialMetadata({ pageTitle, description, canonicalUrl, imageUrl }),
  };
};

export type AbsoluteRouteMetadataInput = {
  pageTitle: string;
  description: string;
  path: string;
  imageUrl?: string;
  locale?: AppLocale;
};

/**
 * Routes that need a full custom title (home, product PDP, error-ish titles).
 */
export const buildAbsoluteRouteMetadata = ({
  pageTitle,
  description,
  path,
  imageUrl,
  locale = defaultLocale,
}: AbsoluteRouteMetadataInput): Metadata => {
  const metadataBase = resolveMetadataBase();
  const canonicalUrl = toCanonicalUrl(
    metadataBase,
    buildLocalePath(path, locale),
  );
  const languageAlternates = Object.fromEntries(
    appLocales
      .map((locale) => ({
        hreflang: APP_LOCALE_TO_HREFLANG[locale],
        url: toCanonicalUrl(metadataBase, buildLocalePath(path, locale)),
      }))
      .filter((entry): entry is { hreflang: string; url: string } => entry.url !== undefined)
      .map((entry) => [entry.hreflang, entry.url]),
  );
  const xDefaultAlternate = toCanonicalUrl(metadataBase, buildLocalePath(path, defaultLocale));

  return {
    title: { absolute: pageTitle },
    description,
    ...(canonicalUrl !== undefined
      ? {
        alternates: {
          canonical: canonicalUrl,
          languages: {
            ...languageAlternates,
            ...(xDefaultAlternate !== undefined ? { "x-default": xDefaultAlternate } : {}),
          },
        },
      }
      : {}),
    ...socialMetadata({ pageTitle, description, canonicalUrl, imageUrl }),
  };
};
