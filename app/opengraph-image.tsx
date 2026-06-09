import { ImageResponse } from "next/og";

// OG image generata a runtime (convenzione file-based Next.js).
// Sostituisce il vecchio /og-image.png che era referenziato ma inesistente (404).
export const alt = "Spiezia Tyres S.p.A. — Pneumatici online, 4 sedi in Campania e Lazio";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function OpenGraphImage() {
  return new ImageResponse(
    (
      <div
        style={{
          height: "100%",
          width: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          background: "#0d0d0d",
          color: "#ffffff",
          padding: "90px",
          fontFamily: "sans-serif",
        }}
      >
        <div style={{ width: 72, height: 10, background: "#FFC300", borderRadius: 10, marginBottom: 36 }} />
        <div style={{ fontSize: 88, fontWeight: 800, lineHeight: 1.05, display: "flex" }}>
          Spiezia Tyres&nbsp;<span style={{ color: "#FFC300" }}>S.p.A.</span>
        </div>
        <div style={{ fontSize: 42, marginTop: 28, color: "#bdbdbd" }}>
          Pneumatici online per auto, SUV, moto e veicoli agricoli
        </div>
        <div style={{ fontSize: 30, marginTop: 40, color: "#FFC300", fontWeight: 700, display: "flex" }}>
          4 sedi · Nola · Volla · Portici · Fiano Romano
        </div>
      </div>
    ),
    { ...size }
  );
}
