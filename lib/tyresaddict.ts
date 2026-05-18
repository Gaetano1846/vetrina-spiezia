const BASE = "/api/tyresaddict";

async function call(path: string, qs?: Record<string, string | number>): Promise<Record<string, unknown>> {
  const params = new URLSearchParams();
  if (qs) Object.entries(qs).forEach(([k, v]) => params.set(k, String(v)));
  const query = params.toString();
  const url = `${BASE}/${path}${query ? `?${query}` : ""}`;
  const res = await fetch(url);
  if (!res.ok) throw new Error(`tyresaddict ${res.status}: ${path}`);
  const json = await res.json() as Record<string, unknown>;
  if (!json.result) throw new Error(`tyresaddict error: ${json.message ?? path}`);
  return json;
}

export type TaMake = { make_id: string; make_name: string };
export type TaModel = { model_id: string; model_name: string; model_start_year: string; model_end_year: string };
export type TaModification = { mod_id: string; mod_name: string };
export type TaTyre = { width: string; profile: string; r: string };
export type TaFitment = { tyres: { factory: TaTyre[]; replace: TaTyre[] } };

export async function getMakes(): Promise<TaMake[]> {
  const json = await call("makes");
  return json.makes as TaMake[];
}

export async function getModels(makeId: string): Promise<TaModel[]> {
  const json = await call("models", { make_id: makeId });
  return json.models as TaModel[];
}

export async function getYears(modelId: string): Promise<number[]> {
  const json = await call("model_years", { model_id: modelId });
  return json.years as number[];
}

export async function getModifications(modelId: string, year: number): Promise<TaModification[]> {
  const json = await call("model_modifications", { model_id: modelId, year });
  return json.modifications as TaModification[];
}

export async function getFitment(modelId: string, year: number, modId: string): Promise<TaFitment> {
  const json = await call("fitment", { model_id: modelId, year, mod_id: modId });
  return json.fitment as TaFitment;
}
