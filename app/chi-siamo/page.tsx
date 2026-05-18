import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { MapPin, Phone, Mail, CheckCircle, CalendarCheck, Shield, Clock } from "lucide-react";

export const metadata: Metadata = {
  title: "Chi Siamo — Spiezia Tyres S.p.A.",
  description: "Spiezia Tyres S.p.A. — oltre 30 anni di esperienza nella vendita e montaggio di pneumatici. 4 sedi in Campania e Lazio.",
};

const LOCATIONS = [
  { city: "Nola",         address: "Via Croce Del Papa 27/29", tel: "+39 081 511 5011", maps: "https://www.google.com/maps/dir//Via+Croce+del+Papa,+27%2F29,+80035+Nola+NA/@40.9301147,14.428379,12z/data=!4m8!4m7!1m0!1m5!1m1!1s0x133bb21ae5ac3e1d:0x816d8c387b2451ee!2m2!1d14.5107798!2d40.930144?entry=ttu" },
  { city: "Volla",        address: "Via Palazziello, 73",      tel: "+39 081 511 5011", maps: "https://www.google.com/maps/dir/40.9292509,14.5072726/spiezia+tyres+volla/@40.9191238,14.2492527,11z/data=!3m1!4b1!4m9!4m8!1m1!4e1!1m5!1m1!1s0x133ba8f1823dabbb:0x5593c595afb22bd8!2m2!1d14.3416487!2d40.8875763?entry=ttu&g_ep=EgoyMDI1MDkxMC4wIKXMDSoASAFQAw%3D%3D" },
  { city: "Portici",      address: "Via S. Cristoforo, 93",    tel: "+39 081 511 5011", maps: "https://www.google.com/maps?rlz=1C1ONGR_itIT1037IT1037&sxsrf=AB5stBjW_3CCfdtN8rqX-bEFmtDjE_6cKg:1690991235852&uact=5&gs_lp=Egxnd3Mtd2l6LXNlcnAiFXNwaWV6aWEgdHlyZXMgcG9ydGljaTIHECMYigUYJzILEC4YgAQYxwEYrwEyAhAmMhoQLhiABBjHARivARiXBRjcBBjeBBjgBNgBAUiRDFDEBFjLCnACeAGQAQCYAXmgAfYFqgEDMC43uAEDyAEA-AEBwgIKEAAYRxjWBBiwA8ICBBAjGCfCAhAQLhiABBgUGIcCGMcBGK8BwgIJEAAYFhgeGPEEwgIGEAAYFhgewgIfEC4YgAQYFBiHAhjHARivARiXBRjcBBjeBBjgBNgBAeIDBBgAIEGIBgGQBga6BgYIARABGBQ&um=1&ie=UTF-8&fb=1&gl=it&sa=X&geocode=KceqU7appzsTMcu6GU8hZOw3&daddr=Via+S.+Cristoforo,+93,+80055+Portici+NA" },
  { city: "Fiano Romano", address: "Via Procoio, 41A",         tel: "+39 081 511 5011", maps: "https://www.google.com/maps/place/Via+Procoio,+41,+00065+Fiano+Romano+RM/@42.1560406,12.6166334,18z/data=!3m1!4b1!4m6!3m5!1s0x132f6d59d6ec1a2b:0xa6164bc7110fcd44!8m2!3d42.1560394!4d12.6180815!16s%2Fg%2F11k5jpbngn?entry=tts" },
];

const VALUES = [
  { icon: Shield,        title: "Esperienza",   desc: "Oltre 30 anni nel settore pneumatici ci rendono un punto di riferimento affidabile per privati e aziende." },
  { icon: CheckCircle,   title: "Qualità",      desc: "Trattiamo solo pneumatici dei migliori brand mondiali: Michelin, Pirelli, Continental, Bridgestone e molti altri." },
  { icon: CalendarCheck, title: "Prenotazione", desc: "Prenota online in 1 minuto. Nessun pagamento anticipato — confermi il prezzo e paghi comodamente in sede." },
  { icon: Clock,         title: "Assistenza",   desc: "Il nostro team è disponibile per consigliarti la gomma giusta per il tuo veicolo e le tue esigenze di guida." },
];

export default function ChiSiamoPage() {
  return (
    <div className="bg-white">

      {/* ── Hero ── */}
      <section className="relative overflow-hidden">
        {/* Background image */}
        <div
          className="absolute inset-0 bg-cover bg-center bg-no-repeat"
          style={{ backgroundImage: "url('/hero-bg.png')" }}
        />
        {/* Overlay to ensure text readability on the left */}
        <div className="absolute inset-0 bg-gradient-to-r from-black/70 via-black/40 to-transparent" />

        <div className="relative max-w-8xl mx-auto px-4 sm:px-6 py-12 sm:py-28">
          <div className="max-w-xl">
            <div className="inline-flex items-center gap-2 bg-[#FFC300]/20 border border-[#FFC300]/40 rounded-full px-4 py-1.5 mb-6">
              <span className="w-1.5 h-1.5 rounded-full bg-[#FFC300]" />
              <span className="text-xs font-bold text-[#FFC300] uppercase tracking-widest">Chi siamo</span>
            </div>
            <h1 className="text-3xl sm:text-5xl font-black text-white mb-5 leading-tight">
              Spiezia Tyres<br />
              <span className="text-[#FFC300]">S.p.A.</span>
            </h1>
            <p className="text-white/70 text-base sm:text-lg leading-relaxed mb-8">
              Il tuo specialista di fiducia per pneumatici e meccanica leggera da oltre 30 anni.
              4 officine tra Campania e Lazio al tuo servizio.
            </p>
            <div className="flex flex-col sm:flex-row gap-3">
              <Link href="/prodotti" className="btn-gold">Sfoglia il catalogo</Link>
              <Link href="/checkout" className="inline-flex items-center justify-center px-5 py-2.5 text-sm font-bold rounded-lg border border-white/40 text-white hover:bg-white/10 transition-colors">
                Prenota un appuntamento
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* ── Storia ── */}
      <section className="py-12 sm:py-20 border-b border-[#E5E7EB]">
        <div className="max-w-8xl mx-auto px-4 sm:px-6">
          <div className="grid lg:grid-cols-2 gap-16 items-center">

            {/* Logo + testo */}
            <div>
              <Image
                src="/logo-lion.png"
                alt="Spiezia Tyres"
                width={280}
                height={280}
                className="w-28 sm:w-40 object-contain mb-4 sm:mb-8"
              />
              <h2 className="text-2xl sm:text-3xl font-black text-[#111827] mb-4 sm:mb-5 leading-tight">
                La nostra storia
              </h2>
              <p className="text-[#57636C] leading-relaxed mb-4">
                Nata in Campania, Spiezia Tyres S.p.A. è cresciuta fino a diventare uno dei principali
                specialisti di pneumatici del Centro-Sud Italia. Con 4 sedi operative tra Campania e Lazio,
                serviamo ogni anno migliaia di clienti privati e aziendali.
              </p>
              <p className="text-[#57636C] leading-relaxed mb-8">
                Grazie alla nostra piattaforma di prenotazione online puoi scegliere le gomme,
                prenotare l&apos;appuntamento nella sede più comoda e arrivare direttamente
                al montaggio — senza code, senza anticipi.
              </p>
              <Link href="/prodotti" className="btn-gold">Scopri il catalogo</Link>
            </div>

            {/* Value cards */}
            <div className="grid sm:grid-cols-2 gap-4">
              {VALUES.map(({ icon: Icon, title, desc }) => (
                <div key={title} className="bg-[#F8F9FB] rounded-2xl p-6 border border-[#E5E7EB] hover:border-[#FFC300]/40 transition-colors">
                  <div className="w-10 h-10 bg-[#FFC300]/10 rounded-xl flex items-center justify-center mb-4">
                    <Icon size={18} className="text-[#92700A]" />
                  </div>
                  <h3 className="font-black text-sm text-[#111827] uppercase tracking-wide mb-2">{title}</h3>
                  <p className="text-sm text-[#57636C] leading-relaxed">{desc}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ── Locations ── */}
      <section className="py-12 sm:py-20 bg-[#F8F9FB] border-b border-[#E5E7EB]">
        <div className="max-w-8xl mx-auto px-4 sm:px-6">
          <div className="text-center mb-12">
            <div className="inline-flex items-center gap-2 bg-[#FFC300]/10 border border-[#FFC300]/30 rounded-full px-4 py-1.5 mb-4">
              <span className="w-1.5 h-1.5 rounded-full bg-[#FFC300]" />
              <span className="text-xs font-bold text-[#92700A] uppercase tracking-widest">I nostri punti vendita</span>
            </div>
            <h2 className="text-3xl font-black text-[#111827]">4 sedi a tua disposizione</h2>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {LOCATIONS.map((loc) => (
              <div key={loc.city} className="bg-white rounded-2xl p-6 border border-[#E5E7EB] shadow-sm hover:shadow-md hover:border-[#FFC300]/40 transition-all">
                <div className="w-10 h-10 bg-[#FFC300] rounded-xl flex items-center justify-center mb-4">
                  <MapPin size={18} className="text-[#111827]" />
                </div>
                <h3 className="font-black text-[#111827] mb-1">{loc.city}</h3>
                <p className="text-sm text-[#57636C] mb-4">{loc.address}</p>
                <div className="flex flex-col gap-2 pt-3 border-t border-[#F1F4F8]">
                  <a
                    href={`tel:${loc.tel.replace(/\s/g, "")}`}
                    className="flex items-center gap-1.5 text-xs text-[#57636C] hover:text-[#92700A] transition-colors font-medium"
                  >
                    <Phone size={11} className="text-[#FFC300]" /> {loc.tel}
                  </a>
                  <a
                    href={loc.maps}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-1.5 text-xs text-[#57636C] hover:text-[#92700A] transition-colors font-medium"
                  >
                    <MapPin size={11} className="text-[#FFC300]" /> Indicazioni stradali →
                  </a>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── CTA ── */}
      <section className="py-10 sm:py-16 bg-white">
        <div className="max-w-8xl mx-auto px-4 sm:px-6">
          <div className="bg-[#F8F9FB] border border-[#E5E7EB] rounded-3xl px-8 py-12 text-center max-w-3xl mx-auto">
            <div className="w-14 h-14 bg-[#FFC300]/10 rounded-2xl flex items-center justify-center mx-auto mb-5">
              <CalendarCheck size={24} className="text-[#92700A]" />
            </div>
            <h2 className="text-2xl font-black text-[#111827] mb-3">Hai bisogno di assistenza?</h2>
            <p className="text-[#57636C] mb-7 leading-relaxed">
              Contattaci per un preventivo gratuito o prenota direttamente online.<br />
              Nessun pagamento anticipato richiesto.
            </p>
            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <a href="tel:+390815115011" className="btn-gold inline-flex items-center gap-2">
                <Phone size={15} /> Chiamaci
              </a>
              <Link href="/checkout" className="btn-outline-navy inline-flex items-center gap-2">
                <CalendarCheck size={15} /> Prenota online
              </Link>
            </div>
          </div>
        </div>
      </section>

    </div>
  );
}
