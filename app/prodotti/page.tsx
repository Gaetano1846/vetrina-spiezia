import { Suspense } from "react";
import type { Metadata } from "next";
import { searchProdotti, facetValues } from "@/lib/algolia";
import ProductCard from "@/components/products/ProductCard";
import FiltersPanel from "@/components/products/FiltersPanel";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Catalogo Pneumatici",
  description: "Sfoglia il catalogo pneumatici Spiezia Tyres. Filtra per misura, stagione e marca. Prenota il tuo appuntamento in sede.",
};

type SearchParams = Promise<{ [key: string]: string | string[] | undefined }>;

function getString(v: string | string[] | undefined): string {
  return typeof v === "string" ? v : (Array.isArray(v) ? v[0] : "") ?? "";
}
function getArray(v: string | string[] | undefined): string[] {
  if (!v) return [];
  const s = typeof v === "string" ? v : v[0] ?? "";
  return s ? s.split(",").filter(Boolean) : [];
}

async function ProductsResults({ searchParams }: { searchParams: Awaited<SearchParams> }) {
  const larghezza = getString(searchParams.larghezza);
  const altezza   = getString(searchParams.altezza);
  const diametro  = getString(searchParams.diametro);
  const marche          = getArray(searchParams.marche);
  const stagioni        = getArray(searchParams.stagioni);
  const indiciVelocita  = getArray(searchParams.iv);
  const indiciCarico    = getArray(searchParams.ic);
  const query           = getString(searchParams.q);
  const cat             = getString(searchParams.cat);
  const spedizione      = getString(searchParams.spedizione) === "1";
  const page            = Math.max(0, parseInt(getString(searchParams.page) || "0", 10));
  const result = await searchProdotti({
    query, page, hitsPerPage: 24,
    larghezza, altezza, diametro,
    marche, stagioni,
    indiciVelocita: indiciVelocita.length ? indiciVelocita : undefined,
    indiciCarico:   indiciCarico.length   ? indiciCarico   : undefined,
    categoria:      cat       || undefined,
    spedizioneVeloce: spedizione || undefined,
    sortByPrice:    "asc",
  });

  const totalPages = result.nbPages;
  const hasFilters = !!(larghezza || altezza || diametro || marche.length || stagioni.length || query);

  const buildPageUrl = (p: number) => {
    const params = new URLSearchParams();
    if (larghezza) params.set("larghezza", larghezza);
    if (altezza) params.set("altezza", altezza);
    if (diametro) params.set("diametro", diametro);
    if (marche.length) params.set("marche", marche.join(","));
    if (stagioni.length) params.set("stagioni", stagioni.join(","));
    if (indiciVelocita.length) params.set("iv", indiciVelocita.join(","));
    if (indiciCarico.length) params.set("ic", indiciCarico.join(","));
    if (query) params.set("q", query);
    if (cat) params.set("cat", cat);
    if (spedizione) params.set("spedizione", "1");
    if (p > 0) params.set("page", String(p));
    return `/prodotti?${params.toString()}`;
  };

  return (
    <>
      {/* Toolbar */}
      <div className="flex items-center justify-between mb-6">
        <p className="text-sm text-[#57636C]">
          <span className="font-bold text-[#001D3D]">{result.nbHits.toLocaleString("it-IT")}</span> risultati
          {hasFilters && <span className="text-[#FFC300] ml-1 font-semibold">filtrati</span>}
        </p>
      </div>

      {/* Applied filters summary */}
      {(larghezza || altezza || diametro) && (
        <div className="mb-4 flex items-center gap-2 flex-wrap">
          <span className="text-xs text-[#9DA5AE]">Misura:</span>
          <span className="font-mono text-xs font-bold bg-[#001D3D] text-white px-2.5 py-1 rounded-lg">
            {[larghezza, altezza, diametro ? `R${diametro}` : ""].filter(Boolean).join("/")}
          </span>
        </div>
      )}

      {result.hits.length === 0 ? (
        <div className="py-20 px-6 text-center">
          <p className="text-sm font-semibold text-[#001D3D] mb-1">Nessun risultato trovato</p>
          <p className="text-sm text-[#9DA5AE] mb-6">Modifica i filtri o prova con criteri diversi.</p>
          <Link href="/prodotti" className="text-xs font-bold text-[#001D3D] underline underline-offset-4 hover:text-[#FFC300] transition-colors">
            Azzera tutti i filtri
          </Link>
        </div>
      ) : (
        <>
          <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-4">
            {result.hits.map((p) => <ProductCard key={p.id} prodotto={p} />)}
          </div>

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex items-center justify-center gap-1 sm:gap-2 mt-10">
              {page > 0 && (
                <Link
                  href={buildPageUrl(page - 1)}
                  className="h-7 sm:h-9 px-2 sm:px-4 flex items-center justify-center text-xs font-bold rounded-lg border-2 border-[#111] text-[#111] hover:bg-[#111] hover:text-white transition-all whitespace-nowrap"
                >
                  <span className="sm:hidden">←</span>
                  <span className="hidden sm:inline">← Precedente</span>
                </Link>
              )}
              <div className="flex items-center gap-0.5 sm:gap-1">
                {Array.from({ length: Math.min(totalPages, 7) }, (_, i) => {
                  let p_idx = i;
                  if (totalPages > 7) {
                    if (page < 4) p_idx = i;
                    else if (page > totalPages - 5) p_idx = totalPages - 7 + i;
                    else p_idx = page - 3 + i;
                  }
                  return (
                    <Link
                      key={p_idx}
                      href={buildPageUrl(p_idx)}
                      className={`w-7 h-7 sm:w-9 sm:h-9 flex items-center justify-center text-[10px] sm:text-xs font-bold rounded-lg border transition-all ${
                        p_idx === page
                          ? "bg-[#111] text-white border-[#111]"
                          : "border-[#E5E7EB] text-[#57636C] hover:border-[#111] hover:text-[#111]"
                      }`}
                    >
                      {p_idx + 1}
                    </Link>
                  );
                })}
              </div>
              {page < totalPages - 1 && (
                <Link
                  href={buildPageUrl(page + 1)}
                  className="h-7 sm:h-9 px-2 sm:px-4 flex items-center justify-center text-xs font-bold rounded-lg border-2 border-[#111] text-[#111] hover:bg-[#111] hover:text-white transition-all whitespace-nowrap"
                >
                  <span className="sm:hidden">→</span>
                  <span className="hidden sm:inline">Successiva →</span>
                </Link>
              )}
            </div>
          )}
        </>
      )}
    </>
  );
}

export default async function ProdottiPage({ searchParams }: { searchParams: SearchParams }) {
  const params = await searchParams;

  const [marche, indiciVelocita, indiciCarico] = await Promise.all([
    facetValues("Marca"),
    facetValues("Indice_Velocita"),
    facetValues("Indice_Carico"),
  ]);

  const initialFilters = {
    larghezza:       getString(params.larghezza),
    altezza:         getString(params.altezza),
    diametro:        getString(params.diametro),
    marche:          getArray(params.marche),
    stagioni:        getArray(params.stagioni),
    indiciVelocita:  getArray(params.iv),
    indiciCarico:    getArray(params.ic),
    spedizione:      getString(params.spedizione) === "1",
  };

  return (
    <div className="max-w-8xl mx-auto px-4 sm:px-6 py-5 sm:py-8">
      {/* Page header */}
      <div className="mb-5 sm:mb-8">
        <p className="eyebrow mb-1">Catalogo</p>
        <h1 className="text-2xl sm:text-3xl font-black text-[#001D3D]">Tutti i pneumatici</h1>
      </div>

      <div className="lg:flex lg:gap-8">
        {/* Filters sidebar */}
        <Suspense fallback={null}>
          <FiltersPanel
            initialFilters={initialFilters}
            availableMarche={marche}
            availableIndiciVelocita={indiciVelocita}
            availableIndiciCarico={indiciCarico}
          />
        </Suspense>

        {/* Results */}
        <div className="flex-1 min-w-0">
          <Suspense
            fallback={
              <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-4">
                {Array.from({ length: 24 }).map((_, i) => (
                  <div key={i} className="aspect-[3/4] skeleton rounded-lg" />
                ))}
              </div>
            }
          >
            <ProductsResults searchParams={params} />
          </Suspense>
        </div>
      </div>
    </div>
  );
}
