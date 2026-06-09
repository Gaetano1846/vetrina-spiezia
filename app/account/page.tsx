"use client";
import { useState, useEffect } from "react";
import { useAuth } from "@/context/AuthContext";
import { db } from "@/lib/firebase";
import { collection, query, where, getDocs, doc, getDoc } from "firebase/firestore";
import { User, Package, MapPin, LogOut, Edit2, Check, X, Loader2, Calendar, Building2 } from "lucide-react";
import Link from "next/link";
import toast from "react-hot-toast";

type Tab = "profilo" | "ordini" | "indirizzi";

type Prenotazione = {
  id: string;
  Intervento?: string;
  Sede_Label?: string;
  Data?: string;
  Stato?: string;
  creataMs: number;
  Pneumatici?: { Marca?: string; Modello?: string; Quantita?: number }[];
};

type Fatturazione = {
  Tipo?: string; RagioneSociale?: string; PIVA?: string; SDI?: string;
  CodiceFiscale?: string; Via?: string; Citta?: string; CAP?: string; Provincia?: string;
};
type Cliente = { Nome?: string; Cognome?: string; Email?: string; Telefono?: string; Fatturazione?: Fatturazione };

function statoBadge(s?: string): string {
  const v = (s ?? "").toLowerCase();
  if (v.includes("conferm")) return "bg-emerald-50 text-[#249689] border-emerald-200";
  if (v.includes("annull")) return "bg-red-50 text-[#FF5963] border-red-200";
  return "bg-amber-50 text-amber-700 border-amber-200";
}

export default function AccountPage() {
  const { user, logout, updateName } = useAuth();
  const [tab, setTab] = useState<Tab>("profilo");
  const [editName, setEditName] = useState(false);
  const [newName, setNewName] = useState(user?.displayName ?? "");
  const [savingName, setSavingName] = useState(false);

  const [pren, setPren] = useState<Prenotazione[]>([]);
  const [loadingPren, setLoadingPren] = useState(true);
  const [cliente, setCliente] = useState<Cliente | null>(null);
  const [loadingInd, setLoadingInd] = useState(true);

  useEffect(() => { setNewName(user?.displayName ?? ""); }, [user?.displayName]);

  useEffect(() => {
    if (!user?.uid) { setLoadingPren(false); setLoadingInd(false); return; }
    let active = true;
    (async () => {
      // Prenotazioni (Appuntamenti collegati all'utente)
      try {
        const snap = await getDocs(query(collection(db, "Appuntamenti"), where("uid", "==", user.uid)));
        const list: Prenotazione[] = snap.docs.map((d) => {
          const x = d.data() as Record<string, unknown>;
          const dc = x.Data_Creazione as { toMillis?: () => number } | undefined;
          return {
            id: d.id,
            Intervento: x.Intervento as string | undefined,
            Sede_Label: x.Sede_Label as string | undefined,
            Data: x.Data as string | undefined,
            Stato: x.Stato as string | undefined,
            creataMs: dc?.toMillis?.() ?? 0,
            Pneumatici: (x.Pneumatici as Prenotazione["Pneumatici"]) ?? [],
          };
        });
        list.sort((a, b) => b.creataMs - a.creataMs);
        if (active) setPren(list);
      } catch (e) { console.error("[account] prenotazioni:", e); }
      finally { if (active) setLoadingPren(false); }

      // Indirizzi / fatturazione salvati
      try {
        const cs = await getDoc(doc(db, "Vetrina_Clienti", user.uid));
        if (active) setCliente(cs.exists() ? (cs.data() as Cliente) : null);
      } catch (e) { console.error("[account] indirizzi:", e); }
      finally { if (active) setLoadingInd(false); }
    })();
    return () => { active = false; };
  }, [user?.uid]);

  async function handleSaveName() {
    if (!newName.trim()) return;
    setSavingName(true);
    try {
      await updateName(newName.trim());
      toast.success("Nome aggiornato");
      setEditName(false);
    } catch {
      toast.error("Errore nel salvataggio del nome");
    } finally {
      setSavingName(false);
    }
  }

  if (!user) {
    return (
      <div className="max-w-md mx-auto px-4 py-24 text-center">
        <div className="w-20 h-20 bg-[#F1F4F8] rounded-full flex items-center justify-center mx-auto mb-6 text-4xl">🔐</div>
        <h1 className="text-2xl font-black text-[#001D3D] mb-2">Accedi al tuo account</h1>
        <p className="text-[#57636C] mb-6">Effettua l&apos;accesso per vedere le tue prenotazioni e gestire il profilo.</p>
        <Link href="/" className="btn-gold">Vai alla home</Link>
      </div>
    );
  }

  const tabs: { id: Tab; label: string; icon: typeof User }[] = [
    { id: "profilo", label: "Profilo", icon: User },
    { id: "ordini", label: "Prenotazioni", icon: Package },
    { id: "indirizzi", label: "Indirizzi", icon: MapPin },
  ];

  const f = cliente?.Fatturazione;
  const hasIndirizzo = !!(f && (f.Via || f.RagioneSociale || f.PIVA || f.CodiceFiscale || f.Citta));

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 py-8">
      {/* Header */}
      <div className="flex items-start justify-between mb-8">
        <div>
          <p className="eyebrow mb-1">Il tuo account</p>
          <h1 className="text-3xl font-black text-[#001D3D]">{user.displayName || "Utente"}</h1>
          <p className="text-[#9DA5AE] text-sm mt-1">{user.email}</p>
        </div>
        <button onClick={logout} className="btn-ghost flex items-center gap-1.5 text-[#9DA5AE] hover:text-[#FF5963] transition-colors">
          <LogOut size={14} /> Esci
        </button>
      </div>

      {/* Tabs */}
      <div className="flex border-b border-[#E5E7EB] mb-8">
        {tabs.map((t) => (
          <button
            key={t.id}
            onClick={() => setTab(t.id)}
            className={`flex items-center gap-2 px-5 py-3 text-sm font-bold transition-colors border-b-2 -mb-px ${
              tab === t.id ? "border-[#FFC300] text-[#001D3D]" : "border-transparent text-[#9DA5AE] hover:text-[#57636C]"
            }`}
          >
            <t.icon size={15} />
            {t.label}
            {t.id === "ordini" && pren.length > 0 && (
              <span className="ml-0.5 text-[10px] font-black bg-[#FFC300] text-[#111] rounded-full px-1.5 py-0.5">{pren.length}</span>
            )}
          </button>
        ))}
      </div>

      {/* PROFILO */}
      {tab === "profilo" && (
        <div className="max-w-lg space-y-6">
          <div className="border border-[#E5E7EB] rounded-xl p-6 bg-white shadow-[0_2px_8px_rgba(0,29,61,0.06)]">
            <h2 className="text-[10px] font-black uppercase tracking-widest text-[#001D3D] mb-5">Informazioni personali</h2>
            <div className="space-y-4">
              <div>
                <label className="block text-xs font-bold uppercase tracking-widest text-[#57636C] mb-1.5">Nome completo</label>
                {editName ? (
                  <div className="flex gap-2">
                    <input
                      className="flex-1 border border-[#E5E7EB] rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:border-[#001D3D] transition-colors"
                      value={newName}
                      onChange={(e) => setNewName(e.target.value)}
                      onKeyDown={(e) => { if (e.key === "Enter") handleSaveName(); }}
                      autoFocus
                    />
                    <button
                      onClick={handleSaveName}
                      disabled={savingName || !newName.trim()}
                      className="w-10 h-10 border border-[#E5E7EB] rounded-lg flex items-center justify-center hover:bg-[#F1F4F8] transition-colors disabled:opacity-40"
                    >
                      {savingName ? <Loader2 size={14} className="animate-spin text-[#57636C]" /> : <Check size={14} className="text-[#249689]" />}
                    </button>
                    <button
                      onClick={() => { setEditName(false); setNewName(user.displayName ?? ""); }}
                      className="w-10 h-10 border border-[#E5E7EB] rounded-lg flex items-center justify-center hover:bg-[#F1F4F8] transition-colors"
                    >
                      <X size={14} className="text-[#9DA5AE]" />
                    </button>
                  </div>
                ) : (
                  <div className="flex items-center justify-between border border-[#E5E7EB] rounded-lg px-4 py-3 bg-white">
                    <span className="text-sm text-[#001D3D]">{user.displayName || "—"}</span>
                    <button onClick={() => setEditName(true)} className="text-[#9DA5AE] hover:text-[#FFC300] transition-colors">
                      <Edit2 size={14} />
                    </button>
                  </div>
                )}
              </div>
              <div>
                <label className="block text-xs font-bold uppercase tracking-widest text-[#57636C] mb-1.5">Email</label>
                <div className="border border-[#E5E7EB] rounded-lg px-4 py-3 bg-[#F1F4F8]">
                  <span className="text-sm text-[#57636C]">{user.email}</span>
                </div>
              </div>
            </div>
          </div>

          <div className="border border-[#E5E7EB] rounded-xl p-6 bg-white shadow-[0_2px_8px_rgba(0,29,61,0.06)]">
            <h2 className="text-[10px] font-black uppercase tracking-widest text-[#001D3D] mb-5">Sicurezza</h2>
            <p className="text-sm text-[#57636C]">
              Per cambiare la password, usa la funzione &quot;Password dimenticata&quot; nella pagina di accesso.
            </p>
          </div>
        </div>
      )}

      {/* PRENOTAZIONI */}
      {tab === "ordini" && (
        <div>
          {loadingPren ? (
            <div className="flex items-center justify-center py-16 text-[#9DA5AE]"><Loader2 size={22} className="animate-spin" /></div>
          ) : pren.length === 0 ? (
            <div className="text-center py-16 border border-[#E5E7EB] rounded-xl bg-white">
              <div className="w-16 h-16 bg-[#F1F4F8] rounded-full flex items-center justify-center mx-auto mb-4">
                <Package size={28} className="text-[#9DA5AE]" />
              </div>
              <p className="font-bold text-[#001D3D]">Nessuna prenotazione ancora</p>
              <p className="text-sm text-[#9DA5AE] mt-1 mb-6">Le tue prenotazioni appariranno qui.</p>
              <Link href="/prodotti" className="btn-gold text-sm">Sfoglia il catalogo</Link>
            </div>
          ) : (
            <div className="space-y-3">
              {pren.map((p) => (
                <div key={p.id} className="border border-[#E5E7EB] rounded-xl p-5 bg-white shadow-[0_2px_8px_rgba(0,29,61,0.06)]">
                  <div className="flex items-start justify-between gap-3 mb-3">
                    <div>
                      <p className="font-black text-[#001D3D]">{p.Intervento || "Appuntamento"}</p>
                      <p className="text-sm text-[#57636C] flex items-center gap-1.5 mt-1">
                        <MapPin size={13} className="text-[#FFC300]" /> {p.Sede_Label || "—"}
                      </p>
                      <p className="text-sm text-[#57636C] flex items-center gap-1.5 mt-0.5">
                        <Calendar size={13} className="text-[#FFC300]" /> {p.Data || "—"}
                      </p>
                    </div>
                    <span className={`text-[10px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-full border ${statoBadge(p.Stato)}`}>
                      {p.Stato || "In attesa"}
                    </span>
                  </div>
                  {p.Pneumatici && p.Pneumatici.length > 0 && (
                    <div className="border-t border-[#F1F4F8] pt-3 space-y-1">
                      {p.Pneumatici.map((pn, i) => (
                        <p key={i} className="text-xs text-[#57636C]">
                          <span className="font-semibold text-[#001D3D]">{pn.Quantita}×</span> {pn.Marca} {pn.Modello}
                        </p>
                      ))}
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* INDIRIZZI */}
      {tab === "indirizzi" && (
        <div>
          {loadingInd ? (
            <div className="flex items-center justify-center py-16 text-[#9DA5AE]"><Loader2 size={22} className="animate-spin" /></div>
          ) : !hasIndirizzo ? (
            <div className="text-center py-16 border border-[#E5E7EB] rounded-xl bg-white">
              <div className="w-16 h-16 bg-[#F1F4F8] rounded-full flex items-center justify-center mx-auto mb-4">
                <MapPin size={28} className="text-[#9DA5AE]" />
              </div>
              <p className="font-bold text-[#001D3D]">Nessun indirizzo salvato</p>
              <p className="text-sm text-[#9DA5AE] mt-1 mb-6">I dati di fatturazione inseriti durante la prenotazione vengono salvati qui.</p>
              <Link href="/checkout" className="btn-outline-navy text-sm">Prenota un appuntamento</Link>
            </div>
          ) : (
            <div className="border border-[#E5E7EB] rounded-xl p-6 bg-white shadow-[0_2px_8px_rgba(0,29,61,0.06)] max-w-lg">
              <div className="flex items-center gap-2 mb-4">
                {f!.Tipo === "Azienda" ? <Building2 size={16} className="text-[#FFC300]" /> : <User size={16} className="text-[#FFC300]" />}
                <h2 className="text-[10px] font-black uppercase tracking-widest text-[#001D3D]">
                  Dati di fatturazione · {f!.Tipo || "Privato"}
                </h2>
              </div>
              <dl className="space-y-2 text-sm">
                {f!.RagioneSociale && <Row k="Ragione sociale" v={f!.RagioneSociale} />}
                {(cliente?.Nome || cliente?.Cognome) && !f!.RagioneSociale && <Row k="Intestatario" v={`${cliente?.Nome ?? ""} ${cliente?.Cognome ?? ""}`.trim()} />}
                {f!.PIVA && <Row k="Partita IVA" v={f!.PIVA} />}
                {f!.SDI && <Row k="Codice SDI" v={f!.SDI} />}
                {f!.CodiceFiscale && <Row k="Codice fiscale" v={f!.CodiceFiscale} />}
                {(f!.Via || f!.Citta) && (
                  <Row k="Indirizzo" v={[f!.Via, f!.CAP, f!.Citta, f!.Provincia].filter(Boolean).join(", ")} />
                )}
                {cliente?.Telefono && <Row k="Telefono" v={cliente.Telefono} />}
              </dl>
              <Link href="/checkout" className="inline-block mt-5 text-xs font-bold text-[#001D3D] underline underline-offset-4 hover:text-[#FFC300] transition-colors">
                Aggiorna alla prossima prenotazione →
              </Link>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

function Row({ k, v }: { k: string; v: string }) {
  return (
    <div className="flex justify-between gap-4 border-b border-[#F1F4F8] pb-2">
      <dt className="text-[#9DA5AE]">{k}</dt>
      <dd className="font-semibold text-[#001D3D] text-right">{v}</dd>
    </div>
  );
}
