import "server-only";

import * as _ from "lodash";

const NOVA_POSHTA_JSON_URL = "https://api.novaposhta.ua/v2.0/json/";

type NpRequestBody = {
  modelName: string;
  calledMethod: string;
  methodProperties: Record<string, unknown>;
};

type NpApiEnvelope<T> = {
  success: boolean;
  data?: T;
  errors?: string[];
  warnings?: string[] | null;
  info?: unknown;
};

const isRecord = (value: unknown): value is Record<string, unknown> =>
  value !== null && typeof value === "object" && !Array.isArray(value);

export const callNovaPoshta = async <T = unknown[]>(
  apiKey: string,
  body: NpRequestBody,
): Promise<T> => {
  const response = await fetch(NOVA_POSHTA_JSON_URL, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(
      _.assign({}, body, { apiKey }) as Record<string, unknown>,
    ),
    next: { revalidate: 0 },
  });
  if (!response.ok) {
    throw new Error(
      `Nova Poshta HTTP ${response.status}: ${response.statusText}`,
    );
  }
  const json: unknown = await response.json();
  if (!isRecord(json) || !_.isBoolean(json["success"])) {
    throw new Error("Nova Poshta: invalid response shape");
  }
  const envelope = json as NpApiEnvelope<T>;
  if (!envelope.success) {
    const firstError =
      Array.isArray(envelope.errors) && envelope.errors[0] !== undefined
        ? String(envelope.errors[0])
        : "Unknown Nova Poshta error";
    throw new Error(`Nova Poshta: ${firstError}`);
  }
  if (envelope.data === undefined) {
    return [] as T;
  }
  return envelope.data;
};
