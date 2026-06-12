import { cache } from "react";
import { algoliasearch } from "algoliasearch";
import type { Prodotto } from "./types";

const APP_ID = process.env.NEXT_PUBLIC_ALGOLIA_APP_ID || "";
const SEARCH_KEY = process.env.NEXT_PUBLIC_ALGOLIA_SEARCH_KEY || "";
const INDEX = process.env.NEXT_PUBLIC_ALGOLIA_INDEX || "Prodotti";
const INDEX_PRICE_ASC = process.env.NEXT_PUBLIC_ALGOLIA_INDEX_PRICE_ASC || `${INDEX}_prezzo_privato_asc`;
const INDEX_PRICE_DESC = process.env.NEXT_PUBLIC_ALGOLIA_INDEX_PRICE_DESC || `${INDEX}_prezzo_privato_desc`;
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

// Replica esatta di calculatePFU del progetto Flutter (solo diametro, nessuna categoria).
function calcPfu(diametro: unknown): number {
  const d = typeof diametro === "string" ? parseFloat(diametro) : Number(diametro);
  if (!Number.isFinite(d)) return 3.70;
  const truck = [17.5, 19.5, 22.5, 24.5, 26.5, 30.0];
  const car = [13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24];
  if (truck.includes(d)) {
    if (d === 17.5 || d === 19.5 || d === 22.5) return 14.50;
    if (d === 24.5 || d === 26.5 || d === 30.0) return 18.70;
    return 14.50;
  }
  if (car.includes(d)) {
    if (d === 13) return 1.00;
    if (d === 14 || d === 15) return 1.80;
    if (d >= 16 && d <= 19) return 2.60;
    return 3.70;
  }
  return (d * 10) % 10 === 5 ? 14.50 : 3.70;
}

// Base di prezzo GREZZA (prima del ricarico): il campo costo/listino usato dal Flutter
// a seconda di marca/canale. Se vale 0 il prodotto non ha un prezzo reale (dato mancante).
function sellableBaseRaw(h: AlgoliaHit): number {
  const t24 = toBool(h.T24);
  const marca = toStr(h.Marca).toUpperCase();
  if (t24) return toNum(h.Prezzo_T24);
  if (marca === "PIRELLI" || marca === "BRIDGESTONE") return toNum(h.Prezzo_Gommista);
  return toNum(h.Prezzo_Acquisto);
}

// Un prodotto è VENDIBILE solo se la sua base di prezzo è > 0. Esclude i record con
// Prezzo_Acquisto/Gommista/T24 mancante (=0): senza questo filtro verrebbero venduti
// sotto costo (solo ricarico diametro) e apparirebbero come finte mega-offerte.
// Usato da ogni entry-point prodotti (catalogo, offerte, dettaglio, sitemap).
export function hasValidPrice(h: AlgoliaHit): boolean {
  return sellableBaseRaw(h) > 0;
}

// Prezzo base di VENDITA, replica esatta del carrello Flutter (updateCarrello/checkCartUpdate):
//  base = Prezzo_T24 (T24) | Prezzo_Gommista (Pirelli/Bridgestone) | Prezzo_Acquisto (altri)
//  + ricarico fisso per diametro (regole per marca) + 12% se T24.
function flutterBasePrice(h: AlgoliaHit): number {
  const t24 = toBool(h.T24);
  const marca = toStr(h.Marca).toUpperCase();
  const d = parseFloat(toStr(h.Diametro));
  let base = sellableBaseRaw(h);
  if (Number.isFinite(d)) {
    if (marca === "COMPASAL") {
      if (d <= 16) base += 20;
      else if (d === 17) base += 23;
      else if (d >= 18) base += 28;
    } else if (marca === "PIRELLI" || marca === "BRIDGESTONE") {
      if (d <= 18) base += 10;
      else if (d >= 19) base += 15;
    } else {
      if (d <= 16) base += 15;
      else if (d >= 17 && d <= 18) base += 20;
      else if (d >= 19) base += 25;
    }
  }
  if (t24) base *= 1.12;
  return base;
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
  // Prezzo di vendita con la formula esatta del Flutter (base costo/listino + ricarico diametro + IVA).
  const prezzo = applyIva(flutterBasePrice(h));
  const prezzoPrec = applyIva(toNum(h.Prezzo_Gommista ?? h.Prezzo_Grossista, 0));
  const catPath = toStr(h._categoryPath ?? h.Categoria);
  const immagine = (toStr(h.Immagine) || toStr(h.Foto) || "").trim() || "https://media4.tyre-shopping.com/images_ts/tyre/nopic_nobr-MjM4NzA2-w300-h300-br1-24000238706.jpg";
  const pfuNetto = (h.PFU != null && toNum(h.PFU) > 0) ? toNum(h.PFU) : calcPfu(h.Diametro);

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

// Le dimensioni NON sono facet Algolia (Larghezza/Altezza/Diametro non sono attributesForFaceting):
// vengono applicate come testo libero. Costruiamo la stringa PIÙ SPECIFICA possibile anche con
// misure PARZIALI (es. solo larghezza "205") e la combiniamo con l'eventuale ricerca testuale `q`,
// invece di sceglierne una sola. Così "michelin" + misura, o "solo 205", filtrano davvero.
function buildSearchQuery(o: SearchOpts): string {
  const parts: string[] = [];
  if (o.query) parts.push(o.query.trim());
  const { larghezza: w, altezza: h, diametro: d } = o;
  let dim = "";
  if (w && h && d) dim = `${w}/${h} R${d}`;
  else if (w && h) dim = `${w}/${h}`;
  else if (h && d) dim = `${h} R${d}`;
  else if (w) dim = w;
  else if (d) dim = `R${d}`;
  else if (h) dim = h;
  if (dim) parts.push(dim);
  return parts.join(" ").trim();
}

async function _search(indexName: string, opts: SearchOpts): Promise<SearchResult> {
  const res = await client().searchSingleIndex<AlgoliaHit>({
    indexName,
    searchParams: {
      query: buildSearchQuery(opts),
      page: opts.page ?? 0,
      hitsPerPage: opts.hitsPerPage ?? 24,
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      facetFilters: buildFacetFilters(opts) as any,
      filters: "Prezzo_Privato >= 20 OR Prezzo_T24 >= 20",
      facets: ["Marca", "Stagione", "Indice_Velocita", "Indice_Carico", "Categoria"],
    },
  });
  const hits = (res.hits as unknown as AlgoliaHit[])
    .filter((h) => hasValidPrice(h)) // niente prodotti con base prezzo = 0
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

const EMPTY_RESULT: SearchResult = { hits: [], nbHits: 0, page: 0, nbPages: 0, facets: {} };

export async function searchProdotti(opts: SearchOpts = {}): Promise<SearchResult> {
  // asc/desc usano le replica ordinate per Prezzo_Privato; se la replica non esiste in
  // Algolia la chiamata fallisce e si ricade sull'indice base (rilevanza) senza rompere la pagina.
  const sortedIndex =
    opts.sortByPrice === "asc" ? INDEX_PRICE_ASC :
    opts.sortByPrice === "desc" ? INDEX_PRICE_DESC : null;
  if (sortedIndex) {
    try { return await _search(sortedIndex, opts); } catch { /* fall through to relevance */ }
  }
  try {
    return await _search(INDEX, opts);
  } catch (err) {
    console.error("[Algolia] searchProdotti failed:", err);
    return EMPTY_RESULT;
  }
}

// ─── Offerte ─────────────────────────────────────────────────────────────────
// Il DB non ha un campo "in offerta": l'unico segnale di sconto è Prezzo_Gommista/
// Grossista > Prezzo_Privato (già mappato in prezzoPrecedente). La maggior parte dei
// prodotti ha ribassi minimi (~5%, normale markup), quindi consideriamo "offerta" solo
// uno sconto REALE ≥ minDiscount su prodotto in stock, ordinato per sconto decrescente.
export type Offerta = Prodotto & { sconto: number };

export async function getOfferte(opts: { limit?: number; minDiscount?: number } = {}): Promise<{ offerte: Offerta[]; total: number }> {
  const limit = opts.limit ?? 24;
  const minDiscount = opts.minDiscount ?? 10;
  // Indice vendibile (stesso del catalogo, ~3.3k prodotti a stock proprio), NON i 122k dropship.
  let raw: AlgoliaHit[] = [];
  try {
    const res = await client().searchSingleIndex<AlgoliaHit>({
      indexName: INDEX_PRICE_ASC,
      searchParams: { query: "", hitsPerPage: 1000, filters: "Prezzo_Privato >= 20" },
    });
    raw = res.hits as unknown as AlgoliaHit[];
  } catch (err) {
    console.error("[Algolia] getOfferte failed:", err);
    return { offerte: [], total: 0 };
  }
  // Sconto reale = listino max(Gommista, Grossista) vs prezzo Privato. Usiamo max() (non `??`)
  // perché spesso uno dei due è 0; sovrascriviamo prezzoPrecedente così il badge sconto compare.
  const offers: Offerta[] = [];
  for (const h of raw) {
    if (!hasValidPrice(h)) continue; // niente prodotti con base prezzo = 0
    const p = mapAlgoliaHit(h);
    if (p.prezzo <= 0 || p.stock <= 0) continue;
    const t = (p.titolo + " " + p.modello).toLowerCase();
    if (t.includes("camera d'aria") || t.includes("camera d aria")) continue;
    const ref = applyIva(Math.max(toNum(h.Prezzo_Gommista), toNum(h.Prezzo_Grossista)));
    if (ref <= p.prezzo) continue;
    const sconto = Math.round((1 - p.prezzo / ref) * 100);
    if (sconto < minDiscount) continue;
    offers.push({ ...p, prezzoPrecedente: ref, sconto });
  }
  offers.sort((a, b) => b.sconto - a.sconto);
  return { offerte: offers.slice(0, limit), total: offers.length };
}

export const getProdottoById = cache(async function getProdottoById(id: string): Promise<Prodotto | null> {
  try {
    const res = await client().getObject<AlgoliaHit>({ indexName: INDEX, objectID: id });
    if (!hasValidPrice(res as AlgoliaHit)) return null; // prodotto senza prezzo reale → 404
    return mapAlgoliaHit(res as AlgoliaHit);
  } catch {
    return null;
  }
});

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

// Stesso filtro prezzo del catalogo: esclude i record "civetta" senza prezzo reale.
const SITEMAP_FILTER = "Prezzo_Privato >= 20 OR Prezzo_T24 >= 20";
// Attributi minimi per valutare hasValidPrice() lato client (oltre all'objectID).
const SITEMAP_ATTRS = ["objectID", "T24", "Marca", "Prezzo_T24", "Prezzo_Gommista", "Prezzo_Acquisto"];

// Enumera gli objectID dei prodotti EFFETTIVAMENTE VENDIBILI per la sitemap.
// Usiamo l'indice `*_prezzo_privato_asc` (lo stesso del catalogo pubblico): contiene solo
// i prodotti a stock proprio mostrati agli utenti (~3.3k), non l'intero catalogo fornitori
// dropship (~89k pagine sottili che sprecherebbero crawl budget e diluirebbero la qualità).
// La paginazione search di Algolia è limitata a 1000 → browseObjects itera tutto via cursor.
// Se la key non ha l'ACL "browse", fallback partizionando per Marca (ogni marca < 1000).
export async function getAllProductIds(): Promise<string[]> {
  const ids = new Set<string>();
  try {
    await client().browseObjects<AlgoliaHit>({
      indexName: INDEX_PRICE_ASC,
      browseParams: { query: "", filters: SITEMAP_FILTER, attributesToRetrieve: SITEMAP_ATTRS, hitsPerPage: 1000 },
      aggregator: (res) => {
        for (const h of res.hits as unknown as AlgoliaHit[]) if (h.objectID && hasValidPrice(h)) ids.add(h.objectID);
      },
    });
    if (ids.size > 0) return [...ids];
  } catch (err) {
    console.error("[sitemap] browseObjects non disponibile, fallback per-marca:", err);
  }

  // Fallback: una query per marca (≤1000 hit ciascuna), così resta entro il limite.
  try {
    const marche = await facetValues("Marca");
    for (const m of marche) {
      const res = await client().searchSingleIndex<AlgoliaHit>({
        indexName: INDEX_PRICE_ASC,
        searchParams: {
          query: "",
          hitsPerPage: 1000,
          filters: SITEMAP_FILTER,
          attributesToRetrieve: SITEMAP_ATTRS,
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          facetFilters: [[`Marca:${m}`]] as any,
        },
      });
      for (const h of res.hits as unknown as AlgoliaHit[]) if (h.objectID && hasValidPrice(h)) ids.add(h.objectID);
    }
  } catch (err) {
    console.error("[sitemap] fallback per-marca fallito:", err);
  }
  return [...ids];
}
