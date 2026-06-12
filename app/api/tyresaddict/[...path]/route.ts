import { NextRequest, NextResponse } from "next/server";
import https from "https";

const BASE = "https://tyresaddict.ru/api/fitment";
const API_KEY = process.env.TYRESADDICT_KEY;

// Endpoint e parametri ESATTI usati da lib/tyresaddict.ts. Allowlist stretta: il proxy NON deve
// diventare un open-proxy verso l'API esterna né esporre la chiave a path/parametri arbitrari.
const ALLOWED_ENDPOINTS = new Set(["makes", "models", "model_years", "model_modifications", "fitment"]);
const ALLOWED_PARAMS = new Set(["make_id", "model_id", "year", "mod_id"]);

const TIMEOUT_MS = 8000;
const MAX_BYTES = 5 * 1024 * 1024; // 5 MB: le risposte sono piccole liste JSON

// tyresaddict.ru usa un cert self-signed che fallisce la validazione su alcuni host Node.
// La verifica TLS resta ATTIVA in produzione; il bypass è limitato allo sviluppo e SOLO a questa
// connessione (agent per-richiesta), mai globale.
const agent = new https.Agent({
  rejectUnauthorized: process.env.NODE_ENV === "production",
});

function fetchUpstream(url: string): Promise<unknown> {
  return new Promise((resolve, reject) => {
    const req = https.get(url, { agent }, (res) => {
      const status = res.statusCode ?? 0;
      if (status < 200 || status >= 300) {
        res.resume(); // drena la socket
        reject(new Error(`upstream ${status}`));
        return;
      }
      const chunks: Buffer[] = [];
      let total = 0;
      res.on("data", (chunk: Buffer) => {
        total += chunk.length;
        if (total > MAX_BYTES) { req.destroy(new Error("risposta troppo grande")); return; }
        chunks.push(chunk);
      });
      res.on("end", () => {
        try {
          resolve(JSON.parse(Buffer.concat(chunks).toString()));
        } catch {
          reject(new Error("Risposta non-JSON da tyresaddict"));
        }
      });
    });
    req.setTimeout(TIMEOUT_MS, () => req.destroy(new Error("timeout tyresaddict")));
    req.on("error", reject);
  });
}

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ path: string[] }> }
) {
  if (!API_KEY) {
    console.error("[tyresaddict proxy] TYRESADDICT_KEY env var not set");
    return NextResponse.json({ result: false, message: "Servizio veicoli non configurato" }, { status: 503 });
  }

  const { path } = await params;
  const endpoint = path?.[0];
  // Un solo segmento, in allowlist: niente path traversal o path arbitrari verso l'upstream.
  if (path.length !== 1 || !endpoint || !ALLOWED_ENDPOINTS.has(endpoint)) {
    return NextResponse.json({ result: false, message: "Endpoint non valido" }, { status: 400 });
  }

  // api_key/api_version SEMPRE lato server come primi parametri; dal client inoltriamo solo i
  // parametri attesi (whitelist) → niente parameter pollution né override della chiave.
  const qs = new URLSearchParams();
  qs.set("api_key", API_KEY);
  qs.set("api_version", "1");
  for (const [k, v] of req.nextUrl.searchParams) {
    if (ALLOWED_PARAMS.has(k)) qs.append(k, v);
  }
  const url = `${BASE}/${endpoint}?${qs.toString()}`;

  try {
    const json = await fetchUpstream(url);
    return NextResponse.json(json);
  } catch (err) {
    console.error("[tyresaddict proxy]", err);
    return NextResponse.json({ result: false, message: "Errore connessione al servizio veicoli" }, { status: 502 });
  }
}
