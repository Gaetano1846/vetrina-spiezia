import { NextRequest, NextResponse } from "next/server";
import https from "https";

const BASE = "https://tyresaddict.ru/api/fitment";
const API_KEY = process.env.NEXT_PUBLIC_TYRESADDICT_KEY ?? "3e9aace9642e6f9183e7203484e9643b47932cc9";

const agent = new https.Agent({ rejectUnauthorized: false });

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
