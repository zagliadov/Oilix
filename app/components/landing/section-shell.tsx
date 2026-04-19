import type { ReactNode } from "react";

type SectionShellProps = {
  children: ReactNode;
  className?: string;
};

export const SectionShell = ({ children, className = "" }: SectionShellProps) => (
  <div
    className={`w-full px-4 sm:px-8 lg:px-12 xl:px-16 2xl:px-24 ${className}`}
  >
    {children}
  </div>
);
