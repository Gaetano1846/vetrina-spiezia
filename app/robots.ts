import type { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        // Crawl budget hygiene: niente utility, paginazione e parametri di tracking.
        // Le viste filtrate "di valore" (?marche=, ?stagioni=, ?cat=, misura) restano crawlabili
        // e si auto-consolidano via canonical.
        disallow: [
          "/checkout",
          "/account",
          "/api/",
          "/archivio/", // route interna degli archivi (l'URL pubblico è /pneumatici-*)
          "/*?page=",
          "/*?sort=",
          "/*?utm_",
          "/*?gclid=",
          "/*?fbclid=",
        ],
      },
      // AI Search engines — consentiti per visibilità GEO (AI Overviews, ChatGPT, Perplexity, ecc.)
      {
        userAgent: [
          "GPTBot",
          "OAI-SearchBot",
          "ChatGPT-User",
          "ClaudeBot",
          "anthropic-ai",
          "Claude-SearchBot",
          "PerplexityBot",
          "Google-Extended",
          "CCBot",
          "Bytespider",
        ],
        allow: "/",
      },
    ],
    sitemap: "https://spieziatyres.it/sitemap.xml",
    host: "https://spieziatyres.it",
  };
}
