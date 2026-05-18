import { algoliasearch } from "algoliasearch";
import type { Prodotto } from "./types";

const APP_ID = process.env.NEXT_PUBLIC_ALGOLIA_APP_ID || "";
const SEARCH_KEY = process.env.NEXT_PUBLIC_ALGOLIA_SEARCH_KEY || "";
const INDEX = process.env.NEXT_PUBLIC_ALGOLIA_INDEX || "Prodotti";
const INDEX_PRICE_ASC = process.env.NEXT_PUBLIC_ALGOLIA_INDEX_PRICE_ASC || `${INDEX}_prezzo_privato_asc`;
const COMBINATIONS_INDEX = "Combinations";

let _client: ReturnType<typeof algoliasearch> | null = null;
function client() {
  if (!_client) _client = algoliasearch(APP_ID, SEARCH_KEY);
  return _client;
}

export function isAlgoliaConfigured(): boolean {
  return !!APP_ID && !!SEARCH_KEY;
}

type AlgoliaHit = Record<string, unknown> & { objectID: string };

function toStr(v: unknown, fb = ""): string {
  if (v === null || v === undefined) return fb;
  return String(v);
}
function toNum(v: unknown, fb = 0): number {
  if (typeof v === "number" && !isNaN(v)) return v;
  if (typeof v === "string") {
    const n = parseFloat(v.replace(",", "."));
    return isNaN(n) ? fb : n;
  }
  return fb;
}
function toBool(v: unknown): boolean {
  if (typeof v === "boolean") return v;
  if (typeof v === "string") return v.toLowerCase() === "true" || v === "1";
  return false;
}

function calcPfu(diametro: unknown, catPath: string): number {
  const d = typeof diametro === "string" ? parseInt(diametro, 10) : Number(diametro) || 0;
  const cat = catPath.toLowerCase();
  if (cat.includes("moto") || cat.includes("scooter")) {
    if (d <= 15) return 0.90;
    if (d <= 17) return 1.20;
    return 1.50;
  }
  if (cat.includes("autocarro") || cat.includes("furgo") || cat.includes("commerc") || cat.includes("trasporto")) {
    if (d <= 15) return 4.50;
    if (d <= 17) return 5.50;
    if (d <= 19) return 7.00;
    return 9.00;
  }
  if (d <= 13) return 1.50;
  if (d <= 14) return 1.80;
  if (d <= 15) return 2.20;
  if (d <= 16) return 2.50;
  if (d <= 17) return 2.80;
  if (d <= 18) return 3.20;
  if (d <= 19) return 3.80;
  if (d <= 20) return 4.30;
  if (d <= 21) return 4.80;
  return 5.50;
}

function normalizeStagione(raw: unknown): Prodotto["stagione"] {
  const s = toStr(raw).toLowerCase();
  if (!s) return "4-Stagioni";
  if (s.includes("invern")) return "Invernali";
  if (s.includes("estiv") || s.includes("summer")) return "Estive";
  return "4-Stagioni";
}

function normalizeCategoria(path: string): Prodotto["categoria"] {
  const s = path.toLowerCase();
  if (s.includes("suv") || s.includes("4x4")) return "SUV";
  if (s.includes("moto") || s.includes("scooter")) return "Moto";
  if (s.includes("furgo") || s.includes("autocarro") || s.includes("commerc")) return "Furgone";
  return "Auto";
}

function computeStock(h: AlgoliaHit): number {
  if (toBool(h.T24)) return toNum(h.Stock_T24);
  const locals = [
    toNum(h.Stock_Nola), toNum(h.Stock_Nola_2),
    toNum(h.Stock_Roma), toNum(h.Stock_Volla), toNum(h.Stock_Portici),
  ].reduce((a, b) => a + b, 0);
  if (locals > 0) return locals;
  return toBool(h.hasStock) ? 1 : 0;
}

const IVA = 1.22;
function applyIva(n: number) { return Math.round(n * IVA * 100) / 100; }

export function mapAlgoliaHit(h: AlgoliaHit): Prodotto {
  const t24 = toBool(h.T24);
  const prezzoNetto = t24 ? toNum(h.Prezzo_T24) : toNum(h.Prezzo_Privato);
  const prezzo = applyIva(prezzoNetto);
  const prezzoPrec = applyIva(toNum(h.Prezzo_Gommista ?? h.Prezzo_Grossista, 0));
  const catPath = toStr(h._categoryPath ?? h.Categoria);
  const immagine = (toStr(h.Immagine) || toStr(h.Foto) || "").trim() || "https://media4.tyre-shopping.com/images_ts/tyre/nopic_nobr-MjM4NzA2-w300-h300-br1-24000238706.jpg";
  const pfuNetto = (h.PFU != null && toNum(h.PFU) > 0) ? toNum(h.PFU) : calcPfu(h.Diametro, catPath);

  return {
    id: h.objectID,
    titolo: toStr(h.Titolo, h.objectID),
    marca: toStr(h.Marca),
    modello: toStr(h.Modello),
    larghezza: toStr(h.Larghezza),
    altezza: toStr(h.Altezza),
    diametro: toStr(h.Diametro),
    indiceCarico: toStr(h.Indice_Carico),
    indiceVelocita: toStr(h.Indice_Velocita),
    stagione: normalizeStagione(h.Stagione),
    categoria: normalizeCategoria(catPath),
    immagine,
    prezzo,
    prezzoPrecedente: prezzoPrec > prezzo && prezzo > 0 ? prezzoPrec : undefined,
    pfu: applyIva(pfuNetto),
    stock: computeStock(h),
    rating: toNum(h.rating, 4.5),
    recensioni: toNum(h.recensioni, 0),
    indiceBagnato: toStr(h.Indice_Bagnato),
    indiceConsumo: toStr(h.Indice_Consumo),
    indiceRumorosita: toStr(h.Indice_Rumorosita),
    ean: toStr(h.EAN),
    sku: toStr(h.SKU),
    t24,
  };
}

const STAGIONE_VARIANTS: Record<string, string[]> = {
  Estive: ["Estivi", "Estive"],
  Invernali: ["Invernali"],
  "4-Stagioni": ["4 Stagioni", "Pneumatici 4 stagioni"],
};

const CATEGORIA_MAP: Record<string, string[]> = {
  auto:       ["Categoria_Prodotti/Pneumatici Auto"],
  autocarro:  ["Categoria_Prodotti/Pneumatici Autocarro"],
  agro:       ["Categoria_Prodotti/Pneumatici Agroindustriali"],
};

export type SearchOpts = {
  query?: string;
  page?: number;
  hitsPerPage?: number;
  larghezza?: string;
  altezza?: string;
  diametro?: string;
  marche?: string[];
  stagioni?: string[];
  indiciVelocita?: string[];
  indiciCarico?: string[];
  categoria?: string;
  spedizioneVeloce?: boolean;
  sortByPrice?: "asc" | "desc";
};

export type SearchResult = {
  hits: Prodotto[];
  nbHits: number;
  page: number;
  nbPages: number;
  facets: Record<string, Record<string, number>>;
};

function buildFacetFilters(o: SearchOpts): (string | string[])[] {
  const ff: (string | string[])[] = [];
  if (o.categoria) {
    const vals = CATEGORIA_MAP[o.categoria] ?? [`Categoria_Prodotti/Pneumatici ${o.categoria}`];
    ff.push(vals.map((v) => `Categoria:${v}`));
  }
  // Larghezza/Altezza/Diametro are NOT attributesForFaceting → filtered via full-text query in _search
  if (o.marche?.length) ff.push(o.marche.map((m) => `Marca:${m}`));
  if (o.indiciVelocita?.length) ff.push(o.indiciVelocita.map((v) => `Indice_Velocita:${v}`));
  if (o.indiciCarico?.length)   ff.push(o.indiciCarico.map((v)  => `Indice_Carico:${v}`));
  if (o.stagioni?.length) {
    const expanded: string[] = [];
    for (const s of o.stagioni) {
      for (const v of STAGIONE_VARIANTS[s] ?? [s]) expanded.push(`Stagione:${v}`);
    }
    ff.push(expanded);
  }
  return ff;
}

async function _search(indexName: string, opts: SearchOpts): Promise<SearchResult> {
  // Dimensions are not Algolia facets — build a text query like "205/55 R16"
  const dimensionQuery = !opts.query && opts.larghezza && opts.altezza && opts.diametro
    ? `${opts.larghezza}/${opts.altezza} R${opts.diametro}`
    : opts.query ?? "";

  const res = await client().searchSingleIndex<AlgoliaHit>({
    indexName,
    searchParams: {
      query: dimensionQuery,
      page: opts.page ?? 0,
      hitsPerPage: opts.hitsPerPage ?? 24,
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      facetFilters: buildFacetFilters(opts) as any,
      filters: "Prezzo_Privato >= 20 OR Prezzo_T24 >= 20",
      facets: ["Marca", "Stagione", "Indice_Velocita", "Indice_Carico", "Categoria"],
    },
  });
  const hits = (res.hits as unknown as AlgoliaHit[])
    .map((h) => mapAlgoliaHit(h))
    .filter((p) => {
      if (p.prezzo <= 0) return false;
      const t = (p.titolo + " " + p.modello).toLowerCase();
      return !t.includes("camera d'aria") && !t.includes("camera d aria");
    });
  return {
    hits,
    nbHits: res.nbHits ?? 0,
    page: res.page ?? 0,
    nbPages: res.nbPages ?? 0,
    facets: (res.facets ?? {}) as Record<string, Record<string, number>>,
  };
}

export async function searchProdotti(opts: SearchOpts = {}): Promise<SearchResult> {
  if (opts.sortByPrice === "asc") {
    try { return await _search(INDEX_PRICE_ASC, opts); } catch { /* fall through */ }
  }
  return await _search(INDEX, opts);
}

export async function getProdottoById(id: string): Promise<Prodotto | null> {
  try {
    const res = await client().getObject<AlgoliaHit>({ indexName: INDEX, objectID: id });
    return mapAlgoliaHit(res as AlgoliaHit);
  } catch {
    return null;
  }
}

export async function dimensionValues(
  field: "Larghezza" | "Altezza" | "Diametro",
  larghezza?: string,
  altezza?: string,
): Promise<string[]> {
  const facetFilters: string[][] = [];
  if (larghezza) facetFilters.push([`Larghezza:${larghezza}`]);
  if (altezza)   facetFilters.push([`Altezza:${altezza}`]);
  const unique = new Set<string>();
  let page = 0;
  try {
    while (true) {
      const res = await client().searchSingleIndex<Record<string, unknown>>({
        indexName: COMBINATIONS_INDEX,
        searchParams: {
          query: "",
          filters: "Counter > 0",
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          ...(facetFilters.length ? { facetFilters: facetFilters as any } : {}),
          attributesToRetrieve: [field],
          hitsPerPage: 1000,
          page,
        },
      });
      const hits = res.hits as Array<Record<string, unknown>>;
      for (const hit of hits) {
        const v = hit[field];
        if (typeof v === "string" && v) unique.add(v);
      }
      if (page >= (res.nbPages ?? 0) - 1 || hits.length < 1000) break;
      page++;
    }
  } catch { /* ignore */ }
  return Array.from(unique).sort((a, b) => Number(a) - Number(b));
}

export async function facetValues(attr: string, extra: SearchOpts = {}): Promise<string[]> {
  const ff = buildFacetFilters(extra);
  try {
    const res = await client().searchSingleIndex<AlgoliaHit>({
      indexName: INDEX,
      searchParams: {
        query: "",
        hitsPerPage: 0,
        maxValuesPerFacet: 500,
        facets: [attr],
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        ...(ff.length ? { facetFilters: ff as any } : {}),
      },
    });
    return Object.keys(((res.facets ?? {}) as Record<string, Record<string, number>>)[attr] ?? {});
  } catch {
    return [];
  }
}
