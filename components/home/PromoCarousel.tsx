"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { ChevronLeft, ChevronRight, ArrowRight, Tag } from "lucide-react";
import type { Promo } from "@/lib/promozioni";

const AUTOPLAY_MS = 5000;

export default function PromoCarousel({ promozioni }: { promozioni: Promo[] }) {
  const [index, setIndex] = useState(0);
  const [paused, setPaused] = useState(false);
  const touchStartX = useRef<number | null>(null);
  const count = promozioni.length;

  const go = useCallback(
    (n: number) => setIndex((i) => (n + count) % count),
    [count]
  );
  const next = useCallback(() => go(index + 1), [go, index]);
  const prev = useCallback(() => go(index - 1), [go, index]);

  // Autoplay (in pausa su hover o quando c'è una sola slide).
  useEffect(() => {
    if (paused || count <= 1) return;
    const t = setTimeout(() => setIndex((i) => (i + 1) % count), AUTOPLAY_MS);
    return () => clearTimeout(t);
  }, [index, paused, count]);

  if (count === 0) return null;

  return (
    <div
      className="relative"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
      role="region"
      aria-roledescription="carosello"
      aria-label="Promozioni in evidenza"
    >
      {/* Viewport */}
      <div
        className="overflow-hidden rounded-2xl"
        onTouchStart={(e) => (touchStartX.current = e.touches[0].clientX)}
        onTouchEnd={(e) => {
          if (touchStartX.current === null) return;
          const dx = e.changedTouches[0].clientX - touchStartX.current;
          if (Math.abs(dx) > 40) (dx < 0 ? next : prev)();
          touchStartX.current = null;
        }}
      >
        {/* Track */}
        <div
          className="flex transition-transform duration-500 ease-out"
          style={{ transform: `translateX(-${index * 100}%)` }}
        >
          {promozioni.map((promo) => (
            <Link
              key={promo.slug}
              href={`/promozioni/${promo.slug}`}
              className="group relative block w-full flex-shrink-0"
              aria-label={promo.title}
            >
              <div className="relative h-[280px] sm:h-[360px] lg:h-[420px] w-full overflow-hidden">
                {promo.image ? (
                  <Image
                    src={promo.image}
                    alt={promo.title}
                    fill
                    priority
                    className="object-cover object-center transition-transform duration-700 group-hover:scale-105"
                    sizes="(max-width:1280px) 100vw, 1280px"
                  />
                ) : (
                  /* Placeholder brandizzato finché non viene impostata l'immagine */
                  <div className={`absolute inset-0 bg-gradient-to-br ${promo.gradient}`}>
                    <div
                      className="absolute inset-0 opacity-[0.07]"
                      style={{
                        backgroundImage:
                          "repeating-linear-gradient(45deg,#fff 0,#fff 1px,transparent 1px,transparent 22px)",
                      }}
                    />
                    <div className="absolute top-4 right-4 inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white/10 backdrop-blur text-white/70 text-[11px] font-semibold">
                      <Tag size={12} /> Anteprima — immagine in arrivo
                    </div>
                  </div>
                )}

                {/* Overlay scuro per leggibilità del testo */}
                <div className="absolute inset-0 bg-gradient-to-r from-black/75 via-black/40 to-transparent" />

                {/* Contenuto */}
                <div className="absolute inset-0 flex flex-col justify-center p-6 sm:p-10 lg:p-14 max-w-2xl">
                  {promo.badge && (
                    <span className="inline-flex w-fit items-center gap-2 mb-3">
                      <span className="w-1 h-5 rounded-full bg-[#FFC300] flex-shrink-0" />
                      <span className="text-xs font-bold text-[#FFC300] uppercase tracking-widest">{promo.badge}</span>
                    </span>
                  )}
                  <h3 className="text-2xl sm:text-4xl font-black text-white leading-tight mb-2">
                    {promo.title}
                  </h3>
                  <p className="text-white/75 text-sm sm:text-lg leading-snug mb-5 max-w-md">
                    {promo.subtitle}
                  </p>
                  <span className="inline-flex w-fit items-center gap-2 px-5 py-2.5 rounded-lg bg-[#FFC300] text-[#111] text-sm font-bold group-hover:gap-3 transition-all">
                    {promo.ctaLabel} <ArrowRight size={16} />
                  </span>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>

      {/* Frecce (solo se più di una slide) */}
      {count > 1 && (
        <>
          <button
            type="button"
            onClick={prev}
            aria-label="Promozione precedente"
            className="absolute left-3 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-white/90 hover:bg-white text-[#111] flex items-center justify-center shadow-lg transition-colors z-10"
          >
            <ChevronLeft size={20} />
          </button>
          <button
            type="button"
            onClick={next}
            aria-label="Promozione successiva"
            className="absolute right-3 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-white/90 hover:bg-white text-[#111] flex items-center justify-center shadow-lg transition-colors z-10"
          >
            <ChevronRight size={20} />
          </button>

          {/* Dots */}
          <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex items-center gap-2 z-10">
            {promozioni.map((p, i) => (
              <button
                key={p.slug}
                type="button"
                onClick={() => go(i)}
                aria-label={`Vai alla promozione ${i + 1}`}
                aria-current={i === index}
                className={`h-2 rounded-full transition-all ${
                  i === index ? "w-7 bg-[#FFC300]" : "w-2 bg-white/50 hover:bg-white/80"
                }`}
              />
            ))}
          </div>
        </>
      )}
    </div>
  );
}
