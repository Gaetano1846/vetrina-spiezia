// Fonte unica delle promozioni mostrate nel carosello in homepage e nelle
// pagine dedicate /promozioni/[slug].
//
// IMMAGINI: il campo `image` è volutamente vuoto per ora. Quando avrai le
// creatività, metti il percorso (es. "/promozioni/invernali.png", file in
// public/promozioni/) e il carosello/hero mostreranno l'immagine al posto del
// placeholder brandizzato. Niente altro da toccare.

export type Promo = {
  slug: string;
  title: string;
  subtitle: string;
  badge?: string; // etichetta breve mostrata sul banner (es. "Stagionale")
  image?: string; // banner; se assente → placeholder gradiente
  gradient: string; // classi tailwind del placeholder (quando image è assente)
  ctaLabel: string;

  // ── Contenuti pagina dettaglio ──
  intro: string;
  highlights: string[]; // "cosa include" / punti chiave
  validita?: string; // periodo di validità
  note?: string[]; // termini e condizioni
};

export const PROMOZIONI: Promo[] = [
  {
    slug: "cambio-gomme-invernali",
    title: "Cambio gomme invernali",
    subtitle: "Affronta l'inverno in sicurezza con montaggio incluso",
    badge: "Stagionale",
    image: "", // ← imposta qui la creatività quando pronta
    gradient: "from-[#0a2540] via-[#0d3a66] to-[#0a2540]",
    ctaLabel: "Scopri la promo",
    intro:
      "Con l'arrivo del freddo, monta i tuoi pneumatici invernali presso una delle nostre sedi e viaggia sicuro. Approfitta della promozione stagionale Spiezia Tyres su una selezione di gomme invernali dei migliori brand, con montaggio e bilanciatura inclusi nel prezzo.",
    highlights: [
      "Selezione di pneumatici invernali in pronta consegna",
      "Montaggio, smontaggio e bilanciatura inclusi",
      "Possibilità di deposito gomme estive presso la sede",
      "Consulenza gratuita sulla misura corretta per il tuo veicolo",
    ],
    validita: "Promozione valida fino a esaurimento disponibilità.",
    note: [
      "L'offerta è valida nelle 4 sedi Spiezia Tyres (Nola, Volla, Portici, Fiano Romano).",
      "Il prezzo finale viene confermato in sede in base al modello e alla misura scelti.",
    ],
  },
  {
    slug: "treno-gomme-montaggio-incluso",
    title: "Treno di gomme + montaggio",
    subtitle: "4 pneumatici con montaggio incluso a prezzo dedicato",
    badge: "Più richiesta",
    image: "",
    gradient: "from-[#1a1a1a] via-[#333] to-[#0d0d0d]",
    ctaLabel: "Scopri la promo",
    intro:
      "Cambia tutti e quattro i pneumatici con un'unica soluzione conveniente. Scegli il treno di gomme adatto al tuo veicolo e il montaggio è incluso: nessuna sorpresa, paghi e monti direttamente in sede.",
    highlights: [
      "4 pneumatici nuovi della stessa misura",
      "Montaggio e bilanciatura delle 4 ruote inclusi",
      "Smaltimento pneumatici usati incluso",
      "Controllo pressione e valvole",
    ],
    validita: "Promozione valida tutto l'anno su modelli selezionati.",
    note: [
      "Disponibilità soggetta a stock di sede.",
      "Il prezzo varia in base a marca e misura: chiedi il preventivo gratuito.",
    ],
  },
  {
    slug: "tagliando-piu-gomme",
    title: "Tagliando + gomme",
    subtitle: "Cambio gomme e meccanica leggera in un'unica visita",
    badge: "Risparmia tempo",
    image: "",
    gradient: "from-[#3a2c00] via-[#92700A] to-[#3a2c00]",
    ctaLabel: "Scopri la promo",
    intro:
      "Ottimizza la tua visita in officina: abbina il cambio gomme ai servizi di meccanica leggera (cambio olio, sostituzione filtri, controlli) e risparmia tempo e denaro con un unico appuntamento.",
    highlights: [
      "Cambio gomme con montaggio incluso",
      "Cambio olio e sostituzione filtri",
      "Controllo freni, luci e livelli",
      "Un solo appuntamento, una sola sede",
    ],
    validita: "Promozione valida su prenotazione.",
    note: [
      "Servizi di meccanica leggera disponibili in tutte le sedi.",
      "Prenota in anticipo per concordare data e orario.",
    ],
  },
];

export function getPromo(slug: string): Promo | undefined {
  return PROMOZIONI.find((p) => p.slug === slug);
}
