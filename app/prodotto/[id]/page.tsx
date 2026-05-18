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

  const productSchema = {
    "@context": "https://schema.org",
    "@type": "Product",
    name: prodotto.titolo,
    brand: { "@type": "Brand", name: prodotto.marca },
    description: `${prodotto.titolo} — Pneumatico ${prodotto.stagione} per ${prodotto.categoria}. Misura: ${prodotto.larghezza}/${prodotto.altezza} R${prodotto.diametro}.`,
    image: prodotto.immagine,
    offers: {
      "@type": "Offer",
      priceCurrency: "EUR",
      price: prodotto.prezzo.toFixed(2),
      availability: prodotto.stock > 0 ? "https://schema.org/InStock" : "https://schema.org/OutOfStock",
      seller: { "@type": "Organization", name: "Spiezia Tyres S.p.A." },
    },
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(productSchema) }}
      />
      <Suspense fallback={<div className="min-h-screen" />}>
        <ProductDetailClient prodotto={prodotto} />
      </Suspense>
    </>
  );
}
