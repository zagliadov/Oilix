import { getTranslations } from "next-intl/server";

import { SectionShell } from "@/app/components/landing/section-shell";

export const LandingFooter = async () => {
  const landingTranslations = await getTranslations("Landing");

  return (
    <footer className="w-full border-t border-border py-10">
      <SectionShell className="text-center text-xs text-muted-foreground">
        <p>
          {landingTranslations("footer.copyright", {
            year: new Date().getFullYear(),
          })}
        </p>
      </SectionShell>
    </footer>
  );
};
