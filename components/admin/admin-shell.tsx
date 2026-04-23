import Link from "next/link";
import { getTranslations } from "next-intl/server";

import { adminLogoutAction } from "@/app/lib/admin/auth/actions";
import {
  storefrontButtonSecondary,
  storefrontButtonSecondaryPadding,
} from "@/components/ui/storefront";

type AdminShellProps = {
  title: string;
  children: React.ReactNode;
};

export const AdminShell = async ({ title, children }: AdminShellProps) => {
  const landingTranslations = await getTranslations("Landing");

  return (
    <div className="w-full px-4 py-8 sm:px-6 lg:px-8">
      <header className="flex flex-col gap-4 border-b border-border pb-6 sm:flex-row sm:items-center sm:justify-between">
        <div className="min-w-0">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:gap-5">
            <Link
              href="/"
              className="font-display shrink-0 text-lg font-semibold uppercase tracking-tight text-foreground transition hover:opacity-85"
            >
              {landingTranslations("brand")}
            </Link>
            <div className="min-w-0">
              <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                <Link href="/admin" className="transition hover:text-foreground">
                  Админка
                </Link>
                {" / "}
                <Link href="/admin/products" className="transition hover:text-foreground">
                  Товары
                </Link>
              </p>
              <h1 className="font-display mt-2 text-2xl font-bold tracking-tight text-foreground">
                {title}
              </h1>
            </div>
          </div>
        </div>
        <form action={adminLogoutAction}>
          <button
            type="submit"
            className={`${storefrontButtonSecondary} ${storefrontButtonSecondaryPadding} text-sm`}
          >
            Выйти
          </button>
        </form>
      </header>
      <div className="pt-8">{children}</div>
    </div>
  );
};
