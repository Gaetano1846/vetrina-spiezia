"use client";
import { useEffect } from "react";
import Link from "next/link";

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <div className="min-h-[60vh] flex flex-col items-center justify-center px-4 py-20 text-center">
      <p className="text-6xl font-black text-[#E5E7EB] leading-none mb-4">!</p>
      <h1 className="text-2xl font-black text-[#111] mb-2">Qualcosa è andato storto</h1>
      <p className="text-[#57636C] mb-8 max-w-sm">
        Si è verificato un errore inaspettato. Puoi riprovare o tornare alla home.
      </p>
      <div className="flex flex-wrap gap-3 justify-center">
        <button onClick={reset} className="btn-gold">Riprova</button>
        <Link href="/" className="btn-outline-navy">Torna alla home</Link>
      </div>
    </div>
  );
}
