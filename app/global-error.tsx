"use client";
import { useEffect } from "react";

export default function GlobalError({
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
    <html lang="it">
      <body className="min-h-screen flex flex-col items-center justify-center bg-white px-4 py-20 text-center font-sans">
        <p className="text-7xl font-black" style={{ color: "#FFC300" }}>!</p>
        <h1 className="text-2xl font-black mt-4 mb-2" style={{ color: "#111" }}>
          Errore critico
        </h1>
        <p style={{ color: "#57636C" }} className="mb-8 max-w-sm">
          Si è verificato un errore grave. Ricarica la pagina o torna alla home.
        </p>
        <div className="flex gap-3">
          <button
            onClick={reset}
            style={{ background: "#FFC300", color: "#111", fontWeight: 900, padding: "10px 24px", borderRadius: "10px", border: "none", cursor: "pointer" }}
          >
            Riprova
          </button>
          <a
            href="/"
            style={{ border: "2px solid #111", color: "#111", fontWeight: 700, padding: "10px 24px", borderRadius: "10px", textDecoration: "none" }}
          >
            Home
          </a>
        </div>
      </body>
    </html>
  );
}
