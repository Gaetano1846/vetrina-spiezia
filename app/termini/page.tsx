import type { Metadata } from "next";
import Link from "next/link";
import { ChevronRight } from "lucide-react";

export const metadata: Metadata = {
  title: "Termini e Condizioni",
  description: "Termini e condizioni di vendita di SpieziaTyres.",
};

export default function TerminiPage() {
  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 py-12">
      <nav className="flex items-center gap-2 text-xs text-[#9B9B9B] mb-8">
        <Link href="/" className="hover:text-[#0A0A0A] transition-colors">Home</Link>
        <ChevronRight size={12} />
        <span className="text-[#0A0A0A]">Termini e Condizioni</span>
      </nav>

      <p className="section-eyebrow">Legale</p>
      <h1 className="text-3xl font-black mb-8">Termini e Condizioni di Vendita</h1>

      <div className="prose prose-sm max-w-none space-y-8 text-[#5C5C5C] leading-relaxed">
        <section>
          <h2 className="text-base font-black text-[#0A0A0A] mb-3">1. Soggetto gestore</h2>
          <p>Il presente sito è gestito da Spiezia Tyres S.p.A. (marchio PrezzoGomme), P.IVA IT07737141213, con sede in Via Variante 7 Bis, 301 – Nola (NA), Italia. Contatto: <a href="mailto:info@prezzo-gomme.it" className="text-[#FF4500] hover:underline">info@prezzo-gomme.it</a>.</p>
        </section>
        <section>
          <h2 className="text-base font-black text-[#0A0A0A] mb-3">2. Oggetto del servizio</h2>
          <p>Il presente sito consente agli utenti di consultare il catalogo pneumatici e prenotare un appuntamento presso le sedi Spiezia Tyres per l&apos;acquisto, il montaggio o una consulenza. Nessun acquisto viene perfezionato online: il contratto di vendita si conclude esclusivamente in sede.</p>
        </section>
        <section>
          <h2 className="text-base font-black text-[#0A0A0A] mb-3">3. Prezzi e preventivi</h2>
          <p>Tutti i prezzi mostrati sono in Euro (€) e includono IVA al 22%. Il PFU (Pneumatico Fuori Uso) è indicato separatamente ai sensi del D.M. 182/2003. I prezzi visualizzati sono indicativi: il prezzo definitivo è confermato in sede al momento del servizio.</p>
        </section>
        <section>
          <h2 className="text-base font-black text-[#0A0A0A] mb-3">4. Prenotazioni</h2>
          <p>La prenotazione online è gratuita e non vincolante. L&apos;utente riceverà una conferma via email o telefono entro 24 ore lavorative. Spiezia Tyres si riserva il diritto di contattare l&apos;utente per ridefinire data e orario in caso di indisponibilità.</p>
        </section>
        <section>
          <h2 className="text-base font-black text-[#0A0A0A] mb-3">5. Diritto di recesso</h2>
          <p>Il consumatore ha diritto di recedere entro 14 giorni dalla consegna senza indicarne il motivo (art. 52 D.Lgs. 206/2005). I prodotti devono essere restituiti integri, nella confezione originale, non montati.</p>
        </section>
        <section>
          <h2 className="text-base font-black text-[#0A0A0A] mb-3">6. Garanzia</h2>
          <p>I prodotti sono coperti dalla garanzia legale di conformità di 24 mesi per i consumatori (12 mesi per le aziende). Per difetti di conformità contattare <a href="mailto:info@prezzo-gomme.it" className="text-[#FF4500] hover:underline">info@prezzo-gomme.it</a>.</p>
        </section>
        <section>
          <h2 className="text-base font-black text-[#0A0A0A] mb-3">9. Contatti</h2>
          <p>Per qualsiasi comunicazione: <a href="mailto:info@prezzo-gomme.it" className="text-[#FF4500] hover:underline">info@prezzo-gomme.it</a> oppure +39 081 511 5011.</p>
        </section>
      </div>
    </div>
  );
}
