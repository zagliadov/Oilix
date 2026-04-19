"use client";

import Link from "next/link";
import type { ComponentProps } from "react";

type NavHashLinkProps = Omit<ComponentProps<typeof Link>, "href"> & {
  hash: string;
};

export const NavHashLink = ({ hash, ...props }: NavHashLinkProps) => {
  return <Link href={`/#${hash}`} {...props} />;
};
