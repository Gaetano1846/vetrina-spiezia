export type Prodotto = {
  id: string;
  titolo: string;
  marca: string;
  modello: string;
  larghezza: string;
  altezza: string;
  diametro: string;
  indiceCarico: string;
  indiceVelocita: string;
  stagione: "Estive" | "Invernali" | "4-Stagioni";
  categoria: "Auto" | "SUV" | "Moto" | "Furgone";
  immagine: string;
  prezzo: number;
  prezzoPrecedente?: number;
  pfu: number;
  stock: number;
  rating: number;
  recensioni: number;
  indiceBagnato: string;
  indiceConsumo: string;
  indiceRumorosita: string;
  ean: string;
  sku: string;
  t24: boolean;
};

export type ArticoloCarrello = {
  id: string;
  prodottoId: string;
  titolo: string;
  marca: string;
  modello: string;
  immagine: string;
  prezzoUnitario: number;
  pfu: number;
  quantita: number;
  sku: string;
  t24: boolean;
  stagione: string;
  larghezza: string;
  altezza: string;
  diametro: string;
};

export type IndirizzoDiSpedizione = {
  destinatario: string;
  via: string;
  cap: string;
  citta: string;
  provincia: string;
  telefono: string;
};

export type IndirizzoDiFatturazione = {
  nome: string;
  cognome: string;
  via: string;
  cap: string;
  citta: string;
  provincia: string;
  email: string;
  telefono: string;
  isAzienda: boolean;
  ragioneSociale?: string;
  piva?: string;
  codiceFiscale?: string;
  codiceDest?: string;
};

export type Ordine = {
  id: string;
  data: string;
  stato: string;
  articoli: ArticoloCarrello[];
  totale: number;
  spedizione: number;
  indirizzo: IndirizzoDiSpedizione;
  tracking?: string;
};

export type CarMake = { id: number; name: string };
export type CarModel = { id: number; name: string };
export type CarYear = { id: number; name: string };
export type CarModification = { id: number; name: string; tires: string[] };
