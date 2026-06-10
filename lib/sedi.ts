// Fonte unica dei dati delle sedi fisiche Spiezia Tyres.
// Usata da: pagine /sedi e /sedi/[slug], sitemap, schema LocalBusiness.
// I dati (indirizzi, geo, telefoni) rispecchiano quelli già presenti in
// app/layout.tsx (#dealer) e app/contatti — qui sono centralizzati e arricchiti
// con contenuto unico per-sede ai fini del local SEO.

export type Sede = {
  slug: string;
  city: string;
  region: "Campania" | "Lazio";
  province: string;      // sigla: NA, RM
  provinceName: string;  // esteso: Napoli, Roma
  address: string;
  postalCode: string;
  tel: string;           // formattato per la UI
  maps: string;          // link Google Maps "indicazioni"
  geo?: { lat: number; lng: number };
  // Comuni/zone limitrofe servite — danno rilevanza locale alle pagine.
  serves: string[];
  // Paragrafo unico per-sede (evita contenuto duplicato tra le 4 pagine).
  intro: string;
};

export const SEDI: Sede[] = [
  {
    slug: "nola",
    city: "Nola",
    region: "Campania",
    province: "NA",
    provinceName: "Napoli",
    address: "Via Croce Del Papa 27/29",
    postalCode: "80035",
    tel: "+39 081 511 5011",
    maps: "https://www.google.com/maps/dir//Via+Croce+del+Papa,+27%2F29,+80035+Nola+NA/@40.9301147,14.428379,12z/data=!4m8!4m7!1m0!1m5!1m1!1s0x133bb21ae5ac3e1d:0x816d8c387b2451ee!2m2!1d14.5107798!2d40.930144?entry=ttu",
    geo: { lat: 40.930144, lng: 14.5107798 },
    serves: ["Nola", "Cimitile", "Saviano", "Cicciano", "Marigliano", "Acerra", "Pomigliano d'Arco"],
    intro:
      "La sede di Nola è il cuore storico di Spiezia Tyres: officina completa per la vendita e il montaggio di pneumatici per auto, SUV, moto e veicoli agricoli, con magazzino capiente e disponibilità immediata sui principali brand. Punto di riferimento per l'Agro nolano e l'area vesuviana interna.",
  },
  {
    slug: "volla",
    city: "Volla",
    region: "Campania",
    province: "NA",
    provinceName: "Napoli",
    address: "Via Palazziello 73",
    postalCode: "80040",
    tel: "+39 081 511 5011",
    maps: "https://www.google.com/maps/dir/40.9292509,14.5072726/spiezia+tyres+volla/@40.9191238,14.2492527,11z/data=!3m1!4b1!4m9!4m8!1m1!4e1!1m5!1m1!1s0x133ba8f1823dabbb:0x5593c595afb22bd8!2m2!1d14.3416487!2d40.8875763?entry=ttu",
    geo: { lat: 40.8875763, lng: 14.3416487 },
    serves: ["Volla", "Casoria", "Cercola", "Pollena Trocchia", "Napoli est", "San Sebastiano al Vesuvio"],
    intro:
      "La sede di Volla serve l'hinterland nord-est di Napoli con un servizio rapido di cambio gomme, equilibratura e meccanica leggera. Posizione comoda per chi arriva da Casoria, Cercola e dalla zona orientale del capoluogo.",
  },
  {
    slug: "portici",
    city: "Portici",
    region: "Campania",
    province: "NA",
    provinceName: "Napoli",
    address: "Via S. Cristoforo 93",
    postalCode: "80055",
    tel: "+39 081 511 5011",
    maps: "https://www.google.com/maps/place/Via+S.+Cristoforo,+93,+80055+Portici+NA/@40.8200,14.3300,17z",
    serves: ["Portici", "Ercolano", "San Giorgio a Cremano", "Torre del Greco", "Napoli sud"],
    intro:
      "La sede di Portici copre l'area vesuviana costiera: vendita pneumatici di tutte le stagioni e servizio di montaggio per gli automobilisti di Portici, Ercolano e San Giorgio a Cremano. Officina pratica e veloce a due passi dalla statale 18.",
  },
  {
    slug: "fiano-romano",
    city: "Fiano Romano",
    region: "Lazio",
    province: "RM",
    provinceName: "Roma",
    address: "Via Procoio 41A",
    postalCode: "00065",
    tel: "+39 081 511 5011",
    maps: "https://www.google.com/maps/place/Via+Procoio,+41,+00065+Fiano+Romano+RM/@42.1560406,12.6166334,18z/data=!3m1!4b1!4m6!3m5!1s0x132f6d59d6ec1a2b:0xa6164bc7110fcd44!8m2!3d42.1560394!4d12.6180815!16s%2Fg%2F11k5jpbngn?entry=tts",
    geo: { lat: 42.1560394, lng: 12.6180815 },
    serves: ["Fiano Romano", "Capena", "Morlupo", "Monterotondo", "Roma nord", "Castelnuovo di Porto"],
    intro:
      "La sede di Fiano Romano è il presidio Spiezia Tyres nel Lazio: comoda dall'uscita A1 Fiano Romano, serve l'area a nord di Roma con vendita e montaggio pneumatici per auto, SUV e veicoli commerciali.",
  },
];

export function getSede(slug: string): Sede | undefined {
  return SEDI.find((s) => s.slug === slug);
}

// Orari comuni a tutte le sedi (rispecchiano app/layout.tsx).
export const ORARI_SEDE = [
  { giorni: "Lunedì – Venerdì", orario: "08:30 – 13:30 · 14:30 – 19:00" },
  { giorni: "Sabato", orario: "08:30 – 13:30" },
  { giorni: "Domenica", orario: "Chiuso" },
];

// Stesso orario in formato schema.org OpeningHoursSpecification.
export const OPENING_HOURS_SCHEMA = [
  { "@type": "OpeningHoursSpecification", dayOfWeek: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"], opens: "08:30", closes: "13:30" },
  { "@type": "OpeningHoursSpecification", dayOfWeek: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"], opens: "14:30", closes: "19:00" },
  { "@type": "OpeningHoursSpecification", dayOfWeek: ["Saturday"], opens: "08:30", closes: "13:30" },
];

// Servizi erogati in ogni officina (local SEO).
export const SERVIZI_SEDE = [
  "Vendita pneumatici estivi, invernali e 4 stagioni",
  "Montaggio e smontaggio gomme",
  "Equilibratura e bilanciatura",
  "Convergenza e assetto ruote",
  "Cambio stagionale e deposito gomme",
  "Cambio olio e sostituzione filtri",
];
