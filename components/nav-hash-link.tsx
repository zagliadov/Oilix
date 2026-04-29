"use client";

import Link from "next/link";
import { useLocale } from "next-intl";
import type { ComponentProps } from "react";

type NavHashLinkProps = Omit<ComponentProps<typeof Link>, "href"> & {
  hash: string;
};

export const NavHashLink = ({ hash, ...props }: NavHashLinkProps) => {
  const locale = useLocale();
  return <Link href={`/${locale}/#${hash}`} {...props} />;
};
