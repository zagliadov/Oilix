import { getNovaPoshtaApiKey } from "@/app/lib/nova-poshta/env";
import { listNpWarehouses } from "@/app/lib/nova-poshta/np-address";

/**
 * JSON: { data: { ref, label, number }[] } or 503 if NPAPI is not set.
 * Query: cityRef (required), filter (optional).
 */
export const GET = async (request: Request) => {
  const apiKey = getNovaPoshtaApiKey();
  if (apiKey === undefined) {
    return Response.json(
      { error: "not_configured", data: [] },
      { status: 503 },
    );
  }
  const { searchParams } = new URL(request.url);
  const cityRef = searchParams.get("cityRef")?.trim() ?? "";
  if (cityRef === "") {
    return Response.json(
      { error: "city_ref_required", data: [] as [] },
      { status: 400 },
    );
  }
  const filter = searchParams.get("filter")?.trim() ?? undefined;
  try {
    const data = await listNpWarehouses(apiKey, cityRef, filter);
    return Response.json({ data });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Nova Poshta request failed";
    return Response.json(
      { error: "np_error", message, data: [] as [] },
      { status: 502 },
    );
  }
};
