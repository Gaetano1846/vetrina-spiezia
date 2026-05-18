"use client";
import Image from "next/image";
import Link from "next/link";
import { ShoppingCart, Check } from "lucide-react";
import { useState } from "react";
import type { Prodotto } from "@/lib/types";
import { formatPrice } from "@/lib/utils";
import { useCart } from "@/context/CartContext";
import toast from "react-hot-toast";

type Props = { prodotto: Prodotto };

function StagioneIcon({ s }: { s: string }) {
  if (s === "Estive") return (
    <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
      <circle cx="12" cy="12" r="4"/>
      <line x1="12" y1="2" x2="12" y2="5"/><line x1="12" y1="19" x2="12" y2="22"/>
      <line x1="2" y1="12" x2="5" y2="12"/><line x1="19" y1="12" x2="22" y2="12"/>
      <line x1="4.93" y1="4.93" x2="7.05" y2="7.05"/><line x1="16.95" y1="16.95" x2="19.07" y2="19.07"/>
      <line x1="4.93" y1="19.07" x2="7.05" y2="16.95"/><line x1="16.95" y1="7.05" x2="19.07" y2="4.93"/>
    </svg>
  );
  if (s === "Invernali") return (
    <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
      <line x1="12" y1="2" x2="12" y2="22"/><line x1="2" y1="12" x2="22" y2="12"/>
      <line x1="6" y1="6" x2="18" y2="18"/><line x1="18" y1="6" x2="6" y2="18"/>
    </svg>
  );
  return (
    <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
      <circle cx="12" cy="12" r="4"/>
      <line x1="12" y1="2" x2="12" y2="5"/>
      <line x1="2" y1="12" x2="5" y2="12"/>
      <line x1="4.93" y1="4.93" x2="7.05" y2="7.05"/>
      <line x1="12" y1="19" x2="12" y2="22"/>
      <line x1="19" y1="12" x2="22" y2="12"/>
      <line x1="16.95" y1="16.95" x2="19.07" y2="19.07"/>
    </svg>
  );
}

const STAGIONE_CHIP: Record<string, { bg: string; text: string; label: string }> = {
  Estive:       { bg: "bg-[#FFC300]/15 border border-[#FFC300]/40", text: "text-[#7a5c00]",  label: "Estive"     },
  Invernali:    { bg: "bg-[#111]/10 border border-[#111]/20",        text: "text-[#111]",     label: "Invernali"  },
  "4-Stagioni": { bg: "bg-[#F1F4F8] border border-[#E5E7EB]",        text: "text-[#57636C]",  label: "4 Stagioni" },
};

export default function ProductCard({ prodotto: p }: Props) {
  const { addItem } = useCart();
  const [added, setAdded]   = useState(false);
  const [qty, setQty]       = useState(p.stock > 0 && p.stock < 4 ? p.stock : 4);

  const inStock     = p.stock > 0;
  const ultimiPezzi = p.stock > 0 && p.stock <= 4;
  const maxQty      = Math.min(p.stock || 10, 10);
  const sconto      = p.prezzoPrecedente
    ? Math.round(((p.prezzoPrecedente - p.prezzo) / p.prezzoPrecedente) * 100)
    : 0;

  const misura = [
    p.larghezza && p.diametro
      ? `${p.larghezza}${p.altezza ? `/${p.altezza}` : ""} R${p.diametro}`
      : "",
    p.indiceCarico && p.indiceVelocita ? `${p.indiceCarico}${p.indiceVelocita}` : "",
  ].filter(Boolean).join(" ");

  const chip = STAGIONE_CHIP[p.stagione] ?? STAGIONE_CHIP["4-Stagioni"];

  function handleAdd(e: React.MouseEvent) {
    e.preventDefault();
    addItem(p, qty);
    setAdded(true);
    toast.success(`${p.marca} ${p.modello} aggiunto`);
    setTimeout(() => setAdded(false), 2000);
  }

  return (
    <div className="card-hover group flex flex-col overflow-hidden">
      {/* Image */}
      <Link href={`/prodotto/${p.id}`} className="block">
        <div className="relative bg-gradient-to-b from-[#F1F4F8] to-white aspect-square overflow-hidden">
          <Image
            src={p.immagine}
            alt={p.titolo}
            fill
            className="object-contain p-4 group-hover:scale-105 transition-transform duration-500"
            onError={(e) => { (e.target as HTMLImageElement).src = "https://media4.tyre-shopping.com/images_ts/tyre/nopic_nobr-MjM4NzA2-w300-h300-br1-24000238706.jpg"; }}
            sizes="(max-width:640px) 50vw,(max-width:1024px) 33vw,25vw"
          />

          {/* Discount badge top-right */}
          {sconto > 0 && (
            <div className="absolute top-2 right-2 z-10">
              <span className="inline-flex items-center px-1.5 py-0.5 text-[10px] font-black rounded-lg bg-[#FF5963] text-white">
                -{sconto}%
              </span>
            </div>
          )}

          {/* Out of stock overlay */}
          {!inStock && (
            <div className="absolute inset-0 bg-white/80 flex items-center justify-center">
              <span className="text-xs font-bold text-[#9DA5AE] bg-white px-3 py-1 rounded-full border border-[#E5E7EB]">
                Esaurito
              </span>
            </div>
          )}

          {/* Hover overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end p-3">
            <span className="text-white text-xs font-bold">Vedi dettagli →</span>
          </div>
        </div>
      </Link>

      {/* Content */}
      <div className="p-2.5 sm:p-4 flex flex-col flex-1 border-t border-[#E5E7EB]">
        <Link href={`/prodotto/${p.id}`}>
          {/* Brand + stagione */}
          <div className="flex items-center justify-between mb-1">
            <span className="text-[10px] font-black uppercase tracking-widest text-[#9DA5AE]">{p.marca}</span>
            <span className={`inline-flex items-center gap-1 text-[10px] font-semibold px-1.5 sm:px-2 py-0.5 rounded-full ${chip.bg} ${chip.text}`}>
              <StagioneIcon s={p.stagione} /><span className="hidden sm:inline">{chip.label}</span>
            </span>
          </div>

          {/* Model */}
          <h3 className="font-bold text-xs sm:text-sm text-[#111] line-clamp-2 leading-tight mb-0.5 group-hover:text-[#FFC300] transition-colors">
            {p.modello || p.titolo}
          </h3>

          {/* Size */}
          {misura && (
            <p className="font-mono text-[10px] sm:text-xs text-[#57636C] mb-1">{misura}</p>
          )}
        </Link>

        {/* Stock badge */}
        {inStock && (
          <div className="mb-1">
            {ultimiPezzi ? (
              <span className="text-[10px] font-semibold text-amber-700 bg-amber-50 border border-amber-200 px-2 py-0.5 rounded-full">
                Ultimi {p.stock} pezzi
              </span>
            ) : (
              <span className="text-[10px] font-semibold text-[#249689] bg-emerald-50 border border-emerald-200 px-2 py-0.5 rounded-full">
                ✓ Disponibile
              </span>
            )}
          </div>
        )}

        {/* Price */}
        <div className="mt-2">
          {p.prezzoPrecedente && (
            <p className="text-xs text-[#9DA5AE] line-through leading-none mb-0.5">
              {formatPrice(p.prezzoPrecedente)}
            </p>
          )}
          <p className="text-base sm:text-xl font-black text-[#111] leading-none">{formatPrice(p.prezzo)}</p>
          <p className="text-[10px] text-[#9DA5AE]">+{formatPrice(p.pfu)} PFU</p>
        </div>

        {/* Quantity stepper + cart */}
        {inStock && (
          <div className="flex flex-col gap-1.5 mt-2">
            <div className="flex items-center border border-[#E5E7EB] rounded-lg overflow-hidden self-start">
              <button
                type="button"
                onClick={(e) => { e.preventDefault(); setQty((q) => Math.max(1, q - 1)); }}
                className="w-7 sm:w-8 h-7 sm:h-8 flex items-center justify-center text-[#111] font-black text-sm sm:text-base hover:bg-[#F1F4F8] transition"
              >−</button>
              <span className="w-7 sm:w-8 text-center text-xs sm:text-sm font-black text-[#111] select-none border-x border-[#E5E7EB]">{qty}</span>
              <button
                type="button"
                onClick={(e) => { e.preventDefault(); setQty((q) => Math.min(maxQty, q + 1)); }}
                className="w-7 sm:w-8 h-7 sm:h-8 flex items-center justify-center text-[#111] font-black text-sm sm:text-base hover:bg-[#F1F4F8] transition"
              >+</button>
            </div>
            <button
              onClick={handleAdd}
              aria-label="Aggiungi alla selezione"
              className={`w-full h-7 sm:h-8 rounded-lg flex items-center justify-center gap-1 sm:gap-1.5 text-[10px] sm:text-xs font-bold transition-all duration-200 ${
                added
                  ? "bg-[#249689] text-white"
                  : "bg-[#FFC300] text-[#111] hover:bg-[#E6B000]"
              }`}
            >
              {added
                ? <><Check size={12} /> Aggiunto</>
                : <><ShoppingCart size={12} /> Aggiungi</>
              }
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
