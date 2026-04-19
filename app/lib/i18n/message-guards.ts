export type PillarItem = {
  title: string;
  body: string;
};

export type CatalogBlock = {
  title: string;
  items: string[];
};

const isRecord = (value: unknown): value is Record<string, unknown> =>
  value !== null && typeof value === "object";

export const isStringArray = (value: unknown): value is string[] =>
  Array.isArray(value) && value.every((item) => typeof item === "string");

export const isPillarItemArray = (value: unknown): value is PillarItem[] =>
  Array.isArray(value) &&
  value.every((item) => {
    if (!isRecord(item)) {
      return false;
    }
    return typeof item.title === "string" && typeof item.body === "string";
  });

export const isCatalogBlockArray = (value: unknown): value is CatalogBlock[] =>
  Array.isArray(value) &&
  value.every((block) => {
    if (!isRecord(block)) {
      return false;
    }
    return (
      typeof block.title === "string" && isStringArray(block.items)
    );
  });

export const requireLandingMessage = <T>(
  value: unknown,
  predicate: (value: unknown) => value is T,
  messageKey: string,
): T => {
  if (!predicate(value)) {
    throw new Error(`Invalid Landing message shape: ${messageKey}`);
  }
  return value;
};
