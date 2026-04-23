"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { useTranslations } from "next-intl";

import type { CheckoutFormValues } from "@/app/lib/checkout/types";
import { FormField, formInputClassName } from "@/components/forms/form-field";

type NpCityRow = { ref: string; name: string };
type NpWarehouseRow = { ref: string; label: string; number: number | null };

type CheckoutNovaPoshtaBlockProps = {
  formValues: CheckoutFormValues;
  fieldErrors: Partial<Record<keyof CheckoutFormValues, string>>;
  isNpApiConfigured: boolean;
  onFieldChange: <K extends keyof CheckoutFormValues>(
    field: K,
    value: CheckoutFormValues[K],
  ) => void;
};

const CITY_SEARCH_MIN = 2;
const DEBOUNCED_MS = 400;

export const CheckoutNovaPoshtaBlock = ({
  formValues,
  fieldErrors,
  isNpApiConfigured,
  onFieldChange,
}: CheckoutNovaPoshtaBlockProps) => {
  const tr = useTranslations("Checkout");
  const [cityQuery, setCityQuery] = useState(() => formValues.npCityName);
  const [cityRows, setCityRows] = useState<NpCityRow[]>([]);
  const [warehouseRows, setWarehouseRows] = useState<NpWarehouseRow[]>([]);
  const [warehouseFilter, setWarehouseFilter] = useState("");
  const [citiesLoading, setCitiesLoading] = useState(false);
  const [warehousesLoading, setWarehousesLoading] = useState(false);
  const [apiHint, setApiHint] = useState<string | null>(null);
  const searchTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  const cityRef = formValues.npCityRef.trim();
  const cityQueryTrimmed = cityQuery.trim();
  const displayCityRows: NpCityRow[] = useMemo(() => {
    if (!isNpApiConfigured) {
      return [];
    }
    const selectedRef = formValues.npCityRef.trim();
    const selectedName = formValues.npCityName.trim();
    const fromSearch =
      cityQueryTrimmed.length >= CITY_SEARCH_MIN ? cityRows : [];
    if (selectedRef === "" || selectedName === "") {
      return fromSearch;
    }
    const selectedInList = fromSearch.some((city) => city.ref === selectedRef);
    if (selectedInList) {
      return fromSearch;
    }
    return [{ ref: selectedRef, name: selectedName }, ...fromSearch];
  }, [
    isNpApiConfigured,
    cityQueryTrimmed,
    cityRows,
    formValues.npCityRef,
    formValues.npCityName,
  ]);
  const displayCitiesLoading: boolean =
    isNpApiConfigured &&
    cityQueryTrimmed.length >= CITY_SEARCH_MIN &&
    citiesLoading;
  const warehouses: NpWarehouseRow[] =
    !isNpApiConfigured || cityRef === "" ? [] : warehouseRows;
  const displayWarehousesLoading: boolean = cityRef !== "" && warehousesLoading;

  // Debounced search cities
  useEffect(() => {
    if (!isNpApiConfigured) {
      return;
    }
    if (searchTimer.current !== null) {
      clearTimeout(searchTimer.current);
    }
    const q = cityQuery.trim();
    if (q.length < CITY_SEARCH_MIN) {
      return;
    }
    searchTimer.current = setTimeout(() => {
      void (async () => {
        setCitiesLoading(true);
        setApiHint(null);
        try {
          const response = await fetch(
            `/api/nova-poshta/cities?${new URLSearchParams({ q })}`,
          );
          if (response.status === 503) {
            setCityRows([]);
            setApiHint(tr("npNotConfiguredMessage"));
            return;
          }
          if (!response.ok) {
            setCityRows([]);
            setApiHint(tr("npListError"));
            return;
          }
          const body = (await response.json()) as { data: NpCityRow[] };
          setCityRows(body.data);
        } catch {
          setCityRows([]);
          setApiHint(tr("npListError"));
        } finally {
          setCitiesLoading(false);
        }
      })();
    }, DEBOUNCED_MS);
    return () => {
      if (searchTimer.current !== null) {
        clearTimeout(searchTimer.current);
      }
    };
  }, [cityQuery, isNpApiConfigured, tr]);

  // Load warehouses when a city is selected
  useEffect(() => {
    if (!isNpApiConfigured || cityRef === "") {
      return;
    }
    const searchParams = new URLSearchParams({ cityRef });
    const filterTrimmed = warehouseFilter.trim();
    if (filterTrimmed.length > 0) {
      searchParams.set("filter", filterTrimmed);
    }
    const controller = new AbortController();
    void (async () => {
      setWarehousesLoading(true);
      setApiHint(null);
      try {
        const response = await fetch(
          `/api/nova-poshta/warehouses?${searchParams.toString()}`,
          { signal: controller.signal },
        );
        if (!response.ok) {
          setWarehouseRows([]);
          setApiHint(tr("npListError"));
          return;
        }
        const body = (await response.json()) as { data: NpWarehouseRow[] };
        setWarehouseRows(body.data);
      } catch (error) {
        if (error instanceof DOMException && error.name === "AbortError") {
          return;
        }
        setWarehouseRows([]);
        setApiHint(tr("npListError"));
      } finally {
        setWarehousesLoading(false);
      }
    })();
    return () => {
      controller.abort();
    };
  }, [isNpApiConfigured, cityRef, warehouseFilter, tr]);

  if (!isNpApiConfigured) {
    return (
      <FormField
        id="checkout-np-manual"
        label={tr("fieldNpBranchManual")}
        required
        description={tr("fieldNpBranchManualHint")}
        error={fieldErrors.npBranchManual}
      >
        <input
          id="checkout-np-manual"
          name="npBranchManual"
          type="text"
          value={formValues.npBranchManual}
          onChange={(event) => {
            onFieldChange("npBranchManual", event.target.value);
          }}
          className={formInputClassName(Boolean(fieldErrors.npBranchManual))}
          autoComplete="off"
          placeholder={tr("fieldNpBranchManualPlaceholder")}
        />
      </FormField>
    );
  }

  return (
    <div className="space-y-4 rounded-md border border-border/80 bg-muted/10 p-4 dark:border-white/10 dark:bg-white/3">
      <p className="text-sm text-muted-foreground">{tr("npApiHint")}</p>
      {apiHint !== null ? (
        <p
          className="text-sm text-amber-800 dark:text-amber-200/90"
          role="status"
        >
          {apiHint}
        </p>
      ) : null}

      <FormField
        id="checkout-np-city-search"
        label={tr("fieldNpCitySearch")}
        description={tr("fieldNpCitySearchHint")}
        error={fieldErrors.npCityRef}
      >
        <input
          id="checkout-np-city-search"
          name="npCitySearch"
          type="search"
          value={cityQuery}
          onChange={(event) => {
            setCityQuery(event.target.value);
          }}
          className={formInputClassName(Boolean(fieldErrors.npCityRef))}
          autoComplete="off"
          placeholder={tr("fieldNpCitySearchPlaceholder")}
          aria-busy={displayCitiesLoading}
        />
      </FormField>

      <FormField
        id="checkout-np-city"
        label={tr("fieldNpCity")}
        required
        error={fieldErrors.npCityRef}
      >
        <select
          id="checkout-np-city"
          name="npCityRef"
          value={formValues.npCityRef}
          onChange={(event) => {
            const nextRef = event.target.value;
            const row = displayCityRows.find((city) => city.ref === nextRef);
            onFieldChange("npCityRef", nextRef);
            onFieldChange("npCityName", row?.name ?? "");
            onFieldChange("npWarehouseRef", "");
            onFieldChange("npWarehouseName", "");
            setCityQuery(row?.name ?? "");
            setWarehouseFilter("");
          }}
          className={formInputClassName(Boolean(fieldErrors.npCityRef))}
        >
          <option value="">{tr("selectCityPlaceholder")}</option>
          {displayCityRows.map((city) => (
            <option key={city.ref} value={city.ref}>
              {city.name}
            </option>
          ))}
        </select>
        <p
          className="mt-1.5 min-h-5 text-xs text-muted-foreground"
          aria-live="polite"
        >
          <span className={displayCitiesLoading ? "opacity-100" : "opacity-0"}>
            {tr("npLoadingCities")}
          </span>
        </p>
      </FormField>

      <FormField
        id="checkout-np-warehouse-filter"
        label={tr("fieldNpWarehouseFilter")}
        description={tr("fieldNpWarehouseFilterHint")}
        error={undefined}
      >
        <input
          id="checkout-np-warehouse-filter"
          name="npWarehouseFilter"
          type="search"
          value={warehouseFilter}
          onChange={(event) => {
            setWarehouseFilter(event.target.value);
          }}
          className={formInputClassName(false)}
          autoComplete="off"
          disabled={cityRef === ""}
          placeholder={tr("fieldNpWarehouseFilterPlaceholder")}
        />
      </FormField>

      <FormField
        id="checkout-np-warehouse"
        label={tr("fieldNpWarehouse")}
        required
        error={fieldErrors.npWarehouseRef}
      >
        <select
          id="checkout-np-warehouse"
          name="npWarehouseRef"
          value={formValues.npWarehouseRef}
          disabled={displayWarehousesLoading || cityRef === ""}
          onChange={(event) => {
            const nextRef = event.target.value;
            const row = warehouses.find(
              (warehouse) => warehouse.ref === nextRef,
            );
            onFieldChange("npWarehouseRef", nextRef);
            onFieldChange("npWarehouseName", row?.label ?? "");
          }}
          className={formInputClassName(Boolean(fieldErrors.npWarehouseRef))}
        >
          <option value="">{tr("selectWarehousePlaceholder")}</option>
          {warehouses.map((warehouse) => (
            <option key={warehouse.ref} value={warehouse.ref}>
              {warehouse.label}
            </option>
          ))}
        </select>
        <p
          className="mt-1.5 min-h-5 text-xs text-muted-foreground"
          aria-live="polite"
        >
          <span
            className={displayWarehousesLoading ? "opacity-100" : "opacity-0"}
          >
            {tr("npLoadingWarehouses")}
          </span>
        </p>
      </FormField>
    </div>
  );
};
