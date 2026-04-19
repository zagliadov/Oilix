"use client";

import { motion, useReducedMotion } from "framer-motion";
import type { ReactNode } from "react";

import { appleEase } from "@/components/motion/apple-ease";

type ScrollRevealAs = "div" | "section" | "article" | "li" | "span" | "footer";

type ScrollRevealProps = {
  children: ReactNode;
  className?: string;
  delay?: number;
  as?: ScrollRevealAs;
  duration?: number;
  id?: string;
};

/** No translateY — transforms on section ancestors break `position:sticky` and nested in-view animations on mobile. */
const viewport = {
  once: true,
  margin: "0px 0px -40px 0px",
  amount: 0.05,
} as const;

export const ScrollReveal = ({
  children,
  className,
  delay = 0,
  as = "div",
  duration = 0.62,
  id,
}: ScrollRevealProps) => {
  const prefersReducedMotion = useReducedMotion();
  const instant = prefersReducedMotion === true;

  const common = {
    id,
    className,
    initial: instant ? { opacity: 1 } : { opacity: 0 },
    whileInView: { opacity: 1 },
    viewport,
    transition: {
      duration: instant ? 0 : duration,
      delay: instant ? 0 : delay,
      ease: appleEase,
    },
  };

  switch (as) {
    case "section":
      return <motion.section {...common}>{children}</motion.section>;
    case "article":
      return <motion.article {...common}>{children}</motion.article>;
    case "li":
      return <motion.li {...common}>{children}</motion.li>;
    case "span":
      return <motion.span {...common}>{children}</motion.span>;
    case "footer":
      return <motion.footer {...common}>{children}</motion.footer>;
    default:
      return <motion.div {...common}>{children}</motion.div>;
  }
};
