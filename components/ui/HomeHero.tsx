"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Search, Loader2 } from "lucide-react";
import { dimensionValues } from "@/lib/algolia";
import Combobox from "@/components/ui/Combobox";
import VehicleSearch from "@/components/ui/VehicleSearch";

const POPULAR_SIZES = [
  "205/55 R16","215/60 R16","225/45 R17","195/55 R16","205/45 R17",
  "175/65 R14","205/60 R16","225/40 R18","225/50 R17",
];

export default function HomeHero() {
  const router = useRouter();
  const [tab, setTab] = useState<"misura" | "auto">("misura");
  const [larghezze, setLarghezze] = useState<string[]>([]);
  const [altezze, setAltezze] = useState<string[]>([]);
  const [diametri, setDiametri] = useState<string[]>([]);
  const [L, setL] = useState(""); const [A, setA] = useState(""); const [D, setD] = useState("");
  const [stagione, setStagione] = useState<"Estive" | "Invernali" | "4-Stagioni" | "">("");
  const [loading, setLoading] = useState(false);

  useEffect(() => { dimensionValues("Larghezza").then(setLarghezze); }, []);
  useEffect(() => {
    if (L) dimensionValues("Altezza", L).then(setAltezze);
    else { setAltezze([]); setA(""); setD(""); }
  }, [L]);
  useEffect(() => {
    if (L && A) dimensionValues("Diametro", L, A).then(setDiametri);
    else { setDiametri([]); setD(""); }
  }, [L, A]);

  function handleSearch() {
    setLoading(true);
    const params = new URLSearchParams();
    if (L) params.set("larghezza", L);
    if (A) params.set("altezza", A);
    if (D) params.set("diametro", D);
    if (stagione) params.set("stagioni", stagione);
    router.push(`/prodotti?${params.toString()}`);
  }

  return (
    <div className="bg-white rounded-2xl shadow-[0_8px_40px_rgba(0,0,0,0.15)] p-5 w-full">
      {/* Tabs */}
      <div className="flex gap-1 bg-[#F1F4F8] rounded-xl p-1 mb-5">
        {(["misura", "auto"] as const).map((t) => (
          <button
            key={t}
            onClick={() => setTab(t)}
            className={`flex-1 py-2 text-xs font-bold rounded-lg transition-all duration-200 ${
              tab === t ? "bg-[#111] text-white shadow-sm" : "text-[#555] hover:text-[#111]"
            }`}
          >
            {t === "misura" ? "Cerca per Misura" : "Cerca per Auto"}
          </button>
        ))}
      </div>

      {tab === "misura" ? (
        <div className="space-y-3">
        <div className="grid grid-cols-3 gap-2">
            <div>
              <p className="text-[10px] font-black uppercase tracking-widest text-[#9DA5AE] mb-1.5">Largh.</p>
              <Combobox
                value={L}
                onChange={(v) => { setL(v); setA(""); setD(""); }}
                options={larghezze}
                popular={["195","205","215","225","175","185","235","245"]}
                placeholder="205"
              />
            </div>
            <div>
              <p className="text-[10px] font-black uppercase tracking-widest text-[#9DA5AE] mb-1.5">Alt.</p>
              <Combobox
                value={A}
                onChange={(v) => { setA(v); setD(""); }}
                options={altezze}
                popular={["55","65","45","50","60","40","35","70"]}
                placeholder="55"
                disabled={!L}
              />
            </div>
            <div>
              <p className="text-[10px] font-black uppercase tracking-widest text-[#9DA5AE] mb-1.5">Diam.</p>
              <Combobox
                value={D}
                onChange={setD}
                options={diametri}
                popular={["16","17","15","18","14","19","20"]}
                placeholder="R16"
                prefix="R"
                disabled={!A}
              />
            </div>
          </div>

          {/* Stagione pills */}
          <div>
            <p className="text-[10px] font-black uppercase tracking-widest text-[#9DA5AE] mb-1.5">Stagione</p>
            <div className="grid grid-cols-3 gap-2">
              {(["Estive","Invernali","4-Stagioni"] as const).map((s) => (
                <button
                  key={s}
                  onClick={() => setStagione(stagione === s ? "" : s)}
                  className={`py-2 rounded-lg text-xs font-bold border-2 bg-white transition-all text-center ${
                    stagione === s
                      ? "border-[#FFC300] text-[#111] bg-[#FFC300]/5"
                      : "border-[#E5E7EB] text-[#555] hover:border-[#FFC300]"
                  }`}
                >
                  {s === "4-Stagioni" ? "4 Stagioni" : s}
                </button>
              ))}
            </div>
          </div>

          <button
            onClick={handleSearch}
            className="w-full bg-[#FFC300] hover:bg-[#E6B000] text-[#111] font-black py-3 sm:py-3.5 rounded-xl flex items-center justify-center gap-2 text-xs sm:text-sm transition-colors shadow-[0_4px_16px_rgba(255,195,0,0.4)]"
          >
            {loading ? <Loader2 size={18} className="animate-spin" /> : <Search size={18} />}
            Cerca Pneumatici
          </button>

          {/* Misure popolari — solo nel tab misura */}
          <div className="pt-3 border-t border-[#f0f0f0]">
            <p className="text-[10px] font-black uppercase tracking-widest text-[#9DA5AE] mb-2">Misure popolari</p>
            <div className="grid grid-cols-3 gap-1.5">
              {POPULAR_SIZES.map((s) => {
                const [wh, r] = s.split(" ");
                const [w, h] = wh.split("/");
                return (
                  <button
                    key={s}
                    onClick={() => router.push(`/prodotti?larghezza=${w}&altezza=${h}&diametro=${r.replace("R","")}`)}
                    className="text-[11px] font-mono font-semibold px-2 py-1.5 rounded-lg border border-[#E5E7EB] text-[#555] hover:border-[#FFC300] hover:text-[#111] transition-colors text-center"
                  >
                    {s}
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      ) : (
        <VehicleSearch />
      )}
    </div>
  );
}
