import type { Metadata } from "next";
import Link from "next/link";

import { adminLogoutAction } from "@/app/lib/admin/auth/actions";
import {
  storefrontButtonSecondary,
  storefrontButtonSecondaryPadding,
} from "@/components/ui/storefront";

export const metadata: Metadata = {
  title: "Admin — Oilix",
  description: "Oilix storefront administration",
  robots: { index: false, follow: false },
};

export default function AdminHomePage() {
  return (
    <div className="w-full px-4 py-10 sm:px-6 lg:px-8">
      <header className="flex flex-col gap-4 border-b border-border pb-8 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="font-display text-2xl font-bold tracking-tight text-foreground">
            Administration
          </h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Manage the mock catalog or sign out.
          </p>
        </div>
        <div className="flex flex-wrap gap-2">
          <Link
            href="/admin/products"
            className={`${storefrontButtonSecondary} ${storefrontButtonSecondaryPadding} text-sm`}
          >
            Products
          </Link>
          <form action={adminLogoutAction}>
            <button
              type="submit"
              className={`${storefrontButtonSecondary} ${storefrontButtonSecondaryPadding} text-sm`}
            >
              Log out
            </button>
          </form>
        </div>
      </header>
      <section className="pt-10">
        <p className="text-base text-muted-foreground">
          Open{" "}
          <Link href="/admin/products" className="font-medium text-brand hover:underline">
            Products
          </Link>{" "}
          to view, create, edit, or delete items in{" "}
          <code className="rounded bg-muted px-1.5 py-0.5 font-mono text-sm text-foreground">
            data/catalog.json
          </code>
          .
        </p>
      </section>
    </div>
  );
}
