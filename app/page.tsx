import { getLocale, getTranslations } from "next-intl/server";
import { isAppLocale } from "@/app/lib/i18n/locales";

import { buildAbsoluteRouteMetadata } from "@/app/lib/seo/page-metadata";
import { resolveAbsoluteUrl, resolveSiteUrl } from "@/app/lib/seo/page-metadata";
import { LandingAudience } from "@/app/components/landing/landing-audience";
import { LandingBackground } from "@/app/components/landing/landing-background";
import { LandingCatalog } from "@/app/components/landing/landing-catalog";
import { LandingProducts } from "@/app/components/landing/landing-products";
import { LandingContact } from "@/app/components/landing/landing-contact";
import { LandingFooter } from "@/app/components/landing/landing-footer";
import { LandingHeader } from "@/app/components/landing/landing-header";
import { LandingHero } from "@/app/components/landing/landing-hero";
import { LandingPillars } from "@/app/components/landing/landing-pillars";
import { LandingQuality } from "@/app/components/landing/landing-quality";
import { HashScroll } from "@/components/hash-scroll";
import { LanguageTransition } from "@/components/language-transition";

export const generateMetadata = async () => {
  const metadataTranslations = await getTranslations("Metadata");
  const locale = await getLocale();
  return buildAbsoluteRouteMetadata({
    pageTitle: metadataTranslations("title"),
    description: metadataTranslations("description"),
    path: "/",
    ...(isAppLocale(locale) ? { locale } : {}),
  });
};

export default async function Home() {
  const locale = await getLocale();
  const activeLocale = isAppLocale(locale) ? locale : "uk";
  const siteUrl = resolveSiteUrl() ?? "http://localhost:3000";
  const homeUrl = resolveAbsoluteUrl("/", activeLocale) ?? `${siteUrl}/${activeLocale}`;
  const organizationSchema = {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: "Oilix",
    url: siteUrl,
    logo: resolveAbsoluteUrl("/opengraph-image", activeLocale) ?? `${siteUrl}/opengraph-image`,
  };
  const websiteSchema = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: "Oilix",
    url: siteUrl,
    inLanguage: ["ru", "uk", "en"],
    potentialAction: {
      "@type": "SearchAction",
      target: `${siteUrl}/${activeLocale}/catalog`,
      "query-input": "required name=search_term_string",
    },
  };

  return (
    <div className="relative flex min-h-dvh w-full flex-col overflow-x-clip bg-background text-foreground">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@graph": [
              {
                ...organizationSchema,
                "@id": `${homeUrl}#organization`,
              },
              {
                ...websiteSchema,
                "@id": `${homeUrl}#website`,
                publisher: {
                  "@id": `${homeUrl}#organization`,
                },
              },
            ],
          }),
        }}
      />
      <HashScroll />
      <LandingBackground />

      <LandingHeader />

      <LanguageTransition>
        <main className="flex w-full flex-1 flex-col">
          <LandingHero />
          <LandingAudience />
          <LandingPillars />
          <LandingQuality />
          <LandingProducts />
          <LandingCatalog />
          <LandingContact />
        </main>

        <LandingFooter />
      </LanguageTransition>
    </div>
  );
}
