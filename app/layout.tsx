import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import Providers from "@/components/layout/Providers";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

export const metadata: Metadata = {
  title: {
    default: "SpieziaTyres — Pneumatici Online",
    template: "%s | SpieziaTyres",
  },
  description: "Spiezia Tyres S.p.A. — ampia selezione di pneumatici per auto, SUV, moto e agricoli. 4 sedi in Campania e Lazio. Prenota il tuo appuntamento.",
  metadataBase: new URL("https://spiezia-tyres.it"),
  openGraph: {
    siteName: "SpieziaTyres",
    type: "website",
    locale: "it_IT",
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="it" className={`${inter.variable} h-full`}>
      <body className="min-h-full flex flex-col antialiased bg-white text-[#111]">
        <Providers>
          <Header />
          <main className="flex-1">{children}</main>
          <Footer />
        </Providers>
      </body>
    </html>
  );
}
