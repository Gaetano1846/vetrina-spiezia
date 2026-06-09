import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import Providers from "@/components/layout/Providers";
import CookieBanner from "@/components/legal/CookieBanner";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

export const metadata: Metadata = {
  title: {
    default: "Spiezia Tyres — Pneumatici Online | 4 Sedi Campania e Lazio",
    template: "%s | Spiezia Tyres",
  },
  description: "Spiezia Tyres S.p.A. — ampia selezione di pneumatici per auto, SUV, moto e agricoli. 4 sedi in Campania e Lazio. Prenota il tuo appuntamento.",
  metadataBase: new URL("https://spieziatyres.it"),
  openGraph: {
    siteName: "Spiezia Tyres",
    type: "website",
    locale: "it_IT",
    // L'immagine OG è fornita automaticamente da app/opengraph-image.tsx (convenzione Next.js).
  },
  twitter: {
    card: "summary_large_image",
  },
};

const SITE = "https://spieziatyres.it";

const ORARI = [
  { "@type": "OpeningHoursSpecification", dayOfWeek: ["Monday","Tuesday","Wednesday","Thursday","Friday"], opens: "08:30", closes: "13:30" },
  { "@type": "OpeningHoursSpecification", dayOfWeek: ["Monday","Tuesday","Wednesday","Thursday","Friday"], opens: "14:30", closes: "19:00" },
  { "@type": "OpeningHoursSpecification", dayOfWeek: ["Saturday"], opens: "08:30", closes: "13:30" },
];

// Topical authority (E-E-A-T / GEO): argomenti e brand di cui l'azienda è competente.
const KNOWS_ABOUT = [
  "Pneumatici", "Pneumatici auto", "Pneumatici SUV", "Pneumatici moto", "Pneumatici agricoli", "Pneumatici autocarro",
  "Pneumatici invernali", "Pneumatici estivi", "Pneumatici 4 stagioni",
  "Etichetta UE pneumatici", "Indice di carico", "Indice di velocità", "Run Flat", "M+S", "3PMSF",
  "Montaggio pneumatici", "Equilibratura", "Convergenza", "Cambio stagionale",
  "Michelin", "Pirelli", "Continental", "Bridgestone", "Goodyear", "Hankook",
];

// Servizi erogati in officina (local SEO — differenziatore vs e-commerce puri).
const SERVIZI_OFFICINA = [
  "Montaggio pneumatici", "Equilibratura", "Convergenza", "Cambio stagionale",
  "Sostituzione filtri", "Cambio olio", "Revisione auto",
].map((s) => ({ "@type": "Offer", itemOffered: { "@type": "Service", name: s } }));

// JSON-LD globale come @graph: Organization (entità azienda) + WebSite (con SearchAction
// per la searchbox dei sitelink) + AutoDealer (LocalBusiness con sedi, orari, geo).
const localBusinessSchema = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "Organization",
      "@id": `${SITE}/#organization`,
      name: "Spiezia Tyres S.p.A.",
      alternateName: "Spiezia Tyres",
      url: SITE,
      logo: `${SITE}/logo-spiezia.png`,
      image: `${SITE}/logo-spiezia.png`,
      description: "Spiezia Tyres S.p.A. è un rivenditore di pneumatici e officina con oltre 30 anni di esperienza, con 4 sedi in Campania e Lazio. Vendita di pneumatici per auto, SUV, moto e veicoli agricoli, con prenotazione online e montaggio in sede.",
      email: "info@spieziatyres.it",
      telephone: "+390815115011",
      vatID: "IT07737141213",
      areaServed: ["Campania", "Lazio", "Italia"],
      knowsAbout: KNOWS_ABOUT,
      contactPoint: [
        { "@type": "ContactPoint", contactType: "customer service", telephone: "+390815115011", email: "info@spieziatyres.it", areaServed: "IT", availableLanguage: "Italian" },
      ],
    },
    {
      "@type": "WebSite",
      "@id": `${SITE}/#website`,
      url: SITE,
      name: "Spiezia Tyres",
      inLanguage: "it-IT",
      publisher: { "@id": `${SITE}/#organization` },
      potentialAction: {
        "@type": "SearchAction",
        target: { "@type": "EntryPoint", urlTemplate: `${SITE}/prodotti?q={search_term_string}` },
        "query-input": "required name=search_term_string",
      },
    },
    {
      "@type": "AutoDealer",
      "@id": `${SITE}/#dealer`,
      name: "Spiezia Tyres S.p.A.",
      url: SITE,
      image: `${SITE}/logo-spiezia.png`,
      logo: `${SITE}/logo-spiezia.png`,
      telephone: "+390815115011",
      email: "info@spieziatyres.it",
      vatID: "IT07737141213",
      priceRange: "€€",
      currenciesAccepted: "EUR",
      paymentAccepted: ["Cash", "Credit Card", "Debit Card"],
      areaServed: [
        { "@type": "AdministrativeArea", name: "Campania" },
        { "@type": "AdministrativeArea", name: "Lazio" },
        { "@type": "City", name: "Nola" },
        { "@type": "City", name: "Napoli" },
        { "@type": "City", name: "Volla" },
        { "@type": "City", name: "Portici" },
        { "@type": "City", name: "Fiano Romano" },
      ],
      knowsAbout: KNOWS_ABOUT,
      hasOfferCatalog: { "@type": "OfferCatalog", name: "Servizi pneumatici e officina", itemListElement: SERVIZI_OFFICINA },
      parentOrganization: { "@id": `${SITE}/#organization` },
      address: { "@type": "PostalAddress", streetAddress: "Via Croce Del Papa 27/29", addressLocality: "Nola", addressRegion: "NA", postalCode: "80035", addressCountry: "IT" },
      geo: { "@type": "GeoCoordinates", latitude: 40.930144, longitude: 14.5107798 },
      openingHoursSpecification: ORARI,
      location: [
        { "@type": "AutoDealer", name: "Spiezia Tyres — Nola",         telephone: "+390815115011", openingHoursSpecification: ORARI, geo: { "@type": "GeoCoordinates", latitude: 40.930144, longitude: 14.5107798 }, address: { "@type": "PostalAddress", streetAddress: "Via Croce Del Papa 27/29", addressLocality: "Nola",         addressRegion: "NA", postalCode: "80035", addressCountry: "IT" } },
        { "@type": "AutoDealer", name: "Spiezia Tyres — Volla",        telephone: "+390815115011", openingHoursSpecification: ORARI, geo: { "@type": "GeoCoordinates", latitude: 40.8875763, longitude: 14.3416487 }, address: { "@type": "PostalAddress", streetAddress: "Via Palazziello 73",        addressLocality: "Volla",        addressRegion: "NA", postalCode: "80040", addressCountry: "IT" } },
        { "@type": "AutoDealer", name: "Spiezia Tyres — Portici",      telephone: "+390815115011", openingHoursSpecification: ORARI, address: { "@type": "PostalAddress", streetAddress: "Via S. Cristoforo 93",       addressLocality: "Portici",      addressRegion: "NA", postalCode: "80055", addressCountry: "IT" } },
        { "@type": "AutoDealer", name: "Spiezia Tyres — Fiano Romano", telephone: "+390815115011", openingHoursSpecification: ORARI, geo: { "@type": "GeoCoordinates", latitude: 42.1560394, longitude: 12.6180815 }, address: { "@type": "PostalAddress", streetAddress: "Via Procoio 41A",            addressLocality: "Fiano Romano", addressRegion: "RM", postalCode: "00065", addressCountry: "IT" } },
      ],
    },
  ],
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="it" className={`${inter.variable} h-full`}>
      <head>
        {/* Preconnect/dns-prefetch ai CDN immagini fornitori → riduce il tempo di LCP sulle immagini prodotto */}
        <link rel="preconnect" href="https://media4.tyre-shopping.com" crossOrigin="anonymous" />
        <link rel="dns-prefetch" href="https://media4.tyre-shopping.com" />
        <link rel="dns-prefetch" href="https://firebasestorage.googleapis.com" />
        <link rel="dns-prefetch" href="https://storage.googleapis.com" />
      </head>
      <body className="min-h-full flex flex-col antialiased bg-white text-[#111]">
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(localBusinessSchema) }}
        />
        <Providers>
          <Header />
          <main className="flex-1">{children}</main>
          <Footer />
          <CookieBanner />
        </Providers>
      </body>
    </html>
  );
}
