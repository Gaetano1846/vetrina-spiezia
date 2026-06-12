import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      { protocol: "https", hostname: "**.tyre-shopping.com" },
      { protocol: "https", hostname: "**.tyresbay.net" },
      { protocol: "https", hostname: "**.tyres.net" },
      { protocol: "https", hostname: "firebasestorage.googleapis.com" },
      { protocol: "https", hostname: "storage.googleapis.com" },
      // Broad fallback for product images from Algolia-indexed suppliers.
      // TODO: enumerate actual supplier CDN domains and remove this wildcard post-launch.
      { protocol: "https", hostname: "**" },
    ],
  },
  // URL SEO-friendly per gli archivi: l'utente vede /pneumatici-205-55-r16, /pneumatici-michelin,
  // /pneumatici-invernali; internamente sono serviti dalla route /archivio/[slug].
  async rewrites() {
    return [{ source: "/pneumatici-:slug", destination: "/archivio/:slug" }];
  },
  // Security header di base (difesa in profondità). NB: la CSP NON è qui — va introdotta a parte
  // in modalità Report-Only e testata (Google Maps iframe, PayPal/Klarna, Firebase, JSON-LD inline).
  async headers() {
    return [
      {
        source: "/:path*",
        headers: [
          // Forza HTTPS per 1 anno su dominio e sottodomini (ignorato su localhost/HTTP).
          { key: "Strict-Transport-Security", value: "max-age=31536000; includeSubDomains" },
          // Impedisce il MIME-sniffing dei tipi di risposta.
          { key: "X-Content-Type-Options", value: "nosniff" },
          // Anti-clickjacking: il sito non è incorporabile in iframe di terzi.
          { key: "X-Frame-Options", value: "SAMEORIGIN" },
          { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
          // La vetrina non usa camera/microfono/geolocalizzazione: disabilitati.
          { key: "Permissions-Policy", value: "camera=(), microphone=(), geolocation=()" },
        ],
      },
    ];
  },
};

export default nextConfig;
