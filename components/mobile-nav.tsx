"use client";

import * as _ from "lodash";
import { AnimatePresence, motion } from "framer-motion";
import { ArrowRight, Menu, X } from "lucide-react";
import { useTranslations } from "next-intl";
import Link from "next/link";
import {
  useCallback,
  useEffect,
  useId,
  useSyncExternalStore,
  useState,
} from "react";
import { createPortal } from "react-dom";

import { navLinks } from "@/app/landing/data";
import { appleEase } from "@/components/motion/apple-ease";
import { NavHashLink } from "@/components/nav-hash-link";

export const MobileNav = () => {
  const landingTranslations = useTranslations("Landing");
  const panelIdentifier = useId();
  const [menuOpen, setMenuOpen] = useState(false);
  const portalReady = useSyncExternalStore(
    () => () => {},
    () => true,
    () => false,
  );

  const closeMenu = useCallback(() => {
    setMenuOpen(false);
  }, []);

  useEffect(() => {
    if (!menuOpen) {
      return;
    }
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setMenuOpen(false);
      }
    };
    document.addEventListener("keydown", handleEscape);
    return () => {
      document.body.style.overflow = previousOverflow;
      document.removeEventListener("keydown", handleEscape);
    };
  }, [menuOpen]);

  const sheet = menuOpen ? (
    <motion.div
      key="mobile-nav-sheet"
      className="pointer-events-none fixed inset-0 z-[200] flex flex-col"
      style={{ isolation: "isolate" }}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.2, ease: appleEase }}
    >
      <motion.div
        role="presentation"
        className="pointer-events-auto absolute inset-x-0 bottom-0 top-16 bg-zinc-950/85 backdrop-blur-md dark:bg-black/90"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.18, ease: appleEase }}
        onClick={closeMenu}
        aria-hidden
      />
      <motion.div
        id={panelIdentifier}
        role="dialog"
        aria-modal="true"
        aria-label={landingTranslations("header.menuTitle")}
        className="pointer-events-auto absolute inset-x-0 bottom-0 top-16 z-10 flex flex-col border-t border-border bg-background text-foreground shadow-[0_-8px_40px_rgba(0,0,0,0.25)] dark:border-white/10 dark:bg-zinc-950"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: 16 }}
        transition={{ duration: 0.28, ease: appleEase }}
      >
        <div
          className="pointer-events-none shrink-0 border-b border-border/50 bg-muted/40 px-4 pb-2 pt-3 dark:border-white/10 dark:bg-zinc-900"
          aria-hidden
        >
          <div className="mx-auto h-1 w-10 rounded-md bg-muted-foreground/35" />
        </div>
        <div
          className="flex min-h-0 flex-1 flex-col overflow-y-auto overscroll-contain px-4 pb-[max(1.5rem,env(safe-area-inset-bottom))] pt-5"
          style={{ WebkitOverflowScrolling: "touch" }}
        >
          <div className="mb-6 border-b border-border/60 pb-6 dark:border-white/12">
            <p className="font-display text-xs font-semibold uppercase tracking-[0.18em] text-muted-foreground sm:text-sm">
              {landingTranslations("header.menuTagline")}
            </p>
            <p className="mt-3 font-display text-2xl font-bold tracking-tight text-foreground">
              {landingTranslations("brand")}
            </p>
          </div>
          <nav
            className="flex-1"
            aria-label={landingTranslations("header.menuTitle")}
          >
            <ul className="flex flex-col divide-y divide-border/70 p-0 dark:divide-white/12">
              <li className="list-none">
                <Link
                  href="/cart"
                  className="flex w-full items-center justify-between py-4 text-base font-semibold uppercase tracking-wide text-foreground transition-colors active:text-brand sm:text-lg"
                  onClick={closeMenu}
                >
                  {landingTranslations("nav.cart")}
                  <ArrowRight
                    className="h-5 w-5 shrink-0 text-brand/55"
                    aria-hidden
                    strokeWidth={2}
                  />
                </Link>
              </li>
              {_.map(navLinks, (link) => (
                <li
                  key={link.kind === "hash" ? link.hash : link.href}
                  className="list-none"
                >
                  {link.kind === "hash" ? (
                    <NavHashLink
                      hash={link.hash}
                      className="flex w-full items-center justify-between py-4 text-base font-semibold uppercase tracking-wide text-foreground transition-colors active:text-brand sm:text-lg"
                      onClick={closeMenu}
                    >
                      {landingTranslations(`nav.${link.navKey}`)}
                      <ArrowRight
                        className="h-5 w-5 shrink-0 text-brand/55"
                        aria-hidden
                        strokeWidth={2}
                      />
                    </NavHashLink>
                  ) : (
                    <Link
                      href={link.href}
                      className="flex w-full items-center justify-between py-4 text-base font-semibold uppercase tracking-wide text-foreground transition-colors active:text-brand sm:text-lg"
                      onClick={closeMenu}
                    >
                      {landingTranslations(`nav.${link.navKey}`)}
                      <ArrowRight
                        className="h-5 w-5 shrink-0 text-brand/55"
                        aria-hidden
                        strokeWidth={2}
                      />
                    </Link>
                  )}
                </li>
              ))}
            </ul>
          </nav>
          <NavHashLink
            hash="contact"
            className="mt-6 flex shrink-0 items-center justify-center rounded-md border border-border bg-zinc-900 py-4 text-base font-medium text-white transition hover:bg-zinc-800 dark:border-white/15 dark:bg-white dark:text-zinc-950 dark:hover:bg-zinc-200"
            onClick={closeMenu}
          >
            {landingTranslations("header.orderCta")}
          </NavHashLink>
        </div>
      </motion.div>
    </motion.div>
  ) : null;

  return (
    <>
      <div className="md:hidden">
        <button
          type="button"
          aria-expanded={menuOpen}
          aria-controls={panelIdentifier}
          aria-label={
            menuOpen
              ? landingTranslations("header.closeMenu")
              : landingTranslations("header.openMenu")
          }
          onClick={() => {
            setMenuOpen((previous) => !previous);
          }}
          className="relative z-[220] flex h-10 w-10 shrink-0 items-center justify-center rounded-md border border-border/50 bg-background text-foreground shadow-sm transition hover:border-brand/30 hover:bg-muted/40 dark:border-white/10 dark:bg-zinc-900 dark:hover:border-brand/25"
        >
          <span className="relative flex h-[18px] w-[18px] items-center justify-center">
            <AnimatePresence mode="wait" initial={false}>
              {menuOpen ? (
                <motion.span
                  key="close"
                  role="img"
                  aria-hidden
                  className="absolute inset-0 flex items-center justify-center"
                  initial={{ opacity: 0, scale: 0.92 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.92 }}
                  transition={{ duration: 0.15, ease: appleEase }}
                >
                  <X
                    className="text-zinc-800 dark:text-zinc-100"
                    size={18}
                    strokeWidth={2}
                  />
                </motion.span>
              ) : (
                <motion.span
                  key="menu"
                  role="img"
                  aria-hidden
                  className="absolute inset-0 flex items-center justify-center"
                  initial={{ opacity: 0, scale: 0.92 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.92 }}
                  transition={{ duration: 0.15, ease: appleEase }}
                >
                  <Menu
                    className="text-zinc-800 dark:text-zinc-100"
                    size={18}
                    strokeWidth={2}
                  />
                </motion.span>
              )}
            </AnimatePresence>
          </span>
        </button>
      </div>
      {portalReady
        ? createPortal(
            <AnimatePresence mode="sync">{sheet}</AnimatePresence>,
            document.body,
          )
        : null}
    </>
  );
};
