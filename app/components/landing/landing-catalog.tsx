import * as _ from "lodash";
import { ChevronDown, Dot } from "lucide-react";
import { getTranslations } from "next-intl/server";

import { SectionShell } from "@/app/components/landing/section-shell";
import { ScrollReveal } from "@/components/motion/scroll-reveal";
import { StickyHeading } from "@/components/motion/sticky-heading";
import {
  isCatalogBlockArray,
  requireLandingMessage,
} from "@/app/lib/i18n/message-guards";

export const LandingCatalog = async () => {
  const landingTranslations = await getTranslations("Landing");
  const catalogBlocks = requireLandingMessage(
    landingTranslations.raw("catalog.blocks"),
    isCatalogBlockArray,
    "Landing.catalog.blocks",
  );

  return (
    <section id="catalog-guide" className="w-full scroll-mt-20 py-20">
      <SectionShell>
        <StickyHeading>
          <h2 className="font-display text-2xl font-bold tracking-tight text-foreground sm:text-3xl">
            {landingTranslations("catalog.title")}
          </h2>
          <p className="mt-3 max-w-3xl text-base leading-[1.5] text-muted-foreground sm:text-lg">
            {landingTranslations("catalog.lead")}
          </p>
        </StickyHeading>
        <div className="mt-10 w-full space-y-3">
          {_.map(catalogBlocks, (block, blockIndex) => (
            <ScrollReveal key={block.title} delay={blockIndex * 0.08}>
              <details
                className="group rounded-md border border-border bg-muted/30 open:bg-muted/50 dark:bg-white/[0.02] dark:open:bg-white/[0.04]"
              >
                <summary className="font-display cursor-pointer list-none px-5 py-4 text-base font-semibold text-foreground marker:content-none [&::-webkit-details-marker]:hidden">
                  <span className="flex items-center justify-between gap-4">
                    {block.title}
                    <ChevronDown
                      className="h-4 w-4 shrink-0 text-muted-foreground transition group-open:rotate-180 dark:text-zinc-500"
                      strokeWidth={2}
                      aria-hidden
                    />
                  </span>
                </summary>
                <ul className="space-y-2 border-t border-border px-5 pb-5 pt-3 text-base leading-[1.5] text-muted-foreground">
                  {_.map(block.items, (item) => (
                    <li key={item} className="flex gap-2">
                      <Dot
                        className="mt-2 h-1.5 w-1.5 shrink-0 text-brand"
                        aria-hidden
                      />
                      {item}
                    </li>
                  ))}
                </ul>
              </details>
            </ScrollReveal>
          ))}
        </div>
      </SectionShell>
    </section>
  );
};
