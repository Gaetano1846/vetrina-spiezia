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
};

export default nextConfig;
