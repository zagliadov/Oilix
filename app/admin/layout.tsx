import type { Metadata } from "next";
import type { ReactNode } from "react";

export const metadata: Metadata = {
  robots: { index: false, follow: false },
};

/**
 * Admin uses the root layout (theme, fonts, i18n provider) but keeps its own subtree
 * without storefront navigation — CRUD UI will plug in here later.
 */
export default function AdminLayout({ children }: { children: ReactNode }) {
  return (
    <div className="min-h-dvh bg-background text-foreground">
      <div className="admin-scope">{children}</div>
    </div>
  );
}
