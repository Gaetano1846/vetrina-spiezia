import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import { Tag, ArrowRight } from "lucide-react";
import { PROMOZIONI } from "@/lib/promozioni";

const SITE = "https://spieziatyres.it";

export const metadata: Metadata = {
  title: "Promozioni pneumatici e officina",
  description:
    "Tutte le promozioni attive di Spiezia Tyres: cambio gomme stagionale, treni di pneumatici con montaggio incluso, tagliando + gomme. Approfitta delle offerte nelle 4 sedi in Campania e Lazio.",
  alternates: { canonical: "/promozioni" },
  openGraph: { title: "Promozioni | Spiezia Tyres", type: "website", url: "/promozioni" },
};

const schema = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "CollectionPage",
      "@id": `${SITE}/promozioni#collection`,
      url: `${SITE}/promozioni`,
      name: "Promozioni Spiezia Tyres",
      isPartOf: { "@id": `${SITE}/#website` },
      mainEntity: {
        "@type": "ItemList",
        numberOfItems: PROMOZIONI.length,
        itemListElement: PROMOZIONI.map((p, i) => ({
          "@type": "ListItem",
          position: i + 1,
          url: `${SITE}/promozioni/${p.slug}`,
          name: p.title,
        })),
      },
    },
    {
      "@type": "BreadcrumbList",
      itemListElement: [
        { "@type": "ListItem", position: 1, name: "Home", item: `${SITE}/` },
        { "@type": "ListItem", position: 2, name: "Promozioni", item: `${SITE}/promozioni` },
      ],
    },
  ],
};

export default function PromozioniPage() {
  return (
    <div className="bg-white">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }} />

      {/* Hero */}
      <section className="border-b border-[#E5E7EB] bg-[#0d0d0d]">
        <div className="max-w-8xl mx-auto px-4 sm:px-6 py-12 sm:py-16">
          <div className="flex items-center gap-3 mb-4">
            <span className="w-1 h-5 rounded-full bg-[#FFC300] flex-shrink-0" />
            <span className="text-xs font-bold text-[#FFC300] uppercase tracking-widest">#Promozioni</span>
          </div>
          <h1 className="text-3xl sm:text-5xl font-black text-white mb-4 leading-tight">
            Le promozioni attive
          </h1>
          <p className="text-[#999] text-base sm:text-lg leading-relaxed max-w-2xl">
            Approfitta delle convenienze di Spiezia Tyres su pneumatici e servizi per la tua auto.
            Scegli la promozione, scopri i dettagli e prenota nella sede più comoda.
          </p>
        </div>
      </section>

      {/* Griglia promo */}
      <section className="py-14">
        <div className="max-w-8xl mx-auto px-4 sm:px-6">
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {PROMOZIONI.map((promo) => (
              <Link
                key={promo.slug}
                href={`/promozioni/${promo.slug}`}
                className="group relative block rounded-2xl overflow-hidden border border-[#E5E7EB] hover:border-[#FFC300]/60 hover:shadow-lg transition-all"
              >
                <div className="relative h-56">
                  {promo.image ? (
                    <Image src={promo.image} alt={promo.title} fill className="object-cover transition-transform duration-500 group-hover:scale-105" sizes="(max-width:1024px) 100vw, 33vw" />
                  ) : (
                    <div className={`absolute inset-0 bg-gradient-to-br ${promo.gradient}`}>
                      <div
                        className="absolute inset-0 opacity-[0.07]"
                        style={{ backgroundImage: "repeating-linear-gradient(45deg,#fff 0,#fff 1px,transparent 1px,transparent 22px)" }}
                      />
                    </div>
                  )}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/25 to-transparent" />
                  {promo.badge && (
                    <span className="absolute top-3 left-3 inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#FFC300] text-[#111] text-[10px] font-black uppercase tracking-widest">
                      <Tag size={11} /> {promo.badge}
                    </span>
                  )}
                  <div className="absolute bottom-0 left-0 right-0 p-5">
                    <h2 className="font-black text-white text-lg leading-tight group-hover:text-[#FFC300] transition-colors">{promo.title}</h2>
                    <p className="text-white/70 text-sm mt-1 leading-snug">{promo.subtitle}</p>
                  </div>
                </div>
                <div className="px-5 py-4 flex items-center justify-between">
                  <span className="text-sm font-bold text-[#92700A]">{promo.ctaLabel}</span>
                  <ArrowRight size={16} className="text-[#9DA5AE] group-hover:text-[#92700A] group-hover:translate-x-1 transition-all" />
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
