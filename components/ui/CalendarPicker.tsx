"use client";
import { useState, useRef, useEffect } from "react";
import { ChevronLeft, ChevronRight, Calendar } from "lucide-react";

const WEEKDAYS = ["Lu", "Ma", "Me", "Gi", "Ve", "Sa", "Do"];
const MONTHS = [
  "Gennaio","Febbraio","Marzo","Aprile","Maggio","Giugno",
  "Luglio","Agosto","Settembre","Ottobre","Novembre","Dicembre",
];

type Props = {
  value: string;           // ISO yyyy-mm-dd
  onChange: (v: string) => void;
  min?: string;            // ISO yyyy-mm-dd
  className?: string;
};

function parseISO(s: string) {
  const [y, m, d] = s.split("-").map(Number);
  return new Date(y, m - 1, d);
}
function toISO(d: Date) {
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
}
function formatDisplay(iso: string) {
  if (!iso) return "";
  const d = parseISO(iso);
  return `${String(d.getDate()).padStart(2, "0")}/${String(d.getMonth() + 1).padStart(2, "0")}/${d.getFullYear()}`;
}

export default function CalendarPicker({ value, onChange, min, className = "" }: Props) {
  const today  = new Date();
  today.setHours(0, 0, 0, 0);
  const minDate = min ? parseISO(min) : today;

  const initMonth = value ? parseISO(value) : (minDate > today ? minDate : today);
  const [cursor, setCursor] = useState(new Date(initMonth.getFullYear(), initMonth.getMonth(), 1));
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handler(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    }
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  function prevMonth() {
    setCursor((c) => new Date(c.getFullYear(), c.getMonth() - 1, 1));
  }
  function nextMonth() {
    setCursor((c) => new Date(c.getFullYear(), c.getMonth() + 1, 1));
  }

  function buildDays() {
    const year  = cursor.getFullYear();
    const month = cursor.getMonth();
    const first = new Date(year, month, 1);
    const last  = new Date(year, month + 1, 0);
    // Monday-based: 0=Mo…6=Su
    let startDow = first.getDay() - 1;
    if (startDow < 0) startDow = 6;

    const days: { date: Date; currMonth: boolean }[] = [];
    // Fill leading days from prev month
    for (let i = startDow - 1; i >= 0; i--) {
      days.push({ date: new Date(year, month, -i), currMonth: false });
    }
    // Current month days
    for (let d = 1; d <= last.getDate(); d++) {
      days.push({ date: new Date(year, month, d), currMonth: true });
    }
    // Trailing days to complete the grid (multiples of 7)
    let trail = 1;
    while (days.length % 7 !== 0) {
      days.push({ date: new Date(year, month + 1, trail++), currMonth: false });
    }
    return days;
  }

  const days = buildDays();
  const selectedISO = value;

  // Disable prev month nav if cursor is already in min month
  const canGoPrev = cursor > new Date(minDate.getFullYear(), minDate.getMonth(), 1);

  return (
    <div ref={ref} className={`relative ${className}`}>
      {/* Trigger input */}
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        className="w-full flex items-center gap-3 border border-[#E5E7EB] rounded-lg px-4 py-2.5 text-sm bg-white hover:border-[#111] focus:outline-none focus:border-[#FFC300] focus:ring-2 focus:ring-[#FFC300]/20 transition-colors text-left"
      >
        <Calendar size={15} className="text-[#9DA5AE] flex-shrink-0" />
        <span className={value ? "text-[#111] font-semibold" : "text-[#9DA5AE]"}>
          {value ? formatDisplay(value) : "gg/mm/aaaa"}
        </span>
      </button>

      {/* Popover */}
      {open && (
        <div className="absolute z-50 mt-2 left-0 w-[300px] bg-white border border-[#E5E7EB] rounded-2xl shadow-xl overflow-hidden">
          {/* Header */}
          <div className="flex items-center justify-between px-4 py-3 bg-[#111]">
            <button
              type="button"
              onClick={prevMonth}
              disabled={!canGoPrev}
              className={`w-8 h-8 flex items-center justify-center rounded-lg transition-colors ${
                canGoPrev ? "text-white hover:bg-white/10" : "text-white/20 cursor-not-allowed"
              }`}
            >
              <ChevronLeft size={16} />
            </button>
            <span className="text-sm font-bold text-white capitalize">
              {MONTHS[cursor.getMonth()]} {cursor.getFullYear()}
            </span>
            <button
              type="button"
              onClick={nextMonth}
              className="w-8 h-8 flex items-center justify-center rounded-lg text-white hover:bg-white/10 transition-colors"
            >
              <ChevronRight size={16} />
            </button>
          </div>

          {/* Weekday labels */}
          <div className="grid grid-cols-7 border-b border-[#E5E7EB] bg-[#F1F4F8]">
            {WEEKDAYS.map((w) => (
              <div key={w} className="py-2 text-center text-[10px] font-bold uppercase tracking-widest text-[#9DA5AE]">
                {w}
              </div>
            ))}
          </div>

          {/* Days grid */}
          <div className="grid grid-cols-7 p-2 gap-0.5">
            {days.map(({ date, currMonth }, i) => {
              const iso        = toISO(date);
              const isToday    = iso === toISO(today);
              const isSelected = iso === selectedISO;
              const isPast     = date < minDate;
              const isOther    = !currMonth;
              const isSunday   = date.getDay() === 0;
              const isDisabled = isPast || isOther || isSunday;

              return (
                <button
                  key={i}
                  type="button"
                  disabled={isDisabled}
                  onClick={() => {
                    onChange(iso);
                    setOpen(false);
                  }}
                  title={isSunday && currMonth ? "Chiuso la domenica" : undefined}
                  className={`
                    w-full aspect-square flex items-center justify-center text-xs font-semibold rounded-lg transition-all
                    ${isSelected
                      ? "bg-[#FFC300] text-[#111] font-black shadow-sm"
                      : isToday && !isOther && !isSunday
                      ? "bg-[#111]/10 text-[#111] ring-1 ring-[#111]/30 font-black"
                      : isDisabled
                      ? "text-[#D4D4D4] cursor-not-allowed"
                      : "text-[#111] hover:bg-[#F1F4F8] cursor-pointer"
                    }
                  `}
                >
                  {date.getDate()}
                </button>
              );
            })}
          </div>

          {/* Footer */}
          <div className="flex items-center justify-between px-4 py-2.5 border-t border-[#E5E7EB] bg-[#F1F4F8]">
            <button
              type="button"
              onClick={() => { onChange(""); setOpen(false); }}
              className="text-xs text-[#9DA5AE] hover:text-[#57636C] transition-colors font-medium"
            >
              Cancella
            </button>
            <button
              type="button"
              onClick={() => {
                const t = toISO(today);
                if (today >= minDate) { onChange(t); setOpen(false); }
              }}
              disabled={today < minDate}
              className={`text-xs font-bold transition-colors ${
                today >= minDate ? "text-[#FFC300] hover:text-[#e6af00]" : "text-[#D4D4D4] cursor-not-allowed"
              }`}
            >
              Oggi
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
