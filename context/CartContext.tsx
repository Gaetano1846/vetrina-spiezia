"use client";
import React, { createContext, useContext, useEffect, useState } from "react";
import type { ArticoloCarrello, Prodotto } from "@/lib/types";
import { maxAcquistabile, CART_MAX_QTY } from "@/lib/utils";

// Chiave versionata: lo schema dell'articolo è già cambiato nel tempo. Bumpando la versione
// evitiamo di caricare carrelli pre-schema (campi numerici mancanti → totali NaN nell'ordine).
const STORAGE_KEY = "spiezia_cart_v2";

// Difesa anti-corruzione: carichiamo solo item con prezzi/quantità numerici validi.
function isValidCartItem(x: unknown): x is ArticoloCarrello {
  if (!x || typeof x !== "object") return false;
  const i = x as Record<string, unknown>;
  return (
    typeof i.id === "string" &&
    typeof i.prodottoId === "string" &&
    typeof i.prezzoUnitario === "number" && Number.isFinite(i.prezzoUnitario) &&
    typeof i.pfu === "number" && Number.isFinite(i.pfu) &&
    typeof i.quantita === "number" && Number.isFinite(i.quantita) && i.quantita > 0
  );
}

// crypto.randomUUID richiede secure context (HTTPS); fallback per dev su IP/HTTP e browser datati.
function genId(): string {
  try { return crypto.randomUUID(); } catch { return `${Date.now()}-${Math.round(Math.random() * 1e9)}`; }
}

type CartCtx = {
  items: ArticoloCarrello[];
  count: number;
  totale: number;
  pfuTotale: number;
  addItem: (p: Prodotto, quantita: number) => void;
  removeItem: (id: string) => void;
  updateQty: (id: string, qty: number) => void;
  clearCart: () => void;
  isOpen: boolean;
  openCart: () => void;
  closeCart: () => void;
};

const CartContext = createContext<CartCtx | null>(null);

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [items, setItems] = useState<ArticoloCarrello[]>([]);
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (!saved) return;
      const parsed = JSON.parse(saved);
      if (Array.isArray(parsed)) setItems(parsed.filter(isValidCartItem));
    } catch { /* ignore */ }
  }, []);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
    } catch { /* Safari private mode or storage full */ }
  }, [items]);

  const count = items.reduce((s, i) => s + i.quantita, 0);
  const pfuTotale = items.reduce((s, i) => s + i.pfu * i.quantita, 0);
  const totale = items.reduce((s, i) => s + (i.prezzoUnitario + i.pfu) * i.quantita, 0);

  function addItem(p: Prodotto, quantita: number) {
    const max = maxAcquistabile(p);
    if (max <= 0) return; // prodotto esaurito → non aggiungibile
    const qty = Math.max(1, Math.min(Math.floor(quantita) || 1, max));
    setItems((prev) => {
      const exists = prev.find((i) => i.prodottoId === p.id);
      if (exists) {
        // somma le quantità ma non oltre lo stock disponibile; aggiorna il tetto.
        return prev.map((i) =>
          i.prodottoId === p.id
            ? { ...i, quantita: Math.min(i.quantita + qty, max), maxQty: max }
            : i
        );
      }
      return [
        ...prev,
        {
          id: genId(),
          prodottoId: p.id,
          titolo: p.titolo,
          marca: p.marca,
          modello: p.modello,
          immagine: p.immagine,
          prezzoUnitario: p.prezzo,
          pfu: p.pfu,
          quantita: qty,
          maxQty: max,
          sku: p.sku,
          t24: p.t24,
          stagione: p.stagione,
          larghezza: p.larghezza,
          altezza: p.altezza,
          diametro: p.diametro,
        },
      ];
    });
    setIsOpen(true);
  }

  function removeItem(id: string) {
    setItems((prev) => prev.filter((i) => i.id !== id));
  }

  function updateQty(id: string, qty: number) {
    if (qty <= 0) { removeItem(id); return; }
    setItems((prev) => prev.map((i) => {
      if (i.id !== id) return i;
      const max = i.maxQty && Number.isFinite(i.maxQty) ? i.maxQty : CART_MAX_QTY;
      return { ...i, quantita: Math.min(Math.floor(qty), max) };
    }));
  }

  function clearCart() { setItems([]); }

  return (
    <CartContext.Provider value={{
      items, count, totale, pfuTotale,
      addItem, removeItem, updateQty, clearCart,
      isOpen, openCart: () => setIsOpen(true), closeCart: () => setIsOpen(false),
    }}>
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error("useCart must be used within CartProvider");
  return ctx;
}
