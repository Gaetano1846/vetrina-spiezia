import type { Metadata } from "next";
import Link from "next/link";
import { MapPin, Phone, Mail, Clock, CalendarCheck, ChevronRight } from "lucide-react";

export const metadata: Metadata = {
  title: "Contatti — Spiezia Tyres S.p.A.",
  description: "Contatta Spiezia Tyres S.p.A. — 4 sedi tra Campania e Lazio. Chiama, scrivi o prenota online il tuo appuntamento per pneumatici e meccanica leggera.",
};

const LOCATIONS = [
  {
    city: "Nola",
    address: "Via Croce Del Papa 27/29",
    tel: "+39 081 511 5011",
    maps: "https://www.google.com/maps/dir//Via+Croce+del+Papa,+27%2F29,+80035+Nola+NA/@40.9301147,14.428379,12z/data=!4m8!4m7!1m0!1m5!1m1!1s0x133bb21ae5ac3e1d:0x816d8c387b2451ee!2m2!1d14.5107798!2d40.930144?entry=ttu",
  },
  {
    city: "Volla",
    address: "Via Palazziello, 73",
    tel: "+39 081 511 5011",
    maps: "https://www.google.com/maps/dir/40.9292509,14.5072726/spiezia+tyres+volla/@40.9191238,14.2492527,11z/data=!3m1!4b1!4m9!4m8!1m1!4e1!1m5!1m1!1s0x133ba8f1823dabbb:0x5593c595afb22bd8!2m2!1d14.3416487!2d40.8875763?entry=ttu&g_ep=EgoyMDI1MDkxMC4wIKXMDSoASAFQAw%3D%3D",
  },
  {
    city: "Portici",
    address: "Via S. Cristoforo, 93",
    tel: "+39 081 511 5011",
    maps: "https://www.google.com/maps?rlz=1C1ONGR_itIT1037IT1037&sxsrf=AB5stBjW_3CCfdtN8rqX-bEFmtDjE_6cKg:1690991235852&uact=5&gs_lp=Egxnd3Mtd2l6LXNlcnAiFXNwaWV6aWEgdHlyZXMgcG9ydGljaTIHECMYigUYJzILEC4YgAQYxwEYrwEyAhAmMhoQLhiABBjHARivARiXBRjcBBjeBBjgBNgBAUiRDFDEBFjLCnACeAGQAQCYAXmgAfYFqgEDMC43uAEDyAEA-AEBwgIKEAAYRxjWBBiwA8ICBBAjGCfCAhAQLhiABBgUGIcCGMcBGK8BwgIJEAAYFhgeGPEEwgIGEAAYFhgewgIfEC4YgAQYFBiHAhjHARivARiXBRjcBBjeBBjgBNgBAeIDBBgAIEGIBgGQBga6BgYIARABGBQ&um=1&ie=UTF-8&fb=1&gl=it&sa=X&geocode=KceqU7appzsTMcu6GU8hZOw3&daddr=Via+S.+Cristoforo,+93,+80055+Portici+NA",
  },
  {
    city: "Fiano Romano",
    address: "Via Procoio, 41A",
    tel: "+39 081 511 5011",
    maps: "https://www.google.com/maps/place/Via+Procoio,+41,+00065+Fiano+Romano+RM/@42.1560406,12.6166334,18z/data=!3m1!4b1!4m6!3m5!1s0x132f6d59d6ec1a2b:0xa6164bc7110fcd44!8m2!3d42.1560394!4d12.6180815!16s%2Fg%2F11k5jpbngn?entry=tts",
  },
];

const SERVICES = [
  "Vendita pneumatici estivi, invernali e 4 stagioni",
  "Montaggio e bilanciamento gomme",
  "Convergenza e geometria",
  "Cambio olio e filtri",
  "Sostituzione filtri auto",
  "Revisione auto",
];

export default function ContattiPage() {
  return (
    <div className="bg-white">

      {/* ── Hero ── */}
      <section className="relative overflow-hidden border-b border-[#E5E7EB]">
        <div
          className="absolute inset-0 bg-cover bg-center bg-no-repeat"
          style={{ backgroundImage: "url('/hero-contatti.png')" }}
        />
        <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/50 to-transparent" />
        <div className="relative max-w-8xl mx-auto px-4 sm:px-6 py-12 sm:py-28">
          <div className="inline-flex items-center gap-2 bg-[#FFC300]/20 border border-[#FFC300]/40 rounded-full px-4 py-1.5 mb-5">
            <span className="w-1.5 h-1.5 rounded-full bg-[#FFC300]" />
            <span className="text-xs font-bold text-[#FFC300] uppercase tracking-widest">Contatti</span>
          </div>
          <h1 className="text-3xl sm:text-5xl font-black text-white mb-4 leading-tight">
            Siamo qui per aiutarti.
          </h1>
          <p className="text-white/70 text-base sm:text-lg leading-relaxed max-w-xl mb-8">
            Spiezia Tyres S.p.A. — oltre 30 anni di esperienza in pneumatici e meccanica leggera.
            4 sedi tra Campania e Lazio al tuo servizio.
          </p>
          <div className="flex flex-wrap gap-3">
            <a href="tel:+390815115011" className="btn-gold inline-flex items-center gap-2">
              <Phone size={15} /> Chiamaci ora
            </a>
            <Link href="/checkout" className="inline-flex items-center justify-center gap-2 px-5 py-2.5 text-sm font-bold rounded-lg border border-white/40 text-white hover:bg-white/10 transition-colors">
              <CalendarCheck size={15} /> Prenota online
            </Link>
          </div>
        </div>
      </section>

      {/* ── Contatti rapidi ── */}
      <section className="py-14 border-b border-[#E5E7EB]">
        <div className="max-w-8xl mx-auto px-4 sm:px-6">
          <div className="grid sm:grid-cols-2 gap-5 max-w-2xl">

            <a href="tel:+390815115011" className="group flex items-start gap-4 p-5 rounded-2xl border border-[#E5E7EB] hover:border-[#FFC300]/50 hover:bg-[#FFFBEB] transition-all">
              <div className="w-10 h-10 bg-[#FFC300]/10 rounded-xl flex items-center justify-center flex-shrink-0 group-hover:bg-[#FFC300]/20 transition-colors">
                <Phone size={18} className="text-[#92700A]" />
              </div>
              <div>
                <p className="text-xs font-black uppercase tracking-widest text-[#9DA5AE] mb-0.5">Telefono</p>
                <p className="font-bold text-[#111827] text-sm">+39 081 511 5011</p>
                <p className="text-xs text-[#57636C] mt-0.5">Lun–Ven 08:30–13:30, 14:30–19:00 · Sab 08:30–13:30</p>
              </div>
            </a>

            <a href="mailto:info@spieziatyres.it" className="group flex items-start gap-4 p-5 rounded-2xl border border-[#E5E7EB] hover:border-[#FFC300]/50 hover:bg-[#FFFBEB] transition-all">
              <div className="w-10 h-10 bg-[#FFC300]/10 rounded-xl flex items-center justify-center flex-shrink-0 group-hover:bg-[#FFC300]/20 transition-colors">
                <Mail size={18} className="text-[#92700A]" />
              </div>
              <div>
                <p className="text-xs font-black uppercase tracking-widest text-[#9DA5AE] mb-0.5">Email</p>
                <p className="font-bold text-[#111827] text-sm">info@spieziatyres.it</p>
                <p className="text-xs text-[#57636C] mt-0.5">Risponderemo il prima possibile</p>
              </div>
            </a>

          </div>
        </div>
      </section>

      {/* ── Sedi ── */}
      <section className="py-14 border-b border-[#E5E7EB]">
        <div className="max-w-8xl mx-auto px-4 sm:px-6">
          <h2 className="text-2xl font-black text-[#111827] mb-2">Le nostre sedi</h2>
          <p className="text-sm text-[#57636C] mb-8">Vieni a trovarci in una delle nostre officine.</p>

          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {LOCATIONS.map((loc) => (
              <div key={loc.city} className="bg-[#F8F9FB] rounded-2xl p-5 border border-[#E5E7EB] flex flex-col gap-3">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 bg-[#FFC300] rounded-lg flex items-center justify-center flex-shrink-0">
                    <MapPin size={15} className="text-[#111827]" />
                  </div>
                  <h3 className="font-black text-[#111827]">{loc.city}</h3>
                </div>
                <p className="text-sm text-[#57636C]">{loc.address}</p>
                <div className="flex flex-col gap-1.5 pt-2 border-t border-[#E5E7EB] mt-auto">
                  <a href={`tel:${loc.tel.replace(/\s/g, "")}`}
                     className="flex items-center gap-1.5 text-xs text-[#57636C] hover:text-[#92700A] transition-colors font-medium">
                    <Phone size={11} className="text-[#FFC300]" /> {loc.tel}
                  </a>
                  <a href={loc.maps} target="_blank" rel="noopener noreferrer"
                     className="flex items-center gap-1.5 text-xs text-[#FFC300] hover:text-[#92700A] transition-colors font-semibold">
                    <MapPin size={11} /> Indicazioni stradali →
                  </a>
                </div>
              </div>
            ))}
          </div>

          {/* Orari */}
          <div className="mt-8 flex items-start gap-4 p-5 bg-[#F8F9FB] rounded-2xl border border-[#E5E7EB] max-w-sm">
            <div className="w-9 h-9 bg-[#FFC300]/10 rounded-xl flex items-center justify-center flex-shrink-0">
              <Clock size={16} className="text-[#92700A]" />
            </div>
            <div>
              <p className="text-xs font-black uppercase tracking-widest text-[#9DA5AE] mb-2">Orari di apertura</p>
              <div className="space-y-1 text-sm">
                <div className="flex justify-between gap-8">
                  <span className="text-[#57636C]">Lunedì – Venerdì</span>
                  <span className="font-semibold text-[#111827] text-right leading-relaxed">08:30 – 13:30<br/>14:30 – 19:00</span>
                </div>
                <div className="flex justify-between gap-8">
                  <span className="text-[#57636C]">Sabato</span>
                  <span className="font-semibold text-[#111827]">08:30 – 13:30</span>
                </div>
                <div className="flex justify-between gap-8">
                  <span className="text-[#57636C]">Domenica</span>
                  <span className="font-semibold text-[#9DA5AE]">Chiuso</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── Chi siamo + servizi ── */}
      <section className="py-14 border-b border-[#E5E7EB]">
        <div className="max-w-8xl mx-auto px-4 sm:px-6">
          <div className="grid lg:grid-cols-2 gap-14 items-start">

            <div>
              <h2 className="text-2xl font-black text-[#111827] mb-4">Chi siamo</h2>
              <p className="text-[#57636C] leading-relaxed mb-4">
                Spiezia Tyres S.p.A. è uno dei principali specialisti di pneumatici del Centro-Sud Italia.
                Nata in Campania, l&apos;azienda ha costruito in oltre 30 anni una reputazione solida
                basata su qualità, competenza e servizio al cliente.
              </p>
              <p className="text-[#57636C] leading-relaxed mb-6">
                Trattiamo solo pneumatici dei migliori brand mondiali — Michelin, Pirelli, Continental,
                Bridgestone e molti altri — e offriamo anche servizi di meccanica leggera nelle nostre
                4 officine equipaggiate.
              </p>
              <Link href="/chi-siamo" className="inline-flex items-center gap-1.5 text-sm font-bold text-[#FFC300] hover:text-[#92700A] transition-colors">
                Scopri la nostra storia <ChevronRight size={15} />
              </Link>
            </div>

            <div>
              <h2 className="text-2xl font-black text-[#111827] mb-4">Cosa facciamo</h2>
              <ul className="space-y-2.5">
                {SERVICES.map((s) => (
                  <li key={s} className="flex items-center gap-3 text-sm text-[#57636C]">
                    <span className="w-1.5 h-1.5 rounded-full bg-[#FFC300] flex-shrink-0" />
                    {s}
                  </li>
                ))}
              </ul>
              <div className="mt-6">
                <Link href="/prodotti" className="btn-gold inline-flex items-center gap-2">
                  Sfoglia il catalogo
                </Link>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* ── CTA prenotazione ── */}
      <section className="py-14">
        <div className="max-w-8xl mx-auto px-4 sm:px-6">
          <div className="bg-[#FFFBEB] border border-[#FFC300]/40 rounded-2xl px-8 py-10 max-w-2xl">
            <CalendarCheck size={24} className="text-[#92700A] mb-4" />
            <h2 className="text-xl font-black text-[#111827] mb-2">Prenota il tuo appuntamento</h2>
            <p className="text-sm text-[#57636C] leading-relaxed mb-6">
              Scegli le gomme online, prenota la sede e l&apos;orario che preferisci.
              Nessun anticipo richiesto — confermi il prezzo e paghi direttamente in officina.
            </p>
            <div className="flex flex-wrap gap-3">
              <Link href="/checkout" className="btn-gold inline-flex items-center gap-2">
                <CalendarCheck size={15} /> Prenota online
              </Link>
              <a href="tel:+390815115011" className="btn-outline-navy inline-flex items-center gap-2">
                <Phone size={15} /> Chiamaci
              </a>
            </div>
          </div>
        </div>
      </section>

    </div>
  );
}
