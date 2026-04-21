import type { Metadata } from "next";

import { isAdminAuthConfigured } from "@/app/lib/admin/auth/env";
import { AdminLoginForm } from "@/components/admin/admin-login-form";
import { storefrontSurfacePanel } from "@/components/ui/storefront";

export const metadata: Metadata = {
  title: "Admin sign-in — Oilix",
  description: "Oilix storefront administration",
  robots: { index: false, follow: false },
};

export default function AdminLoginPage() {
  const configured = isAdminAuthConfigured();

  return (
    <div className="flex min-h-dvh w-full flex-col items-center justify-center px-4 py-12 sm:px-6">
      <div className={`w-full max-w-sm p-8 ${storefrontSurfacePanel}`}>
        <h1 className="font-display text-xl font-semibold text-foreground">Oilix admin</h1>
        <p className="mt-2 text-sm text-muted-foreground">Sign in with the admin password.</p>
        {!configured ? (
          <p className="mt-4 rounded-md border border-destructive/40 bg-destructive/10 px-3 py-2 text-sm text-destructive">
            Admin login is disabled until <code className="font-mono">ADMIN_PASSWORD</code> is set in
            the environment.
          </p>
        ) : null}
        <div className="mt-8">
          <AdminLoginForm disabled={!configured} />
        </div>
      </div>
    </div>
  );
}
