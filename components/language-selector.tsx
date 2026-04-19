"use client";

import { AnimatePresence, motion } from "framer-motion";
import { Check, ChevronDown } from "lucide-react";
import * as _ from "lodash";
import { useLocale, useTranslations } from "next-intl";
import { useRouter } from "next/navigation";
import { useEffect, useRef, useState, useTransition } from "react";

import {
  appLocales,
  defaultLocale,
  isAppLocale,
  type AppLocale,
} from "@/app/lib/i18n/locales";
import { setUserLocale } from "@/app/lib/services/locale-actions";

const localeShortCode: Record<AppLocale, string> = {
  ru: "RU",
  uk: "UA",
  en: "EN",
};

export const LanguageSelector = () => {
  const router = useRouter();
  const activeLocaleFromHook = useLocale();
  const activeLocale: AppLocale = isAppLocale(activeLocaleFromHook)
    ? activeLocaleFromHook
    : defaultLocale;
  const languageTranslations = useTranslations("Language");
  const [menuOpen, setMenuOpen] = useState(false);
  const [isPending, startTransition] = useTransition();
  const containerReference = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handlePointerDown = (event: MouseEvent) => {
      if (
        containerReference.current &&
        !containerReference.current.contains(event.target as Node)
      ) {
        setMenuOpen(false);
      }
    };
    document.addEventListener("mousedown", handlePointerDown);
    return () => {
      document.removeEventListener("mousedown", handlePointerDown);
    };
  }, []);

  const localeLabels: Record<AppLocale, string> = {
    ru: languageTranslations("ru"),
    en: languageTranslations("en"),
    uk: languageTranslations("uk"),
  };

  const pickLocale = (nextLocale: AppLocale) => {
    if (nextLocale === activeLocale) {
      setMenuOpen(false);
      return;
    }
    startTransition(() => {
      void (async () => {
        const result = await setUserLocale(nextLocale);
        if (result.ok) {
          router.refresh();
        }
        setMenuOpen(false);
      })();
    });
  };

  const activeShort = localeShortCode[activeLocale];

  return (
    <div className="relative" ref={containerReference}>
      <button
        type="button"
        className="flex h-9 shrink-0 items-center gap-2 rounded-md bg-zinc-200/90 px-4 py-2 text-sm font-medium text-zinc-900 transition hover:bg-zinc-200 dark:bg-zinc-700/90 dark:text-zinc-100 dark:hover:bg-zinc-600"
        aria-expanded={menuOpen}
        aria-haspopup="listbox"
        aria-label={`${languageTranslations("label")}: ${localeLabels[activeLocale]}`}
        disabled={isPending}
        onClick={() => {
          setMenuOpen((previous) => !previous);
        }}
      >
        <span className="relative inline-flex min-w-[1.75rem] justify-center overflow-hidden">
          <AnimatePresence mode="wait" initial={false}>
            <motion.span
              key={activeLocale}
              className="inline-block"
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 10 }}
              transition={{ duration: 0.2, ease: [0.22, 1, 0.36, 1] }}
            >
              {activeShort}
            </motion.span>
          </AnimatePresence>
        </span>
        <motion.span
          animate={{ rotate: menuOpen ? 180 : 0 }}
          transition={{ duration: 0.2 }}
        >
          <ChevronDown
            className="h-2.5 w-2.5 shrink-0 text-zinc-600 dark:text-zinc-300"
            strokeWidth={2.5}
            aria-hidden
          />
        </motion.span>
      </button>
      <AnimatePresence>
        {menuOpen ? (
          <motion.div
            key="language-menu"
            role="listbox"
            className="absolute right-0 z-[60] mt-2 min-w-[5.5rem] overflow-hidden rounded-md border border-border bg-card py-1 shadow-lg backdrop-blur-md dark:bg-zinc-900/95"
            initial={{ opacity: 0, y: -6, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -4, scale: 0.98 }}
            transition={{ duration: 0.2, ease: [0.22, 1, 0.36, 1] }}
            style={{ originY: 0 }}
          >
            {_.map([...appLocales], (localeOption, index) => (
              <motion.button
                key={localeOption}
                type="button"
                role="option"
                aria-selected={activeLocale === localeOption}
                aria-label={localeLabels[localeOption]}
                className="flex w-full items-center justify-between gap-3 px-3 py-2 text-left text-sm font-medium text-foreground hover:bg-muted"
                initial={{ opacity: 0, x: -6 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{
                  delay: 0.03 * index,
                  duration: 0.15,
                }}
                onClick={() => {
                  pickLocale(localeOption);
                }}
              >
                <span>{localeShortCode[localeOption]}</span>
                {activeLocale === localeOption ? (
                  <Check
                    className="h-4 w-4 shrink-0 text-zinc-500 dark:text-zinc-400"
                    strokeWidth={2}
                    aria-hidden
                  />
                ) : null}
              </motion.button>
            ))}
          </motion.div>
        ) : null}
      </AnimatePresence>
    </div>
  );
};
