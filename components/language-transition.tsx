"use client";

/* eslint-disable react-hooks/refs -- Previous locale via ref during render is intentional for motion `initial`. */
import { AnimatePresence, motion } from "framer-motion";
import { useLocale } from "next-intl";
import type { ReactNode } from "react";
import { useRef } from "react";

type LanguageTransitionProps = {
  children: ReactNode;
};

/**
 * Enter animation runs only when `locale` changes — not on first paint — so the first
 * wheel/touch scroll is not competing with a full-page opacity transition.
 */
export const LanguageTransition = ({ children }: LanguageTransitionProps) => {
  const locale = useLocale();
  const previousLocaleReference = useRef(locale);
  const isLocaleSwitch = previousLocaleReference.current !== locale;
  previousLocaleReference.current = locale;

  return (
    <AnimatePresence mode="sync">
      <motion.div
        key={locale}
        className="flex min-h-0 flex-1 flex-col"
        initial={isLocaleSwitch ? { opacity: 0, y: 12 } : false}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -8 }}
        transition={{
          duration: 0.28,
          ease: [0.22, 1, 0.36, 1],
        }}
      >
        {children}
      </motion.div>
    </AnimatePresence>
  );
};
