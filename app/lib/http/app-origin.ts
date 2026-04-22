import "server-only";

import { headers } from "next/headers";

/**
 * Public origin for the current request (used for absolute asset URLs in admin UI).
 */
export const getAppOriginFromRequestHeaders = async (): Promise<string> => {
  const h = await headers();
  const host = h.get("x-forwarded-host") ?? h.get("host");
  if (host === null) {
    return "http://localhost:3000";
  }
  const explicitProto = h.get("x-forwarded-proto");
  const protocol =
    explicitProto === "http" || explicitProto === "https"
      ? explicitProto
      : host.split(":")[0] === "localhost"
        ? "http"
        : "https";
  return `${protocol}://${host}`;
};
