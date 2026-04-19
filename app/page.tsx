import { LandingAudience } from "@/app/components/landing/landing-audience";
import { LandingBackground } from "@/app/components/landing/landing-background";
import { LandingCatalog } from "@/app/components/landing/landing-catalog";
import { LandingContact } from "@/app/components/landing/landing-contact";
import { LandingFooter } from "@/app/components/landing/landing-footer";
import { LandingHeader } from "@/app/components/landing/landing-header";
import { LandingHero } from "@/app/components/landing/landing-hero";
import { LandingPillars } from "@/app/components/landing/landing-pillars";
import { LandingQuality } from "@/app/components/landing/landing-quality";
import { LanguageTransition } from "@/components/language-transition";

export default function Home() {
  return (
    <div className="relative min-h-full w-full overflow-x-hidden bg-background text-foreground">
      <LandingBackground />

      <LandingHeader />

      <LanguageTransition>
        <main className="w-full">
          <LandingHero />
          <LandingAudience />
          <LandingPillars />
          <LandingQuality />
          <LandingCatalog />
          <LandingContact />
        </main>

        <LandingFooter />
      </LanguageTransition>
    </div>
  );
}
