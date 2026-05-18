"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Search } from "lucide-react";
import { dimensionValues } from "@/lib/algolia";

export default function SizeSearchBar() {
  const router = useRouter();
  const [larghezze, setLarghezze] = useState<string[]>([]);
  const [altezze, setAltezze] = useState<string[]>([]);
  const [diametri, setDiametri] = useState<string[]>([]);
  const [L, setL] = useState("");
  const [A, setA] = useState("");
  const [D, setD] = useState("");

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
    const params = new URLSearchParams();
    if (L) params.set("larghezza", L);
    if (A) params.set("altezza", A);
    if (D) params.set("diametro", D);
    router.push(`/prodotti?${params.toString()}`);
  }

  const sel = "bg-white/10 text-white border-0 px-4 py-3.5 text-sm font-semibold focus:outline-none cursor-pointer appearance-none w-full placeholder:text-white/50";

  return (
    <div className="flex flex-col sm:flex-row gap-0 border-2 border-white/30 rounded-xl overflow-hidden max-w-2xl mx-auto backdrop-blur-sm">
      <select
        className={sel}
        value={L}
        onChange={(e) => { setL(e.target.value); setA(""); setD(""); }}
      >
        <option value="" className="text-[#001D3D] bg-white">Larghezza</option>
        {larghezze.map((v) => <option key={v} value={v} className="text-[#001D3D] bg-white">{v}</option>)}
      </select>
      <div className="hidden sm:block w-px bg-white/20" />
      <select
        className={`${sel} ${!L ? "opacity-50 cursor-not-allowed" : ""}`}
        value={A}
        onChange={(e) => { setA(e.target.value); setD(""); }}
        disabled={!L}
      >
        <option value="" className="text-[#001D3D] bg-white">Altezza</option>
        {altezze.map((v) => <option key={v} value={v} className="text-[#001D3D] bg-white">{v}</option>)}
      </select>
      <div className="hidden sm:block w-px bg-white/20" />
      <select
        className={`${sel} ${!A ? "opacity-50 cursor-not-allowed" : ""}`}
        value={D}
        onChange={(e) => setD(e.target.value)}
        disabled={!A}
      >
        <option value="" className="text-[#001D3D] bg-white">Diametro</option>
        {diametri.map((v) => <option key={v} value={v} className="text-[#001D3D] bg-white">R{v}</option>)}
      </select>
      <button
        onClick={handleSearch}
        className="bg-[#FFC300] text-[#001D3D] px-7 py-3.5 flex items-center justify-center gap-2 text-sm font-black hover:bg-[#FFD54F] transition-colors flex-shrink-0"
      >
        <Search size={16} /> Cerca
      </button>
    </div>
  );
}
