import type { MetadataRoute } from "next";

const BASE = "https://spieziatyres.it";

const STATIC_ROUTES = [
  { url: `${BASE}/`,          priority: 1.0,  changeFrequency: "weekly"  },
  { url: `${BASE}/prodotti`,  priority: 0.9,  changeFrequency: "daily"   },
  { url: `${BASE}/chi-siamo`, priority: 0.7,  changeFrequency: "monthly" },
  { url: `${BASE}/contatti`,  priority: 0.8,  changeFrequency: "monthly" },
  { url: `${BASE}/privacy`,   priority: 0.3,  changeFrequency: "yearly"  },
  { url: `${BASE}/termini`,   priority: 0.3,  changeFrequency: "yearly"  },
] as MetadataRoute.Sitemap;

export default function sitemap(): MetadataRoute.Sitemap {
  return STATIC_ROUTES;
}
