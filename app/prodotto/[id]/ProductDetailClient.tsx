"use client";
import { useEffect, useRef, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import {
  ShoppingCart, Shield, CalendarCheck, MapPin, ChevronRight,
  Plus, Minus, Check, Clock, ChevronDown, Calendar,
} from "lucide-react";
import type { Prodotto } from "@/lib/types";
import { formatPrice } from "@/lib/utils";
import { useCart } from "@/context/CartContext";
import { searchProdotti } from "@/lib/algolia";
import ProductCard from "@/components/products/ProductCard";
import toast from "react-hot-toast";

// ─── SVG season icons ────────────────────────────────────────────────────────
const IcoSole = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
    <circle cx="12" cy="12" r="4" />
    <line x1="12" y1="2" x2="12" y2="5" /><line x1="12" y1="19" x2="12" y2="22" />
    <line x1="2" y1="12" x2="5" y2="12" /><line x1="19" y1="12" x2="22" y2="12" />
    <line x1="4.93" y1="4.93" x2="7.05" y2="7.05" /><line x1="16.95" y1="16.95" x2="19.07" y2="19.07" />
    <line x1="4.93" y1="19.07" x2="7.05" y2="16.95" /><line x1="16.95" y1="7.05" x2="19.07" y2="4.93" />
  </svg>
);
const IcoFiocco = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
    <line x1="12" y1="2" x2="12" y2="22" /><line x1="2" y1="12" x2="22" y2="12" />
    <line x1="6" y1="6" x2="18" y2="18" /><line x1="18" y1="6" x2="6" y2="18" />
    <line x1="9" y1="3" x2="12" y2="6" /><line x1="15" y1="3" x2="12" y2="6" />
    <line x1="9" y1="21" x2="12" y2="18" /><line x1="15" y1="21" x2="12" y2="18" />
  </svg>
);
const IcoQuattroStagioni = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
    <circle cx="12" cy="12" r="4" />
    <line x1="12" y1="2" x2="12" y2="5" /><line x1="2" y1="12" x2="5" y2="12" />
    <line x1="4.93" y1="4.93" x2="7.05" y2="7.05" /><line x1="12" y1="19" x2="12" y2="22" />
    <line x1="19" y1="12" x2="22" y2="12" /><line x1="16.95" y1="16.95" x2="19.07" y2="19.07" />
  </svg>
);

// ─── StagioneBadge ────────────────────────────────────────────────────────────
const STAGIONE_META = {
  Invernali:    { bg: "bg-[#111] text-white",           icon: <IcoFiocco />,         label: "Invernali" },
  Estive:       { bg: "bg-[#FFC300] text-[#111]",       icon: <IcoSole />,            label: "Estive" },
  "4-Stagioni": { bg: "bg-[#F1F4F8] text-[#111]",       icon: <IcoQuattroStagioni />, label: "4 Stagioni" },
} as const;

function StagioneBadge({ stagione }: { stagione: Prodotto["stagione"] }) {
  const m = STAGIONE_META[stagione] ?? STAGIONE_META["4-Stagioni"];
  return (
    <span className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold ${m.bg}`}>
      {m.icon} {m.label}
    </span>
  );
}

// ─── EtichettaUE ─────────────────────────────────────────────────────────────
function classeColore(v: string): string {
  const u = v.toUpperCase();
  if (u === "A") return "bg-[#0a8a3f]";
  if (u === "B") return "bg-[#4cae50]";
  if (u === "C") return "bg-[#f9d221] text-[#001D3D]";
  if (u === "D") return "bg-[#f79836]";
  if (u === "E") return "bg-[#e84d2c]";
  if (u === "F") return "bg-[#d3312d]";
  if (u === "G") return "bg-[#b71c1c]";
  return "bg-[#001D3D]";
}

function EtichettaUE({ label, value }: { label: string; value: string }) {
  const isNumeric = /^\d+$/.test(value);
  return (
    <div className="rounded-xl bg-[#fde8ea]/60 border border-[#fdd2d6] flex flex-col items-center gap-1 px-3 py-2.5">
      <div className={`rounded-full flex items-center justify-center text-white font-black shadow w-10 h-10 text-base ${classeColore(value)}`}>
        {value}{isNumeric && <span className="ml-0.5 text-[8px]">dB</span>}
      </div>
      <div className="text-[11px] font-semibold text-[#001D3D]">{label}</div>
    </div>
  );
}

// ─── SpecInfo tooltip ─────────────────────────────────────────────────────────
function SpecInfo({ text }: { text: string }) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLSpanElement>(null);
  const tipRef = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    if (!open) return;
    const h = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener("mousedown", h);
    return () => document.removeEventListener("mousedown", h);
  }, [open]);

  useEffect(() => {
    if (!open || !tipRef.current) return;
    const rect = tipRef.current.getBoundingClientRect();
    const overflow = rect.right - (window.innerWidth - 12);
    if (overflow > 0) tipRef.current.style.left = `-${overflow}px`;
  }, [open]);

  return (
    <span ref={ref} className="relative inline-flex items-center ml-1.5">
      <button
        type="button"
        onMouseEnter={() => setOpen(true)}
        onMouseLeave={() => setOpen(false)}
        onTouchStart={(e) => { e.preventDefault(); setOpen((o) => !o); }}
        className="w-4 h-4 rounded-full bg-[#9DA5AE]/20 hover:bg-[#FFC300] text-[#9DA5AE] hover:text-[#001D3D] flex items-center justify-center text-[9px] font-black transition shrink-0 select-none"
        aria-label="Informazioni"
      >i</button>
      {open && (
        <span
          ref={tipRef}
          className="absolute bottom-full left-0 mb-2 w-56 bg-[#001D3D] text-white text-xs rounded-xl px-3 py-2.5 shadow-2xl z-50 leading-relaxed pointer-events-none"
        >
          {text}
          <span className="absolute top-full left-4 border-[5px] border-transparent border-t-[#001D3D]" />
        </span>
      )}
    </span>
  );
}

// ─── FaqItem accordion ────────────────────────────────────────────────────────
function FaqItem({ q, a, defaultOpen = false }: { q: string; a: React.ReactNode; defaultOpen?: boolean }) {
  const [open, setOpen] = useState(defaultOpen);
  return (
    <div className="border-b border-[#E5E7EB] last:border-b-0">
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        className="w-full flex items-center justify-between gap-4 py-4 text-left"
      >
        <span className="font-bold text-[#001D3D]">{q}</span>
        <ChevronDown
          size={16}
          className={`text-[#001D3D] shrink-0 transition-transform ${open ? "rotate-180" : ""}`}
        />
      </button>
      {open && (
        <div className="pb-5 text-sm text-[#57636C] space-y-2 leading-relaxed">{a}</div>
      )}
    </div>
  );
}

// ─── SEO description ─────────────────────────────────────────────────────────
function buildDescription(p: Prodotto): string {
  const misura = `${p.larghezza}/${p.altezza} R${p.diametro}`;
  const indici = [p.indiceCarico, p.indiceVelocita].filter(Boolean).join("");
  const stagTesto =
    p.stagione === "Invernali" ? "la guida su neve e ghiaccio, con il simbolo 3PMSF" :
    p.stagione === "Estive" ? "le alte prestazioni in condizioni estive, asciutto e bagnato" :
    "tutto l'anno senza necessità di cambio stagionale";

  let desc = `Lo pneumatico ${p.marca} ${p.modello} in misura ${misura}${indici ? ` ${indici}` : ""} è progettato per veicoli ${p.categoria.toLowerCase()}, ideale per ${stagTesto}.`;

  const eu: string[] = [];
  if (p.indiceConsumo) eu.push(`classe consumo ${p.indiceConsumo}`);
  if (p.indiceBagnato) eu.push(`classe bagnato ${p.indiceBagnato}`);
  if (p.indiceRumorosita) eu.push(`rumorosità ${p.indiceRumorosita} dB`);
  if (eu.length) desc += ` Etichetta UE: ${eu.join(", ")}.`;

  desc += " Disponibile presso le sedi Spiezia Tyres con garanzia produttore e installazione professionale.";
  return desc;
}

// ─── FAQ data ─────────────────────────────────────────────────────────────────
const FAQS: { q: string; a: React.ReactNode }[] = [
  {
    q: "Come prenoto un appuntamento per il cambio gomme?",
    a: <p>Aggiungi i pneumatici desiderati alla selezione, poi vai al checkout per scegliere la sede e la data preferita. Il nostro staff ti contatterà per confermare l&apos;orario disponibile.</p>,
  },
  {
    q: "Devo pagare un anticipo al momento della prenotazione?",
    a: <p>No. La prenotazione è gratuita e senza anticipo. Il pagamento avviene in sede al momento del servizio, dopo la conferma finale del prezzo.</p>,
  },
  {
    q: "Posso modificare o cancellare l'appuntamento?",
    a: <p>Sì, puoi modificare o cancellare l&apos;appuntamento in qualsiasi momento contattandoci per telefono o via WhatsApp al <strong>+39 081 511 5011</strong>.</p>,
  },
  {
    q: "Cosa significano le etichette UE (consumo, bagnato, rumorosità)?",
    a: (
      <ul className="list-disc pl-4 space-y-1">
        <li><strong>Consumo</strong>: efficienza nei consumi di carburante. Dalla classe A (migliore) alla G.</li>
        <li><strong>Bagnato</strong>: tenuta di strada su asfalto bagnato. Dalla classe A (migliore) alla G.</li>
        <li><strong>Rumorosità</strong>: livello di rumore esterno in dB. Più basso è il valore, più silenziosa è la guida.</li>
      </ul>
    ),
  },
  {
    q: "Quale stagione di pneumatico mi serve?",
    a: (
      <p>Gli <strong>invernali</strong> sono obbligatori (o catene) dal 15 novembre al 15 aprile su molte strade italiane. Gli <strong>estivi</strong> garantiscono le massime prestazioni in estate. I <strong>4 stagioni</strong> sono una soluzione comoda per chi non vuole effettuare il cambio stagionale.</p>
    ),
  },
  {
    q: "Quanto dura il montaggio in sede?",
    a: <p>Il cambio gomme completo (smontaggio, montaggio, bilanciatura) richiede mediamente <strong>circa 30 minuti</strong> per un veicolo standard. Tempi variabili per SUV e veicoli commerciali.</p>,
  },
];

// ─── Main component ───────────────────────────────────────────────────────────
type Props = { prodotto: Prodotto };

export default function ProductDetailClient({ prodotto: p }: Props) {
  const router = useRouter();
  const params = useSearchParams();
  const [qty, setQty] = useState(p.stock > 0 && p.stock < 4 ? p.stock : 4);
  const [added, setAdded] = useState(false);
  const [correlati, setCorrelati] = useState<Prodotto[]>([]);
  const { addItem } = useCart();

  const carMake = params.get("carMake") ?? "";
  const carModel = params.get("carModel") ?? "";
  const carYear = params.get("carYear") ?? "";

  const disponibile = p.stock > 0;
  const ultimiPezzi = p.stock > 0 && p.stock <= 5;
  const maxQty = Math.min(p.stock || 10, 12);
  const misura = `${p.larghezza}/${p.altezza} R${p.diametro}`;
  const indici = [p.indiceCarico, p.indiceVelocita].filter(Boolean).join("");
  const sconto = p.prezzoPrecedente
    ? Math.round(((p.prezzoPrecedente - p.prezzo) / p.prezzoPrecedente) * 100)
    : 0;

  useEffect(() => {
    if (!p.larghezza || !p.altezza || !p.diametro) return;
    searchProdotti({ query: `${p.larghezza}/${p.altezza} R${p.diametro}`, hitsPerPage: 10 })
      .then((r) => setCorrelati(r.hits.filter((x) => x.id !== p.id).slice(0, 4)))
      .catch(() => {});
  }, [p.id, p.larghezza, p.altezza, p.diametro]);

  function handleAdd() {
    addItem(p, qty);
    setAdded(true);
    toast.success(`${p.marca} ${p.modello} aggiunto alla selezione`);
    setTimeout(() => setAdded(false), 2500);
  }

  function handleBook() {
    addItem(p, qty);
    router.push("/checkout");
  }

  const whatsappMsg = encodeURIComponent(
    `Ciao, vorrei richiedere un preventivo per lo pneumatico ${p.marca} ${p.modello} ${misura}${indici ? ` ${indici}` : ""}. È disponibile?`
  );

  return (
    <div className="bg-[#F1F4F8] min-h-screen">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-4 sm:py-8">

        {/* Breadcrumb */}
        <nav className="flex items-center gap-1.5 text-xs text-[#9DA5AE] mb-4 sm:mb-6">
          <Link href="/" className="hover:text-[#001D3D] transition-colors">Home</Link>
          <ChevronRight size={12} />
          <Link href="/prodotti" className="hover:text-[#001D3D] transition-colors">Catalogo</Link>
          <ChevronRight size={12} />
          <span className="text-[#001D3D] font-semibold line-clamp-1">{p.marca} {p.modello}</span>
        </nav>

        {/* Vehicle compatibility banner */}
        {carMake && carModel && (
          <div className="mb-4 bg-white rounded-xl border border-[#249689]/30 overflow-hidden flex shadow-sm">
            <div className="w-1 bg-[#249689] shrink-0" />
            <div className="flex items-center gap-3 px-4 py-3 flex-1 min-w-0">
              <div className="w-8 h-8 rounded-full bg-[#249689]/10 flex items-center justify-center shrink-0">
                <Check size={16} className="text-[#249689]" />
              </div>
              <div className="flex-1 min-w-0">
                <div className="text-[10px] font-black text-[#249689] uppercase tracking-widest mb-0.5">Compatibile</div>
                <div className="font-black text-[#001D3D] text-sm truncate">
                  {carMake} {carModel}{carYear ? ` (${carYear})` : ""}
                </div>
                <div className="text-[11px] text-[#249689] font-semibold font-mono">{misura}{indici ? ` ${indici}` : ""}</div>
              </div>
            </div>
          </div>
        )}

        {/* Main grid */}
        <div className="grid lg:grid-cols-2 gap-3 sm:gap-5">

          {/* Gallery */}
          <div className="bg-white rounded-2xl border border-[#E5E7EB] p-4 sm:p-6 relative">
            <div className="absolute top-3 left-3 z-10">
              <StagioneBadge stagione={p.stagione} />
            </div>
            {sconto > 0 && (
              <div className="absolute top-3 right-3 z-10">
                <span className="inline-flex items-center px-2.5 py-1 text-[11px] font-black rounded-lg bg-[#FF5963] text-white">
                  -{sconto}%
                </span>
              </div>
            )}
            <div className="h-48 sm:aspect-square w-full flex items-center justify-center">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={p.immagine || "/placeholder.svg"}
                alt={p.titolo}
                className="max-h-full max-w-full object-contain"
                onError={(e) => { (e.currentTarget as HTMLImageElement).src = "/placeholder.svg"; }}
              />
            </div>
          </div>

          {/* Purchase details */}
          <div className="bg-white rounded-2xl border border-[#E5E7EB] p-4 sm:p-6">
            {/* Brand / model / size */}
            <div className="mb-4">
              <div className="text-[10px] font-black uppercase tracking-widest text-[#FFC300] mb-0.5">{p.marca}</div>
              <h1 className="text-xl sm:text-2xl font-black text-[#001D3D] leading-tight">{p.modello}</h1>
              <div className="font-mono text-[#57636C] mt-1 text-sm">
                {misura}{indici ? ` ${indici}` : ""}
              </div>
            </div>

            {/* EU labels */}
            {(p.indiceConsumo || p.indiceBagnato || p.indiceRumorosita) && (
              <div className="grid grid-cols-3 gap-2 mb-4">
                <EtichettaUE label="Consumo" value={p.indiceConsumo || "—"} />
                <EtichettaUE label="Bagnato" value={p.indiceBagnato || "—"} />
                <EtichettaUE label="Rumore" value={p.indiceRumorosita || "—"} />
              </div>
            )}

            {/* Price */}
            <div className="mb-4">
              <div className="flex items-baseline gap-2">
                {p.prezzoPrecedente && (
                  <span className="text-sm text-[#9DA5AE] line-through">{formatPrice(p.prezzoPrecedente)}</span>
                )}
                <span className="text-[2rem] sm:text-[2.25rem] leading-none font-black text-[#001D3D]">
                  {formatPrice(p.prezzo)}
                </span>
              </div>
              <p className="text-xs text-[#9DA5AE] mt-0.5">+ {formatPrice(p.pfu)} PFU (contributo ambientale)</p>
              <p className="text-xs text-[#249689] font-semibold mt-1">✓ Prezzo confermato in sede al momento del servizio</p>
            </div>

            {/* Stock status */}
            <div className={`flex items-center gap-2 text-sm font-semibold mb-4 ${disponibile ? "text-[#249689]" : "text-[#FF5963]"}`}>
              <div className={`w-2 h-2 rounded-full shrink-0 ${disponibile ? "bg-[#249689]" : "bg-[#FF5963]"}`} />
              {!disponibile
                ? "Non disponibile"
                : ultimiPezzi
                ? `Ultimi ${p.stock} pezzi`
                : `Disponibile (${p.stock} pz in magazzino)`}
            </div>

            {/* Actions */}
            {disponibile ? (
              <>
                <div className="flex flex-col gap-2 mb-3 sm:flex-row sm:items-center sm:gap-3">
                  {/* Stepper */}
                  <div className="flex items-center border border-[#E5E7EB] rounded-xl overflow-hidden self-start sm:self-auto">
                    <button
                      onClick={() => setQty((q) => Math.max(1, q - 1))}
                      disabled={qty <= 1}
                      className="w-11 h-11 sm:h-12 flex items-center justify-center hover:bg-[#F1F4F8] transition-colors text-[#57636C] disabled:opacity-40"
                    >
                      <Minus size={14} />
                    </button>
                    <span className="w-10 h-11 sm:h-12 flex items-center justify-center font-bold text-[#001D3D] border-x border-[#E5E7EB] select-none">
                      {qty}
                    </span>
                    <button
                      onClick={() => setQty((q) => Math.min(maxQty, q + 1))}
                      disabled={qty >= maxQty}
                      className="w-11 h-11 sm:h-12 flex items-center justify-center hover:bg-[#F1F4F8] transition-colors text-[#57636C] disabled:opacity-40"
                    >
                      <Plus size={14} />
                    </button>
                  </div>
                  {/* Aggiungi alla selezione */}
                  <button
                    onClick={handleAdd}
                    className={`w-full sm:flex-1 h-11 sm:h-12 rounded-xl flex items-center justify-center gap-2 text-sm font-bold transition-all duration-200 ${
                      added ? "bg-[#249689] text-white" : "bg-[#FFC300] hover:bg-[#E6B000] text-[#001D3D]"
                    }`}
                  >
                    {added ? <><Check size={15} /> Aggiunto!</> : <><ShoppingCart size={15} /> Aggiungi alla selezione</>}
                  </button>
                </div>
                {/* Prenota appuntamento */}
                <button
                  onClick={handleBook}
                  className="w-full h-12 rounded-xl bg-[#111] hover:bg-[#333] text-white font-bold text-sm flex items-center justify-center gap-2 transition-colors"
                >
                  <Calendar size={16} /> Prenota appuntamento
                </button>
                {qty > 1 && (
                  <p className="text-xs text-[#57636C] mt-2">
                    Totale per {qty} pz: <strong className="text-[#001D3D]">{formatPrice((p.prezzo + p.pfu) * qty)}</strong> (incl. PFU)
                  </p>
                )}
              </>
            ) : (
              <div className="space-y-2.5">
                <div className="rounded-xl border border-[#FF5963]/30 bg-[#FF5963]/5 px-4 py-3 flex items-center gap-2.5">
                  <div className="w-2 h-2 rounded-full bg-[#FF5963] shrink-0" />
                  <div>
                    <div className="font-bold text-[#FF5963] text-sm">Non disponibile</div>
                    <div className="text-xs text-[#57636C] mt-0.5">
                      Contattaci per verificare disponibilità sulla misura {misura}
                    </div>
                  </div>
                </div>
                <a
                  href={`https://wa.me/390815115011?text=${whatsappMsg}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-center gap-2.5 w-full h-12 rounded-xl bg-[#25D366] hover:bg-[#1ebe5d] text-white font-bold text-sm transition-colors"
                >
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor" className="shrink-0">
                    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 0 1-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 0 1-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 0 1 2.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0 0 12.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 0 0 5.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 0 0-3.48-8.413Z" />
                  </svg>
                  Richiedi preventivo via WhatsApp
                </a>
                <Link
                  href="/chi-siamo"
                  className="flex items-center justify-center gap-2 w-full h-11 rounded-xl border border-[#E5E7EB] text-[#001D3D] hover:bg-[#F1F4F8] font-semibold text-sm transition-colors"
                >
                  Altre opzioni di contatto
                </Link>
              </div>
            )}
          </div>
        </div>

        {/* Highlights */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mt-3 sm:mt-5">
          {[
            { icon: Shield,        title: "Prodotto originale",   sub: "Pneumatici nuovi forniti dai migliori produttori mondiali" },
            { icon: CalendarCheck, title: "Prenota in sede",      sub: "Prezzo confermato all'appuntamento, nessun anticipo richiesto" },
            { icon: MapPin,        title: "4 sedi operative",     sub: "Nola, Volla, Portici, Fiano Romano" },
          ].map(({ icon: Icon, title, sub }) => (
            <div key={title} className="bg-white rounded-2xl border border-[#E5E7EB] p-4 sm:p-5 flex items-start gap-3">
              <div className="w-10 h-10 rounded-xl bg-[#FFC300]/10 border border-[#FFC300]/20 flex items-center justify-center shrink-0">
                <Icon size={20} className="text-[#FFC300]" />
              </div>
              <div>
                <div className="font-black text-[#001D3D] text-sm">{title}</div>
                <div className="text-xs text-[#57636C] mt-0.5 leading-snug">{sub}</div>
              </div>
            </div>
          ))}
        </div>

        {/* How booking works */}
        <div className="bg-white rounded-2xl border border-[#E5E7EB] p-5 sm:p-7 mt-3 sm:mt-5">
          <h2 className="font-black text-[#001D3D] text-base sm:text-lg mb-5">Come funziona la prenotazione</h2>
          <div className="grid md:grid-cols-3 gap-6">
            {[
              { n: "01", icon: ShoppingCart, title: "Aggiungi alla selezione", desc: "Scegli la misura e la quantità di pneumatici che ti servono." },
              { n: "02", icon: Calendar,     title: "Prenota appuntamento",    desc: "Dal checkout scegli la sede e la data preferita per il servizio." },
              { n: "03", icon: Clock,        title: "Vieni in sede",           desc: "Confirmiamo il prezzo, effettuiamo il montaggio in circa 30 minuti." },
            ].map(({ n, icon: Icon, title, desc }) => (
              <div key={n} className="flex gap-4">
                <div className="flex flex-col items-center">
                  <div className="w-10 h-10 rounded-xl bg-[#FFC300]/15 border border-[#FFC300]/30 flex items-center justify-center shrink-0">
                    <Icon size={18} className="text-[#FFC300]" />
                  </div>
                  <div className="text-[10px] font-black text-[#9DA5AE] mt-1">{n}</div>
                </div>
                <div>
                  <div className="font-bold text-[#001D3D] text-sm">{title}</div>
                  <div className="text-xs text-[#57636C] mt-1 leading-snug">{desc}</div>
                </div>
              </div>
            ))}
          </div>
          <div className="mt-6 pt-5 border-t border-[#E5E7EB]">
            <Link
              href="/checkout"
              className="inline-flex items-center gap-2 h-10 px-5 rounded-xl border border-[#111] text-[#111] hover:bg-[#111] hover:text-white font-bold text-sm transition-colors"
            >
              <ShoppingCart size={15} /> Vai alla selezione
            </Link>
          </div>
        </div>

        {/* SEO description */}
        <div className="bg-white rounded-2xl border border-[#E5E7EB] p-5 sm:p-7 mt-3 sm:mt-5">
          <h2 className="font-black text-[#001D3D] text-base sm:text-lg mb-2">
            {p.marca} {p.modello} — {misura}
          </h2>
          <p className="text-sm text-[#57636C] leading-relaxed">{buildDescription(p)}</p>
        </div>

        {/* Specs */}
        <div className="bg-white rounded-2xl border border-[#E5E7EB] p-5 sm:p-7 mt-3 sm:mt-5">
          <h3 className="font-black text-[#001D3D] text-base sm:text-lg mb-4">Specifiche tecniche</h3>
          <dl className="grid md:grid-cols-2 gap-x-8 gap-y-2 text-sm">
            {(
              [
                ["Marca",                 p.marca],
                ["Modello",               p.modello],
                ["Misura",                `${misura}${indici ? ` ${indici}` : ""}`],
                ["Larghezza",             p.larghezza && `${p.larghezza} mm`],
                ["Altezza",               p.altezza, "Rapporto altezza/larghezza del fianco espresso in percentuale. Es. 55 = 55%."],
                ["Diametro",              p.diametro && `R${p.diametro}`],
                ["Indice di carico",      p.indiceCarico, "Peso massimo sopportabile da ogni singolo pneumatico, espresso secondo la tabella ETRTO (es. 91 = 615 kg)."],
                ["Indice di velocità",    p.indiceVelocita, "Velocità massima ammessa in servizio continuo (es. H = 210 km/h, V = 240 km/h)."],
                ["Stagione",              p.stagione.replace("-", " ")],
                ["Categoria",             p.categoria],
                ["Classe consumo",        p.indiceConsumo, "Efficienza energetica: dalla classe A (migliore) alla G (peggiore). Influisce sui consumi di carburante."],
                ["Resistenza al bagnato", p.indiceBagnato, "Tenuta di strada su asfalto bagnato: dalla classe A (migliore) alla G (peggiore)."],
                ["Rumorosità",            p.indiceRumorosita, "Rumore esterno di rotolamento in dB. Cerchio nero = rispetta la soglia; due cerchi = 3 dB sotto soglia."],
                ["EAN",                   p.ean],
                ["SKU",                   p.sku],
              ] as [string, string | undefined | null, string?][]
            )
              .filter(([, v]) => !!v)
              .map(([k, v, tip]) => (
                <div key={k} className="flex justify-between gap-4 border-b border-[#E5E7EB]/60 pb-2">
                  <dt className="text-[#9DA5AE] flex items-center shrink-0">
                    {k}
                    {tip && <SpecInfo text={tip} />}
                  </dt>
                  <dd className="font-semibold text-[#001D3D] text-right">{v}</dd>
                </div>
              ))}
          </dl>
        </div>

        {/* Related products */}
        {correlati.length > 0 && (
          <section className="mt-5 sm:mt-8">
            <div className="flex items-end justify-between mb-4">
              <div>
                <h2 className="text-xl sm:text-2xl font-black text-[#001D3D]">
                  Altre opzioni nella misura {misura}
                </h2>
                <p className="text-sm text-[#57636C]">Confronta altri pneumatici per questa misura</p>
              </div>
              <Link
                href={`/prodotti?larghezza=${p.larghezza}&altezza=${p.altezza}&diametro=${p.diametro}`}
                className="text-sm font-bold text-[#001D3D] hover:text-[#FFC300] transition-colors whitespace-nowrap"
              >
                Vedi tutti →
              </Link>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3 sm:gap-4">
              {correlati.map((x) => <ProductCard key={x.id} prodotto={x} />)}
            </div>
          </section>
        )}

        {/* FAQ */}
        <div className="bg-white rounded-2xl border border-[#E5E7EB] p-5 sm:p-7 mt-3 sm:mt-5 mb-8">
          <h3 className="font-black text-[#001D3D] text-base sm:text-lg mb-1 flex items-center gap-2">
            <CalendarCheck size={18} className="text-[#FFC300]" />
            Domande frequenti
          </h3>
          <p className="text-xs text-[#9DA5AE] mb-4">Tutto quello che devi sapere su prenotazione e montaggio</p>
          <div>
            {FAQS.map((f, i) => (
              <FaqItem key={f.q} q={f.q} a={f.a} defaultOpen={i === 0} />
            ))}
          </div>
        </div>

      </div>
    </div>
  );
}
