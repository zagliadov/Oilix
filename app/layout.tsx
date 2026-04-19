import type { Metadata } from "next";
import { Inter, Oswald } from "next/font/google";
import { NextIntlClientProvider } from "next-intl";
import { getLocale, getMessages, getTranslations } from "next-intl/server";

import { CartProvider } from "@/components/cart/cart-context";
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

export const generateMetadata = async (): Promise<Metadata> => {
  const metadataTranslations = await getTranslations("Metadata");

  return {
    title: metadataTranslations("title"),
    description: metadataTranslations("description"),
  };
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const locale = await getLocale();
  const messages = await getMessages();

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
            <CartProvider>{children}</CartProvider>
          </ThemeProvider>
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
