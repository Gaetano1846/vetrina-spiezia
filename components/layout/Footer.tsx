import Link from "next/link";
import Image from "next/image";
import { Phone, Mail, MapPin, Clock } from "lucide-react";

const SEDI = [
  {
    city: "Nola",
    address: "Via Croce Del Papa 27/29",
    maps: "https://www.google.com/maps/dir//Via+Croce+del+Papa,+27%2F29,+80035+Nola+NA/@40.9301147,14.428379,12z/data=!4m8!4m7!1m0!1m5!1m1!1s0x133bb21ae5ac3e1d:0x816d8c387b2451ee!2m2!1d14.5107798!2d40.930144?entry=ttu",
  },
  {
    city: "Volla",
    address: "Via Palazziello, 73",
    maps: "https://www.google.com/maps/dir/40.9292509,14.5072726/spiezia+tyres+volla/@40.9191238,14.2492527,11z/data=!3m1!4b1!4m9!4m8!1m1!4e1!1m5!1m1!1s0x133ba8f1823dabbb:0x5593c595afb22bd8!2m2!1d14.3416487!2d40.8875763?entry=ttu&g_ep=EgoyMDI1MDkxMC4wIKXMDSoASAFQAw%3D%3D",
  },
  {
    city: "Portici",
    address: "Via S. Cristoforo, 93",
    maps: "https://www.google.com/maps?rlz=1C1ONGR_itIT1037IT1037&sxsrf=AB5stBjW_3CCfdtN8rqX-bEFmtDjE_6cKg:1690991235852&uact=5&gs_lp=Egxnd3Mtd2l6LXNlcnAiFXNwaWV6aWEgdHlyZXMgcG9ydGljaTIHECMYigUYJzILEC4YgAQYxwEYrwEyAhAmMhoQLhiABBjHARivARiXBRjcBBjeBBjgBNgBAUiRDFDEBFjLCnACeAGQAQCYAXmgAfYFqgEDMC43uAEDyAEA-AEBwgIKEAAYRxjWBBiwA8ICBBAjGCfCAhAQLhiABBgUGIcCGMcBGK8BwgIJEAAYFhgeGPEEwgIGEAAYFhgewgIfEC4YgAQYFBiHAhjHARivARiXBRjcBBjeBBjgBNgBAeIDBBgAIEGIBgGQBga6BgYIARABGBQ&um=1&ie=UTF-8&fb=1&gl=it&sa=X&geocode=KceqU7appzsTMcu6GU8hZOw3&daddr=Via+S.+Cristoforo,+93,+80055+Portici+NA",
  },
  {
    city: "Fiano Romano",
    address: "Via Procoio, 41A",
    maps: "https://www.google.com/maps/place/Via+Procoio,+41,+00065+Fiano+Romano+RM/@42.1560406,12.6166334,18z/data=!3m1!4b1!4m6!3m5!1s0x132f6d59d6ec1a2b:0xa6164bc7110fcd44!8m2!3d42.1560394!4d12.6180815!16s%2Fg%2F11k5jpbngn?entry=tts",
  },
];

const LINKS_SERVIZI = [
  { label: "Pneumatici",              href: "/prodotti" },
  { label: "Pneumatici Invernali",    href: "/prodotti?stagioni=Invernali" },
  { label: "Pneumatici Estivi",       href: "/prodotti?stagioni=Estive" },
  { label: "Pneumatici 4 Stagioni",   href: "/prodotti?stagioni=4-Stagioni" },
  { label: "Convergenza e geometria", href: "/chi-siamo" },
  { label: "Cambio olio e filtri",    href: "/chi-siamo" },
  { label: "Revisione auto",          href: "/chi-siamo" },
];

export default function Footer() {
  return (
    <footer className="bg-white border-t border-[#E5E7EB]">

      {/* Main section — light background */}
      <div className="max-w-8xl mx-auto px-4 sm:px-6 py-14">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10">

          {/* Brand */}
          <div className="sm:col-span-2 lg:col-span-1">
            <div className="mb-4">
              <Image
                src="/logo-spiezia.png"
                alt="Spiezia Tyres S.p.A."
                width={160}
                height={48}
                className="h-10 w-auto object-contain mix-blend-multiply"
              />
            </div>
            <p className="text-sm text-[#57636C] leading-relaxed mb-5">
              Officina specializzata in pneumatici e meccanica leggera. 4 sedi tra Campania e Lazio, oltre 30 anni di esperienza.
            </p>
            <div className="space-y-2 text-sm">
              <a href="tel:+390815115011" className="flex items-center gap-2 text-[#57636C] hover:text-[#FFC300] transition-colors font-medium">
                <Phone size={14} className="text-[#FFC300]" /> +39 081 511 5011
              </a>
              <a href="mailto:info@spieziatyres.it" className="flex items-center gap-2 text-[#57636C] hover:text-[#FFC300] transition-colors">
                <Mail size={14} className="text-[#FFC300]" /> info@spieziatyres.it
              </a>
            </div>
          </div>

          {/* Servizi */}
          <div>
            <h4 className="text-[#001D3D] text-xs font-black uppercase tracking-widest mb-5">Servizi</h4>
            <ul className="space-y-2.5">
              {LINKS_SERVIZI.map((l, i) => (
                <li key={i}>
                  <Link href={l.href} className="text-sm text-[#57636C] hover:text-[#001D3D] transition-colors flex items-center gap-1.5 group">
                    <span className="w-1 h-1 rounded-full bg-[#FFC300] flex-shrink-0 group-hover:scale-125 transition-transform" />
                    {l.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Le nostre sedi */}
          <div>
            <h4 className="text-[#001D3D] text-xs font-black uppercase tracking-widest mb-5">Le nostre sedi</h4>
            <div className="space-y-4">
              {SEDI.map((s) => (
                <div key={s.city} className="group">
                  <div className="flex items-center gap-1.5 mb-0.5">
                    <MapPin size={12} className="text-[#FFC300] flex-shrink-0" />
                    <p className="text-sm text-[#001D3D] font-semibold">{s.city}</p>
                  </div>
                  <p className="text-xs text-[#9DA5AE] mb-1 pl-[18px]">{s.address}</p>
                  <a
                    href={s.maps}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-[11px] font-medium text-[#FFC300] hover:text-[#001D3D] transition-colors pl-[18px]"
                  >
                    Indica via Maps →
                  </a>
                </div>
              ))}
            </div>
          </div>

          {/* Orari */}
          <div>
            <h4 className="text-[#001D3D] text-xs font-black uppercase tracking-widest mb-5">Orari apertura</h4>
            <div className="space-y-2">
              <div className="flex items-center justify-between text-sm">
                <span className="text-[#57636C] flex items-center gap-1.5">
                  <Clock size={12} className="text-[#9DA5AE]" /> Lun – Ven
                </span>
                <span className="text-[#001D3D] font-semibold">08:30 – 18:30</span>
              </div>
              <div className="flex items-center justify-between text-sm">
                <span className="text-[#57636C] flex items-center gap-1.5">
                  <Clock size={12} className="text-[#9DA5AE]" /> Sabato
                </span>
                <span className="text-[#001D3D] font-semibold">08:30 – 13:00</span>
              </div>
              <div className="flex items-center justify-between text-sm">
                <span className="text-[#57636C] flex items-center gap-1.5">
                  <Clock size={12} className="text-[#D1D5DB]" /> Domenica
                </span>
                <span className="text-[#9DA5AE]">Chiuso</span>
              </div>
            </div>

            {/* CTA prenota */}
            <div className="mt-5 rounded-xl bg-[#FFF8DC] border border-[#FFC300]/40 p-4">
              <p className="text-sm font-black text-[#111827] mb-0.5">Prenota in 1 minuto</p>
              <p className="text-xs text-[#57636C] leading-relaxed mb-3">
                Nessun anticipo. Confermi prezzo e paghi in sede.
              </p>
              <Link
                href="/checkout"
                className="block w-full text-center text-xs font-black bg-[#FFC300] text-[#111827] rounded-lg py-2.5 hover:bg-[#FFD54F] transition-colors"
              >
                Prenota online →
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom bar */}
      <div className="border-t border-[#E5E7EB] bg-[#F8F9FB]">
        <div className="max-w-8xl mx-auto px-4 sm:px-6 py-4 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-[#9DA5AE]">
          <p>© {new Date().getFullYear()} Spiezia Tyres S.p.A. · P.IVA IT07737141213 · Tutti i diritti riservati</p>
          <div className="flex items-center gap-4">
            <Link href="/chi-siamo" className="hover:text-[#001D3D] transition-colors">Chi siamo</Link>
            <Link href="/termini" className="hover:text-[#001D3D] transition-colors">Termini</Link>
            <Link href="/privacy" className="hover:text-[#001D3D] transition-colors">Privacy</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
