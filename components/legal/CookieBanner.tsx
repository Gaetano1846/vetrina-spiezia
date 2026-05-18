"use client";
import { useState, useEffect } from "react";
import Link from "next/link";
import { X } from "lucide-react";

const STORAGE_KEY = "cookie-consent";

export default function CookieBanner() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    try {
      if (!localStorage.getItem(STORAGE_KEY)) setVisible(true);
    } catch { /* private mode */ }
  }, []);

  function accept() {
    try { localStorage.setItem(STORAGE_KEY, "accepted"); } catch { /* */ }
    setVisible(false);
  }

  function refuse() {
    try { localStorage.setItem(STORAGE_KEY, "refused"); } catch { /* */ }
    setVisible(false);
  }

  if (!visible) return null;

  return (
    <div className="fixed bottom-0 left-0 right-0 z-[500] p-4 sm:p-6">
      <div className="max-w-3xl mx-auto bg-white border border-[#E5E7EB] rounded-2xl shadow-2xl p-5 sm:p-6 flex flex-col sm:flex-row gap-4 sm:items-center">
        <div className="flex-1 min-w-0">
          <p className="text-sm font-bold text-[#111] mb-1">Questo sito usa cookie</p>
          <p className="text-xs text-[#57636C] leading-relaxed">
            Utilizziamo cookie tecnici necessari al funzionamento del sito (autenticazione, carrello).{" "}
            Nessun cookie di profilazione senza il tuo consenso.{" "}
            <Link href="/privacy" className="text-[#FFC300] hover:text-[#92700A] font-semibold underline underline-offset-2">
              Leggi la privacy policy
            </Link>
          </p>
        </div>
        <div className="flex items-center gap-2 flex-shrink-0">
          <button
            onClick={refuse}
            className="text-xs font-bold text-[#57636C] hover:text-[#111] transition-colors px-4 py-2.5 rounded-lg border border-[#E5E7EB] hover:border-[#111]/30"
          >
            Rifiuta
          </button>
          <button
            onClick={accept}
            className="text-xs font-black bg-[#FFC300] hover:bg-[#E6B000] text-[#111] px-4 py-2.5 rounded-lg transition-colors"
          >
            Accetta
          </button>
          <button
            onClick={refuse}
            aria-label="Chiudi banner cookie"
            className="text-[#9DA5AE] hover:text-[#111] transition-colors p-1"
          >
            <X size={16} />
          </button>
        </div>
      </div>
    </div>
  );
}
