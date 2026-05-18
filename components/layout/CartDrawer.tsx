"use client";
import { useCart } from "@/context/CartContext";
import { X, ClipboardList, Trash2, Plus, Minus, ArrowRight, Info } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { formatPrice } from "@/lib/utils";

export default function CartDrawer() {
  const { isOpen, closeCart, items, totale, pfuTotale, removeItem, updateQty, count } = useCart();
  if (!isOpen) return null;

  return (
    <>
      <div className="fixed inset-0 z-[200] bg-[#001D3D]/60 backdrop-blur-sm cart-overlay" onClick={closeCart} />

      <div className="fixed right-0 top-0 bottom-0 z-[201] w-full max-w-[420px] bg-white shadow-xl cart-drawer flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-4 bg-[#001D3D]">
          <div className="flex items-center gap-2.5">
            <ClipboardList size={18} className="text-[#FFC300]" />
            <h2 className="text-white font-bold text-sm">
              La tua selezione <span className="text-[#FFC300]">({count})</span>
            </h2>
          </div>
          <button onClick={closeCart} className="text-white/60 hover:text-white transition-colors p-1 rounded">
            <X size={18} />
          </button>
        </div>

        {/* Body */}
        <div className="flex-1 overflow-y-auto bg-[#F1F4F8]">
          {items.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full gap-5 text-center px-8">
              <div className="w-20 h-20 rounded-full bg-[#E5E7EB] flex items-center justify-center">
                <ClipboardList size={30} className="text-[#9DA5AE]" />
              </div>
              <div>
                <p className="font-bold text-[#001D3D]">Nessun pneumatico selezionato</p>
                <p className="text-xs text-[#57636C] mt-1">Aggiungi le gomme che ti interessano per prenotare una visita</p>
              </div>
              <button onClick={closeCart} className="btn-outline-navy text-sm">
                Sfoglia il catalogo
              </button>
            </div>
          ) : (
            <ul className="divide-y divide-[#E5E7EB] bg-white">
              {items.map((item) => (
                <li key={item.id} className="px-5 py-4 flex gap-4 hover:bg-[#F1F4F8] transition-colors">
                  {/* Image */}
                  <div className="w-16 h-16 flex-shrink-0 rounded-lg bg-[#F1F4F8] border border-[#E5E7EB] flex items-center justify-center">
                    <Image
                      src={item.immagine}
                      alt={item.titolo}
                      width={60}
                      height={60}
                      className="object-contain p-1 w-full h-full"
                      onError={(e) => { (e.target as HTMLImageElement).src = "/placeholder.svg"; }}
                    />
                  </div>

                  {/* Info */}
                  <div className="flex-1 min-w-0">
                    <p className="text-[10px] font-bold uppercase tracking-widest text-[#57636C]">{item.marca}</p>
                    <p className="text-sm font-semibold text-[#001D3D] line-clamp-2 leading-snug">{item.titolo}</p>

                    <div className="flex items-center justify-between mt-2">
                      {/* Qty controls */}
                      <div className="flex items-center rounded-lg border border-[#E5E7EB] bg-white overflow-hidden">
                        <button
                          onClick={() => updateQty(item.id, item.quantita - 1)}
                          className="w-7 h-7 flex items-center justify-center hover:bg-[#F1F4F8] transition-colors text-[#57636C]"
                        >
                          <Minus size={12} />
                        </button>
                        <span className="w-7 h-7 flex items-center justify-center text-xs font-bold text-[#001D3D] border-x border-[#E5E7EB]">
                          {item.quantita}
                        </span>
                        <button
                          onClick={() => updateQty(item.id, item.quantita + 1)}
                          className="w-7 h-7 flex items-center justify-center hover:bg-[#F1F4F8] transition-colors text-[#57636C]"
                        >
                          <Plus size={12} />
                        </button>
                      </div>
                      <span className="text-sm font-bold text-[#001D3D]">
                        {formatPrice((item.prezzoUnitario + item.pfu) * item.quantita)}
                      </span>
                    </div>
                    {item.pfu > 0 && (
                      <p className="text-[10px] text-[#9DA5AE] mt-0.5">incl. PFU {formatPrice(item.pfu)}/pz</p>
                    )}
                  </div>

                  <button
                    onClick={() => removeItem(item.id)}
                    className="text-[#9DA5AE] hover:text-[#FF5963] transition-colors p-1 flex-shrink-0 self-start"
                    aria-label="Rimuovi"
                  >
                    <Trash2 size={15} />
                  </button>
                </li>
              ))}
            </ul>
          )}
        </div>

        {/* Footer */}
        {items.length > 0 && (
          <div className="border-t border-[#E5E7EB] bg-white px-5 py-5 space-y-4">
            <div className="space-y-2 text-sm">
              <div className="flex justify-between text-[#57636C]">
                <span>Pneumatici ({count} pz)</span>
                <span>{formatPrice(totale - pfuTotale)}</span>
              </div>
              <div className="flex justify-between text-[#57636C]">
                <span>PFU (contrib. ambientale)</span>
                <span>{formatPrice(pfuTotale)}</span>
              </div>
              <div className="border-t border-[#E5E7EB] pt-2.5 flex justify-between items-baseline">
                <span className="font-bold text-[#001D3D]">Stima di riferimento</span>
                <span className="text-xl font-black text-[#001D3D]">{formatPrice(totale)}</span>
              </div>
              <div className="flex items-start gap-1.5 bg-amber-50 border border-amber-200 rounded-lg px-3 py-2">
                <Info size={12} className="text-amber-600 flex-shrink-0 mt-0.5" />
                <p className="text-[10px] text-amber-700 leading-snug">Il prezzo definitivo sarà confermato in sede al momento del servizio.</p>
              </div>
            </div>

            <Link
              href="/checkout"
              onClick={closeCart}
              className="btn-gold-lg w-full flex items-center justify-center gap-2"
            >
              Prenota appuntamento <ArrowRight size={18} />
            </Link>
            <button onClick={closeCart} className="w-full text-center text-xs text-[#57636C] hover:text-[#001D3D] transition-colors py-1">
              Continua a sfogliare
            </button>
          </div>
        )}
      </div>
    </>
  );
}
