"use client";
import { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { ChevronDown, X, SlidersHorizontal, Search } from "lucide-react";
import { dimensionValues } from "@/lib/algolia";
import Combobox from "@/components/ui/Combobox";

type Filters = {
  larghezza: string;
  altezza: string;
  diametro: string;
  marche: string[];
  stagioni: string[];
  indiciVelocita: string[];
  indiciCarico: string[];
  spedizione: boolean;
};

type Props = {
  initialFilters: Filters;
  availableMarche: string[];
  availableIndiciVelocita: string[];
  availableIndiciCarico: string[];
};

const STAGIONI = ["Estive", "Invernali", "4-Stagioni"];

const LARGHEZZE_POPOLARI = ["155", "165", "175", "185", "195", "205", "215", "225", "235", "245", "255"];
const ALTEZZE_POPOLARI = ["35", "40", "45", "50", "55", "60", "65", "70"];
const DIAMETRI_POPOLARI = ["R14", "R15", "R16", "R17", "R18", "R19", "R20"];

function FilterSection({ title, children, defaultOpen = true }: {
  title: string;
  children: React.ReactNode;
  defaultOpen?: boolean;
}) {
  const [open, setOpen] = useState(defaultOpen);
  return (
    <div className="border-b border-[#E5E7EB]">
      <button
        onClick={() => setOpen((v) => !v)}
        className="w-full flex items-center justify-between py-3.5 text-left"
      >
        <span className="text-[10px] font-black uppercase tracking-widest text-[#111]">{title}</span>
        <ChevronDown
          size={14}
          className={`text-[#9DA5AE] transition-transform duration-200 ${open ? "rotate-180" : ""}`}
        />
      </button>
      {open && <div className="pb-4">{children}</div>}
    </div>
  );
}

export default function FiltersPanel({ initialFilters, availableMarche, availableIndiciVelocita, availableIndiciCarico }: Props) {
  const router = useRouter();
  const searchParams = useSearchParams();

  const [filters, setFilters] = useState<Filters>(initialFilters);
  const [altezze, setAltezze] = useState<string[]>([]);
  const [diametri, setDiametri] = useState<string[]>([]);
  const [larghezze, setLarghezze] = useState<string[]>([]);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [marcaSearch, setMarcaSearch] = useState("");
  const [ivSearch, setIvSearch] = useState("");
  const [icSearch, setIcSearch] = useState("");

  useEffect(() => {
    dimensionValues("Larghezza").then(setLarghezze);
  }, []);

  useEffect(() => {
    if (filters.larghezza) {
      dimensionValues("Altezza", filters.larghezza).then(setAltezze);
    } else {
      setAltezze([]);
    }
  }, [filters.larghezza]);

  useEffect(() => {
    if (filters.larghezza && filters.altezza) {
      dimensionValues("Diametro", filters.larghezza, filters.altezza).then(setDiametri);
    } else {
      setDiametri([]);
    }
  }, [filters.larghezza, filters.altezza]);

  function applyFilters(newFilters: Filters) {
    const params = new URLSearchParams(searchParams.toString());
    const setOrDel = (k: string, v: string | undefined) => {
      if (v) params.set(k, v); else params.delete(k);
    };
    setOrDel("larghezza", newFilters.larghezza);
    setOrDel("altezza", newFilters.altezza);
    setOrDel("diametro", newFilters.diametro);
    if (newFilters.marche.length) params.set("marche", newFilters.marche.join(","));
    else params.delete("marche");
    if (newFilters.stagioni.length) params.set("stagioni", newFilters.stagioni.join(","));
    else params.delete("stagioni");
    if (newFilters.indiciVelocita.length) params.set("iv", newFilters.indiciVelocita.join(","));
    else params.delete("iv");
    if (newFilters.indiciCarico.length) params.set("ic", newFilters.indiciCarico.join(","));
    else params.delete("ic");
    if (newFilters.spedizione) params.set("spedizione", "1");
    else params.delete("spedizione");
    params.delete("page");
    router.push(`/prodotti?${params.toString()}`);
    setMobileOpen(false);
  }

  function setF<K extends keyof Filters>(key: K, value: Filters[K]) {
    const next = { ...filters, [key]: value };
    if (key === "larghezza") { next.altezza = ""; next.diametro = ""; }
    if (key === "altezza") { next.diametro = ""; }
    setFilters(next);
  }

  function toggleArray(key: "marche" | "stagioni", value: string) {
    const arr = filters[key];
    const next = arr.includes(value) ? arr.filter((v) => v !== value) : [...arr, value];
    setFilters({ ...filters, [key]: next });
  }

  function reset() {
    const empty: Filters = { larghezza: "", altezza: "", diametro: "", marche: [], stagioni: [], indiciVelocita: [], indiciCarico: [], spedizione: false };
    setFilters(empty);
    router.push("/prodotti");
    setMobileOpen(false);
  }

  const activeCount = [
    filters.larghezza, filters.altezza, filters.diametro,
    ...filters.marche, ...filters.stagioni,
    ...filters.indiciVelocita, ...filters.indiciCarico,
    filters.spedizione ? "1" : "",
  ].filter(Boolean).length;

  const searchInputCls = "w-full pl-8 pr-3 py-2 text-xs border border-[#E5E7EB] rounded-lg focus:outline-none focus:border-[#FFC300] transition-colors bg-white placeholder:text-[#9DA5AE]";

  const panelContent = (
    <div>
      {/* Size cascade */}
      <FilterSection title="Misura pneumatico">
        <div className="space-y-2">
          <div>
            <p className="text-[10px] text-[#9DA5AE] uppercase tracking-widest mb-1.5">Larghezza</p>
            <Combobox
              value={filters.larghezza || "Tutte"}
              onChange={(v) => setF("larghezza", v === "Tutte" ? "" : v)}
              options={["Tutte", ...larghezze]}
              popular={LARGHEZZE_POPOLARI}
              placeholder="Tutte"
            />
          </div>
          {filters.larghezza && (
            <div>
              <p className="text-[10px] text-[#9DA5AE] uppercase tracking-widest mb-1.5">Altezza</p>
              <Combobox
                value={filters.altezza || "Tutte"}
                onChange={(v) => setF("altezza", v === "Tutte" ? "" : v)}
                options={["Tutte", ...altezze]}
                popular={ALTEZZE_POPOLARI}
                placeholder="Tutte"
              />
            </div>
          )}
          {filters.altezza && (
            <div>
              <p className="text-[10px] text-[#9DA5AE] uppercase tracking-widest mb-1.5">Diametro</p>
              <Combobox
                value={filters.diametro ? `R${filters.diametro}` : "Tutti"}
                onChange={(v) => setF("diametro", v === "Tutti" ? "" : v.slice(1))}
                options={["Tutti", ...diametri.map((v) => `R${v}`)]}
                popular={DIAMETRI_POPOLARI}
                placeholder="Tutti"
              />
            </div>
          )}
        </div>
      </FilterSection>

      {/* Stagione */}
      <FilterSection title="Stagione">
        <div className="space-y-1.5">
          {STAGIONI.map((s) => (
            <label key={s} className="flex items-center gap-2.5 cursor-pointer group/check">
              <div className={`w-4 h-4 rounded border-2 flex items-center justify-center flex-shrink-0 transition-colors ${
                filters.stagioni.includes(s)
                  ? "bg-[#FFC300] border-[#FFC300]"
                  : "border-[#D4D4D4] group-hover/check:border-[#FFC300]"
              }`}>
                {filters.stagioni.includes(s) && (
                  <svg width="8" height="6" viewBox="0 0 8 6" fill="none">
                    <path d="M1 3l2 2 4-4" stroke="#111" strokeWidth="1.5" strokeLinecap="round"/>
                  </svg>
                )}
              </div>
              <input
                type="checkbox"
                className="sr-only"
                checked={filters.stagioni.includes(s)}
                onChange={() => toggleArray("stagioni", s)}
              />
              <span className="text-sm text-[#111]">{s}</span>
            </label>
          ))}
        </div>
      </FilterSection>

      {/* Marche */}
      {availableMarche.length > 0 && (
        <FilterSection title="Marca" defaultOpen={false}>
          <div className="relative mb-3">
            <Search size={13} className="absolute left-3 top-1/2 -translate-y-1/2 text-[#9DA5AE]" />
            <input
              type="text"
              placeholder="Cerca marca…"
              value={marcaSearch}
              onChange={(e) => setMarcaSearch(e.target.value)}
              className={searchInputCls}
            />
            {marcaSearch && (
              <button
                onClick={() => setMarcaSearch("")}
                className="absolute right-2.5 top-1/2 -translate-y-1/2 text-[#9DA5AE] hover:text-[#555]"
              >
                <X size={11} />
              </button>
            )}
          </div>
          <div className="space-y-1.5 max-h-52 overflow-y-auto scrollbar-hide">
            {availableMarche.filter((m) =>
              m.toLowerCase().includes(marcaSearch.toLowerCase())
            ).map((m) => (
              <label key={m} className="flex items-center gap-2.5 cursor-pointer group/check">
                <div className={`w-4 h-4 rounded border-2 flex items-center justify-center flex-shrink-0 transition-colors ${
                  filters.marche.includes(m)
                    ? "bg-[#FFC300] border-[#FFC300]"
                    : "border-[#D4D4D4] group-hover/check:border-[#FFC300]"
                }`}>
                  {filters.marche.includes(m) && (
                    <svg width="8" height="6" viewBox="0 0 8 6" fill="none">
                      <path d="M1 3l2 2 4-4" stroke="#111" strokeWidth="1.5" strokeLinecap="round"/>
                    </svg>
                  )}
                </div>
                <input
                  type="checkbox"
                  className="sr-only"
                  checked={filters.marche.includes(m)}
                  onChange={() => toggleArray("marche", m)}
                />
                <span className="text-sm text-[#111]">{m}</span>
              </label>
            ))}
          </div>
        </FilterSection>
      )}

      {/* Indice di Velocità */}
      {availableIndiciVelocita.length > 0 && (
        <FilterSection title="Indice di Velocità" defaultOpen={false}>
          <div className="relative mb-3">
            <Search size={13} className="absolute left-3 top-1/2 -translate-y-1/2 text-[#9DA5AE]" />
            <input
              type="text"
              placeholder="Cerca indice…"
              value={ivSearch}
              onChange={(e) => setIvSearch(e.target.value)}
              className={searchInputCls}
            />
          </div>
          <div className="grid grid-cols-3 gap-2">
            {availableIndiciVelocita
              .filter((v) => v.toLowerCase().includes(ivSearch.toLowerCase()))
              .sort()
              .map((v) => {
                const active = filters.indiciVelocita.includes(v);
                return (
                  <button
                    key={v}
                    onClick={() => {
                      const arr = active
                        ? filters.indiciVelocita.filter((x) => x !== v)
                        : [...filters.indiciVelocita, v];
                      setFilters({ ...filters, indiciVelocita: arr });
                    }}
                    className={`py-1.5 text-xs font-bold rounded-lg border-2 transition-all ${
                      active
                        ? "bg-[#FFC300] border-[#FFC300] text-[#111]"
                        : "border-[#E5E7EB] text-[#555] hover:border-[#111] hover:text-[#111]"
                    }`}
                  >
                    {v}
                  </button>
                );
              })}
          </div>
        </FilterSection>
      )}

      {/* Indice di Carico */}
      {availableIndiciCarico.length > 0 && (
        <FilterSection title="Indice di Carico" defaultOpen={false}>
          <div className="relative mb-3">
            <Search size={13} className="absolute left-3 top-1/2 -translate-y-1/2 text-[#9DA5AE]" />
            <input
              type="text"
              placeholder="Cerca indice…"
              value={icSearch}
              onChange={(e) => setIcSearch(e.target.value)}
              className={searchInputCls}
            />
          </div>
          <div className="grid grid-cols-3 gap-2 max-h-48 overflow-y-auto scrollbar-hide">
            {availableIndiciCarico
              .filter((v) => v.includes(icSearch))
              .sort((a, b) => Number(a) - Number(b))
              .map((v) => {
                const active = filters.indiciCarico.includes(v);
                return (
                  <button
                    key={v}
                    onClick={() => {
                      const arr = active
                        ? filters.indiciCarico.filter((x) => x !== v)
                        : [...filters.indiciCarico, v];
                      setFilters({ ...filters, indiciCarico: arr });
                    }}
                    className={`py-1.5 text-xs font-bold rounded-lg border-2 transition-all ${
                      active
                        ? "bg-[#FFC300] border-[#FFC300] text-[#111]"
                        : "border-[#E5E7EB] text-[#555] hover:border-[#111] hover:text-[#111]"
                    }`}
                  >
                    {v}
                  </button>
                );
              })}
          </div>
        </FilterSection>
      )}

      <div className="mt-4 space-y-2">
        <button
          onClick={() => applyFilters(filters)}
          className="w-full bg-[#FFC300] hover:bg-[#E6B000] text-[#111] font-black text-sm py-3 rounded-xl transition-colors"
        >
          Applica filtri{activeCount > 0 ? ` (${activeCount})` : ""}
        </button>
        {activeCount > 0 && (
          <button
            onClick={reset}
            className="w-full flex items-center justify-center gap-1 text-xs font-semibold text-[#FF5963] hover:text-red-700 transition-colors py-2"
          >
            <X size={12} /> Azzera filtri
          </button>
        )}
      </div>
    </div>
  );

  return (
    <>
      {/* Mobile toggle */}
      <div className="lg:hidden mb-4">
        <button
          onClick={() => setMobileOpen(true)}
          className="btn-outline-navy flex items-center gap-2 text-sm"
        >
          <SlidersHorizontal size={16} />
          Filtri {activeCount > 0 && <span className="bg-[#FFC300] text-[#111] text-[10px] font-black rounded-full w-4 h-4 flex items-center justify-center">{activeCount}</span>}
        </button>
      </div>

      {/* Desktop sidebar */}
      <div className="hidden lg:block w-64 flex-shrink-0">
        <div className="sticky top-24 max-h-[calc(100vh-7rem)] flex flex-col">
          <div className="flex items-center justify-between mb-4 flex-shrink-0">
            <h2 className="text-[10px] font-black uppercase tracking-widest text-[#111]">Filtri</h2>
            {activeCount > 0 && (
              <button onClick={reset} className="text-xs text-[#FF5963] hover:underline font-semibold">
                Azzera ({activeCount})
              </button>
            )}
          </div>
          <div className="overflow-y-auto flex-1 pr-1 -mr-1">
            {panelContent}
          </div>
        </div>
      </div>

      {/* Mobile drawer */}
      {mobileOpen && (
        <>
          <div className="fixed inset-0 z-[200] bg-black/60 backdrop-blur-sm cart-overlay" onClick={() => setMobileOpen(false)} />
          <div className="fixed left-0 top-0 bottom-0 z-[201] w-full max-w-sm bg-white cart-drawer flex flex-col">
            <div className="flex items-center justify-between px-5 py-4 bg-[#111]">
              <h2 className="text-sm font-bold text-white">Filtri</h2>
              <button onClick={() => { setFilters(initialFilters); setMobileOpen(false); }} className="text-white/60 hover:text-white transition-colors p-1 rounded">
                <X size={18} />
              </button>
            </div>
            <div className="flex-1 overflow-y-auto px-5 py-4">
              {panelContent}
            </div>
          </div>
        </>
      )}
    </>
  );
}
