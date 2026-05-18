"use client";
import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { ShoppingCart, User, Search, Menu, X, ChevronDown, Phone, Mail } from "lucide-react";
import { useCart } from "@/context/CartContext";
import { useAuth } from "@/context/AuthContext";
import AuthModal from "@/components/auth/AuthModal";

const NAV_LINKS = [
  { label: "CATALOGO",        href: "/prodotti" },
  { label: "OFFERTE",         href: "/prodotti?sortByPrice=asc" },
  { label: "GOMME INVERNALI",  href: "/prodotti?stagioni=Invernali" },
  { label: "GOMME ESTIVE",     href: "/prodotti?stagioni=Estive" },
  { label: "GOMME 4 STAGIONI", href: "/prodotti?stagioni=4-Stagioni" },
  { label: "CHI SIAMO",        href: "/chi-siamo" },
  { label: "CONTATTI",        href: "/contatti" },
];

export default function Header() {
  const { count, openCart } = useCart();
  const { user, logout } = useAuth();
  const [scrolled, setScrolled]       = useState(false);
  const [mobileOpen, setMobileOpen]   = useState(false);
  const [authOpen, setAuthOpen]       = useState(false);
  const [userMenu, setUserMenu]       = useState(false);
  const [searchOpen, setSearchOpen]   = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  function handleSearch(e: React.FormEvent) {
    e.preventDefault();
    if (searchQuery.trim()) {
      window.location.href = `/prodotti?q=${encodeURIComponent(searchQuery.trim())}`;
      setSearchOpen(false);
    }
  }

  return (
    <>
      {/* ── Top info bar ── */}
      <div className="bg-[#f5f5f5] border-b border-[#e8e8e8] text-xs py-2 hidden md:block">
        <div className="max-w-8xl mx-auto px-4 sm:px-6 flex items-center justify-between">
          <div className="flex items-center gap-6">
            <a href="tel:+390815115011" className="flex items-center gap-1.5 text-[#555] hover:text-[#FFC300] transition-colors font-medium">
              <Phone size={11} className="text-[#FFC300]" /> Chiamaci in Sede!
            </a>
            <a href="mailto:info@spieziatyres.it" className="flex items-center gap-1.5 text-[#555] hover:text-[#FFC300] transition-colors">
              <Mail size={11} className="text-[#FFC300]" /> info@spieziatyres.it
            </a>
          </div>
        </div>
      </div>

      {/* ── Main navbar ── */}
      <header
        className={`sticky top-0 z-50 bg-white transition-shadow duration-300 ${
          scrolled ? "shadow-[0_2px_16px_rgba(0,0,0,0.12)]" : "shadow-[0_1px_0_rgba(0,0,0,0.08)]"
        }`}
      >
        <div className="max-w-8xl mx-auto px-4 sm:px-6">
          <div className="flex items-center justify-between h-16">

            {/* Logo */}
            <Link href="/" className="flex-shrink-0 group">
              <Image
                src="/logo-spiezia.png"
                alt="Spiezia Tyres S.p.A."
                width={160}
                height={48}
                className="h-10 w-auto object-contain mix-blend-multiply"
                priority
              />
            </Link>

            {/* Desktop nav */}
            <nav className="hidden lg:flex items-center gap-0">
              {NAV_LINKS.map((l) => (
                <Link
                  key={l.href}
                  href={l.href}
                  className="text-xs font-bold tracking-widest text-[#333] hover:text-[#FFC300] transition-colors px-4 py-2 relative group/nav"
                >
                  {l.label}
                  <span className="absolute bottom-0 left-4 right-4 h-0.5 bg-[#FFC300] scale-x-0 group-hover/nav:scale-x-100 transition-transform duration-200 origin-left" />
                </Link>
              ))}
            </nav>

            {/* Right actions */}
            <div className="flex items-center gap-1">
              {/* Search */}
              <button
                onClick={() => setSearchOpen(true)}
                className="p-2.5 text-[#555] hover:text-[#FFC300] transition-colors rounded-lg hover:bg-[#f5f5f5]"
                aria-label="Cerca"
              >
                <Search size={18} />
              </button>

              {/* User */}
              <div className="relative hidden sm:block">
                <button
                  onClick={() => user ? setUserMenu((v) => !v) : setAuthOpen(true)}
                  className="p-2.5 text-[#555] hover:text-[#FFC300] transition-colors rounded-lg hover:bg-[#f5f5f5] flex items-center gap-1"
                >
                  <User size={18} />
                  {user && <ChevronDown size={12} className={`transition-transform ${userMenu ? "rotate-180" : ""}`} />}
                </button>

                {user && userMenu && (
                  <div className="absolute right-0 top-full mt-2 w-52 bg-white rounded-xl shadow-[0_8px_32px_rgba(0,0,0,0.12)] border border-[#eee] overflow-hidden z-50">
                    <div className="px-4 py-3 bg-[#f9f9f9] border-b border-[#eee]">
                      <p className="text-xs text-[#999]">Accesso come</p>
                      <p className="text-sm font-bold text-[#111] truncate">{user.displayName || user.email}</p>
                    </div>
                    <Link href="/account" className="block px-4 py-2.5 text-sm text-[#333] hover:bg-[#f5f5f5] transition-colors" onClick={() => setUserMenu(false)}>
                      Il mio account
                    </Link>
                    <button
                      onClick={() => { logout(); setUserMenu(false); }}
                      className="w-full text-left px-4 py-2.5 text-sm text-red-500 hover:bg-red-50 transition-colors border-t border-[#eee]"
                    >
                      Esci
                    </button>
                  </div>
                )}
              </div>

              {/* Cart */}
              <button
                onClick={openCart}
                className="relative p-2.5 text-[#555] hover:text-[#FFC300] transition-colors rounded-lg hover:bg-[#f5f5f5]"
                aria-label="La tua selezione"
              >
                <ShoppingCart size={18} className={count > 0 ? "text-[#FFC300]" : ""} />
                {count > 0 && (
                  <span className="absolute top-1 right-1 w-4 h-4 bg-[#FFC300] text-[#111] text-[9px] font-black rounded-full flex items-center justify-center shadow-sm">
                    {count > 9 ? "9+" : count}
                  </span>
                )}
              </button>

              {/* Mobile menu */}
              <button
                onClick={() => setMobileOpen((v) => !v)}
                className="p-2.5 text-[#555] hover:text-[#111] transition-colors rounded-lg hover:bg-[#f5f5f5] lg:hidden"
                aria-label="Menu"
              >
                {mobileOpen ? <X size={18} /> : <Menu size={18} />}
              </button>
            </div>
          </div>
        </div>

        {/* Gold accent bottom line */}
        <div className="h-[2px] bg-gradient-to-r from-[#FFC300] via-[#FFD54F] to-[#FFC300]" />

        {/* Mobile nav */}
        {mobileOpen && (
          <div className="lg:hidden border-t border-[#eee] bg-white mobile-menu">
            <nav className="max-w-8xl mx-auto px-4 py-3 flex flex-col gap-0.5">
              {NAV_LINKS.map((l) => (
                <Link
                  key={l.href}
                  href={l.href}
                  className="px-4 py-3 text-xs font-bold tracking-widest text-[#333] hover:text-[#FFC300] hover:bg-[#f9f9f9] rounded transition-colors"
                  onClick={() => setMobileOpen(false)}
                >
                  {l.label}
                </Link>
              ))}
              <div className="border-t border-[#eee] mt-2 pt-2">
                {user ? (
                  <>
                    <Link href="/account" className="block px-4 py-3 text-sm font-semibold text-[#333] hover:text-[#FFC300] rounded" onClick={() => setMobileOpen(false)}>
                      Il mio account
                    </Link>
                    <button onClick={() => { logout(); setMobileOpen(false); }} className="w-full text-left px-4 py-3 text-sm font-semibold text-red-500">
                      Esci
                    </button>
                  </>
                ) : (
                  <button onClick={() => { setAuthOpen(true); setMobileOpen(false); }} className="w-full text-left px-4 py-3 text-sm font-bold text-[#FFC300]">
                    Accedi / Registrati
                  </button>
                )}
              </div>
            </nav>
          </div>
        )}
      </header>

      {/* Search overlay */}
      {searchOpen && (
        <div className="fixed inset-0 z-[100] bg-black/60 backdrop-blur-sm cart-overlay" onClick={() => setSearchOpen(false)}>
          <div className="bg-white border-b border-[#eee] shadow-xl" onClick={(e) => e.stopPropagation()}>
            <form onSubmit={handleSearch} className="max-w-3xl mx-auto px-4 py-4 flex gap-3">
              <div className="flex-1 relative">
                <Search size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-[#999]" />
                <input
                  autoFocus
                  type="text"
                  placeholder="Cerca per marca, misura, modello…"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-11 pr-4 py-3 border border-[#ddd] rounded-lg text-[#111] placeholder:text-[#999] focus:outline-none focus:border-[#FFC300] transition-colors"
                />
              </div>
              <button type="submit" className="btn-gold">Cerca</button>
              <button type="button" onClick={() => setSearchOpen(false)} className="p-2.5 text-[#555] hover:text-[#111] transition-colors">
                <X size={18} />
              </button>
            </form>
          </div>
        </div>
      )}

      <AuthModal isOpen={authOpen} onClose={() => setAuthOpen(false)} />
    </>
  );
}
