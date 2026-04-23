/**
 * Nova Poshta (Україна) JSON API key — public API, keep server-side only; never `NEXT_PUBLIC_`.
 */
export const getNovaPoshtaApiKey = (): string | undefined => {
  const raw = process.env.NPAPI;
  if (raw === undefined) {
    return undefined;
  }
  const trimmed = raw.trim();
  return trimmed === "" ? undefined : trimmed;
};

export const isNovaPoshtaApiConfigured = (): boolean => getNovaPoshtaApiKey() !== undefined;
