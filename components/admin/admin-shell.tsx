import Link from "next/link";

import { adminLogoutAction } from "@/app/lib/admin/auth/actions";
import {
  storefrontButtonSecondary,
  storefrontButtonSecondaryPadding,
} from "@/components/ui/storefront";

type AdminShellProps = {
  title: string;
  children: React.ReactNode;
};

export const AdminShell = ({ title, children }: AdminShellProps) => {
  return (
    <div className="w-full px-4 py-8 sm:px-6 lg:px-8">
      <header className="flex flex-col gap-4 border-b border-border pb-6 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
            <Link href="/admin" className="transition hover:text-foreground">
              Admin
            </Link>
            {" / "}
            <Link href="/admin/products" className="transition hover:text-foreground">
              Products
            </Link>
          </p>
          <h1 className="font-display mt-2 text-2xl font-bold tracking-tight text-foreground">
            {title}
          </h1>
        </div>
        <form action={adminLogoutAction}>
          <button
            type="submit"
            className={`${storefrontButtonSecondary} ${storefrontButtonSecondaryPadding} text-sm`}
          >
            Log out
          </button>
        </form>
      </header>
      <div className="pt-8">{children}</div>
    </div>
  );
};
