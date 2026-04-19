import * as _ from "lodash";
import { getTranslations } from "next-intl/server";

import { SectionShell } from "@/app/components/landing/section-shell";
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
    <section id="range" className="w-full py-20">
      <SectionShell>
        <h2 className="font-display text-2xl font-bold tracking-tight text-foreground sm:text-3xl">
          {landingTranslations("catalog.title")}
        </h2>
        <p className="mt-3 max-w-3xl text-base leading-[1.5] text-muted-foreground sm:text-lg">
          {landingTranslations("catalog.lead")}
        </p>
        <div className="mt-10 w-full space-y-3">
          {_.map(catalogBlocks, (block) => (
            <details
              key={block.title}
              className="group rounded-2xl border border-border bg-muted/30 open:bg-muted/50 dark:bg-white/[0.02] dark:open:bg-white/[0.04]"
            >
              <summary className="font-display cursor-pointer list-none px-5 py-4 text-base font-semibold text-foreground marker:content-none [&::-webkit-details-marker]:hidden">
                <span className="flex items-center justify-between gap-4">
                  {block.title}
                  <span className="text-muted-foreground transition group-open:rotate-180 dark:text-zinc-500">
                    ▼
                  </span>
                </span>
              </summary>
              <ul className="space-y-2 border-t border-border px-5 pb-5 pt-3 text-base leading-[1.5] text-muted-foreground">
                {_.map(block.items, (item) => (
                  <li key={item} className="flex gap-2">
                    <span className="text-violet-600 dark:text-violet-400">·</span>
                    {item}
                  </li>
                ))}
              </ul>
            </details>
          ))}
        </div>
      </SectionShell>
    </section>
  );
};
