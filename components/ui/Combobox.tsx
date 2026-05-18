"use client";
import { useEffect, useRef, useState } from "react";

type Props = {
  value: string;
  onChange: (v: string) => void;
  options: string[];
  popular?: string[];
  placeholder?: string;
  prefix?: string;
  disabled?: boolean;
};

export default function Combobox({
  value, onChange, options, popular = [], placeholder = "—", prefix, disabled,
}: Props) {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [activeIdx, setActiveIdx] = useState(-1);
  const containerRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const listRef = useRef<HTMLUListElement>(null);

  const displayValue = value ? (prefix ? `${prefix}${value}` : value) : "";

  const q = query.trim().toLowerCase();
  const popularOptions = options.length > 0 ? popular.filter((p) => options.includes(p)) : popular;
  const popularSet = new Set(popularOptions);
  const restOptions = options.filter((o) => !popularSet.has(o));
  const filtered: string[] = q ? options.filter((o) => o.toLowerCase().includes(q)) : [];
  const flatList: string[] = q ? filtered : [...popularOptions, ...restOptions];

  const select = (v: string) => { onChange(v); setQuery(""); setOpen(false); setActiveIdx(-1); };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (!open) {
      if (e.key === "Enter" || e.key === " " || e.key === "ArrowDown") { setOpen(true); e.preventDefault(); }
      return;
    }
    if (e.key === "Escape") { setOpen(false); setActiveIdx(-1); return; }
    if (e.key === "ArrowDown") { e.preventDefault(); setActiveIdx((i) => Math.min(i + 1, flatList.length - 1)); }
    else if (e.key === "ArrowUp") { e.preventDefault(); setActiveIdx((i) => Math.max(i - 1, 0)); }
    else if (e.key === "Enter") { e.preventDefault(); if (activeIdx >= 0 && flatList[activeIdx]) select(flatList[activeIdx]); }
  };

  useEffect(() => {
    if (activeIdx >= 0 && listRef.current) {
      const el = listRef.current.children[activeIdx] as HTMLElement | undefined;
      el?.scrollIntoView({ block: "nearest" });
    }
  }, [activeIdx]);

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setOpen(false); setActiveIdx(-1);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  const openPanel = () => {
    if (!disabled) {
      setOpen(true); setQuery(""); setActiveIdx(-1);
      setTimeout(() => inputRef.current?.focus(), 0);
    }
  };

  const rowClass = (o: string, idx: number) =>
    `px-3 py-1.5 text-sm cursor-pointer select-none transition-colors ${
      idx === activeIdx
        ? "bg-[#111] text-white"
        : o === value
        ? "bg-[#FFC300]/30 text-[#111] font-semibold"
        : "text-[#111] hover:bg-[#F5F5F5]"
    }`;

  return (
    <div ref={containerRef} className="relative" role="combobox" aria-expanded={open} aria-haspopup="listbox">

      {/* Trigger */}
      <div
        onClick={openPanel}
        onKeyDown={handleKeyDown}
        tabIndex={disabled ? -1 : 0}
        className={`
          flex items-center gap-1.5 w-full px-3 bg-white cursor-pointer outline-none
          border transition-colors duration-150
          ${disabled ? "border-[#E5E7EB] opacity-40 cursor-not-allowed" : "border-[#E5E7EB] hover:border-[#aaa]"}
          ${open ? "border-[#FFC300]" : ""}
        `}
        style={{ borderRadius: 4, minHeight: 40 }}
      >
        {!open && value ? (
          <span className="flex-1 min-w-0 text-sm font-medium text-[#111] truncate">{displayValue}</span>
        ) : !open ? (
          <span className="flex-1 text-sm text-[#aaa]">{placeholder}</span>
        ) : (
          <input
            ref={inputRef}
            className="flex-1 bg-transparent outline-none text-sm placeholder-[#aaa] min-w-0 text-[#111]"
            placeholder="Cerca…"
            value={query}
            onChange={(e) => { setQuery(e.target.value); setActiveIdx(-1); }}
            onKeyDown={handleKeyDown}
            autoFocus
            aria-autocomplete="list"
          />
        )}
        <svg
          className={`w-3.5 h-3.5 shrink-0 transition-transform duration-150 ${open ? "rotate-180 text-[#FFC300]" : "text-[#aaa]"}`}
          viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"
        >
          <path d="m6 9 6 6 6-6" />
        </svg>
      </div>

      {/* Dropdown */}
      {open && (
        <div className="absolute z-50 top-full left-0 right-0 mt-1 bg-white border border-[#E5E7EB] rounded-xl shadow-xl overflow-hidden">
          <ul ref={listRef} role="listbox" className="max-h-52 overflow-y-auto py-1">

            {flatList.length === 0 && (
              <li className="px-3 py-2 text-sm text-[#57636C]">Nessun risultato</li>
            )}

            {/* Sezione "Più popolari" */}
            {!q && popularOptions.length > 0 && (
              <>
                <li className="px-3 py-1 text-[10px] font-bold uppercase tracking-widest text-[#57636C] bg-[#F1F4F8]/60">
                  ⭐ Più popolari
                </li>
                {popularOptions.map((o, i) => (
                  <li
                    key={`pop-${i}-${o}`}
                    role="option"
                    aria-selected={o === value}
                    onMouseDown={() => select(o)}
                    onMouseEnter={() => setActiveIdx(i)}
                    className={rowClass(o, i)}
                  >
                    {prefix ? `${prefix}${o}` : o}
                  </li>
                ))}
                {restOptions.length > 0 && (
                  <li className="px-3 py-1 text-[10px] font-bold uppercase tracking-widest text-[#57636C] bg-[#F1F4F8]/60 mt-0.5">
                    Tutte le misure
                  </li>
                )}
              </>
            )}

            {/* Resto delle misure */}
            {!q && restOptions.map((o, i) => {
              const listIdx = popularOptions.length + i;
              return (
                <li
                  key={`all-${i}-${o}`}
                  role="option"
                  aria-selected={o === value}
                  onMouseDown={() => select(o)}
                  onMouseEnter={() => setActiveIdx(listIdx)}
                  className={rowClass(o, listIdx)}
                >
                  {prefix ? `${prefix}${o}` : o}
                </li>
              );
            })}

            {/* Risultati filtrati */}
            {q && filtered.map((o, i) => (
              <li
                key={`fil-${i}-${o}`}
                role="option"
                aria-selected={o === value}
                onMouseDown={() => select(o)}
                onMouseEnter={() => setActiveIdx(i)}
                className={rowClass(o, i)}
              >
                {prefix ? `${prefix}${o}` : o}
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}
