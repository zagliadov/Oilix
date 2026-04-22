/**
 * Vercel Blob: create a read-write token in the Blob store (Dashboard → Storage → token)
 * and set BLOB_READ_WRITE_TOKEN in .env.local / Vercel project env.
 */
export const getBlobReadWriteToken = (): string | undefined => {
  const raw = process.env.BLOB_READ_WRITE_TOKEN;
  if (raw === undefined) {
    return undefined;
  }
  const trimmed = raw.trim();
  return trimmed === "" ? undefined : trimmed;
};

export const isBlobStorageConfigured = (): boolean =>
  getBlobReadWriteToken() !== undefined;
