import { notFound } from "next/navigation";
import type { Metadata } from "next";
import Link from "next/link";
import { ChevronRight } from "lucide-react";
import ProductCard from "@/components/products/ProductCard";
import {
  SITE,
  getArchiveData,
  buildArchiveMeta,
  buildIntro,
  buildFaqs,
  type ArchiveDef,
} from "@/lib/archivio";

// ISR: gli archivi cambiano lentamente (stock/prezzi) → rigenerazione ogni 12h.
export const revalidate = 43200;

type Props = { params: Promise<{ slug: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const data = await getArchiveData(slug);
  if (!data || data.result.nbHits === 0) {
    return { title: "Archivio non trovato", robots: { index: false } };
  }
  const { title, description } = buildArchiveMeta(data);
  return {
    title,
    description,
    alternates: { canonical: data.canonical },
    openGraph: { title, description, type: "website", url: data.canonical },
  };
}

// CTA "vedi tutti": link al catalogo filtrato corrispondente.
function catalogoUrl(def: ArchiveDef): string {
  const p = new URLSearchParams();
  if (def.type === "size") {
    p.set("larghezza", def.larghezza!);
    p.set("altezza", def.altezza!);
    p.set("diametro", def.diametro!);
  } else if (def.type === "brand") {
    p.set("marche", def.brand!);
  } else if (def.type === "season") {
    p.set("stagioni", def.seasonValue!);
  } else if (def.type === "category") {
    p.set("cat", def.categoria!);
  }
  return `/prodotti?${p.toString()}`;
}

// Link interni a archivi correlati (boost crawl & link equity).
const RELATED = {
  stagioni: [
    { label: "Estivi", href: "/pneumatici-estivi" },
    { label: "Invernali", href: "/pneumatici-invernali" },
    { label: "4 stagioni", href: "/pneumatici-4-stagioni" },
  ],
  categorie: [
    { label: "Auto", href: "/pneumatici-auto" },
    { label: "Autocarro", href: "/pneumatici-autocarro" },
    { label: "Agricoli", href: "/pneumatici-agricoli" },
  ],
  marche: [
    { label: "Michelin", href: "/pneumatici-michelin" },
    { label: "Pirelli", href: "/pneumatici-pirelli" },
    { label: "Continental", href: "/pneumatici-continental" },
    { label: "Bridgestone", href: "/pneumatici-bridgestone" },
    { label: "Goodyear", href: "/pneumatici-goodyear" },
    { label: "Hankook", href: "/pneumatici-hankook" },
  ],
  misure: [
    { label: "205/55 R16", href: "/pneumatici-205-55-r16" },
    { label: "195/65 R15", href: "/pneumatici-195-65-r15" },
    { label: "225/45 R17", href: "/pneumatici-225-45-r17" },
    { label: "215/55 R17", href: "/pneumatici-215-55-r17" },
  ],
};

export default async function ArchivioPage({ params }: Props) {
  const { slug } = await params;
  const data = await getArchiveData(slug);
  if (!data || data.result.nbHits === 0) notFound();

  const { def, result } = data;
  const { h1, description } = buildArchiveMeta(data);
  const intro = buildIntro(data);
  const faqs = buildFaqs(data);
  const canonicalAbs = `${SITE}${data.canonical}`;

  const schema = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "CollectionPage",
        "@id": `${canonicalAbs}#collection`,
        url: canonicalAbs,
        name: h1,
        description,
        isPartOf: { "@id": `${SITE}/#website` },
        mainEntity: {
          "@type": "ItemList",
          numberOfItems: result.nbHits,
          itemListElement: result.hits.map((p, i) => ({
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
          { "@type": "ListItem", position: 2, name: "Catalogo", item: `${SITE}/prodotti` },
          { "@type": "ListItem", position: 3, name: h1, item: canonicalAbs },
        ],
      },
      {
        "@type": "FAQPage",
        mainEntity: faqs.map((f) => ({
          "@type": "Question",
          name: f.q,
          acceptedAnswer: { "@type": "Answer", text: f.a },
        })),
      },
    ],
  };

  return (
    <div className="max-w-8xl mx-auto px-4 sm:px-6 py-5 sm:py-8">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }} />

      {/* Breadcrumb */}
      <nav className="flex items-center gap-1.5 text-xs text-[#9DA5AE] mb-4">
        <Link href="/" className="hover:text-[#001D3D] transition-colors">Home</Link>
        <ChevronRight size={12} />
        <Link href="/prodotti" className="hover:text-[#001D3D] transition-colors">Catalogo</Link>
        <ChevronRight size={12} />
        <span className="text-[#001D3D] font-semibold">{h1}</span>
      </nav>

      {/* Header + intro */}
      <header className="mb-6">
        <h1 className="text-2xl sm:text-3xl font-black text-[#001D3D] mb-2">{h1}</h1>
        <p className="text-sm text-[#57636C] leading-relaxed max-w-3xl">{intro}</p>
        <p className="mt-3 text-sm">
          <span className="font-bold text-[#001D3D]">{result.nbHits.toLocaleString("it-IT")}</span>
          <span className="text-[#57636C]"> pneumatici disponibili</span>
        </p>
      </header>

      {/* Product grid */}
      <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-4">
        {result.hits.map((p) => <ProductCard key={p.id} prodotto={p} />)}
      </div>

      {/* CTA catalogo filtrato */}
      <div className="mt-8 text-center">
        <Link
          href={catalogoUrl(def)}
          className="inline-flex items-center gap-2 h-11 px-6 rounded-xl bg-[#FFC300] hover:bg-[#E6B000] text-[#001D3D] font-bold text-sm transition-colors"
        >
          Vedi tutti i pneumatici {def.label} <ChevronRight size={16} />
        </Link>
      </div>

      {/* FAQ (FAQPage) — native details, crawlabile e senza JS */}
      <section className="mt-10 bg-white rounded-2xl border border-[#E5E7EB] p-5 sm:p-7 max-w-3xl">
        <h2 className="font-black text-[#001D3D] text-lg mb-4">Domande frequenti</h2>
        <div className="divide-y divide-[#E5E7EB]">
          {faqs.map((f) => (
            <details key={f.q} className="group py-3">
              <summary className="cursor-pointer list-none font-bold text-[#001D3D] flex items-center justify-between gap-4">
                {f.q}
                <ChevronRight size={16} className="shrink-0 transition-transform group-open:rotate-90 text-[#9DA5AE]" />
              </summary>
              <p className="mt-2 text-sm text-[#57636C] leading-relaxed">{f.a}</p>
            </details>
          ))}
        </div>
      </section>

      {/* Internal linking: archivi correlati */}
      <section className="mt-10">
        <h2 className="text-sm font-black uppercase tracking-widest text-[#9DA5AE] mb-4">Esplora anche</h2>
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {[
            { titolo: "Per stagione", links: RELATED.stagioni },
            { titolo: "Per categoria", links: RELATED.categorie },
            { titolo: "Per marca", links: RELATED.marche },
            { titolo: "Misure popolari", links: RELATED.misure },
          ].map((col) => (
            <div key={col.titolo}>
              <p className="text-xs font-black uppercase tracking-widest text-[#001D3D] mb-3">{col.titolo}</p>
              <ul className="space-y-2">
                {col.links.map((l) => (
                  <li key={l.href}>
                    <Link href={l.href} className="text-sm text-[#57636C] hover:text-[#FFC300] transition-colors flex items-center gap-1.5">
                      <span className="w-1 h-1 rounded-full bg-[#FFC300] flex-shrink-0" />
                      Pneumatici {l.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
