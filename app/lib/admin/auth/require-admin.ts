import "server-only";

import { cookies } from "next/headers";
import { redirect } from "next/navigation";

import { ADMIN_SESSION_COOKIE_NAME } from "./cookie-name";
import { getSessionSecret } from "./env";
import { verifyAdminSessionToken } from "./session-token";

/**
 * Ensures the request carries a valid admin session cookie (for Server Actions).
 * Middleware already gates routes; this adds defense in depth for action endpoints.
 */
export const requireAdminSession = async (): Promise<void> => {
  const secret = getSessionSecret();
  const token = (await cookies()).get(ADMIN_SESSION_COOKIE_NAME)?.value;
  if (
    secret === undefined ||
    token === undefined ||
    !(await verifyAdminSessionToken(token, secret))
  ) {
    redirect("/admin/login");
  }
};
