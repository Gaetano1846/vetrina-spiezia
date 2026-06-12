"use client";
import { ArrowUpDown } from "lucide-react";
import { useRouter } from "next/navigation";

interface Props {
  currentSort: string;
  currentParams: Record<string, string>;
}

export default function SortSelect({ currentSort, currentParams }: Props) {
  const router = useRouter();

  function handleChange(e: React.ChangeEvent<HTMLSelectElement>) {
    const params = new URLSearchParams(currentParams);
    // Sempre esplicito ("relevance"/"asc"/"desc") così lo stato è univoco e
    // viene propagato anche ai link di paginazione.
    params.set("sortByPrice", e.target.value);
    params.delete("page");
    router.push(`/prodotti?${params.toString()}`);
  }

  return (
    <div className="flex items-center gap-2 shrink-0">
      <ArrowUpDown size={14} className="text-[#9DA5AE]" />
      <select
        value={currentSort}
        onChange={handleChange}
        aria-label="Ordina i prodotti"
        className="text-xs font-semibold border border-[#E5E7EB] rounded-lg px-3 py-1.5 focus:outline-none focus:border-[#001D3D] appearance-none bg-white text-[#001D3D] transition-colors"
      >
        <option value="asc">Prezzo crescente</option>
        <option value="desc">Prezzo decrescente</option>
        <option value="relevance">Rilevanza</option>
      </select>
    </div>
  );
}
