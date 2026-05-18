"use client";
import React, { createContext, useContext, useEffect, useState } from "react";
import type { ArticoloCarrello, Prodotto } from "@/lib/types";

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
      const saved = localStorage.getItem("spiezia_cart");
      if (saved) setItems(JSON.parse(saved));
    } catch { /* ignore */ }
  }, []);

  useEffect(() => {
    localStorage.setItem("spiezia_cart", JSON.stringify(items));
  }, [items]);

  const count = items.reduce((s, i) => s + i.quantita, 0);
  const pfuTotale = items.reduce((s, i) => s + i.pfu * i.quantita, 0);
  const totale = items.reduce((s, i) => s + (i.prezzoUnitario + i.pfu) * i.quantita, 0);

  function addItem(p: Prodotto, quantita: number) {
    setItems((prev) => {
      const exists = prev.find((i) => i.prodottoId === p.id);
      if (exists) {
        return prev.map((i) =>
          i.prodottoId === p.id ? { ...i, quantita: i.quantita + quantita } : i
        );
      }
      return [
        ...prev,
        {
          id: crypto.randomUUID(),
          prodottoId: p.id,
          titolo: p.titolo,
          marca: p.marca,
          modello: p.modello,
          immagine: p.immagine,
          prezzoUnitario: p.prezzo,
          pfu: p.pfu,
          quantita,
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
    setItems((prev) => prev.map((i) => i.id === id ? { ...i, quantita: qty } : i));
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
