import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { Suspense } from "react";
import ProductDetailClient from "./ProductDetailClient";
import { getProdottoById } from "@/lib/algolia";

type Props = { params: Promise<{ id: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { id } = await params;
  const p = await getProdottoById(id);
  if (!p) return { title: "Prodotto non trovato" };
  return {
    title: `${p.marca} ${p.modello} ${p.larghezza}/${p.altezza} R${p.diametro}`,
    description: `${p.titolo} — ${p.stagione}, ${p.categoria}. Prenota il tuo appuntamento in sede da Spiezia Tyres.`,
    openGraph: {
      title: p.titolo,
      images: p.immagine ? [p.immagine] : [],
    },
  };
}

export default async function ProdottoPage({ params }: Props) {
  const { id } = await params;
  const prodotto = await getProdottoById(id);
  if (!prodotto) notFound();

  return (
    <Suspense fallback={<div className="min-h-screen" />}>
      <ProductDetailClient prodotto={prodotto} />
    </Suspense>
  );
}
