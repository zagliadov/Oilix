import type { Metadata } from "next";
import { Inter, Oswald } from "next/font/google";
import { NextIntlClientProvider } from "next-intl";
import { getLocale, getMessages, getTranslations } from "next-intl/server";

import { getCatalogBundle } from "@/app/lib/catalog/load-catalog";
import { resolveMetadataBase } from "@/app/lib/seo/page-metadata";
import { CartProvider } from "@/components/cart/cart-context";
import { StorefrontCatalogProvider } from "@/components/storefront/storefront-catalog-provider";
import { ThemeProvider } from "@/components/theme-provider";

import "./globals.css";

const inter = Inter({
  variable: "--font-sans-body",
  subsets: ["latin", "cyrillic"],
  display: "swap",
});

const oswald = Oswald({
  variable: "--font-display",
  subsets: ["latin", "cyrillic"],
  display: "swap",
});

const openGraphLocaleByAppLocale: Record<string, string> = {
  en: "en_US",
  uk: "uk_UA",
  ru: "ru_RU",
};

export const generateMetadata = async (): Promise<Metadata> => {
  const metadataTranslations = await getTranslations("Metadata");
  const locale = await getLocale();
  const metadataBase = resolveMetadataBase();

  return {
    ...(metadataBase !== undefined ? { metadataBase } : {}),
    title: {
      default: metadataTranslations("title"),
      template: metadataTranslations("titleTemplate"),
    },
    description: metadataTranslations("description"),
    openGraph: {
      type: "website",
      siteName: metadataTranslations("siteName"),
      title: metadataTranslations("title"),
      description: metadataTranslations("description"),
      locale: openGraphLocaleByAppLocale[locale] ?? locale,
    },
    twitter: {
      card: "summary_large_image",
      title: metadataTranslations("title"),
      description: metadataTranslations("description"),
    },
    robots: {
      index: true,
      follow: true,
    },
  };
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const locale = await getLocale();
  const messages = await getMessages();
  const catalogBundle = await getCatalogBundle();

  return (
    <html
      lang={locale}
      className={`${inter.variable} ${oswald.variable} h-full antialiased`}
      suppressHydrationWarning
    >
      <body
        className="flex min-h-full flex-col bg-background text-foreground"
        suppressHydrationWarning
      >
        <NextIntlClientProvider locale={locale} messages={messages}>
          <ThemeProvider
            attribute="class"
            defaultTheme="system"
            enableSystem
            disableTransitionOnChange
          >
            <StorefrontCatalogProvider bundle={catalogBundle}>
              <CartProvider>{children}</CartProvider>
            </StorefrontCatalogProvider>
          </ThemeProvider>
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
