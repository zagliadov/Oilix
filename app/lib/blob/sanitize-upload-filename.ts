/**
 * Produces a safe single-segment filename for blob pathnames (no path separators).
 */
export const sanitizeUploadFilename = (filename: string): string => {
  const base = filename.split(/[/\\]/).pop() ?? "image";
  const cleaned = base.replace(/[^a-zA-Z0-9._-]+/g, "-");
  const trimmed = cleaned.replace(/^-+|-+$/g, "");
  const limited = trimmed.length > 120 ? trimmed.slice(0, 120) : trimmed;
  return limited === "" ? "image" : limited;
};
