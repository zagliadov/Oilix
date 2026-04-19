"use client";

import type { ReactNode } from "react";

type StickyHeadingProps = {
  children: ReactNode;
  className?: string;
};

/**
 * Sticky title block below the fixed header on md+ — on small screens stays in flow
 * so sticky + transform ancestors don’t create empty scroll gaps.
 */
export const StickyHeading = ({ children, className = "" }: StickyHeadingProps) => (
  <div
    className={`relative z-20 mb-8 border-b border-border/50 bg-background/75 px-0 py-0 backdrop-blur-xl backdrop-saturate-150 supports-[backdrop-filter]:bg-background/60 md:sticky md:top-[4.5rem] md:z-20 md:-mx-4 md:mb-10 md:border-b md:border-border/50 md:px-4 md:py-5 ${className}`}
  >
    {children}
  </div>
);
