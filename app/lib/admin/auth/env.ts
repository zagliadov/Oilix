/**
 * Admin auth reads secrets only on the server / edge (middleware).
 * Set ADMIN_PASSWORD for login; optionally set ADMIN_SESSION_SECRET for signing cookies separately.
 */
export const getAdminPassword = (): string | undefined =>
  process.env.ADMIN_PASSWORD?.trim() || undefined;

export const getSessionSecret = (): string | undefined => {
  const explicit = process.env.ADMIN_SESSION_SECRET?.trim();
  if (explicit !== undefined && explicit !== "") {
    return explicit;
  }
  return process.env.ADMIN_PASSWORD?.trim() || undefined;
};

export const isAdminAuthConfigured = (): boolean =>
  getAdminPassword() !== undefined && getSessionSecret() !== undefined;
