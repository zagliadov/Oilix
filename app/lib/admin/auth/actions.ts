"use server";

import { cookies } from "next/headers";
import { redirect } from "next/navigation";

import { ADMIN_SESSION_COOKIE_NAME } from "./cookie-name";
import { getAdminPassword, getSessionSecret, isAdminAuthConfigured } from "./env";
import { createAdminSessionToken } from "./session-token";

export type AdminLoginState = {
  ok: boolean;
  errorMessage?: string;
};

export const adminLoginAction = async (
  _previousState: AdminLoginState | undefined,
  formData: FormData,
): Promise<AdminLoginState> => {
  if (!isAdminAuthConfigured()) {
    return {
      ok: false,
      errorMessage: "Admin login is not configured (missing ADMIN_PASSWORD).",
    };
  }

  const passwordRaw = formData.get("password");
  const password = typeof passwordRaw === "string" ? passwordRaw : "";
  const expected = getAdminPassword();
  if (expected === undefined || password !== expected) {
    return {
      ok: false,
      errorMessage: "Invalid password.",
    };
  }

  const secret = getSessionSecret();
  if (secret === undefined) {
    return { ok: false, errorMessage: "Session secret is not available." };
  }

  const token = await createAdminSessionToken(secret);
  const cookieStore = await cookies();
  cookieStore.set(ADMIN_SESSION_COOKIE_NAME, token, {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: 8 * 60 * 60,
  });

  redirect("/admin");
};

export const adminLogoutAction = async (): Promise<void> => {
  const cookieStore = await cookies();
  cookieStore.delete(ADMIN_SESSION_COOKIE_NAME);
  redirect("/admin/login");
};
