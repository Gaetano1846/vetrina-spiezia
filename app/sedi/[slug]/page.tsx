import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import { MapPin, Phone, Mail, Clock, CalendarCheck, ChevronRight, Check } from "lucide-react";
import {
  SEDI,
  getSede,
  ORARI_SEDE,
  OPENING_HOURS_SCHEMA,
  SERVIZI_SEDE,
} from "@/lib/sedi";

const SITE = "https://spieziatyres.it";

type Props = { params: Promise<{ slug: string }> };

// Le 4 sedi sono note a build-time → pagine statiche (SSG).
export function generateStaticParams() {
  return SEDI.map((s) => ({ slug: s.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const sede = getSede(slug);
  if (!sede) return { title: "Sede non trovata", robots: { index: false } };
  return {
    title: `Pneumatici a ${sede.city} (${sede.province}) — Spiezia Tyres`,
    description: `Officina Spiezia Tyres a ${sede.city}, ${sede.address}. Vendita e montaggio pneumatici per auto, SUV e moto. Orari, contatti e indicazioni stradali. Prenota online.`,
    alternates: { canonical: `/sedi/${sede.slug}` },
    openGraph: {
      title: `Spiezia Tyres ${sede.city} — Pneumatici e officina`,
      type: "website",
    },
  };
}

export default async function SedePage({ params }: Props) {
  const { slug } = await params;
  const sede = getSede(slug);
  if (!sede) notFound();

  const telHref = `tel:${sede.tel.replace(/\s/g, "")}`;
  // Embed mappa senza API key: query per indirizzo.
  const mapsEmbed = `https://maps.google.com/maps?q=${encodeURIComponent(
    `Spiezia Tyres ${sede.address} ${sede.postalCode} ${sede.city} ${sede.province}`
  )}&z=15&output=embed`;

  const schema = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "AutoDealer",
        "@id": `${SITE}/sedi/${sede.slug}#dealer`,
        name: `Spiezia Tyres — ${sede.city}`,
        url: `${SITE}/sedi/${sede.slug}`,
        image: `${SITE}/logo-spiezia.png`,
        logo: `${SITE}/logo-spiezia.png`,
        telephone: "+390815115011",
        email: "info@spieziatyres.it",
        vatID: "IT07737141213",
        priceRange: "€€",
        currenciesAccepted: "EUR",
        paymentAccepted: ["Cash", "Credit Card", "Debit Card"],
        parentOrganization: { "@id": `${SITE}/#organization` },
        address: {
          "@type": "PostalAddress",
          streetAddress: sede.address,
          addressLocality: sede.city,
          addressRegion: sede.province,
          postalCode: sede.postalCode,
          addressCountry: "IT",
        },
        ...(sede.geo
          ? { geo: { "@type": "GeoCoordinates", latitude: sede.geo.lat, longitude: sede.geo.lng } }
          : {}),
        areaServed: sede.serves.map((name) => ({ "@type": "City", name })),
        openingHoursSpecification: OPENING_HOURS_SCHEMA,
        hasMap: sede.maps,
      },
      {
        "@type": "BreadcrumbList",
        itemListElement: [
          { "@type": "ListItem", position: 1, name: "Home", item: `${SITE}/` },
          { "@type": "ListItem", position: 2, name: "Sedi", item: `${SITE}/sedi` },
          { "@type": "ListItem", position: 3, name: sede.city, item: `${SITE}/sedi/${sede.slug}` },
        ],
      },
    ],
  };

  return (
    <div className="bg-white">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
      />

      {/* ── Breadcrumb ── */}
      <nav aria-label="Breadcrumb" className="border-b border-[#E5E7EB] bg-[#F8F9FB]">
        <div className="max-w-8xl mx-auto px-4 sm:px-6 py-3 flex items-center gap-1.5 text-xs text-[#57636C]">
          <Link href="/" className="hover:text-[#92700A]">Home</Link>
          <ChevronRight size={12} className="text-[#9DA5AE]" />
          <Link href="/sedi" className="hover:text-[#92700A]">Sedi</Link>
          <ChevronRight size={12} className="text-[#9DA5AE]" />
          <span className="font-semibold text-[#111827]">{sede.city}</span>
        </div>
      </nav>

      {/* ── Hero ── */}
      <section className="border-b border-[#E5E7EB]">
        <div className="max-w-8xl mx-auto px-4 sm:px-6 py-10 sm:py-14">
          <div className="flex items-center gap-3 mb-4">
            <span className="w-1 h-5 rounded-full bg-[#FFC300] flex-shrink-0" />
            <span className="text-xs font-bold text-[#92700A] uppercase tracking-widest">
              Sede di {sede.city} · {sede.region}
            </span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-black text-[#111827] mb-4 leading-tight">
            Pneumatici e officina a {sede.city} ({sede.province})
          </h1>
          <p className="text-[#57636C] text-base leading-relaxed max-w-3xl mb-7">
            {sede.intro}
          </p>
          <div className="flex flex-wrap gap-3">
            <Link href="/prodotti" className="btn-gold inline-flex items-center gap-2">
              <CalendarCheck size={15} /> Prenota il montaggio
            </Link>
            <a href={telHref} className="btn-outline-navy inline-flex items-center gap-2">
              <Phone size={15} /> {sede.tel}
            </a>
          </div>
        </div>
      </section>

      {/* ── Dettagli: NAP + mappa ── */}
      <section className="py-12 border-b border-[#E5E7EB]">
        <div className="max-w-8xl mx-auto px-4 sm:px-6 grid lg:grid-cols-2 gap-8 items-start">

          {/* NAP + orari */}
          <div className="space-y-5">
            <div className="flex items-start gap-4 p-5 rounded-2xl border border-[#E5E7EB]">
              <div className="w-10 h-10 bg-[#FFC300]/10 rounded-xl flex items-center justify-center flex-shrink-0">
                <MapPin size={18} className="text-[#92700A]" />
              </div>
              <div>
                <p className="text-xs font-black uppercase tracking-widest text-[#9DA5AE] mb-0.5">Indirizzo</p>
                <p className="font-bold text-[#111827] text-sm">{sede.address}</p>
                <p className="text-sm text-[#57636C]">{sede.postalCode} {sede.city} ({sede.province}) — {sede.region}</p>
                <a href={sede.maps} target="_blank" rel="noopener noreferrer"
                   className="inline-flex items-center gap-1.5 mt-2 text-xs font-semibold text-[#FFC300] hover:text-[#92700A] transition-colors">
                  <MapPin size={11} /> Indicazioni stradali →
                </a>
              </div>
            </div>

            <div className="grid sm:grid-cols-2 gap-5">
              <a href={telHref} className="group flex items-start gap-4 p-5 rounded-2xl border border-[#E5E7EB] hover:border-[#FFC300]/50 hover:bg-[#FFFBEB] transition-all">
                <div className="w-10 h-10 bg-[#FFC300]/10 rounded-xl flex items-center justify-center flex-shrink-0">
                  <Phone size={18} className="text-[#92700A]" />
                </div>
                <div>
                  <p className="text-xs font-black uppercase tracking-widest text-[#9DA5AE] mb-0.5">Telefono</p>
                  <p className="font-bold text-[#111827] text-sm">{sede.tel}</p>
                </div>
              </a>
              <a href="mailto:info@spieziatyres.it" className="group flex items-start gap-4 p-5 rounded-2xl border border-[#E5E7EB] hover:border-[#FFC300]/50 hover:bg-[#FFFBEB] transition-all">
                <div className="w-10 h-10 bg-[#FFC300]/10 rounded-xl flex items-center justify-center flex-shrink-0">
                  <Mail size={18} className="text-[#92700A]" />
                </div>
                <div>
                  <p className="text-xs font-black uppercase tracking-widest text-[#9DA5AE] mb-0.5">Email</p>
                  <p className="font-bold text-[#111827] text-sm">info@spieziatyres.it</p>
                </div>
              </a>
            </div>

            <div className="flex items-start gap-4 p-5 bg-[#F8F9FB] rounded-2xl border border-[#E5E7EB]">
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

          {/* Mappa */}
          <div className="rounded-2xl overflow-hidden border border-[#E5E7EB] h-[420px]">
            <iframe
              title={`Mappa sede Spiezia Tyres ${sede.city}`}
              src={mapsEmbed}
              width="100%"
              height="100%"
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              style={{ border: 0 }}
            />
          </div>
        </div>
      </section>

      {/* ── Servizi ── */}
      <section className="py-12 border-b border-[#E5E7EB]">
        <div className="max-w-8xl mx-auto px-4 sm:px-6">
          <h2 className="text-2xl font-black text-[#111827] mb-2">Servizi nella sede di {sede.city}</h2>
          <p className="text-sm text-[#57636C] mb-8">Tutto quello che offriamo nella nostra officina di {sede.city}.</p>
          <ul className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {SERVIZI_SEDE.map((s) => (
              <li key={s} className="flex items-center gap-3 p-4 rounded-xl border border-[#E5E7EB] text-sm text-[#374151]">
                <span className="w-6 h-6 rounded-full bg-[#FFC300]/15 flex items-center justify-center flex-shrink-0">
                  <Check size={13} className="text-[#92700A]" />
                </span>
                {s}
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* ── Zone servite ── */}
      <section className="py-12 border-b border-[#E5E7EB]">
        <div className="max-w-8xl mx-auto px-4 sm:px-6">
          <h2 className="text-2xl font-black text-[#111827] mb-2">Zone servite</h2>
          <p className="text-sm text-[#57636C] mb-6">
            La sede di {sede.city} è il punto di riferimento per gli automobilisti di:
          </p>
          <div className="flex flex-wrap gap-2">
            {sede.serves.map((z) => (
              <span key={z} className="px-3 py-1.5 rounded-full bg-[#F8F9FB] border border-[#E5E7EB] text-sm text-[#374151]">
                {z}
              </span>
            ))}
          </div>
        </div>
      </section>

      {/* ── CTA + altre sedi ── */}
      <section className="py-14">
        <div className="max-w-8xl mx-auto px-4 sm:px-6 grid lg:grid-cols-2 gap-8 items-start">
          <div className="bg-[#FFFBEB] border border-[#FFC300]/40 rounded-2xl px-8 py-10">
            <CalendarCheck size={24} className="text-[#92700A] mb-4" />
            <h2 className="text-xl font-black text-[#111827] mb-2">Prenota nella sede di {sede.city}</h2>
            <p className="text-sm text-[#57636C] leading-relaxed mb-6">
              Scegli le gomme online e prenota il montaggio a {sede.city}.
              Nessun anticipo — confermi il prezzo e paghi in officina.
            </p>
            <div className="flex flex-wrap gap-3">
              <Link href="/prodotti" className="btn-gold inline-flex items-center gap-2">
                <CalendarCheck size={15} /> Prenota online
              </Link>
              <a href={telHref} className="btn-outline-navy inline-flex items-center gap-2">
                <Phone size={15} /> Chiamaci
              </a>
            </div>
          </div>

          <div>
            <h2 className="text-sm font-black uppercase tracking-widest text-[#9DA5AE] mb-4">Altre sedi</h2>
            <div className="space-y-3">
              {SEDI.filter((s) => s.slug !== sede.slug).map((s) => (
                <Link key={s.slug} href={`/sedi/${s.slug}`}
                      className="group flex items-center justify-between gap-4 p-4 rounded-xl border border-[#E5E7EB] hover:border-[#FFC300]/60 transition-all">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 bg-[#FFC300] rounded-lg flex items-center justify-center flex-shrink-0">
                      <MapPin size={14} className="text-[#111827]" />
                    </div>
                    <div>
                      <p className="font-bold text-[#111827] text-sm">{s.city}</p>
                      <p className="text-xs text-[#57636C]">{s.address}</p>
                    </div>
                  </div>
                  <ChevronRight size={16} className="text-[#9DA5AE] group-hover:text-[#92700A] transition-colors" />
                </Link>
              ))}
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
