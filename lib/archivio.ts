import { cache } from "react";
import { searchProdotti, facetValues, type SearchOpts, type SearchResult } from "@/lib/algolia";

export const SITE = "https://spieziatyres.it";

// ─── Tipi ────────────────────────────────────────────────────────────────────
export type ArchiveType = "size" | "brand" | "season" | "category";

export type ArchiveDef = {
  type: ArchiveType;
  slug: string;                 // slug dopo "pneumatici-" (es. "205-55-r16", "michelin", "invernali")
  opts: SearchOpts;             // filtri Algolia
  label: string;                // etichetta leggibile (es. "205/55 R16", "Michelin", "invernali")
  // campi specifici
  misura?: string;
  larghezza?: string;
  altezza?: string;
  diametro?: string;
  brand?: string;
  seasonValue?: string;         // "Estive" | "Invernali" | "4-Stagioni"
  categoria?: string;
};

// ─── Mappe ───────────────────────────────────────────────────────────────────
const SEASON_MAP: Record<string, { label: string; value: string }> = {
  estivi: { label: "estivi", value: "Estive" },
  invernali: { label: "invernali", value: "Invernali" },
  "4-stagioni": { label: "4 stagioni", value: "4-Stagioni" },
};

const CATEGORY_MAP: Record<string, { label: string; value: string }> = {
  auto: { label: "auto", value: "auto" },
  autocarro: { label: "autocarro", value: "autocarro" },
  agricoli: { label: "agricoli", value: "agro" },
};

// 205-55-r16  |  185-65-r15  |  315-80-r22-5 (autocarro .5 → "-5")
const SIZE_RE = /^(\d{2,3})-(\d{2})-r(\d{1,2}(?:-\d)?)$/;

export function slugifyBrand(s: string): string {
  return s
    .toLowerCase()
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

// I valori Marca su Algolia sono in MAIUSCOLO ("MICHELIN"); per la UI li rendiamo in Title Case.
function prettyBrand(s: string): string {
  return s.toLowerCase().replace(/\b\w/g, (c) => c.toUpperCase());
}

// ─── Risoluzione slug → ArchiveDef ───────────────────────────────────────────
// Ordine: stagione (set fisso) → categoria (set fisso) → misura (regex) → brand (facet Algolia).
async function resolveArchive(slug: string): Promise<ArchiveDef | null> {
  if (SEASON_MAP[slug]) {
    const s = SEASON_MAP[slug];
    return { type: "season", slug, label: s.label, seasonValue: s.value, opts: { stagioni: [s.value] } };
  }

  if (CATEGORY_MAP[slug]) {
    const c = CATEGORY_MAP[slug];
    return { type: "category", slug, label: c.label, categoria: c.value, opts: { categoria: c.value } };
  }

  const m = slug.match(SIZE_RE);
  if (m) {
    const larghezza = m[1];
    const altezza = m[2];
    const diametro = m[3].replace("-", "."); // 22-5 → 22.5
    const misura = `${larghezza}/${altezza} R${diametro}`;
    return {
      type: "size",
      slug,
      label: misura,
      misura,
      larghezza,
      altezza,
      diametro,
      opts: { larghezza, altezza, diametro },
    };
  }

  // brand: valida contro le marche reali presenti su Algolia
  const marche = await facetValues("Marca");
  const brand = marche.find((b) => slugifyBrand(b) === slug);
  if (brand) {
    // label = versione leggibile (Title Case); brand = valore grezzo per il filtro Algolia.
    return { type: "brand", slug, label: prettyBrand(brand), brand, opts: { marche: [brand] } };
  }

  return null;
}

// ─── Fetch dati archivio (cache per-request: usato sia da generateMetadata sia dalla page) ──
export type ArchiveData = { def: ArchiveDef; result: SearchResult; prezzoMin: number; canonical: string };

export const getArchiveData = cache(async (slug: string): Promise<ArchiveData | null> => {
  const def = await resolveArchive(slug);
  if (!def) return null;
  const result = await searchProdotti({ ...def.opts, hitsPerPage: 24, sortByPrice: "asc" });
  // hits ordinati per prezzo crescente → il primo è il minimo
  const prezzoMin = result.hits.length ? result.hits[0].prezzo : 0;
  return { def, result, prezzoMin, canonical: `/pneumatici-${slug}` };
});

// ─── Contenuti (title, description, intro, FAQ) ──────────────────────────────
function eur(n: number): string {
  return `€ ${n.toFixed(2).replace(".", ",")}`;
}

const ANNO = new Date().getFullYear();

export function buildArchiveMeta(d: ArchiveData): { title: string; description: string; h1: string } {
  const { def, prezzoMin, result } = d;
  const da = prezzoMin > 0 ? ` da ${eur(prezzoMin)}` : "";
  const n = result.nbHits;
  switch (def.type) {
    case "size":
      return {
        h1: `Pneumatici ${def.misura}`,
        title: `Pneumatici ${def.misura}${da}`,
        description: `${n}+ pneumatici ${def.misura} dei migliori marchi (Michelin, Pirelli, Continental e altri)${da}. Confronta etichetta UE e prezzi e prenota il montaggio nelle 4 sedi Spiezia Tyres.`,
      };
    case "brand":
      return {
        h1: `Pneumatici ${def.label}`,
        title: `Pneumatici ${def.label}${da}`,
        description: `Catalogo pneumatici ${def.label}: ${n}+ modelli per auto, SUV, moto e agricoli${da}. Confronta misure e prezzi e prenota il montaggio nelle 4 sedi Spiezia Tyres.`,
      };
    case "season": {
      const Lab = def.label.charAt(0).toUpperCase() + def.label.slice(1);
      return {
        h1: `Pneumatici ${def.label} ${ANNO}`,
        title: `Pneumatici ${def.label} ${ANNO}${da}`,
        description: `Pneumatici ${def.label} ${ANNO}: ${n}+ modelli di tutti i marchi${da}. ${Lab} per ogni esigenza. Prenota il montaggio nelle 4 sedi Spiezia Tyres in Campania e Lazio.`,
      };
    }
    case "category":
      return {
        h1: `Pneumatici ${def.label}`,
        title: `Pneumatici ${def.label}${da}`,
        description: `Pneumatici ${def.label}: ${n}+ modelli di tutti i marchi${da}. Estivi, invernali e 4 stagioni. Prenota il montaggio nelle 4 sedi Spiezia Tyres.`,
      };
  }
}

// Paragrafo "definition-first" (GEO): la prima frase È la definizione estraibile dagli LLM.
export function buildIntro(d: ArchiveData): string {
  const { def, prezzoMin } = d;
  const da = prezzoMin > 0 ? ` a partire da ${eur(prezzoMin)}` : "";
  switch (def.type) {
    case "size":
      return `I pneumatici ${def.misura} hanno ${def.larghezza} mm di larghezza, un rapporto di forma del ${def.altezza}% (altezza del fianco) e un diametro cerchio di ${def.diametro} pollici. È una misura molto diffusa: su Spiezia Tyres trovi i modelli dei migliori marchi — estivi, invernali e 4 stagioni —${da}, con montaggio professionale nelle 4 sedi tra Campania e Lazio. Seleziona i pneumatici online e prenota l'appuntamento: paghi e monti in sede, senza anticipo.`;
    case "brand":
      return `${def.label} è uno dei principali produttori di pneumatici. Su Spiezia Tyres trovi il catalogo ${def.label} per auto, SUV, moto e veicoli commerciali${da}: confronta misure, etichetta UE e prezzi e prenota il montaggio nelle 4 sedi tra Campania e Lazio. Paghi e monti in sede, senza anticipo.`;
    case "season":
      if (def.seasonValue === "Invernali")
        return `I pneumatici invernali sono progettati per temperature sotto i 7°C e garantiscono aderenza su neve, ghiaccio e bagnato freddo grazie a una mescola morbida e a un battistrada lamellato. In Italia, secondo l'art. 122 del Codice della Strada, dal 15 novembre al 15 aprile su molte strade è obbligatorio montare pneumatici invernali (omologati M+S o 3PMSF) o avere catene a bordo. Su Spiezia Tyres trovi gli invernali di tutti i marchi${da}, con montaggio nelle 4 sedi tra Campania e Lazio.`;
      if (def.seasonValue === "Estive")
        return `I pneumatici estivi offrono le massime prestazioni di tenuta e di frenata con temperature sopra i 7°C, sia su asciutto sia su bagnato, grazie a una mescola dura e a un battistrada rigido. Sono la scelta ideale dalla primavera all'autunno. Su Spiezia Tyres trovi gli estivi di tutti i marchi${da}, con montaggio nelle 4 sedi tra Campania e Lazio.`;
      return `I pneumatici 4 stagioni (all-season) sono omologati M+S e, nei modelli certificati, 3PMSF: permettono di circolare tutto l'anno senza il cambio stagionale, con un buon compromesso tra prestazioni estive e invernali. Su Spiezia Tyres trovi i 4 stagioni di tutti i marchi${da}, con montaggio nelle 4 sedi tra Campania e Lazio.`;
    case "category":
      return `I pneumatici ${def.label} comprendono tutte le misure per questa categoria di veicoli. Su Spiezia Tyres trovi i modelli dei migliori marchi — estivi, invernali e 4 stagioni —${da}, con montaggio professionale nelle 4 sedi tra Campania e Lazio. Seleziona i pneumatici online e prenota l'appuntamento in sede.`;
  }
}

export function buildFaqs(d: ArchiveData): { q: string; a: string }[] {
  const { def, prezzoMin, result } = d;
  const da = prezzoMin > 0 ? eur(prezzoMin) : "una cifra competitiva";
  const dove = "Selezioni i pneumatici online e prenoti un appuntamento in una delle 4 sedi Spiezia Tyres (Nola, Volla, Portici, Fiano Romano): paghi e fai montare in sede, senza anticipo e con il prezzo confermato all'appuntamento.";

  switch (def.type) {
    case "size":
      return [
        { q: `Quali auto montano la misura ${def.misura}?`, a: `La misura ${def.misura} è montata di serie su molti modelli di auto. Verifica la misura corretta sul libretto di circolazione del tuo veicolo (carta di circolazione) oppure usa la ricerca per veicolo: misure diverse possono essere ammesse solo se omologate.` },
        { q: `Quali sono i migliori pneumatici ${def.misura}?`, a: `Dipende dalla stagione e dal budget: nella misura ${def.misura} trovi modelli premium (Michelin, Pirelli, Continental), mid-range (Hankook, Goodyear) e budget. Confronta le classi dell'etichetta UE (consumo, bagnato, rumore) e il prezzo per scegliere il pneumatico più adatto.` },
        { q: `Quanto costano i pneumatici ${def.misura}?`, a: `Su Spiezia Tyres i pneumatici ${def.misura} partono da ${da}. Il prezzo varia in base a marca, stagione e prestazioni; viene confermato in sede al momento del montaggio.` },
        { q: `Dove monto i pneumatici ${def.misura} dopo l'acquisto?`, a: dove },
      ];
    case "brand":
      return [
        { q: `I pneumatici ${def.label} sono affidabili?`, a: `${def.label} è un marchio riconosciuto nel settore. Per valutare ogni modello consulta le classi dell'etichetta UE (efficienza, aderenza sul bagnato, rumore) e le specifiche tecniche disponibili nella scheda prodotto.` },
        { q: `Quanto costano i pneumatici ${def.label}?`, a: `Su Spiezia Tyres i pneumatici ${def.label} partono da ${da}, in base a misura, stagione e linea di prodotto. Il prezzo viene confermato in sede al montaggio.` },
        { q: `Dove posso montare i pneumatici ${def.label}?`, a: dove },
      ];
    case "season":
      if (def.seasonValue === "Invernali")
        return [
          { q: "Quando vanno montati i pneumatici invernali in Italia?", a: "In Italia, secondo l'art. 122 del Codice della Strada, dal 15 novembre al 15 aprile su molte strade è obbligatorio circolare con pneumatici invernali (omologati M+S o 3PMSF) oppure avere a bordo le catene da neve. Le ordinanze possono variare per regione e tratto stradale; in alcune zone montane l'obbligo si estende oltre il 15 aprile." },
          { q: "Qual è la differenza tra M+S e 3PMSF?", a: "M+S (Mud + Snow) è una marcatura autocertificata dal produttore, senza un test prestazionale. 3PMSF (Three Peak Mountain Snowflake) è invece una certificazione che attesta il superamento di un test di trazione sulla neve. Tutti i pneumatici 3PMSF sono anche M+S, ma non viceversa: per l'inverno è consigliato scegliere modelli con marcatura 3PMSF." },
          { q: "Posso usare i pneumatici invernali tutto l'anno?", a: "Tecnicamente sì, ma non è consigliato: in estate la mescola morbida si usura più velocemente e aumentano gli spazi di frenata sull'asciutto. Se non vuoi cambiare gomme due volte l'anno, valuta i pneumatici 4 stagioni con certificazione 3PMSF." },
        ];
      if (def.seasonValue === "Estive")
        return [
          { q: "Quando rimontare i pneumatici estivi?", a: "Gli pneumatici estivi rendono al meglio con temperature stabilmente sopra i 7°C, in genere da aprile a ottobre. Conviene rimontarli al termine dell'obbligo invernale (dopo il 15 aprile), quando le temperature si alzano." },
          { q: `Quali sono i migliori pneumatici estivi ${ANNO}?`, a: "Tra gli estivi premium spiccano modelli Michelin, Continental e Pirelli; nelle fasce mid-range e budget trovi alternative valide. Confronta le classi dell'etichetta UE (soprattutto l'aderenza sul bagnato) e il prezzo per la tua misura." },
          { q: "Dove monto i pneumatici estivi dopo l'acquisto?", a: dove },
        ];
      return [
        { q: "I pneumatici 4 stagioni sono validi per l'obbligo invernale italiano?", a: "Sì, se omologati M+S o 3PMSF. I modelli con marcatura 3PMSF soddisfano l'obbligo di pneumatici invernali previsto dall'art. 122 del Codice della Strada dal 15 novembre al 15 aprile, senza bisogno di catene a bordo." },
        { q: "Meglio 4 stagioni o doppio treno estivi + invernali?", a: "I 4 stagioni sono comodi per chi percorre pochi km, vive in zone a clima mite e non vuole gestire il cambio stagionale. Il doppio treno (estivi + invernali) offre prestazioni superiori in ogni stagione ed è preferibile per chi guida molto o in zone con inverni rigidi." },
        { q: "Dove monto i pneumatici 4 stagioni dopo l'acquisto?", a: dove },
      ];
    case "category":
      return [
        { q: `Quali misure di pneumatici ${def.label} sono disponibili?`, a: `Su Spiezia Tyres trovi un'ampia gamma di misure per pneumatici ${def.label}. Filtra per misura, marca e stagione nel catalogo per trovare il modello adatto al tuo veicolo.` },
        { q: `Quanto costano i pneumatici ${def.label}?`, a: `I pneumatici ${def.label} partono da ${da}, in base a misura, marca e stagione. Il prezzo viene confermato in sede al momento del montaggio.` },
        { q: `Dove monto i pneumatici ${def.label} dopo l'acquisto?`, a: dove },
      ];
  }
  void result;
  return [];
}

// ─── Voci sitemap per gli archivi ────────────────────────────────────────────
// Misure auto più cercate in Italia (curate dalla keyword research) + stagioni + categorie + tutti i brand.
const TOP_SIZE_SLUGS = [
  "205-55-r16", "195-65-r15", "185-65-r15", "225-45-r17", "205-60-r16", "215-55-r17",
  "225-40-r18", "195-55-r16", "175-65-r14", "205-50-r17", "235-45-r18", "215-60-r16",
  "225-50-r17", "245-45-r18", "205-45-r17", "195-60-r15", "215-65-r16", "235-55-r17",
  "225-55-r17", "215-45-r17", "185-60-r15", "245-40-r18", "225-65-r17", "235-60-r18",
  "255-35-r19", "205-55-r17", "215-50-r17", "195-65-r16", "185-55-r15", "255-40-r19",
];

export async function getArchiveSitemapPaths(): Promise<string[]> {
  const paths: string[] = [];
  // stagioni
  for (const s of Object.keys(SEASON_MAP)) paths.push(`/pneumatici-${s}`);
  // categorie
  for (const c of Object.keys(CATEGORY_MAP)) paths.push(`/pneumatici-${c}`);
  // misure top
  for (const s of TOP_SIZE_SLUGS) paths.push(`/pneumatici-${s}`);
  // brand (tutte le marche reali presenti su Algolia)
  try {
    const marche = await facetValues("Marca");
    for (const b of marche) {
      const slug = slugifyBrand(b);
      if (slug) paths.push(`/pneumatici-${slug}`);
    }
  } catch {
    /* ignore */
  }
  return paths;
}
