"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { ChevronDown, Search, Loader2 } from "lucide-react";
import type { CarMake, CarModel, CarYear, CarModification } from "@/lib/types";

export default function VehicleSearch() {
  const router = useRouter();
  const [makes, setMakes] = useState<CarMake[]>([]);
  const [models, setModels] = useState<CarModel[]>([]);
  const [years, setYears] = useState<CarYear[]>([]);
  const [mods, setMods] = useState<CarModification[]>([]);

  const [make, setMake] = useState("");
  const [model, setModel] = useState("");
  const [year, setYear] = useState("");
  const [mod, setMod] = useState("");

  const [loading, setLoading] = useState<string | null>(null);
  const [tires, setTires] = useState<string[]>([]);

  useEffect(() => {
    setLoading("makes");
    fetch("/api/tyresaddict/makes")
      .then((r) => r.json())
      .then((d) => setMakes(d.data ?? []))
      .catch(() => {})
      .finally(() => setLoading(null));
  }, []);

  function onMake(id: string) {
    setMake(id); setModel(""); setYear(""); setMod(""); setModels([]); setYears([]); setMods([]); setTires([]);
    if (!id) return;
    setLoading("models");
    fetch(`/api/tyresaddict/models?make_id=${id}`)
      .then((r) => r.json())
      .then((d) => setModels(d.data ?? []))
      .catch(() => {})
      .finally(() => setLoading(null));
  }

  function onModel(id: string) {
    setModel(id); setYear(""); setMod(""); setYears([]); setMods([]); setTires([]);
    if (!id) return;
    setLoading("years");
    fetch(`/api/tyresaddict/years?model_id=${id}`)
      .then((r) => r.json())
      .then((d) => setYears(d.data ?? []))
      .catch(() => {})
      .finally(() => setLoading(null));
  }

  function onYear(id: string) {
    setYear(id); setMod(""); setMods([]); setTires([]);
    if (!id) return;
    setLoading("mods");
    fetch(`/api/tyresaddict/modifications?year_id=${id}`)
      .then((r) => r.json())
      .then((d) => setMods(d.data ?? []))
      .catch(() => {})
      .finally(() => setLoading(null));
  }

  function onMod(id: string) {
    setMod(id); setTires([]);
    const found = mods.find((m) => String(m.id) === id);
    if (found?.tires) setTires(found.tires);
  }

  function handleSearch() {
    if (!tires.length) return;
    const [w, h, d] = parseTireSize(tires[0]);
    if (w) router.push(`/prodotti?larghezza=${w}${h ? `&altezza=${h}` : ""}${d ? `&diametro=${d}` : ""}`);
  }

  const makeName = makes.find((m) => String(m.id) === make)?.name;
  const modelName = models.find((m) => String(m.id) === model)?.name;
  const yearName = years.find((y) => String(y.id) === year)?.name;

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
        <SelectField
          label="Marca"
          value={make}
          onChange={onMake}
          disabled={loading === "makes"}
          loading={loading === "makes"}
          placeholder="Seleziona marca"
          options={makes.map((m) => ({ value: String(m.id), label: m.name }))}
        />
        <SelectField
          label="Modello"
          value={model}
          onChange={onModel}
          disabled={!make || loading === "models"}
          loading={loading === "models"}
          placeholder={make ? "Seleziona modello" : "Prima seleziona marca"}
          options={models.map((m) => ({ value: String(m.id), label: m.name }))}
        />
        <SelectField
          label="Anno"
          value={year}
          onChange={onYear}
          disabled={!model || loading === "years"}
          loading={loading === "years"}
          placeholder={model ? "Seleziona anno" : "Prima seleziona modello"}
          options={years.map((y) => ({ value: String(y.id), label: y.name }))}
        />
        <SelectField
          label="Versione"
          value={mod}
          onChange={onMod}
          disabled={!year || loading === "mods"}
          loading={loading === "mods"}
          placeholder={year ? "Seleziona versione" : "Prima seleziona anno"}
          options={mods.map((m) => ({ value: String(m.id), label: m.name }))}
        />
      </div>

      {tires.length > 0 && (
        <div className="bg-[#F1F4F8] border border-[#E5E7EB] rounded-xl p-4">
          <p className="text-[10px] font-bold uppercase tracking-widest text-[#9DA5AE] mb-2">Misure compatibili</p>
          <div className="flex flex-wrap gap-2 mb-3">
            {tires.map((t) => (
              <span key={t} className="font-mono text-sm font-bold bg-white border border-[#E5E7EB] rounded-lg px-3 py-1 text-[#001D3D]">
                {t}
              </span>
            ))}
          </div>
          <p className="text-xs text-[#9DA5AE]">
            {makeName} {modelName} {yearName}
          </p>
        </div>
      )}

      <button
        onClick={handleSearch}
        disabled={!tires.length}
        className={`btn-gold flex items-center gap-2 ${!tires.length ? "opacity-40 cursor-not-allowed" : ""}`}
      >
        <Search size={16} /> Cerca pneumatici compatibili
      </button>
    </div>
  );
}

function SelectField({
  label, value, onChange, options, placeholder, disabled, loading,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  options: { value: string; label: string }[];
  placeholder: string;
  disabled?: boolean;
  loading?: boolean;
}) {
  return (
    <div>
      <label className="block text-xs font-bold uppercase tracking-widest text-[#57636C] mb-1.5">{label}</label>
      <div className="relative">
        <select
          className="w-full border border-[#E5E7EB] rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:border-[#001D3D] transition-colors bg-white appearance-none pr-9 text-[#001D3D] disabled:opacity-40 disabled:cursor-not-allowed"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          disabled={disabled}
        >
          <option value="">{placeholder}</option>
          {options.map((o) => <option key={o.value} value={o.value}>{o.label}</option>)}
        </select>
        <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none">
          {loading ? (
            <Loader2 size={14} className="text-[#9DA5AE] animate-spin" />
          ) : (
            <ChevronDown size={14} className="text-[#9DA5AE]" />
          )}
        </div>
      </div>
    </div>
  );
}

function parseTireSize(tire: string): [string, string, string] {
  const m = tire.match(/^(\d+)[\s/](\d+)[\s]?[Rr](\d+)/);
  if (m) return [m[1], m[2], m[3]];
  const m2 = tire.match(/^(\d+)[\s/](\d+)[-\s](\d+)/);
  if (m2) return [m2[1], m2[2], m2[3]];
  return [tire.replace(/\D.*/, ""), "", ""];
}
