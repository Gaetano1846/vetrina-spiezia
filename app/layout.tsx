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
    images: [{ url: "/og-image.png", width: 1200, height: 630, alt: "Spiezia Tyres S.p.A." }],
  },
  twitter: {
    card: "summary_large_image",
    images: ["/og-image.png"],
  },
};

const localBusinessSchema = {
  "@context": "https://schema.org",
  "@type": "AutoDealer",
  name: "Spiezia Tyres S.p.A.",
  url: "https://spieziatyres.it",
  telephone: "+390815115011",
  email: "info@spieziatyres.it",
  vatID: "IT07737141213",
  openingHoursSpecification: [
    { "@type": "OpeningHoursSpecification", dayOfWeek: ["Monday","Tuesday","Wednesday","Thursday","Friday"], opens: "08:30", closes: "13:30" },
    { "@type": "OpeningHoursSpecification", dayOfWeek: ["Monday","Tuesday","Wednesday","Thursday","Friday"], opens: "14:30", closes: "19:00" },
    { "@type": "OpeningHoursSpecification", dayOfWeek: ["Saturday"], opens: "08:30", closes: "13:30" },
  ],
  location: [
    { "@type": "AutoDealer", name: "Spiezia Tyres — Nola",         address: { "@type": "PostalAddress", streetAddress: "Via Croce Del Papa 27/29", addressLocality: "Nola",         postalCode: "80035", addressCountry: "IT" } },
    { "@type": "AutoDealer", name: "Spiezia Tyres — Volla",        address: { "@type": "PostalAddress", streetAddress: "Via Palazziello 73",        addressLocality: "Volla",        postalCode: "80040", addressCountry: "IT" } },
    { "@type": "AutoDealer", name: "Spiezia Tyres — Portici",      address: { "@type": "PostalAddress", streetAddress: "Via S. Cristoforo 93",       addressLocality: "Portici",      postalCode: "80055", addressCountry: "IT" } },
    { "@type": "AutoDealer", name: "Spiezia Tyres — Fiano Romano", address: { "@type": "PostalAddress", streetAddress: "Via Procoio 41A",            addressLocality: "Fiano Romano", postalCode: "00065", addressCountry: "IT" } },
  ],
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="it" className={`${inter.variable} h-full`}>
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
