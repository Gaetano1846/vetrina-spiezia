import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatPrice(price: number): string {
  return new Intl.NumberFormat("it-IT", {
    style: "currency",
    currency: "EUR",
    minimumFractionDigits: 2,
  }).format(price);
}

export function formatDate(dateStr: string): string {
  return new Intl.DateTimeFormat("it-IT", {
    day: "2-digit",
    month: "long",
    year: "numeric",
  }).format(new Date(dateStr));
}

export function toSlug(text: string): string {
  return text
    .toLowerCase()
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

export function calcTotaleCarrello(
  articoli: { prezzoUnitario: number; pfu: number; quantita: number }[]
): number {
  return articoli.reduce(
    (sum, a) => sum + (a.prezzoUnitario + a.pfu) * a.quantita,
    0
  );
}

// Tetto di pezzi per riga carrello (anche per non saturare l'agenda con prenotazioni assurde).
export const CART_MAX_QTY = 12;

// Quantità massima prenotabile per un prodotto — unica fonte di verità usata da carrello,
// card catalogo e scheda prodotto, così lo stock viene SEMPRE rispettato.
//  - esaurito (stock<=0)        → 0 (non aggiungibile)
//  - dropship T24 (su ordine)   → fino al cap (il fornitore evade il treno completo)
//  - stock locale reale         → almeno un treno (4) e fino allo stock, mai oltre il cap.
// Il minimo di 4 evita di bloccare l'acquisto standard quando lo stock locale è basso o è il
// fallback sintetico (hasStock→1): è un flusso di PRENOTAZIONE, la disponibilità è confermata in sede.
export function maxAcquistabile(p: { stock: number; t24: boolean }): number {
  if (p.stock <= 0) return 0;
  if (p.t24) return CART_MAX_QTY;
  return Math.min(Math.max(p.stock, 4), CART_MAX_QTY);
}
