import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { Tag, Check, CalendarCheck, Phone, ChevronRight, Info, ArrowRight } from "lucide-react";
import { PROMOZIONI, getPromo } from "@/lib/promozioni";

const SITE = "https://spieziatyres.it";

type Props = { params: Promise<{ slug: string }> };

// Le promo sono note a build-time → pagine statiche.
export function generateStaticParams() {
  return PROMOZIONI.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const promo = getPromo(slug);
  if (!promo) return { title: "Promozione non trovata", robots: { index: false } };
  return {
    title: `${promo.title} — Promozione`,
    description: promo.subtitle,
    alternates: { canonical: `/promozioni/${promo.slug}` },
    openGraph: {
      title: `${promo.title} | Spiezia Tyres`,
      description: promo.subtitle,
      type: "website",
      ...(promo.image ? { images: [promo.image] } : {}),
    },
  };
}

export default async function PromoPage({ params }: Props) {
  const { slug } = await params;
  const promo = getPromo(slug);
  if (!promo) notFound();

  const altre = PROMOZIONI.filter((p) => p.slug !== promo.slug);

  const schema = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Home", item: `${SITE}/` },
      { "@type": "ListItem", position: 2, name: "Promozioni", item: `${SITE}/promozioni` },
      { "@type": "ListItem", position: 3, name: promo.title, item: `${SITE}/promozioni/${promo.slug}` },
    ],
  };

  return (
    <div className="bg-white">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }} />

      {/* Breadcrumb */}
      <nav aria-label="Breadcrumb" className="border-b border-[#E5E7EB] bg-[#F8F9FB]">
        <div className="max-w-8xl mx-auto px-4 sm:px-6 py-3 flex items-center gap-1.5 text-xs text-[#57636C]">
          <Link href="/" className="hover:text-[#92700A]">Home</Link>
          <ChevronRight size={12} className="text-[#9DA5AE]" />
          <Link href="/promozioni" className="hover:text-[#92700A]">Promozioni</Link>
          <ChevronRight size={12} className="text-[#9DA5AE]" />
          <span className="font-semibold text-[#111827]">{promo.title}</span>
        </div>
      </nav>

      {/* Hero */}
      <section className="relative overflow-hidden border-b border-[#E5E7EB]">
        <div className="relative h-[300px] sm:h-[380px]">
          {promo.image ? (
            <Image src={promo.image} alt={promo.title} fill priority className="object-cover object-center" sizes="100vw" />
          ) : (
            <div className={`absolute inset-0 bg-gradient-to-br ${promo.gradient}`}>
              <div
                className="absolute inset-0 opacity-[0.07]"
                style={{ backgroundImage: "repeating-linear-gradient(45deg,#fff 0,#fff 1px,transparent 1px,transparent 22px)" }}
              />
              <div className="absolute top-4 right-4 inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white/10 backdrop-blur text-white/70 text-[11px] font-semibold">
                <Tag size={12} /> Anteprima — immagine in arrivo
              </div>
            </div>
          )}
          <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/45 to-transparent" />
          <div className="absolute inset-0 flex items-center">
            <div className="max-w-8xl mx-auto px-4 sm:px-6 w-full">
              <div className="max-w-2xl">
                {promo.badge && (
                  <span className="inline-flex items-center gap-1.5 mb-4 px-3 py-1 rounded-full bg-[#FFC300] text-[#111] text-[11px] font-black uppercase tracking-widest">
                    {promo.badge}
                  </span>
                )}
                <h1 className="text-3xl sm:text-5xl font-black text-white leading-tight mb-3">{promo.title}</h1>
                <p className="text-white/80 text-base sm:text-lg leading-relaxed">{promo.subtitle}</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Corpo */}
      <section className="py-12 border-b border-[#E5E7EB]">
        <div className="max-w-8xl mx-auto px-4 sm:px-6 grid lg:grid-cols-3 gap-10 items-start">

          {/* Descrizione + cosa include */}
          <div className="lg:col-span-2 space-y-8">
            <p className="text-[#374151] text-base leading-relaxed">{promo.intro}</p>

            <div>
              <h2 className="text-xl font-black text-[#111827] mb-4">Cosa include</h2>
              <ul className="grid sm:grid-cols-2 gap-3">
                {promo.highlights.map((h) => (
                  <li key={h} className="flex items-start gap-3 p-4 rounded-xl border border-[#E5E7EB] text-sm text-[#374151]">
                    <span className="w-6 h-6 rounded-full bg-[#FFC300]/15 flex items-center justify-center flex-shrink-0 mt-0.5">
                      <Check size={13} className="text-[#92700A]" />
                    </span>
                    {h}
                  </li>
                ))}
              </ul>
            </div>

            {promo.note && promo.note.length > 0 && (
              <div className="flex items-start gap-3 p-5 rounded-2xl bg-[#F8F9FB] border border-[#E5E7EB]">
                <Info size={18} className="text-[#92700A] flex-shrink-0 mt-0.5" />
                <div>
                  <p className="text-xs font-black uppercase tracking-widest text-[#9DA5AE] mb-2">Termini e condizioni</p>
                  <ul className="space-y-1.5 text-sm text-[#57636C]">
                    {promo.note.map((n) => (
                      <li key={n} className="flex gap-2">
                        <span className="w-1 h-1 rounded-full bg-[#FFC300] flex-shrink-0 mt-2" /> {n}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            )}
          </div>

          {/* Box CTA */}
          <aside className="lg:sticky lg:top-6">
            <div className="rounded-2xl border border-[#FFC300]/40 bg-[#FFFBEB] p-6">
              <CalendarCheck size={24} className="text-[#92700A] mb-3" />
              <p className="text-lg font-black text-[#111827] mb-1">Approfitta della promo</p>
              {promo.validita && <p className="text-sm text-[#57636C] leading-relaxed mb-4">{promo.validita}</p>}
              <div className="flex flex-col gap-2.5">
                <Link href="/prodotti" className="btn-gold inline-flex items-center justify-center gap-2 w-full">
                  Sfoglia il catalogo <ArrowRight size={15} />
                </Link>
                <a href="tel:+390815115011" className="btn-outline-navy inline-flex items-center justify-center gap-2 w-full">
                  <Phone size={15} /> Chiama una sede
                </a>
              </div>
              <p className="text-xs text-[#9DA5AE] leading-relaxed mt-4">
                Nessun anticipo: confermi il prezzo e paghi direttamente in officina.
              </p>
            </div>
          </aside>
        </div>
      </section>

      {/* Altre promozioni */}
      {altre.length > 0 && (
        <section className="py-12">
          <div className="max-w-8xl mx-auto px-4 sm:px-6">
            <h2 className="text-sm font-black uppercase tracking-widest text-[#9DA5AE] mb-5">Altre promozioni</h2>
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
              {altre.map((p) => (
                <Link
                  key={p.slug}
                  href={`/promozioni/${p.slug}`}
                  className="group relative block rounded-2xl overflow-hidden border border-[#E5E7EB] hover:border-[#FFC300]/60 transition-all h-44"
                >
                  {p.image ? (
                    <Image src={p.image} alt={p.title} fill className="object-cover" sizes="(max-width:1024px) 100vw, 33vw" />
                  ) : (
                    <div className={`absolute inset-0 bg-gradient-to-br ${p.gradient}`} />
                  )}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent" />
                  <div className="absolute bottom-0 left-0 right-0 p-4">
                    <p className="font-black text-white text-sm leading-tight group-hover:text-[#FFC300] transition-colors">{p.title}</p>
                    <p className="text-white/60 text-xs mt-0.5 line-clamp-1">{p.subtitle}</p>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}
    </div>
  );
}
