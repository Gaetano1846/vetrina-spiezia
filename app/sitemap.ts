import type { MetadataRoute } from "next";
import { getAllProductIds } from "@/lib/algolia";
import { getArchiveSitemapPaths } from "@/lib/archivio";

const BASE = "https://spieziatyres.it";

// Rigenera la sitemap al massimo una volta al giorno (evita di interrogare Algolia a ogni richiesta).
export const revalidate = 86400;

const STATIC_ROUTES: MetadataRoute.Sitemap = [
  { url: `${BASE}/`,          priority: 1.0, changeFrequency: "weekly"  },
  { url: `${BASE}/prodotti`,  priority: 0.9, changeFrequency: "daily"   },
  { url: `${BASE}/offerte`,   priority: 0.9, changeFrequency: "daily"   },
  { url: `${BASE}/chi-siamo`, priority: 0.7, changeFrequency: "monthly" },
  { url: `${BASE}/contatti`,  priority: 0.8, changeFrequency: "monthly" },
  { url: `${BASE}/privacy`,   priority: 0.3, changeFrequency: "yearly"  },
  { url: `${BASE}/termini`,   priority: 0.3, changeFrequency: "yearly"  },
];

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  // Archivi SEO-friendly (misure, marche, stagioni, categorie) — alta priorità.
  let archiveRoutes: MetadataRoute.Sitemap = [];
  try {
    const paths = await getArchiveSitemapPaths();
    archiveRoutes = paths.map((p) => ({ url: `${BASE}${p}`, changeFrequency: "weekly", priority: 0.8 }));
  } catch (err) {
    console.error("[sitemap] impossibile generare gli archivi:", err);
  }

  let productRoutes: MetadataRoute.Sitemap = [];
  try {
    const ids = await getAllProductIds();
    productRoutes = ids.map((id) => ({
      url: `${BASE}/prodotto/${encodeURIComponent(id)}`,
      changeFrequency: "weekly",
      priority: 0.6,
    }));
  } catch (err) {
    console.error("[sitemap] impossibile caricare i prodotti:", err);
  }
  return [...STATIC_ROUTES, ...archiveRoutes, ...productRoutes];
}
