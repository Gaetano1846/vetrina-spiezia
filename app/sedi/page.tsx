import type { Metadata } from "next";
import Link from "next/link";
import { MapPin, Phone, Clock, ChevronRight } from "lucide-react";
import { SEDI, ORARI_SEDE } from "@/lib/sedi";

const SITE = "https://spieziatyres.it";

export const metadata: Metadata = {
  title: "Sedi e officine — Campania e Lazio",
  description:
    "Le 4 sedi Spiezia Tyres: Nola, Volla e Portici in Campania, Fiano Romano nel Lazio. Indirizzi, orari e contatti delle nostre officine per la vendita e il montaggio pneumatici.",
  alternates: { canonical: "/sedi" },
};

// ItemList delle sedi (aiuta i motori a capire la rete di punti vendita) +
// BreadcrumbList. Ogni sede ha la sua pagina dedicata con schema AutoDealer.
const schema = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "ItemList",
      name: "Sedi Spiezia Tyres",
      itemListElement: SEDI.map((s, i) => ({
        "@type": "ListItem",
        position: i + 1,
        name: `Spiezia Tyres — ${s.city}`,
        url: `${SITE}/sedi/${s.slug}`,
      })),
    },
    {
      "@type": "BreadcrumbList",
      itemListElement: [
        { "@type": "ListItem", position: 1, name: "Home", item: `${SITE}/` },
        { "@type": "ListItem", position: 2, name: "Sedi", item: `${SITE}/sedi` },
      ],
    },
  ],
};

export default function SediPage() {
  return (
    <div className="bg-white">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
      />

      {/* ── Hero ── */}
      <section className="border-b border-[#E5E7EB] bg-[#F8F9FB]">
        <div className="max-w-8xl mx-auto px-4 sm:px-6 py-12 sm:py-16">
          <div className="flex items-center gap-3 mb-5">
            <span className="w-1 h-5 rounded-full bg-[#FFC300] flex-shrink-0" />
            <span className="text-xs font-bold text-[#92700A] uppercase tracking-widest">Le nostre sedi</span>
          </div>
          <h1 className="text-3xl sm:text-5xl font-black text-[#111827] mb-4 leading-tight">
            4 officine tra Campania e Lazio
          </h1>
          <p className="text-[#57636C] text-base sm:text-lg leading-relaxed max-w-2xl">
            Vendita e montaggio pneumatici, equilibratura, convergenza e meccanica leggera.
            Scegli la sede più comoda: trovi indirizzo, orari e indicazioni stradali per ognuna.
          </p>
        </div>
      </section>

      {/* ── Griglia sedi ── */}
      <section className="py-14 border-b border-[#E5E7EB]">
        <div className="max-w-8xl mx-auto px-4 sm:px-6">
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {SEDI.map((s) => (
              <Link
                key={s.slug}
                href={`/sedi/${s.slug}`}
                className="group bg-white rounded-2xl p-5 border border-[#E5E7EB] hover:border-[#FFC300]/60 hover:shadow-md transition-all flex flex-col gap-3"
              >
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 bg-[#FFC300] rounded-lg flex items-center justify-center flex-shrink-0">
                    <MapPin size={15} className="text-[#111827]" />
                  </div>
                  <h2 className="font-black text-[#111827]">{s.city}</h2>
                </div>
                <p className="text-sm text-[#57636C]">{s.address}</p>
                <p className="text-xs text-[#9DA5AE]">{s.postalCode} {s.city} ({s.province}) · {s.region}</p>
                <span className="mt-auto pt-2 inline-flex items-center gap-1 text-xs font-bold text-[#92700A] group-hover:gap-2 transition-all">
                  Dettagli sede <ChevronRight size={13} />
                </span>
              </Link>
            ))}
          </div>

          {/* Orari comuni */}
          <div className="mt-8 flex items-start gap-4 p-5 bg-[#F8F9FB] rounded-2xl border border-[#E5E7EB] max-w-md">
            <div className="w-9 h-9 bg-[#FFC300]/10 rounded-xl flex items-center justify-center flex-shrink-0">
              <Clock size={16} className="text-[#92700A]" />
            </div>
            <div className="flex-1">
              <p className="text-xs font-black uppercase tracking-widest text-[#9DA5AE] mb-2">Orari di apertura</p>
              <div className="space-y-1 text-sm">
                {ORARI_SEDE.map((o) => (
                  <div key={o.giorni} className="flex justify-between gap-6">
                    <span className="text-[#57636C]">{o.giorni}</span>
                    <span className="font-semibold text-[#111827] text-right">{o.orario}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── CTA ── */}
      <section className="py-14">
        <div className="max-w-8xl mx-auto px-4 sm:px-6">
          <div className="bg-[#FFFBEB] border border-[#FFC300]/40 rounded-2xl px-8 py-10 max-w-2xl">
            <h2 className="text-xl font-black text-[#111827] mb-2">Hai bisogno di nuove gomme?</h2>
            <p className="text-sm text-[#57636C] leading-relaxed mb-6">
              Scegli i pneumatici online e prenota il montaggio nella sede che preferisci.
              Nessun anticipo: confermi il prezzo e paghi in officina.
            </p>
            <div className="flex flex-wrap gap-3">
              <Link href="/prodotti" className="btn-gold inline-flex items-center gap-2">
                Sfoglia il catalogo
              </Link>
              <a href="tel:+390815115011" className="btn-outline-navy inline-flex items-center gap-2">
                <Phone size={15} /> Chiamaci
              </a>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
