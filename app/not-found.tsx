import Link from "next/link";
import Image from "next/image";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Pagina non trovata — Spiezia Tyres S.p.A.",
  robots: { index: false },
};

export default function NotFound() {
  return (
    <div className="min-h-[60vh] flex flex-col items-center justify-center px-4 py-20 text-center">
      <Image
        src="/logo-spiezia.png"
        alt="Spiezia Tyres"
        width={140}
        height={42}
        className="h-10 w-auto object-contain mix-blend-multiply mb-8"
      />
      <p className="text-7xl font-black text-[#FFC300] leading-none mb-4">404</p>
      <h1 className="text-2xl font-black text-[#111] mb-2">Pagina non trovata</h1>
      <p className="text-[#57636C] mb-8 max-w-sm">
        La pagina che stai cercando non esiste o è stata spostata.
      </p>
      <div className="flex flex-wrap gap-3 justify-center">
        <Link href="/" className="btn-gold">Torna alla home</Link>
        <Link href="/prodotti" className="btn-outline-navy">Sfoglia il catalogo</Link>
      </div>
    </div>
  );
}
