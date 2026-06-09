import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { Suspense } from "react";
import ProductDetailClient from "./ProductDetailClient";
import { getProdottoById } from "@/lib/algolia";

type Props = { params: Promise<{ id: string }> };

const SITE = "https://spieziatyres.it";

// FAQ in chiaro per il markup FAQPage. Rispecchia le domande mostrate in
// ProductDetailClient (il markup FAQ deve corrispondere al contenuto visibile in pagina).
const FAQ_PRODOTTO: { q: string; a: string }[] = [
  { q: "Come prenoto un appuntamento per il cambio gomme?", a: "Aggiungi i pneumatici desiderati alla selezione, poi vai al checkout per scegliere la sede e la data preferita. Il nostro staff ti contatterà per confermare l'orario disponibile." },
  { q: "Devo pagare un anticipo al momento della prenotazione?", a: "No. La prenotazione è gratuita e senza anticipo. Il pagamento avviene in sede al momento del servizio, dopo la conferma finale del prezzo." },
  { q: "Posso modificare o cancellare l'appuntamento?", a: "Sì, puoi modificare o cancellare l'appuntamento in qualsiasi momento contattandoci per telefono o via WhatsApp al +39 081 511 5011." },
  { q: "Cosa significano le etichette UE (consumo, bagnato, rumorosità)?", a: "Consumo: efficienza nei consumi di carburante, dalla classe A (migliore) alla G. Bagnato: tenuta di strada su asfalto bagnato, dalla classe A alla G. Rumorosità: rumore esterno in dB; più basso è il valore, più silenziosa è la guida." },
  { q: "Quale stagione di pneumatico mi serve?", a: "Gli invernali sono obbligatori (o catene) dal 15 novembre al 15 aprile su molte strade italiane. Gli estivi garantiscono le massime prestazioni in estate. I 4 stagioni sono una soluzione comoda per chi non vuole effettuare il cambio stagionale." },
  { q: "Quanto dura il montaggio in sede?", a: "Il cambio gomme completo (smontaggio, montaggio, bilanciatura) richiede mediamente circa 30 minuti per un veicolo standard. Tempi variabili per SUV e veicoli commerciali." },
];

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { id } = await params;
  const p = await getProdottoById(id);
  if (!p) return { title: "Prodotto non trovato", robots: { index: false } };
  const misura = `${p.larghezza}/${p.altezza} R${p.diametro}`;
  const indici = [p.indiceCarico, p.indiceVelocita].filter(Boolean).join("");
  const stag = p.stagione.replace("-", " ").toLowerCase();
  const prezzo = p.prezzo > 0 ? ` a partire da € ${p.prezzo.toFixed(2).replace(".", ",")}` : "";
  return {
    title: `${p.marca} ${p.modello} ${misura}${indici ? ` ${indici}` : ""}${p.prezzo > 0 ? ` | € ${p.prezzo.toFixed(2).replace(".", ",")}` : ""}`,
    description: `Pneumatico ${p.marca} ${p.modello} ${misura}${indici ? ` ${indici}` : ""}, ${stag}, per ${p.categoria.toLowerCase()}${prezzo}. Prenota il montaggio nelle 4 sedi Spiezia Tyres in Campania e Lazio.`,
    alternates: { canonical: `/prodotto/${id}` },
    openGraph: {
      title: `${p.marca} ${p.modello} ${misura}`,
      type: "website",
      images: p.immagine ? [p.immagine] : [],
    },
  };
}

export default async function ProdottoPage({ params }: Props) {
  const { id } = await params;
  const prodotto = await getProdottoById(id);
  if (!prodotto) notFound();

  const misura = `${prodotto.larghezza}/${prodotto.altezza} R${prodotto.diametro}`;
  const url = `${SITE}/prodotto/${id}`;
  const gtin13 = /^\d{13}$/.test(prodotto.ean) ? prodotto.ean : undefined;
  const priceValidUntil = `${new Date().getFullYear() + 1}-12-31`;

  // additionalProperty: specifiche tecniche + etichetta UE (solo valori realmente presenti).
  const specs: { name: string; value: string; unitText?: string; description?: string }[] = [
    { name: "Larghezza", value: prodotto.larghezza, unitText: "mm" },
    { name: "Altezza (rapporto di forma)", value: prodotto.altezza, unitText: "%" },
    { name: "Diametro cerchio", value: prodotto.diametro, unitText: "inch" },
    { name: "Indice di carico", value: prodotto.indiceCarico },
    { name: "Indice di velocità", value: prodotto.indiceVelocita },
    { name: "Stagione", value: prodotto.stagione.replace("-", " ") },
    { name: "Efficienza energetica", value: prodotto.indiceConsumo, description: "Classe etichetta UE 2020/740" },
    { name: "Aderenza sul bagnato", value: prodotto.indiceBagnato, description: "Classe etichetta UE 2020/740" },
    { name: "Rumore esterno", value: prodotto.indiceRumorosita, unitText: "dB", description: "Etichetta UE 2020/740" },
  ];
  const additionalProperty = specs
    .filter((s) => s.value && String(s.value).trim() !== "" && s.value !== "—")
    .map((s) => ({
      "@type": "PropertyValue",
      name: s.name,
      value: String(s.value),
      ...(s.unitText ? { unitText: s.unitText } : {}),
      ...(s.description ? { description: s.description } : {}),
    }));

  const schema = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "Product",
        "@id": `${url}#product`,
        name: prodotto.titolo,
        brand: { "@type": "Brand", name: prodotto.marca },
        model: prodotto.modello || undefined,
        mpn: prodotto.sku || undefined,
        sku: prodotto.sku || undefined,
        gtin13,
        category: `Pneumatici > ${prodotto.categoria}${prodotto.stagione ? ` > ${prodotto.stagione.replace("-", " ")}` : ""}`,
        image: prodotto.immagine ? [prodotto.immagine] : undefined,
        description: `Pneumatico ${prodotto.marca} ${prodotto.modello} ${misura} — ${prodotto.stagione.replace("-", " ")} per ${prodotto.categoria}.`,
        additionalProperty: additionalProperty.length ? additionalProperty : undefined,
        offers: {
          "@type": "Offer",
          url,
          priceCurrency: "EUR",
          price: prodotto.prezzo.toFixed(2),
          priceValidUntil,
          itemCondition: "https://schema.org/NewCondition",
          availability: prodotto.stock > 0 ? "https://schema.org/InStock" : "https://schema.org/OutOfStock",
          seller: { "@type": "Organization", name: "Spiezia Tyres S.p.A.", "@id": `${SITE}/#organization` },
        },
        ...(prodotto.recensioni > 0
          ? { aggregateRating: { "@type": "AggregateRating", ratingValue: prodotto.rating.toFixed(1), reviewCount: prodotto.recensioni } }
          : {}),
      },
      {
        "@type": "BreadcrumbList",
        itemListElement: [
          { "@type": "ListItem", position: 1, name: "Home", item: `${SITE}/` },
          { "@type": "ListItem", position: 2, name: "Catalogo", item: `${SITE}/prodotti` },
          { "@type": "ListItem", position: 3, name: `${prodotto.marca} ${prodotto.modello}`, item: url },
        ],
      },
      {
        "@type": "FAQPage",
        mainEntity: FAQ_PRODOTTO.map((f) => ({
          "@type": "Question",
          name: f.q,
          acceptedAnswer: { "@type": "Answer", text: f.a },
        })),
      },
    ],
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
      />
      <Suspense fallback={<div className="min-h-screen" />}>
        <ProductDetailClient prodotto={prodotto} />
      </Suspense>
    </>
  );
}
