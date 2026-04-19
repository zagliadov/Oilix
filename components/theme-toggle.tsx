"use client";

import { Check, Moon, Sun } from "lucide-react";
import { useTheme } from "next-themes";
import { useTranslations } from "next-intl";
import { useEffect, useRef, useState } from "react";

export const ThemeToggle = () => {
  const themeTranslations = useTranslations("ThemeToggle");
  const { theme, setTheme, resolvedTheme } = useTheme();
  const [mounted, setMounted] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const containerReference = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const frameId = requestAnimationFrame(() => {
      setMounted(true);
    });
    return () => {
      cancelAnimationFrame(frameId);
    };
  }, []);

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

  if (!mounted) {
    return (
      <div
        className="h-9 w-9 shrink-0 rounded-md border border-border bg-muted/50"
        aria-hidden
      />
    );
  }

  const isDark = resolvedTheme === "dark";

  const pickTheme = (nextTheme: string) => {
    setTheme(nextTheme);
    setMenuOpen(false);
  };

  return (
    <div className="relative" ref={containerReference}>
      <button
        type="button"
        className="flex h-9 w-9 shrink-0 items-center justify-center rounded-md border border-border bg-muted/60 text-foreground transition hover:bg-muted dark:bg-white/5 dark:hover:bg-white/10"
        aria-expanded={menuOpen}
        aria-haspopup="listbox"
        aria-label={themeTranslations("aria")}
        onClick={() => {
          setMenuOpen((previous) => !previous);
        }}
      >
        {isDark ? (
          <Moon className="h-[1.15rem] w-[1.15rem]" strokeWidth={2} />
        ) : (
          <Sun className="h-[1.15rem] w-[1.15rem]" strokeWidth={2} />
        )}
      </button>
      {menuOpen ? (
        <div
          className="absolute right-0 z-[60] mt-2 min-w-[11rem] rounded-md border border-border bg-card py-1 shadow-lg backdrop-blur-md dark:bg-zinc-900/95"
          role="listbox"
        >
          <button
            type="button"
            role="option"
            aria-selected={theme === "light"}
            className="flex w-full items-center justify-between gap-2 px-4 py-2.5 text-left text-sm text-foreground hover:bg-muted"
            onClick={() => {
              pickTheme("light");
            }}
          >
            <span>{themeTranslations("light")}</span>
            {theme === "light" ? (
              <Check className="h-4 w-4 shrink-0" strokeWidth={2} aria-hidden />
            ) : null}
          </button>
          <button
            type="button"
            role="option"
            aria-selected={theme === "dark"}
            className="flex w-full items-center justify-between gap-2 px-4 py-2.5 text-left text-sm text-foreground hover:bg-muted"
            onClick={() => {
              pickTheme("dark");
            }}
          >
            <span>{themeTranslations("dark")}</span>
            {theme === "dark" ? (
              <Check className="h-4 w-4 shrink-0" strokeWidth={2} aria-hidden />
            ) : null}
          </button>
          <button
            type="button"
            role="option"
            aria-selected={theme === "system"}
            className="flex w-full items-center justify-between gap-2 px-4 py-2.5 text-left text-sm text-foreground hover:bg-muted"
            onClick={() => {
              pickTheme("system");
            }}
          >
            <span>{themeTranslations("system")}</span>
            {theme === "system" ? (
              <Check className="h-4 w-4 shrink-0" strokeWidth={2} aria-hidden />
            ) : null}
          </button>
        </div>
      ) : null}
    </div>
  );
};
