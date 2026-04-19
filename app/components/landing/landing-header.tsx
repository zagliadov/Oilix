import * as _ from "lodash";
import { getTranslations } from "next-intl/server";

import { navLinks } from "@/app/landing/data";
import { SectionShell } from "@/app/components/landing/section-shell";
import { LanguageSelector } from "@/components/language-selector";
import { ThemeToggle } from "@/components/theme-toggle";

export const LandingHeader = async () => {
  const landingTranslations = await getTranslations("Landing");

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border bg-background/80 backdrop-blur-xl dark:bg-[#07070a]/80">
      <SectionShell className="flex h-16 w-full items-center justify-between gap-4 md:gap-6">
        <a
          href="#"
          className="font-display text-lg font-semibold uppercase tracking-tight text-foreground"
        >
          {landingTranslations("brand")}
        </a>
        <nav className="hidden items-center gap-8 md:flex">
          {_.map(navLinks, (link) => (
            <a
              key={link.href}
              href={link.href}
              className="font-display text-[0.875rem] font-semibold uppercase tracking-wide text-muted-foreground transition-colors hover:text-foreground"
            >
              {landingTranslations(`nav.${link.navKey}`)}
            </a>
          ))}
        </nav>
        <div className="flex shrink-0 items-center gap-2 sm:gap-3">
          <ThemeToggle />
          <LanguageSelector />
          <a
            href="#contact"
            className="rounded-full bg-zinc-900 px-4 py-2.5 text-base font-medium text-white transition hover:bg-zinc-800 dark:bg-white dark:text-zinc-950 dark:hover:bg-zinc-200 sm:px-5"
          >
            {landingTranslations("header.orderCta")}
          </a>
        </div>
      </SectionShell>
    </header>
  );
};
