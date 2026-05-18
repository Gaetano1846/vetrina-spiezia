import { NextRequest, NextResponse } from "next/server";
import https from "https";

const BASE = "https://tyresaddict.ru/api/fitment";
const API_KEY = process.env.TYRESADDICT_KEY;

// Why: tyresaddict.ru uses a self-signed cert that fails validation in Node on some hosts.
// Disabled only in non-production environments to avoid silently bypassing TLS in prod.
const agent = new https.Agent({
  rejectUnauthorized: process.env.NODE_ENV === "production",
});

function fetchUpstream(url: string): Promise<unknown> {
  return new Promise((resolve, reject) => {
    const req = https.get(url, { agent }, (res) => {
      const chunks: Buffer[] = [];
      res.on("data", (chunk: Buffer) => chunks.push(chunk));
      res.on("end", () => {
        try {
          resolve(JSON.parse(Buffer.concat(chunks).toString()));
        } catch {
          reject(new Error("Risposta non-JSON da tyresaddict"));
        }
      });
    });
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
  const segment = path.join("/");
  const incomingSearch = req.nextUrl.searchParams.toString();
  const sep = incomingSearch ? "&" : "";
  const url = `${BASE}/${segment}?api_key=${API_KEY}&api_version=1${sep}${incomingSearch}`;

  try {
    const json = await fetchUpstream(url);
    return NextResponse.json(json);
  } catch (err) {
    console.error("[tyresaddict proxy]", err);
    return NextResponse.json({ result: false, message: "Errore connessione al servizio veicoli" }, { status: 502 });
  }
}
