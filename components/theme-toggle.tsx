"use client";

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
        className="h-9 w-9 shrink-0 rounded-full border border-border bg-muted/50"
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
        className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full border border-border bg-muted/60 text-foreground transition hover:bg-muted dark:bg-white/5 dark:hover:bg-white/10"
        aria-expanded={menuOpen}
        aria-haspopup="listbox"
        aria-label={themeTranslations("aria")}
        onClick={() => {
          setMenuOpen((previous) => !previous);
        }}
      >
        {isDark ? (
          <MoonIcon className="h-[1.15rem] w-[1.15rem]" />
        ) : (
          <SunIcon className="h-[1.15rem] w-[1.15rem]" />
        )}
      </button>
      {menuOpen ? (
        <div
          className="absolute right-0 z-[60] mt-2 min-w-[11rem] rounded-xl border border-border bg-card py-1 shadow-lg backdrop-blur-md dark:bg-zinc-900/95"
          role="listbox"
        >
          <button
            type="button"
            role="option"
            aria-selected={theme === "light"}
            className="block w-full px-4 py-2.5 text-left text-sm text-foreground hover:bg-muted"
            onClick={() => {
              pickTheme("light");
            }}
          >
            {themeTranslations("light")}
            {theme === "light" ? " ✓" : ""}
          </button>
          <button
            type="button"
            role="option"
            aria-selected={theme === "dark"}
            className="block w-full px-4 py-2.5 text-left text-sm text-foreground hover:bg-muted"
            onClick={() => {
              pickTheme("dark");
            }}
          >
            {themeTranslations("dark")}
            {theme === "dark" ? " ✓" : ""}
          </button>
          <button
            type="button"
            role="option"
            aria-selected={theme === "system"}
            className="block w-full px-4 py-2.5 text-left text-sm text-foreground hover:bg-muted"
            onClick={() => {
              pickTheme("system");
            }}
          >
            {themeTranslations("system")}
            {theme === "system" ? " ✓" : ""}
          </button>
        </div>
      ) : null}
    </div>
  );
};

const SunIcon = ({ className }: { className?: string }) => (
  <svg
    className={className}
    xmlns="http://www.w3.org/2000/svg"
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <circle cx="12" cy="12" r="4" />
    <path d="M12 2v2" />
    <path d="M12 20v2" />
    <path d="m4.93 4.93 1.41 1.41" />
    <path d="m17.66 17.66 1.41 1.41" />
    <path d="M2 12h2" />
    <path d="M20 12h2" />
    <path d="m6.34 17.66-1.41 1.41" />
    <path d="m19.07 4.93-1.41 1.41" />
  </svg>
);

const MoonIcon = ({ className }: { className?: string }) => (
  <svg
    className={className}
    xmlns="http://www.w3.org/2000/svg"
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path d="M12 3a6 6 0 0 0 9 9 9 9 0 1 1-9-9Z" />
  </svg>
);
