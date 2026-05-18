import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import { MapPin, Search, Star, ArrowRight, Zap, Car, CalendarDays, ShoppingCart as ShoppingCart2 } from "lucide-react";
import HomeHero from "@/components/ui/HomeHero";

export const metadata: Metadata = {
  title: "Spiezia Tyres — Pneumatici Online | 4 Sedi Campania e Lazio",
  description: "Acquista pneumatici online da Spiezia Tyres S.p.A.: auto, SUV, moto e veicoli agricoli. 4 sedi in Campania e Lazio. Prezzi competitivi, montaggio express. Prenota subito.",
  openGraph: {
    title: "Spiezia Tyres — Pneumatici Online",
    description: "Oltre 30 anni di esperienza. Michelin, Pirelli, Continental, Bridgestone e molti altri. Prenota il montaggio in 1 minuto.",
  },
};

/* ─── Locations ─── */
const LOCATIONS = [
  { city: "Nola",         address: "Via Croce Del Papa 27/29", maps: "https://www.google.com/maps/dir//Via+Croce+del+Papa,+27%2F29,+80035+Nola+NA/@40.9301147,14.428379,12z/data=!4m8!4m7!1m0!1m5!1m1!1s0x133bb21ae5ac3e1d:0x816d8c387b2451ee!2m2!1d14.5107798!2d40.930144?entry=ttu" },
  { city: "Volla",        address: "Via Palazziello, 73",      maps: "https://www.google.com/maps/dir/40.9292509,14.5072726/spiezia+tyres+volla/@40.9191238,14.2492527,11z/data=!3m1!4b1!4m9!4m8!1m1!4e1!1m5!1m1!1s0x133ba8f1823dabbb:0x5593c595afb22bd8!2m2!1d14.3416487!2d40.8875763?entry=ttu&g_ep=EgoyMDI1MDkxMC4wIKXMDSoASAFQAw%3D%3D" },
  { city: "Portici",      address: "Via S. Cristoforo, 93",    maps: "https://www.google.com/maps?rlz=1C1ONGR_itIT1037IT1037&sxsrf=AB5stBjW_3CCfdtN8rqX-bEFmtDjE_6cKg:1690991235852&uact=5&gs_lp=Egxnd3Mtd2l6LXNlcnAiFXNwaWV6aWEgdHlyZXMgcG9ydGljaTIHECMYigUYJzILEC4YgAQYxwEYrwEyAhAmMhoQLhiABBjHARivARiXBRjcBBjeBBjgBNgBAUiRDFDEBFjLCnACeAGQAQCYAXmgAfYFqgEDMC43uAEDyAEA-AEBwgIKEAAYRxjWBBiwA8ICBBAjGCfCAhAQLhiABBgUGIcCGMcBGK8BwgIJEAAYFhgeGPEEwgIGEAAYFhgewgIfEC4YgAQYFBiHAhjHARivARiXBRjcBBjeBBjgBNgBAeIDBBgAIEGIBgGQBga6BgYIARABGBQ&um=1&ie=UTF-8&fb=1&gl=it&sa=X&geocode=KceqU7appzsTMcu6GU8hZOw3&daddr=Via+S.+Cristoforo,+93,+80055+Portici+NA" },
  { city: "Fiano Romano", address: "Via Procoio, 41A",         maps: "https://www.google.com/maps/place/Via+Procoio,+41,+00065+Fiano+Romano+RM/@42.1560406,12.6166334,18z/data=!3m1!4b1!4m6!3m5!1s0x132f6d59d6ec1a2b:0xa6164bc7110fcd44!8m2!3d42.1560394!4d12.6180815!16s%2Fg%2F11k5jpbngn?entry=tts" },
];

/* ─── Services ─── */
const SERVICES = [
  { title: "Convergenza Gomme",        desc: "Controlliamo la geometria del veicolo per assicurare che i pneumatici vengano utilizzati correttamente.", image: "/services/convergenza.png" },
  { title: "Sostituzione Filtri Auto", desc: "Affidati ai nostri esperti per garantire il corretto funzionamento del tuo veicolo e una maggiore efficienza dei filtri.", image: "/services/filtri.png" },
  { title: "Cambio Olio",              desc: "Offriamo servizi di controllo periodico dell'olio motore professionale ed affidabile per il tuo veicolo.", image: "/services/cambio-olio.png" },
  { title: "Revisione auto",           desc: "La revisione auto è fondamentale per la sicurezza stradale. Affidati ai nostri esperti per un controllo preciso.", image: "/services/revisione.png" },
];

/* ─── Testimonials ─── */
const REVIEWS = [
  { name: "Charlottina Di Chri", text: "Li consiglio! Prezzi davvero ottimi e gomme ottime! Mi hanno assistito telefonicamente tutte le volte che li contattavo e il montaggio è stato rapidissimo. Sono davvero efficienti, tornerò sicuramente qui! Bravissimi 👏" },
  { name: "Roberto Ruotolo",      text: "Personale cordiale, disponibile e molto professionale pronto a risolvere ogni problematica in tempi rapidi garantendo le massime prestazioni del proprio veicolo. Pneumatici dei migliori brand, tra cui Pirelli e Compasal a prezzi competitivi e vantaggiosi." },
  { name: "I-TEAM SOLUTION S.R.L.", text: "Prezzi e qualità dei servizi ottimo. Una struttura davvero enorme e dalla mole di clientela che si trova andando lì si capisce che nella zona sia molto quotato. Hanno personale davvero accogliente e gentilissimo con una sala d'attesa e il personale operativo davvero professionale e disponibili." },
];

export default function HomePage() {
  return (
    <>
      {/* ══════════════════════════════════════
          HERO — dark bg photo + white card
      ══════════════════════════════════════ */}
      <section className="relative min-h-[700px] flex items-center bg-[#111]">
        <div className="absolute inset-0 bg-gradient-to-br from-[#0a0a0a] via-[#1a1a1a] to-[#0d0d0d]" />
        <div className="absolute inset-0 opacity-20" style={{
          backgroundImage: "radial-gradient(circle at 20% 50%, #FFC300 0%, transparent 50%), radial-gradient(circle at 80% 20%, #FFC300 0%, transparent 40%)",
        }} />
        <div className="absolute inset-0 opacity-5" style={{
          backgroundImage: "repeating-linear-gradient(45deg, #fff 0px, #fff 1px, transparent 1px, transparent 20px), repeating-linear-gradient(-45deg, #fff 0px, #fff 1px, transparent 1px, transparent 20px)",
        }} />

        <div className="relative z-10 max-w-8xl mx-auto px-4 sm:px-6 py-6 sm:py-12 w-full">
          <div className="bg-white rounded-2xl shadow-[0_20px_80px_rgba(0,0,0,0.4)] overflow-hidden">
            <div className="grid lg:grid-cols-2">

              {/* ── LEFT: Brand + USPs + Locations ── */}
              <div className="p-5 sm:p-8 lg:p-10 border-b lg:border-b-0 lg:border-r border-[#f0f0f0] flex flex-col order-2 lg:order-1">

                <div className="hidden lg:flex items-center gap-4 mb-5 sm:mb-8">
                  <div className="w-1.5 h-14 bg-[#FFC300] rounded-full flex-shrink-0" />
                  <div>
                    <Image
                      src="/logo-spiezia.png"
                      alt="Spiezia Tyres S.p.A."
                      width={160}
                      height={48}
                      className="h-10 w-auto object-contain mix-blend-multiply mb-1"
                    />
                    <p className="text-xs font-bold text-[#9DA5AE] uppercase tracking-widest">Specialisti in pneumatici dal 1993</p>
                  </div>
                </div>

                {/* USPs */}
                <div className="grid grid-cols-2 gap-2 mb-6 sm:mb-8 content-start">
                  {[
                    { Icon: Car,          text: "Pneumatici per auto, SUV, moto e veicoli agricoli" },
                    { Icon: MapPin,       text: "4 sedi operative in Campania e Lazio" },
                    { Icon: Zap,          text: "Cambio gomme express in circa 30 minuti" },
                    { Icon: CalendarDays, text: "Prenota il tuo appuntamento online, gratis" },
                  ].map(({ Icon, text }) => (
                    <div key={text} className="flex flex-col items-start gap-2 px-2.5 py-3 sm:px-3 bg-[#F8F9FA] border border-[#eee] rounded-xl">
                      <div className="w-7 h-7 sm:w-8 sm:h-8 bg-[#FFC300]/15 rounded-lg flex items-center justify-center flex-shrink-0">
                        <Icon size={14} className="text-[#FFC300]" />
                      </div>
                      <p className="text-[11px] sm:text-sm font-semibold text-[#333] leading-snug">{text}</p>
                    </div>
                  ))}
                </div>

                {/* Locations */}
                <div>
                  <div className="flex items-center gap-2 mb-3">
                    <MapPin size={12} className="text-[#FFC300]" />
                    <p className="text-[10px] font-black uppercase tracking-widest text-[#9DA5AE]">Le nostre sedi</p>
                  </div>
                  <div className="grid grid-cols-2 gap-2">
                    {LOCATIONS.map((loc) => (
                      <a key={loc.city} href={loc.maps} target="_blank" rel="noopener noreferrer"
                        className="flex items-center gap-2 px-3 py-2.5 bg-[#F8F9FA] border border-[#eee] rounded-xl hover:border-[#FFC300] hover:bg-[#fffbeb] transition-all group">
                        <div className="w-1.5 h-1.5 rounded-full bg-[#FFC300] flex-shrink-0 group-hover:scale-125 transition-transform" />
                        <div className="min-w-0">
                          <p className="text-xs font-black text-[#111] truncate">{loc.city}</p>
                          <p className="text-[10px] text-[#9DA5AE] leading-tight truncate">{loc.address}</p>
                        </div>
                      </a>
                    ))}
                  </div>
                </div>
              </div>

              {/* ── RIGHT: Search panel ── */}
              <div className="p-5 sm:p-8 lg:p-10 bg-[#fafafa] order-1 lg:order-2">
                {/* Brand mark — mobile only */}
                <div className="flex lg:hidden items-center gap-3 mb-5">
                  <div className="w-1 h-10 bg-[#FFC300] rounded-full flex-shrink-0" />
                  <div>
                    <Image
                      src="/logo-spiezia.png"
                      alt="Spiezia Tyres S.p.A."
                      width={130}
                      height={40}
                      className="h-8 w-auto object-contain mix-blend-multiply mb-0.5"
                    />
                    <p className="text-[10px] font-bold text-[#9DA5AE] uppercase tracking-widest">Specialisti in pneumatici dal 1993</p>
                  </div>
                </div>
                <p className="text-[10px] font-black uppercase tracking-widest text-[#FFC300] mb-1">Trova le gomme giuste</p>
                <h2 className="text-xl font-black text-[#111] mb-5">Cerca i tuoi pneumatici</h2>
                <HomeHero />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════
          #Promozioni — black section
      ══════════════════════════════════════ */}
      <section className="bg-[#0d0d0d] py-16">
        <div className="max-w-8xl mx-auto px-4 sm:px-6">
          <p className="text-[#FFC300] font-black text-lg mb-2">#Promozioni</p>
          <h2 className="text-3xl font-black text-white mb-2">Non perderti<br />le promozioni attive!</h2>
          <p className="text-[#888] mb-10 max-w-xl">
            Approfitta delle convenienze di Spiezia Tyres: scopri tutte le offerte su pneumatici e servizi per la tua auto!
          </p>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {[
              { label: "FALKEN",    title: "Ogni 4 pneumatici Falken ≥16\" fino a 20€ in buoni carburante", cat: "Estive" },
              { label: "INVERNALI", title: "Gomme invernali già disponibili — prepara l'auto per il freddo",  cat: "Invernali" },
              { label: "PRENOTA",   title: "Prenota il montaggio nelle nostre 4 sedi — Nola, Volla, Portici, Fiano Romano", cat: "Tutti" },
            ].map((promo) => (
              <div key={promo.title} className="bg-[#1a1a1a] border border-[#2a2a2a] rounded-xl overflow-hidden group hover:border-[#FFC300]/40 transition-all">
                <div className="h-40 bg-gradient-to-br from-[#222] to-[#111] flex items-center justify-center relative overflow-hidden">
                  <div className="absolute top-3 left-3 bg-[#FFC300] text-[#111] text-[10px] font-black px-3 py-1 rounded-full">
                    {promo.label}
                  </div>
                  <div className="text-7xl opacity-10">🏎️</div>
                </div>
                <div className="p-5">
                  <p className="text-white font-bold text-sm leading-snug mb-3">{promo.title}</p>
                  <Link
                    href={`/prodotti?stagioni=${promo.cat === "Tutti" ? "" : promo.cat}`}
                    className="text-[#FFC300] text-xs font-bold flex items-center gap-1 group-hover:gap-2 transition-all"
                  >
                    Scopri l&apos;offerta <ArrowRight size={12} />
                  </Link>
                </div>
              </div>
            ))}
          </div>

          <div className="mt-10 text-center">
            <Link href="/prodotti?sortByPrice=asc" className="btn-gold-lg inline-flex items-center gap-2">
              Vedi tutte le offerte <ArrowRight size={18} />
            </Link>
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════
          Services — dark bg + white cards
      ══════════════════════════════════════ */}
      <section className="relative py-20 bg-[#111]">
        <div className="absolute inset-0 bg-gradient-to-b from-[#0d0d0d] to-[#1a1a1a]" />
        <div className="relative max-w-8xl mx-auto px-4 sm:px-6 text-center">
          <p className="text-2xl sm:text-3xl font-black text-white mb-2">
            <span className="text-[#FFC300]">SPIEZIA TYRES S.P.A</span> SI PRENDE CURA DI TE E DELLA TUA AUTO
          </p>
          <p className="text-[#888] text-sm mb-10">
            <span className="text-[#FFC300] font-bold">Garantiamo</span> assistenza qualificata per la tua auto.
            Scegli tra decine di servizi prenotabili{" "}
            <span className="text-white font-semibold">online o in sede</span>{" "}
            e goditi un&apos;esperienza di guida al top.
          </p>

          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {SERVICES.map((s) => (
              <div key={s.title} className="bg-white rounded-2xl text-left shadow-[0_4px_20px_rgba(0,0,0,0.2)] hover:shadow-[0_8px_40px_rgba(255,195,0,0.25)] hover:-translate-y-1 transition-all overflow-hidden flex flex-col">
                {"image" in s && s.image ? (
                  /* eslint-disable-next-line @next/next/no-img-element */
                  <img src={s.image} alt={s.title} className="w-full h-auto" />
                ) : (
                  <div className="px-6 pt-6 pb-2">
                    <div className="w-12 h-12 bg-[#FFC300] rounded-xl flex items-center justify-center mb-4">
                      <Zap size={20} className="text-[#111]" />
                    </div>
                  </div>
                )}
                <div className="px-6 pb-6 flex-1 flex flex-col justify-end border-t border-[#F1F4F8]">
                  <h3 className="font-black text-[#111] mb-2 text-sm pt-4">{s.title}</h3>
                  <p className="text-xs text-[#777] leading-relaxed">{s.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════
          Products — white bg
      ══════════════════════════════════════ */}
      <section className="bg-white py-16">
        <div className="max-w-8xl mx-auto px-4 sm:px-6">
          <div className="flex items-end justify-between mb-8">
            <div>
              <p className="text-[#FFC300] font-black text-sm uppercase tracking-widest mb-1">#Catalogo</p>
              <h2 className="text-2xl font-black text-[#111]">I pneumatici più venduti</h2>
            </div>
            <Link href="/prodotti" className="btn-outline-navy text-sm hidden sm:flex items-center gap-2">
              Vedi tutti <ArrowRight size={14} />
            </Link>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            {[
              { label: "Gomme Estive",         href: "/prodotti?stagioni=Estive",     img: "/categories/gomme-estive.png",    sub: "Per prestazioni in estate"      },
              { label: "Gomme Invernali",      href: "/prodotti?stagioni=Invernali",  img: "/categories/gomme-invernali.png", sub: "Per sicurezza in inverno"        },
              { label: "4 Stagioni",           href: "/prodotti?stagioni=4-Stagioni", img: "/categories/gomme-4stagioni.png", sub: "Tutto l'anno senza pensieri"     },
              { label: "Pneumatici Auto",      href: "/prodotti?cat=auto",            img: "/categories/auto.png",            sub: "Per berline, utilitarie e city"  },
              { label: "Pneumatici Agricoli",  href: "/prodotti?cat=agro",            img: "/categories/agro.png",            sub: "Per trattori e macchine agricole"},
              { label: "Pneumatici Autocarro", href: "/prodotti?cat=autocarro",       img: "/categories/autocarro.png",       sub: "Per camion, autobus e furgoni"   },
            ].map((cat) => (
              <Link
                key={cat.label}
                href={cat.href}
                className="group relative overflow-hidden rounded-2xl border border-[#eee] hover:border-[#FFC300] hover:shadow-[0_4px_20px_rgba(255,195,0,0.2)] transition-all bg-white"
              >
                <div className="relative h-40 sm:h-52 overflow-hidden">
                  <Image
                    src={cat.img}
                    alt={cat.label}
                    fill
                    className="object-cover object-center group-hover:scale-105 transition-transform duration-500"
                    sizes="(max-width:768px) 50vw, 33vw"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
                </div>
                <div className="absolute bottom-0 left-0 right-0 p-4">
                  <p className="font-black text-sm text-white group-hover:text-[#FFC300] transition-colors leading-tight">{cat.label}</p>
                  <p className="text-[11px] text-white/60 mt-0.5 leading-tight">{cat.sub}</p>
                </div>
              </Link>
            ))}
          </div>

          <div className="mt-6 text-center sm:hidden">
            <Link href="/prodotti" className="btn-outline-navy text-sm inline-flex items-center gap-2">
              Vedi tutto il catalogo <ArrowRight size={14} />
            </Link>
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════
          Brands — white
      ══════════════════════════════════════ */}
      <section className="bg-[#f9f9f9] py-14 border-t border-[#eee]">
        <div className="max-w-8xl mx-auto px-4 sm:px-6">
          <p className="text-center text-[10px] font-black uppercase tracking-widest text-[#999] mb-10">I brand che vendiamo</p>
          <div className="flex flex-wrap items-center justify-center gap-10 sm:gap-14 lg:gap-20">
            {[
              { nome: "Michelin",    logo: "/brands/michelin.png",    h: "h-9 sm:h-11"  },
              { nome: "Pirelli",     logo: "/brands/pirelli.jpg",     h: "h-8 sm:h-10"  },
              { nome: "Continental", logo: "/brands/continental.png", h: "h-8 sm:h-10"  },
              { nome: "Bridgestone", logo: "/brands/bridgestone.png", h: "h-7 sm:h-9"   },
              { nome: "Goodyear",    logo: "/brands/goodyear.png",    h: "h-7 sm:h-9"   },
              { nome: "Hankook",     logo: "/brands/hankook.png",     h: "h-8 sm:h-10"  },
            ].map((b) => (
              <Link
                key={b.nome}
                href={`/prodotti?marche=${encodeURIComponent(b.nome)}`}
                title={b.nome}
                className="grayscale opacity-50 hover:grayscale-0 hover:opacity-100 transition-all duration-300"
              >
                <Image
                  src={b.logo}
                  alt={b.nome}
                  width={160}
                  height={60}
                  className={`w-auto mix-blend-multiply ${b.h}`}
                />
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════
          Testimonials — black
      ══════════════════════════════════════ */}
      <section className="bg-[#0d0d0d] py-20">
        <div className="max-w-8xl mx-auto px-4 sm:px-6">
          <div className="text-center mb-12">
            <p className="text-[#FFC300] text-xs font-black uppercase tracking-widest mb-2">I nostri clienti</p>
            <h2 className="text-2xl sm:text-3xl font-black text-white">
              NON CREDERE SOLO<br />
              <span className="text-[#FFC300]">ALLE NOSTRE PAROLE</span>
            </h2>
          </div>

          <div className="grid md:grid-cols-3 gap-6">
            {REVIEWS.map((r) => (
              <div key={r.name} className="bg-[#181818] border border-[#2a2a2a] rounded-2xl p-6">
                <div className="flex gap-0.5 mb-4">
                  {[1,2,3,4,5].map((s) => (
                    <Star key={s} size={16} fill="#FFC300" className="text-[#FFC300]" />
                  ))}
                </div>
                <p className="text-[#bbb] text-sm leading-relaxed mb-5">{r.text}</p>
                <p className="text-[#FFC300] font-bold text-sm">{r.name}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════
          3-step booking — black
      ══════════════════════════════════════ */}
      <section className="bg-[#111] py-20">
        <div className="max-w-8xl mx-auto px-4 sm:px-6">
          <div className="text-center mb-12">
            <h2 className="text-2xl sm:text-3xl font-black text-white">
              PRENOTA IN 3 SEMPLICI PASSI CON<br />
              <span className="text-[#FFC300]">SPIEZIA TYRES S.P.A</span>
            </h2>
          </div>

          <div className="grid md:grid-cols-3 gap-5">
            {[
              { n: "01", title: "Scegli il Pneumatico", LucideIcon: Search,        image: "/steps/scegli-pneumatico.png", desc: "Cerca per misura o per veicolo. Filtra per stagione, marca e prezzo. Trova la gomma giusta per la tua auto.", gold: false },
              { n: "02", title: "Aggiungi alla Lista",  LucideIcon: ShoppingCart2, image: "/steps/aggiungi-lista.png",    desc: "Seleziona i pneumatici che ti interessano, scegli la quantità e componi la tua lista da presentare in sede.", gold: false },
              { n: "03", title: "Prenota in Sede",      LucideIcon: CalendarDays,  image: "/steps/prenota-sede.png",     desc: "Contattaci o vieni direttamente in uno dei nostri 4 punti vendita. Il personale provvederà al montaggio.", gold: false },
            ].map((step) => (
              <div
                key={step.n}
                className={`rounded-2xl overflow-hidden flex flex-col items-center text-center ${
                  step.gold
                    ? "bg-[#FFC300] text-[#111] shadow-[0_8px_32px_rgba(255,195,0,0.4)]"
                    : "bg-white text-[#111]"
                }`}
              >
                {step.image ? (
                  /* eslint-disable-next-line @next/next/no-img-element */
                  <img
                    src={step.image}
                    alt={step.title}
                    className="w-full object-contain bg-white"
                    style={{ aspectRatio: "4/3" }}
                  />
                ) : (
                  <div className={`w-16 h-16 rounded-2xl flex items-center justify-center mt-8 ${step.gold ? "bg-[#E6B000]" : "bg-[#f5f5f5]"}`}>
                    <step.LucideIcon size={28} className={step.gold ? "text-[#111]" : "text-[#FFC300]"} />
                  </div>
                )}
                <div className="px-8 pb-8 pt-5 flex flex-col items-center flex-1">
                  <p className={`text-xs font-black uppercase tracking-widest mb-2 ${step.gold ? "text-[#7a5c00]" : "text-[#999]"}`}>{step.n}</p>
                  <h3 className="text-lg font-black mb-3">{step.title}</h3>
                  <p className={`text-sm leading-relaxed ${step.gold ? "text-[#5a4400]" : "text-[#777]"}`}>{step.desc}</p>
                </div>
              </div>
            ))}
          </div>

          <div className="mt-12 text-center">
            <Link href="/prodotti" className="btn-gold-lg inline-flex items-center gap-2 text-base">
              Sfoglia il catalogo <ArrowRight size={20} />
            </Link>
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════
          Contact strip — gold
      ══════════════════════════════════════ */}
      <section id="contatti" className="bg-[#FFC300] py-10">
        <div className="max-w-8xl mx-auto px-4 sm:px-6 flex flex-col sm:flex-row items-center justify-between gap-6">
          <div>
            <p className="font-black text-[#111] text-xl">Hai domande? Siamo qui.</p>
            <p className="text-[#5a4400] text-sm mt-1">Chiamaci in sede o scrivici, rispondiamo subito.</p>
          </div>
          <div className="flex items-center gap-4">
            <a href="/contatti" className="inline-flex items-center justify-center gap-2 font-bold text-sm text-[#111] bg-white hover:bg-[#F1F4F8] px-5 py-2.5 rounded-lg shadow-sm active:scale-[0.98] transition-all">
              Contattaci
            </a>
          </div>
        </div>
      </section>
    </>
  );
}
