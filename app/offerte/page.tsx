import type { Metadata } from "next";
import Link from "next/link";
import { Tag } from "lucide-react";
import ProductCard from "@/components/products/ProductCard";
import { getOfferte } from "@/lib/algolia";

const SITE = "https://spieziatyres.it";

// ISR: prezzi/stock cambiano → rigenera ogni ora.
export const revalidate = 3600;

export const metadata: Metadata = {
  title: "Offerte pneumatici",
  description:
    "Le migliori offerte su pneumatici auto, SUV, moto e agricoli da Spiezia Tyres: sconti reali sui modelli in pronta consegna. Prenota il montaggio nelle 4 sedi in Campania e Lazio.",
  alternates: { canonical: "/offerte" },
  openGraph: { title: "Offerte pneumatici | Spiezia Tyres", type: "website", url: "/offerte" },
};

export default async function OffertePage() {
  const { offerte, total } = await getOfferte({ limit: 48, minDiscount: 10 });

  const schema = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "CollectionPage",
        "@id": `${SITE}/offerte#collection`,
        url: `${SITE}/offerte`,
        name: "Offerte pneumatici",
        description: "Pneumatici in offerta con sconti reali, in pronta consegna presso le sedi Spiezia Tyres.",
        isPartOf: { "@id": `${SITE}/#website` },
        mainEntity: {
          "@type": "ItemList",
          numberOfItems: offerte.length,
          itemListElement: offerte.map((p, i) => ({
            "@type": "ListItem",
            position: i + 1,
            url: `${SITE}/prodotto/${p.id}`,
            name: p.titolo,
          })),
        },
      },
      {
        "@type": "BreadcrumbList",
        itemListElement: [
          { "@type": "ListItem", position: 1, name: "Home", item: `${SITE}/` },
          { "@type": "ListItem", position: 2, name: "Offerte", item: `${SITE}/offerte` },
        ],
      },
    ],
  };

  return (
    <div className="max-w-8xl mx-auto px-4 sm:px-6 py-5 sm:py-8">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }} />

      {/* Header */}
      <header className="mb-6">
        <div className="inline-flex items-center gap-2.5 mb-2">
          <span className="w-1 h-5 rounded-full bg-[#FFC300] flex-shrink-0" />
          <span className="text-xs font-bold text-[#FFC300] uppercase tracking-widest">#Promozioni</span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-black text-[#001D3D] mb-2">Offerte pneumatici</h1>
        <p className="text-sm text-[#57636C] leading-relaxed max-w-3xl">
          Le occasioni del momento da Spiezia Tyres: pneumatici di tutte le stagioni con uno sconto reale sul prezzo di
          listino, disponibili in pronta consegna nelle 4 sedi tra Campania e Lazio. Seleziona online e prenota
          l&apos;appuntamento &mdash; paghi e monti in sede, senza anticipo.
        </p>
        {total > 0 && (
          <p className="mt-3 text-sm">
            <span className="font-bold text-[#001D3D]">{total.toLocaleString("it-IT")}</span>
            <span className="text-[#57636C]"> pneumatici in offerta</span>
          </p>
        )}
      </header>

      {offerte.length === 0 ? (
        <div className="py-20 px-6 text-center bg-[#F8F9FB] rounded-2xl border border-[#E5E7EB]">
          <div className="w-12 h-12 rounded-2xl bg-[#FFC300]/15 flex items-center justify-center mx-auto mb-4">
            <Tag size={22} className="text-[#92700A]" />
          </div>
          <p className="text-sm font-semibold text-[#001D3D] mb-1">Nessuna offerta attiva al momento</p>
          <p className="text-sm text-[#9DA5AE] mb-6">Torna a trovarci: aggiorniamo le offerte di frequente.</p>
          <Link
            href="/prodotti"
            className="inline-flex items-center gap-2 h-10 px-5 rounded-xl bg-[#FFC300] hover:bg-[#E6B000] text-[#001D3D] font-bold text-sm transition-colors"
          >
            Sfoglia il catalogo
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-4">
          {offerte.map((p) => <ProductCard key={p.id} prodotto={p} />)}
        </div>
      )}
    </div>
  );
}
