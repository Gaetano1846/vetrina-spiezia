"use client";
import { useState, useRef, useEffect } from "react";
import Link from "next/link";
import { ChevronRight, ChevronDown, Check, Loader2, ArrowLeft, MapPin, Calendar, Phone, Mail, User, ShoppingCart } from "lucide-react";
import CalendarPicker from "@/components/ui/CalendarPicker";
import { useCart } from "@/context/CartContext";
import { useAuth } from "@/context/AuthContext";
import { formatPrice } from "@/lib/utils";
import Image from "next/image";
import { collection, addDoc, doc, Timestamp } from "firebase/firestore";
import { db } from "@/lib/firebase";

type Step = "dati" | "sede" | "conferma";

const STEPS: { id: Step; label: string }[] = [
  { id: "dati",     label: "I tuoi dati"   },
  { id: "sede",     label: "Sede e data"   },
  { id: "conferma", label: "Conferma"      },
];

const SEDI = [
  { id: "nola",    label: "Nola (NA)",         address: "Via Croce Del Papa 27/29", firestoreId: "mVlWjE4331qeklyQx0Er" },
  { id: "volla",   label: "Volla (NA)",         address: "Via Palazziello, 73",      firestoreId: "hl8m5slFYsDIKaZSi23m" },
  { id: "portici", label: "Portici (NA)",       address: "Via S. Cristoforo, 93",    firestoreId: "PCYn6uuRGsuAkPU3pFvL" },
  { id: "fiano",   label: "Fiano Romano (RM)",  address: "Via Procoio, 41A",         firestoreId: "AfiBSRtUj44epZNxVXWF" },
];

// Mappatura servizio → ID documento Reparto
const SERVIZIO_REPARTO: Record<string, string> = {
  montaggio:  "IdHLdJPeEFbs0EVtsvXn", // Vettura
  preventivo: "9HONTZiO9nKYYukrTqAX", // Accettazione
  consulenza: "9HONTZiO9nKYYukrTqAX", // Accettazione
};

const FASCE_ORARIE = [
  "08:30 – 10:00", "10:00 – 11:30", "11:30 – 13:00",
  "14:00 – 15:30", "15:30 – 17:00", "17:00 – 18:30",
];

const SERVIZI = [
  { id: "montaggio",   label: "Montaggio pneumatici" },
  { id: "preventivo",  label: "Preventivo in sede"   },
  { id: "consulenza",  label: "Consulenza tecnica"   },
];

const inputCls = "w-full border border-[#E5E7EB] rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:border-[#FFC300] focus:ring-2 focus:ring-[#FFC300]/20 transition-all bg-white";

type DatiForm = { nome: string; cognome: string; email: string; telefono: string; note: string; };

function FasciaSelect({ value, onChange }: { value: string; onChange: (v: string) => void }) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    function handler(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    }
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);
  return (
    <div ref={ref} className="relative">
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        className={`${inputCls} flex items-center justify-between gap-2 text-left`}
      >
        <span className={value ? "text-[#111] font-semibold" : "text-[#9DA5AE]"}>
          {value || "Seleziona"}
        </span>
        <ChevronDown size={15} className={`flex-shrink-0 text-[#9DA5AE] transition-transform ${open ? "rotate-180" : ""}`} />
      </button>
      {open && (
        <div className="absolute z-50 top-full left-0 right-0 mt-1 bg-white border border-[#E5E7EB] rounded-xl shadow-xl overflow-hidden">
          <ul className="py-1">
            {FASCE_ORARIE.map((f) => (
              <li
                key={f}
                onMouseDown={() => { onChange(f); setOpen(false); }}
                className={`px-4 py-3 text-sm cursor-pointer select-none transition-colors ${
                  f === value ? "bg-[#FFC300]/20 text-[#111] font-semibold" : "text-[#111] hover:bg-[#F1F4F8]"
                }`}
              >
                {f}
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}

export default function PrenotazionePage() {
  const { items, totale, pfuTotale, clearCart } = useCart();
  const { user } = useAuth();

  const [step, setStep]     = useState<Step>("dati");
  const [dati, setDati]     = useState<DatiForm>({
    nome:     user?.displayName?.split(" ")[0] ?? "",
    cognome:  user?.displayName?.split(" ").slice(1).join(" ") ?? "",
    email:    user?.email ?? "",
    telefono: "",
    note:     "",
  });
  const [sede, setSede]         = useState("");
  const [servizio, setServizio] = useState("");
  const [data, setData]         = useState("");
  const [fascia, setFascia]     = useState("");
  const [loading, setLoading]   = useState(false);
  const [done, setDone]         = useState(false);

  /* ── Empty cart ── */
  if (!items.length && !done) {
    return (
      <div className="max-w-lg mx-auto px-4 py-20">
        <div className="flex items-center gap-3 mb-3">
          <ShoppingCart size={20} className="text-[#9DA5AE]" />
          <h1 className="text-lg font-bold text-[#111827]">Lista vuota</h1>
        </div>
        <p className="text-sm text-[#57636C] mb-6 border-l-2 border-[#E5E7EB] pl-3">
          Aggiungi dei pneumatici alla lista per procedere alla prenotazione.
        </p>
        <Link href="/prodotti" className="btn-gold inline-flex">Sfoglia il catalogo</Link>
      </div>
    );
  }

  /* ── Done ── */
  if (done) {
    const sedeSel = SEDI.find((s) => s.id === sede);
    return (
      <div className="max-w-lg mx-auto px-4 py-20 text-center">
        <div className="w-20 h-20 bg-[#249689] rounded-full flex items-center justify-center mx-auto mb-6 shadow-[0_4px_20px_rgba(36,150,137,0.3)]">
          <Check size={36} className="text-white" />
        </div>
        <h1 className="text-2xl font-black text-[#111] mb-2">Prenotazione inviata!</h1>
        <p className="text-[#57636C] mb-1">Grazie {dati.nome}, abbiamo ricevuto la tua richiesta.</p>
        <p className="text-sm text-[#9DA5AE] mb-8">
          Ti contatteremo al numero <strong className="text-[#111]">{dati.telefono}</strong> per confermare l&apos;appuntamento
          {sedeSel ? ` presso la sede di ${sedeSel.label}` : ""}.
        </p>
        <div className="bg-[#F1F4F8] rounded-2xl p-5 text-left mb-8 space-y-2">
          <div className="flex items-center gap-2 text-sm text-[#57636C]"><MapPin size={14} className="text-[#FFC300]" /> {sedeSel?.label} — {sedeSel?.address}</div>
          <div className="flex items-center gap-2 text-sm text-[#57636C]"><Calendar size={14} className="text-[#FFC300]" /> {data} · {fascia}</div>
          <div className="flex items-center gap-2 text-sm text-[#57636C]"><Mail size={14} className="text-[#FFC300]" /> {dati.email}</div>
        </div>
        <Link href="/prodotti" className="btn-gold">Torna al catalogo</Link>
      </div>
    );
  }

  const stepIdx = STEPS.findIndex((s) => s.id === step);
  const goNext  = () => setStep(step === "dati" ? "sede" : "conferma");
  const goPrev  = () => setStep(step === "conferma" ? "sede" : "dati");

  const canGoFromDati = dati.nome && dati.cognome && dati.email && dati.telefono;
  const canGoFromSede = sede && servizio && data && fascia;

  async function handleConfirm() {
    setLoading(true);
    try {
      const sedeSel2 = SEDI.find((s) => s.id === sede)!;

      // Build DataOra Timestamp from date (yyyy-mm-dd) + fascia start time (HH:MM)
      const [year, month, day] = data.split("-").map(Number);
      const [startH, startM] = fascia.split(" – ")[0].split(":").map(Number);
      const dataOra = new Date(year, month - 1, day, startH, startM, 0, 0);

      // dd/mm/yyyy
      const dataItaliana = `${String(day).padStart(2, "0")}/${String(month).padStart(2, "0")}/${year}`;

      const interventoMap: Record<string, string> = {
        montaggio:  "Cambio Pneumatici",
        preventivo: "Preventivo",
        consulenza: "Consulenza Tecnica",
      };

      const pneumatici = items.map((item) => ({
        Immagine:      item.immagine === "/placeholder.svg" ? "" : item.immagine,
        Marca:         item.marca,
        Modello:       item.modello,
        PFU:           item.pfu,
        Prezzo:        item.prezzoUnitario,
        Prezzo_Totale: parseFloat(((item.prezzoUnitario + item.pfu) * item.quantita).toFixed(2)),
        Quantita:      item.quantita,
        Stagione:      item.stagione,
        Titolo:        item.titolo,
      }));

      const appuntamento = {
        Accettatore:    null,
        Cliente_Web: {
          Nome:      dati.nome,
          Cognome:   dati.cognome,
          Email:     dati.email,
          Telefono:  dati.telefono,
          Note:      dati.note || "",
        },
        Data:           dataItaliana,
        DataOra:        Timestamp.fromDate(dataOra),
        Data_Creazione: Timestamp.now(),
        Intervento:     interventoMap[servizio] ?? servizio,
        Operatore:      null,
        Pneumatici:     pneumatici,
        Preventivo:     null,
        Reparto:        doc(db, "Reparto", SERVIZIO_REPARTO[servizio] ?? "9HONTZiO9nKYYukrTqAX"),
        Sede:           doc(db, "Sede", sedeSel2.firestoreId),
        Sede_Label:     sedeSel2.label,
        Stato:          "In Attesa",
        Veicolo:        null,
      };

      await addDoc(collection(db, "Appuntamenti"), appuntamento);
      clearCart();
      setDone(true);
    } catch (err) {
      console.error("Errore creazione appuntamento:", err);
      alert("Si è verificato un errore. Riprova o contattaci al +39 081 511 5011.");
    } finally {
      setLoading(false);
    }
  }

  const sedeSel = SEDI.find((s) => s.id === sede);

  /* ─── Sidebar ─── */
  const Sidebar = (
    <div className="sticky top-24 border border-[#E5E7EB] rounded-xl overflow-hidden shadow-sm">
      <div className="px-5 py-4 bg-[#111]">
        <p className="text-[10px] font-bold uppercase tracking-widest text-white/70">
          Pneumatici selezionati <span className="text-[#FFC300]">({items.length})</span>
        </p>
      </div>
      <div className="px-5 py-4 space-y-4 bg-white">
        {items.map((item) => (
          <div key={item.id} className="flex gap-3">
            <div className="w-12 h-12 flex-shrink-0 bg-[#F1F4F8] border border-[#E5E7EB] rounded-lg flex items-center justify-center">
              <Image src={item.immagine} alt={item.titolo} width={48} height={48} className="object-contain p-1"
                onError={(e) => { (e.target as HTMLImageElement).src = "/placeholder.svg"; }} />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-xs font-bold text-[#111] line-clamp-1">{item.marca} {item.modello}</p>
              <p className="text-[10px] text-[#9DA5AE] font-mono">{item.larghezza}/{item.altezza} R{item.diametro}</p>
              <p className="text-[10px] text-[#57636C]">Qtà: {item.quantita}</p>
            </div>
            <p className="text-sm font-black text-[#111] flex-shrink-0">{formatPrice((item.prezzoUnitario + item.pfu) * item.quantita)}</p>
          </div>
        ))}
      </div>
      <div className="border-t border-[#E5E7EB] px-5 py-4 bg-[#F1F4F8] text-xs text-[#57636C]">
        <p className="font-semibold text-[#111] mb-1">Stima di riferimento</p>
        <div className="flex justify-between"><span>Subtotale</span><span>{formatPrice(totale - pfuTotale)}</span></div>
        <div className="flex justify-between"><span>PFU</span><span>{formatPrice(pfuTotale)}</span></div>
        <div className="flex justify-between font-black text-sm text-[#111] border-t border-[#E5E7EB] pt-2 mt-2">
          <span>Totale stimato</span><span>{formatPrice(totale)}</span>
        </div>
        <p className="text-[10px] text-[#9DA5AE] mt-2 leading-relaxed">
          Il prezzo definitivo sarà confermato in sede dal nostro personale.
        </p>
      </div>
    </div>
  );

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 py-8">

      {/* Steps */}
      <div className="flex items-center gap-0 mb-10 overflow-x-auto scrollbar-hide">
        {STEPS.map((s, i) => (
          <div key={s.id} className="flex items-center flex-shrink-0">
            <div className="flex items-center gap-2">
              <div className={`w-7 h-7 flex items-center justify-center text-xs font-black rounded-full border-2 transition-colors ${
                i < stepIdx   ? "bg-[#249689] border-[#249689] text-white"
                : i === stepIdx ? "bg-[#111] border-[#111] text-white"
                : "border-[#E5E7EB] text-[#9DA5AE]"
              }`}>
                {i < stepIdx ? <Check size={12} /> : i + 1}
              </div>
              <span className={`text-xs font-bold uppercase tracking-widest whitespace-nowrap ${
                i === stepIdx ? "text-[#111]" : "text-[#9DA5AE]"
              }`}>{s.label}</span>
            </div>
            {i < STEPS.length - 1 && <ChevronRight size={14} className="text-[#E5E7EB] mx-3" />}
          </div>
        ))}
      </div>

      <div className="grid lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2">

          {/* ── STEP 1: Dati ── */}
          {step === "dati" && (
            <div className="space-y-6">
              <h2 className="text-xl font-black text-[#111]">I tuoi dati</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold uppercase tracking-widest text-[#57636C] mb-1.5">
                    <User size={11} className="inline mr-1" /> Nome *
                  </label>
                  <input className={inputCls} type="text" value={dati.nome}
                    onChange={(e) => setDati((p) => ({ ...p, nome: e.target.value }))} required />
                </div>
                <div>
                  <label className="block text-xs font-bold uppercase tracking-widest text-[#57636C] mb-1.5">Cognome *</label>
                  <input className={inputCls} type="text" value={dati.cognome}
                    onChange={(e) => setDati((p) => ({ ...p, cognome: e.target.value }))} required />
                </div>
                <div>
                  <label className="block text-xs font-bold uppercase tracking-widest text-[#57636C] mb-1.5">
                    <Mail size={11} className="inline mr-1" /> Email *
                  </label>
                  <input className={inputCls} type="email" value={dati.email}
                    onChange={(e) => setDati((p) => ({ ...p, email: e.target.value }))} required />
                </div>
                <div>
                  <label className="block text-xs font-bold uppercase tracking-widest text-[#57636C] mb-1.5">
                    <Phone size={11} className="inline mr-1" /> Telefono *
                  </label>
                  <input className={inputCls} type="tel" value={dati.telefono}
                    onChange={(e) => setDati((p) => ({ ...p, telefono: e.target.value }))} required />
                </div>
                <div className="sm:col-span-2">
                  <label className="block text-xs font-bold uppercase tracking-widest text-[#57636C] mb-1.5">Note aggiuntive</label>
                  <input className={inputCls} type="text" placeholder="Es. modello dell'auto, richieste particolari…"
                    value={dati.note} onChange={(e) => setDati((p) => ({ ...p, note: e.target.value }))} />
                </div>
              </div>
              <button onClick={goNext} disabled={!canGoFromDati}
                className={`btn-gold flex items-center gap-2 ${!canGoFromDati ? "opacity-40 cursor-not-allowed" : ""}`}>
                Scegli la sede <ChevronRight size={16} />
              </button>
            </div>
          )}

          {/* ── STEP 2: Sede ── */}
          {step === "sede" && (
            <div className="space-y-6">
              <h2 className="text-xl font-black text-[#111]">Sede e appuntamento</h2>

              {/* Servizio */}
              <div>
                <p className="text-xs font-bold uppercase tracking-widest text-[#57636C] mb-3">Tipo di servizio *</p>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  {SERVIZI.map((s) => (
                    <label key={s.id} className={`flex items-center gap-3 p-3.5 border-2 rounded-xl cursor-pointer transition-all ${
                      servizio === s.id ? "border-[#111] bg-[#F1F4F8]" : "border-[#E5E7EB] bg-white hover:border-[#111]/40"
                    }`}>
                      <div className={`w-4 h-4 rounded-full border-2 flex-shrink-0 flex items-center justify-center transition-colors ${
                        servizio === s.id ? "border-[#111]" : "border-[#D4D4D4]"
                      }`}>
                        {servizio === s.id && <div className="w-2 h-2 bg-[#111] rounded-full" />}
                      </div>
                      <input type="radio" className="sr-only" value={s.id} checked={servizio === s.id} onChange={() => setServizio(s.id)} />
                      <span className="text-sm font-semibold text-[#111]">{s.label}</span>
                    </label>
                  ))}
                </div>
              </div>

              {/* Sede */}
              <div>
                <p className="text-xs font-bold uppercase tracking-widest text-[#57636C] mb-3">Sede *</p>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {SEDI.map((s) => (
                    <label key={s.id} className={`flex items-start gap-3 p-4 border-2 rounded-xl cursor-pointer transition-all ${
                      sede === s.id ? "border-[#111] bg-[#F1F4F8]" : "border-[#E5E7EB] bg-white hover:border-[#111]/40"
                    }`}>
                      <div className={`w-4 h-4 mt-0.5 rounded-full border-2 flex-shrink-0 flex items-center justify-center transition-colors ${
                        sede === s.id ? "border-[#111]" : "border-[#D4D4D4]"
                      }`}>
                        {sede === s.id && <div className="w-2 h-2 bg-[#111] rounded-full" />}
                      </div>
                      <input type="radio" className="sr-only" value={s.id} checked={sede === s.id} onChange={() => setSede(s.id)} />
                      <div>
                        <p className="font-bold text-sm text-[#111]">{s.label}</p>
                        <p className="text-xs text-[#9DA5AE] flex items-center gap-1 mt-0.5">
                          <MapPin size={10} /> {s.address}
                        </p>
                      </div>
                    </label>
                  ))}
                </div>
              </div>

              {/* Data e fascia oraria */}
              <div className="grid sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold uppercase tracking-widest text-[#57636C] mb-1.5">
                    <Calendar size={11} className="inline mr-1" /> Data preferita *
                  </label>
                  <CalendarPicker
                    value={data}
                    onChange={setData}
                    min={new Date().toISOString().split("T")[0]}
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold uppercase tracking-widest text-[#57636C] mb-1.5">Fascia oraria *</label>
                  <FasciaSelect value={fascia} onChange={setFascia} />
                </div>
              </div>

              <div className="flex gap-3">
                <button onClick={goPrev} className="inline-flex items-center gap-1 text-sm font-semibold text-[#57636C] hover:text-[#111] transition-colors">
                  <ArrowLeft size={14} /> Indietro
                </button>
                <button onClick={goNext} disabled={!canGoFromSede}
                  className={`btn-gold flex items-center gap-2 ${!canGoFromSede ? "opacity-40 cursor-not-allowed" : ""}`}>
                  Rivedi e conferma <ChevronRight size={16} />
                </button>
              </div>
            </div>
          )}

          {/* ── STEP 3: Conferma ── */}
          {step === "conferma" && (
            <div className="space-y-6">
              <h2 className="text-xl font-black text-[#111]">Riepilogo prenotazione</h2>

              <div className="space-y-3">
                <div className="border border-[#E5E7EB] rounded-xl p-4 bg-white">
                  <p className="text-[10px] font-bold uppercase tracking-widest text-[#9DA5AE] mb-2">I tuoi dati</p>
                  <p className="text-sm font-bold text-[#111]">{dati.nome} {dati.cognome}</p>
                  <p className="text-sm text-[#57636C]">{dati.email} · {dati.telefono}</p>
                  {dati.note && <p className="text-sm text-[#9DA5AE] mt-1 italic">{dati.note}</p>}
                </div>

                <div className="border border-[#E5E7EB] rounded-xl p-4 bg-white">
                  <p className="text-[10px] font-bold uppercase tracking-widest text-[#9DA5AE] mb-2">Appuntamento</p>
                  <p className="text-sm font-bold text-[#111]">{SERVIZI.find((s) => s.id === servizio)?.label}</p>
                  <p className="text-sm text-[#57636C] flex items-center gap-1.5 mt-1">
                    <MapPin size={13} className="text-[#FFC300]" /> {sedeSel?.label} — {sedeSel?.address}
                  </p>
                  <p className="text-sm text-[#57636C] flex items-center gap-1.5 mt-1">
                    <Calendar size={13} className="text-[#FFC300]" /> {data} · {fascia}
                  </p>
                </div>

                <div className="bg-[#FFF8DC] border border-[#FFC300]/30 rounded-xl p-4 text-sm text-[#7a5c00]">
                  <strong>Nessun pagamento richiesto.</strong> La prenotazione è gratuita. Il nostro team ti contatterà per confermare l&apos;appuntamento e fornire il preventivo definitivo.
                </div>
              </div>

              <div className="flex gap-3">
                <button onClick={goPrev} className="inline-flex items-center gap-1 text-sm font-semibold text-[#57636C] hover:text-[#111] transition-colors">
                  <ArrowLeft size={14} /> Indietro
                </button>
                <button onClick={handleConfirm} disabled={loading}
                  className="btn-gold-lg flex items-center gap-2 flex-1 justify-center">
                  {loading && <Loader2 size={16} className="animate-spin" />}
                  {loading ? "Invio in corso…" : "Conferma prenotazione"}
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Sidebar */}
        <div>{Sidebar}</div>
      </div>
    </div>
  );
}
