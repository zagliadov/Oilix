import "server-only";

import * as _ from "lodash";

import { callNovaPoshta } from "./call-nova-poshta";

export type NpCityOption = { ref: string; name: string };
export type NpWarehouseOption = { ref: string; label: string; number: number | null };

const isRecord = (value: unknown): value is Record<string, unknown> =>
  value !== null && typeof value === "object" && !Array.isArray(value);

const mapCityRow = (row: unknown): NpCityOption | null => {
  if (!isRecord(row)) {
    return null;
  }
  const ref = row["Ref"];
  const description = row["Description"];
  if (typeof ref !== "string" || ref === "" || typeof description !== "string") {
    return null;
  }
  return { ref, name: description };
};

const mapWarehouseRow = (row: unknown): NpWarehouseOption | null => {
  if (!isRecord(row)) {
    return null;
  }
  const ref = row["Ref"];
  const description = row["Description"] ?? row["DescriptionRu"];
  if (typeof ref !== "string" || ref === "") {
    return null;
  }
  const name =
    typeof description === "string" && description.length > 0
      ? description
      : ref;
  const numberRaw = row["Number"];
  const number =
    typeof numberRaw === "number" && !Number.isNaN(numberRaw) ? numberRaw : null;
  const label = number != null ? `№${number} — ${name}` : name;
  return { ref, label, number };
};

/**
 * @see Nova Poshta API — Address/getCities
 */
export const searchNpCities = async (
  apiKey: string,
  findByString: string,
): Promise<NpCityOption[]> => {
  const trimmed = findByString.trim();
  if (trimmed.length < 2) {
    return [];
  }
  const data = await callNovaPoshta<unknown[]>(apiKey, {
    modelName: "Address",
    calledMethod: "getCities",
    methodProperties: {
      Page: "1",
      FindByString: trimmed,
      Limit: "50",
    },
  });
  if (!Array.isArray(data)) {
    return [];
  }
  return _.compact(_.map(data, (row) => mapCityRow(row)));
};

/**
 * @see Nova Poshta API — Address/getWarehouses
 */
export const listNpWarehouses = async (
  apiKey: string,
  cityRef: string,
  findByString?: string,
): Promise<NpWarehouseOption[]> => {
  if (cityRef.trim() === "") {
    return [];
  }
  const find = findByString?.trim() ?? "";
  const data = await callNovaPoshta<unknown[]>(apiKey, {
    modelName: "Address",
    calledMethod: "getWarehouses",
    methodProperties: {
      CityRef: cityRef,
      Page: "1",
      Limit: "200",
      ...(find.length > 0 ? { FindByString: find } : {}),
    },
  });
  if (!Array.isArray(data)) {
    return [];
  }
  return _.compact(_.map(data, (row) => mapWarehouseRow(row)));
};
