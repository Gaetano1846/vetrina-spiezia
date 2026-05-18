"use client";
import { useState } from "react";
import { useAuth } from "@/context/AuthContext";
import { User, Package, MapPin, LogOut, Edit2, Check, X } from "lucide-react";
import Link from "next/link";

type Tab = "profilo" | "ordini" | "indirizzi";

export default function AccountPage() {
  const { user, logout } = useAuth();
  const [tab, setTab] = useState<Tab>("profilo");
  const [editName, setEditName] = useState(false);
  const [newName, setNewName] = useState(user?.displayName ?? "");

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

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 py-8">
      {/* Header */}
      <div className="flex items-start justify-between mb-8">
        <div>
          <p className="eyebrow mb-1">Il tuo account</p>
          <h1 className="text-3xl font-black text-[#001D3D]">{user.displayName || "Utente"}</h1>
          <p className="text-[#9DA5AE] text-sm mt-1">{user.email}</p>
        </div>
        <button
          onClick={logout}
          className="btn-ghost flex items-center gap-1.5 text-[#9DA5AE] hover:text-[#FF5963] transition-colors"
        >
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
              tab === t.id
                ? "border-[#FFC300] text-[#001D3D]"
                : "border-transparent text-[#9DA5AE] hover:text-[#57636C]"
            }`}
          >
            <t.icon size={15} />
            {t.label}
          </button>
        ))}
      </div>

      {/* PROFILO */}
      {tab === "profilo" && (
        <div className="max-w-lg space-y-6">
          <div className="border border-[#E5E7EB] rounded-xl p-6 bg-white shadow-[0_2px_8px_rgba(0,29,61,0.06)]">
            <h2 className="text-[10px] font-black uppercase tracking-widest text-[#001D3D] mb-5">Informazioni personali</h2>
            <div className="space-y-4">
              {/* Name */}
              <div>
                <label className="block text-xs font-bold uppercase tracking-widest text-[#57636C] mb-1.5">Nome completo</label>
                {editName ? (
                  <div className="flex gap-2">
                    <input
                      className="flex-1 border border-[#E5E7EB] rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:border-[#001D3D] transition-colors"
                      value={newName}
                      onChange={(e) => setNewName(e.target.value)}
                      autoFocus
                    />
                    <button
                      onClick={() => setEditName(false)}
                      className="w-10 h-10 border border-[#E5E7EB] rounded-lg flex items-center justify-center hover:bg-[#F1F4F8] transition-colors"
                    >
                      <Check size={14} className="text-[#249689]" />
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
              {/* Email */}
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
            <p className="text-sm text-[#57636C] mb-4">
              Per cambiare la password, usa la funzione &quot;Password dimenticata&quot; nella pagina di accesso.
            </p>
          </div>
        </div>
      )}

      {/* ORDINI */}
      {tab === "ordini" && (
        <div>
          <div className="text-center py-16 border border-[#E5E7EB] rounded-xl bg-white">
            <div className="w-16 h-16 bg-[#F1F4F8] rounded-full flex items-center justify-center mx-auto mb-4">
              <Package size={28} className="text-[#9DA5AE]" />
            </div>
            <p className="font-bold text-[#001D3D]">Nessuna prenotazione ancora</p>
            <p className="text-sm text-[#9DA5AE] mt-1 mb-6">Le tue prenotazioni appariranno qui.</p>
            <Link href="/prodotti" className="btn-gold text-sm">Sfoglia il catalogo</Link>
          </div>
        </div>
      )}

      {/* INDIRIZZI */}
      {tab === "indirizzi" && (
        <div>
          <div className="text-center py-16 border border-[#E5E7EB] rounded-xl bg-white">
            <div className="w-16 h-16 bg-[#F1F4F8] rounded-full flex items-center justify-center mx-auto mb-4">
              <MapPin size={28} className="text-[#9DA5AE]" />
            </div>
            <p className="font-bold text-[#001D3D]">Nessun indirizzo salvato</p>
            <p className="text-sm text-[#9DA5AE] mt-1 mb-6">Gli indirizzi inseriti durante la prenotazione vengono salvati qui.</p>
            <Link href="/checkout" className="btn-outline-navy text-sm">Prenota un appuntamento</Link>
          </div>
        </div>
      )}
    </div>
  );
}
