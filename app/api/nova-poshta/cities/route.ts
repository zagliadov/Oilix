import { getNovaPoshtaApiKey } from "@/app/lib/nova-poshta/env";
import { searchNpCities } from "@/app/lib/nova-poshta/np-address";

/**
 * JSON: { data: { ref, name }[] } or 503 if NPAPI is not set.
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
  const query = searchParams.get("q")?.trim() ?? "";
  try {
    const data = await searchNpCities(apiKey, query);
    return Response.json({ data });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Nova Poshta request failed";
    return Response.json({ error: "np_error", message, data: [] as [] }, { status: 502 });
  }
};
