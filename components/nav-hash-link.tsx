"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import type { ComponentProps } from "react";

type NavHashLinkProps = Omit<ComponentProps<typeof Link>, "href"> & {
  hash: string;
};

/**
 * Same-page anchors must use `#id` on `/` — `href="/#id"` duplicates the fragment
 * (e.g. `/#range#range`) with Next.js client navigation.
 */
export const NavHashLink = ({ hash, ...props }: NavHashLinkProps) => {
  const pathname = usePathname();
  const href = pathname === "/" ? `#${hash}` : `/#${hash}`;
  return <Link href={href} {...props} />;
};
