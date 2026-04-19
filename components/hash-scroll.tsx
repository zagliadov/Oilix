"use client";

import { usePathname } from "next/navigation";
import { useEffect } from "react";

/**
 * After navigating to `/` with a hash (e.g. from `/product/1`), scroll to the target id.
 * Client-side transitions do not always apply native hash scrolling.
 */
export const HashScroll = () => {
  const pathname = usePathname();

  useEffect(() => {
    const scrollToHash = () => {
      if (pathname !== "/") {
        return;
      }
      const hash = window.location.hash;
      if (!hash || hash.length < 2) {
        return;
      }
      const id = decodeURIComponent(hash.slice(1));
      const element = document.getElementById(id);
      if (element) {
        element.scrollIntoView({ behavior: "smooth", block: "start" });
      }
    };

    const timerId = window.setTimeout(scrollToHash, 80);

    const handleHashChange = () => {
      scrollToHash();
    };

    window.addEventListener("hashchange", handleHashChange);
    return () => {
      window.clearTimeout(timerId);
      window.removeEventListener("hashchange", handleHashChange);
    };
  }, [pathname]);

  return null;
};
