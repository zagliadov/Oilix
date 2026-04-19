"use client";

import { AnimatePresence, motion } from "framer-motion";
import { useLocale } from "next-intl";
import type { ReactNode } from "react";

type LanguageTransitionProps = {
  children: ReactNode;
};

export const LanguageTransition = ({ children }: LanguageTransitionProps) => {
  const locale = useLocale();

  return (
    <AnimatePresence mode="wait">
      <motion.div
        key={locale}
        initial={{ opacity: 0, y: 14 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -10 }}
        transition={{
          duration: 0.32,
          ease: [0.22, 1, 0.36, 1],
        }}
      >
        {children}
      </motion.div>
    </AnimatePresence>
  );
};
