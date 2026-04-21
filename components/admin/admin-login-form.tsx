"use client";

import { useActionState } from "react";

import { type AdminLoginState, adminLoginAction } from "@/app/lib/admin/auth/actions";
import {
  storefrontButtonPrimary,
  storefrontButtonPrimaryPaddingCompact,
} from "@/components/ui/storefront";

type AdminLoginFormProps = {
  disabled: boolean;
};

const initialState: AdminLoginState = { ok: true };

export const AdminLoginForm = ({ disabled }: AdminLoginFormProps) => {
  const [state, formAction, isPending] = useActionState(adminLoginAction, initialState);

  return (
    <form action={formAction} className="space-y-5">
      <div className="space-y-2">
        <label htmlFor="admin-password" className="block text-sm font-medium text-foreground">
          Password
        </label>
        <input
          id="admin-password"
          name="password"
          type="password"
          autoComplete="current-password"
          required={!disabled}
          disabled={disabled || isPending}
          className="w-full rounded-md border border-border bg-background px-4 py-3 text-base text-foreground outline-none focus-visible:border-brand/40 focus-visible:ring-2 focus-visible:ring-brand/25 disabled:cursor-not-allowed disabled:opacity-60 dark:border-white/12 dark:bg-white/3"
        />
      </div>
      {state.errorMessage !== undefined && state.errorMessage !== "" ? (
        <p className="text-sm text-destructive" role="alert">
          {state.errorMessage}
        </p>
      ) : null}
      <button
        type="submit"
        disabled={disabled || isPending}
        className={`w-full ${storefrontButtonPrimary} ${storefrontButtonPrimaryPaddingCompact}`}
      >
        {isPending ? "Signing in…" : "Sign in"}
      </button>
    </form>
  );
};
