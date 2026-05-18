import type { Metadata } from "next";
import Link from "next/link";
import { ChevronRight } from "lucide-react";

export const metadata: Metadata = {
  title: "Privacy Policy",
  description: "Informativa sulla privacy e trattamento dei dati personali di SpieziaTyres.",
};

export default function PrivacyPage() {
  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 py-12">
      <nav className="flex items-center gap-2 text-xs text-[#9B9B9B] mb-8">
        <Link href="/" className="hover:text-[#0A0A0A] transition-colors">Home</Link>
        <ChevronRight size={12} />
        <span className="text-[#0A0A0A]">Privacy Policy</span>
      </nav>

      <p className="section-eyebrow">Legale</p>
      <h1 className="text-3xl font-black mb-8">Informativa sulla Privacy</h1>

      <div className="space-y-8 text-sm text-[#5C5C5C] leading-relaxed">
        <section>
          <h2 className="text-base font-black text-[#0A0A0A] mb-3">1. Titolare del trattamento</h2>
          <p>Spiezia Tyres S.p.A. (marchio PrezzoGomme), P.IVA IT07737141213, Via Variante 7 Bis, 301 – Nola (NA). Contatto: <a href="mailto:info@prezzo-gomme.it" className="text-[#FF4500] hover:underline">info@prezzo-gomme.it</a>.</p>
          <p className="mt-2">Informativa redatta ai sensi del Regolamento UE 2016/679 (GDPR).</p>
        </section>
        <section>
          <h2 className="text-base font-black text-[#0A0A0A] mb-3">2. Dati raccolti</h2>
          <ul className="list-disc pl-4 space-y-1">
            <li>Dati di registrazione: nome, email, password cifrata</li>
            <li>Dati di prenotazione: sede scelta, data e fascia oraria, servizio richiesto, note</li>
            <li>Dati di contatto: numero di telefono per la conferma dell&apos;appuntamento</li>
            <li>Dati di navigazione: IP, cookie tecnici e analitici</li>
          </ul>
        </section>
        <section>
          <h2 className="text-base font-black text-[#0A0A0A] mb-3">3. Finalità e basi giuridiche</h2>
          <ul className="list-disc pl-4 space-y-1">
            <li>Esecuzione del contratto (art. 6.1.b GDPR)</li>
            <li>Obblighi fiscali e di legge (art. 6.1.c GDPR)</li>
            <li>Marketing con esplicito consenso (art. 6.1.a GDPR)</li>
          </ul>
        </section>
        <section>
          <h2 className="text-base font-black text-[#0A0A0A] mb-3">4. Diritti dell&apos;interessato</h2>
          <p>Hai diritto di accedere, rettificare, cancellare i tuoi dati, opporti al trattamento per marketing e richiedere la portabilità. Per esercitare i tuoi diritti: <a href="mailto:info@prezzo-gomme.it" className="text-[#FF4500] hover:underline">info@prezzo-gomme.it</a>.</p>
        </section>
      </div>
    </div>
  );
}
