"use client";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { Loader2, ArrowRight } from "lucide-react";
import {
  getMakes, getModels, getYears, getModifications, getFitment,
  TaMake, TaModel, TaModification,
} from "@/lib/tyresaddict";
import Combobox from "@/components/ui/Combobox";

export default function VehicleSearch() {
  const router = useRouter();

  const [makes, setMakes] = useState<TaMake[]>([]);
  const [models, setModels] = useState<TaModel[]>([]);
  const [years, setYears] = useState<number[]>([]);
  const [mods, setMods] = useState<TaModification[]>([]);

  const [makeId, setMakeId] = useState("");
  const [modelId, setModelId] = useState("");
  const [year, setYear] = useState<number | "">("");
  const [modId, setModId] = useState("");
  const [makeName, setMakeName] = useState("");
  const [modelName, setModelName] = useState("");

  const [loading, setLoading] = useState(true);
  const [searching, setSearching] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    getMakes()
      .then(setMakes)
      .catch(() => setError("Errore nel caricamento delle marche"))
      .finally(() => setLoading(false));
  }, []);

  const onMakeChange = async (name: string) => {
    const id = makes.find((m) => m.make_name === name)?.make_id ?? "";
    setMakeId(id); setMakeName(name);
    setModelId(""); setModelName(""); setYear(""); setModId("");
    setModels([]); setYears([]); setMods([]);
    if (!id) return;
    try { setModels(await getModels(id)); }
    catch { setError("Errore nel caricamento dei modelli"); }
  };

  const onModelChange = async (name: string) => {
    const id = models.find((m) => m.model_name === name)?.model_id ?? "";
    setModelId(id); setModelName(name);
    setYear(""); setModId(""); setYears([]); setMods([]);
    if (!id) return;
    try { setYears((await getYears(id)).sort((a, b) => b - a)); }
    catch { setError("Errore nel caricamento degli anni"); }
  };

  const onYearChange = async (v: string) => {
    const y = Number(v);
    setYear(y); setModId(""); setMods([]);
    if (!modelId) return;
    try { setMods(await getModifications(modelId, y)); }
    catch { setError("Errore nel caricamento delle versioni"); }
  };

  const submit = async () => {
    if (!makeId || !modelId || !year || !modId) return;
    setError(""); setSearching(true);
    try {
      const fitment = await getFitment(modelId, year as number, modId);
      // prefer factory tires, fall back to replace sizes
      const tyres = fitment.tyres.factory.length ? fitment.tyres.factory : fitment.tyres.replace;
      if (!tyres.length) { setError("Nessuna misura trovata per questo veicolo"); setSearching(false); return; }
      const tire = tyres[0];
      // TyresAddict may return r as "R17" or "17" — strip the prefix so Algolia gets "17"
      const diametro = tire.r.replace(/^R/i, "");
      const q = new URLSearchParams({
        larghezza: tire.width,
        altezza: tire.profile,
        diametro,
        carMake: makeName,
        carModel: modelName,
        carYear: String(year),
      });
      router.push(`/prodotti?${q.toString()}`);
    } catch { setError("Errore nel recupero della misura"); setSearching(false); }
  };

  return (
    <div className="space-y-3">
      {error && <p className="text-xs text-red-500 font-semibold">{error}</p>}

      <div className="grid grid-cols-2 gap-2">
        <div>
          <p className="text-[10px] font-black uppercase tracking-widest text-[#9DA5AE] mb-1.5">Marca</p>
          <Combobox
            value={makeName}
            onChange={onMakeChange}
            options={makes.map((m) => m.make_name)}
            placeholder={loading ? "Caricamento…" : "Es. Fiat"}
            disabled={loading}
          />
        </div>
        <div>
          <p className="text-[10px] font-black uppercase tracking-widest text-[#9DA5AE] mb-1.5">Modello</p>
          <Combobox
            value={modelName}
            onChange={onModelChange}
            options={models.map((m) => m.model_name)}
            placeholder={!makeId ? "Prima la marca" : "Es. Punto"}
            disabled={!makeId || models.length === 0}
          />
        </div>
        <div>
          <p className="text-[10px] font-black uppercase tracking-widest text-[#9DA5AE] mb-1.5">Anno</p>
          <Combobox
            value={year ? String(year) : ""}
            onChange={onYearChange}
            options={years.map(String)}
            placeholder={!modelId ? "Prima il modello" : "Es. 2019"}
            disabled={!modelId || years.length === 0}
          />
        </div>
        <div>
          <p className="text-[10px] font-black uppercase tracking-widest text-[#9DA5AE] mb-1.5">Versione</p>
          <Combobox
            value={mods.find((m) => m.mod_id === modId)?.mod_name ?? ""}
            onChange={(name) => setModId(mods.find((m) => m.mod_name === name)?.mod_id ?? "")}
            options={mods.map((m) => m.mod_name)}
            placeholder={!year ? "Prima l'anno" : "Seleziona versione"}
            disabled={!year || mods.length === 0}
          />
        </div>
      </div>

      <button
        onClick={submit}
        disabled={!makeId || !modelId || !year || !modId || searching}
        className="w-full bg-[#FFC300] hover:bg-[#E6B000] disabled:bg-[#F1F4F8] disabled:text-[#9DA5AE] disabled:cursor-not-allowed text-[#111] font-black py-3 sm:py-3.5 rounded-xl flex items-center justify-center gap-2 text-xs sm:text-sm transition-colors shadow-[0_4px_16px_rgba(255,195,0,0.4)] disabled:shadow-none"
      >
        {searching ? <Loader2 size={18} className="animate-spin" /> : <ArrowRight size={18} />}
        Trova pneumatici per la tua auto
      </button>
    </div>
  );
}
