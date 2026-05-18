"use client";
import { ArrowUpDown } from "lucide-react";

interface Props {
  currentSort: string;
  currentParams: Record<string, string>;
}

export default function SortSelect({ currentSort, currentParams }: Props) {
  function handleChange(e: React.ChangeEvent<HTMLSelectElement>) {
    const params = new URLSearchParams(currentParams);
    if (e.target.value) params.set("sortByPrice", e.target.value);
    else params.delete("sortByPrice");
    params.delete("page");
    window.location.href = `/prodotti?${params.toString()}`;
  }

  return (
    <div className="flex items-center gap-2">
      <ArrowUpDown size={14} className="text-[#9DA5AE]" />
      <select
        defaultValue={currentSort}
        onChange={handleChange}
        className="text-xs font-semibold border border-[#E5E7EB] rounded-lg px-3 py-1.5 focus:outline-none focus:border-[#001D3D] appearance-none bg-white text-[#001D3D] transition-colors"
      >
        <option value="">Rilevanza</option>
        <option value="asc">Prezzo crescente</option>
        <option value="desc">Prezzo decrescente</option>
      </select>
    </div>
  );
}
