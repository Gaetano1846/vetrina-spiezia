"use client";
import { useState } from "react";
import Image from "next/image";
import { X, Eye, EyeOff, Loader2 } from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import toast from "react-hot-toast";

type Props = { isOpen: boolean; onClose: () => void };
type Mode = "login" | "register" | "reset";

export default function AuthModal({ isOpen, onClose }: Props) {
  const { signIn, signUp, resetPassword } = useAuth();
  const [mode, setMode] = useState<Mode>("login");
  const [loading, setLoading] = useState(false);
  const [showPw, setShowPw] = useState(false);
  const [form, setForm] = useState({ email: "", password: "", name: "" });

  if (!isOpen) return null;

  const set = (k: string) => (e: React.ChangeEvent<HTMLInputElement>) =>
    setForm((prev) => ({ ...prev, [k]: e.target.value }));

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    try {
      if (mode === "login") {
        await signIn(form.email, form.password);
        toast.success("Bentornato!");
      } else if (mode === "register") {
        await signUp(form.email, form.password, form.name);
        toast.success("Account creato con successo!");
      } else {
        await resetPassword(form.email);
        toast.success("Email di reset inviata!");
        setMode("login");
      }
      onClose();
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Errore";
      if (msg.includes("user-not-found") || msg.includes("wrong-password") || msg.includes("invalid-credential"))
        toast.error("Email o password non corretti");
      else if (msg.includes("email-already-in-use"))
        toast.error("Email già registrata");
      else if (msg.includes("weak-password"))
        toast.error("Password troppo corta (min. 6 caratteri)");
      else toast.error(msg);
    } finally {
      setLoading(false);
    }
  }

  const inputCls =
    "w-full border border-[#E5E7EB] rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-[#FFC300] focus:ring-2 focus:ring-[#FFC300]/20 transition-all placeholder:text-[#C4CAD0]";

  return (
    <>
      <div className="fixed inset-0 z-[300] bg-black/50 backdrop-blur-sm cart-overlay" onClick={onClose} />
      <div className="fixed inset-0 z-[301] flex items-center justify-center p-4">
        <div className="bg-white w-full max-w-sm rounded-2xl shadow-2xl overflow-hidden">

          {/* Header */}
          <div className="flex items-center justify-between px-5 py-4 bg-[#111]">
            <div className="flex items-center gap-3">
              <Image
                src="/logo-spiezia-white.png"
                alt="Spiezia Tyres"
                width={100}
                height={32}
                className="h-7 w-auto object-contain"
              />
              <div className="w-px h-5 bg-white/20" />
              <h2 className="text-white font-bold text-sm">
                {mode === "login" ? "Accedi" : mode === "register" ? "Crea account" : "Reset password"}
              </h2>
            </div>
            <button
              onClick={onClose}
              className="text-white/50 hover:text-white transition-colors p-1 rounded"
            >
              <X size={16} />
            </button>
          </div>

          {/* Body */}
          <div className="px-6 py-6">
            <form onSubmit={handleSubmit} className="space-y-4">
              {mode === "register" && (
                <div>
                  <label className="block text-[10px] font-black uppercase tracking-widest text-[#9DA5AE] mb-1.5">
                    Nome completo
                  </label>
                  <input
                    className={inputCls}
                    type="text"
                    placeholder="Mario Rossi"
                    value={form.name}
                    onChange={set("name")}
                    required
                  />
                </div>
              )}

              <div>
                <label className="block text-[10px] font-black uppercase tracking-widest text-[#9DA5AE] mb-1.5">
                  Email
                </label>
                <input
                  className={inputCls}
                  type="email"
                  placeholder="mario@esempio.it"
                  value={form.email}
                  onChange={set("email")}
                  required
                />
              </div>

              {mode !== "reset" && (
                <div>
                  <label className="block text-[10px] font-black uppercase tracking-widest text-[#9DA5AE] mb-1.5">
                    Password
                  </label>
                  <div className="relative">
                    <input
                      className={`${inputCls} pr-11`}
                      type={showPw ? "text" : "password"}
                      placeholder="••••••••"
                      value={form.password}
                      onChange={set("password")}
                      required
                      minLength={6}
                    />
                    <button
                      type="button"
                      onClick={() => setShowPw((v) => !v)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-[#9DA5AE] hover:text-[#111] transition-colors"
                    >
                      {showPw ? <EyeOff size={16} /> : <Eye size={16} />}
                    </button>
                  </div>
                </div>
              )}

              <button
                type="submit"
                disabled={loading}
                className="w-full bg-[#FFC300] hover:bg-[#E6B000] disabled:opacity-60 text-[#111] font-black py-3 rounded-xl flex items-center justify-center gap-2 text-sm transition-colors mt-2"
              >
                {loading && <Loader2 size={16} className="animate-spin" />}
                {mode === "login" ? "Accedi" : mode === "register" ? "Crea account" : "Invia email di reset"}
              </button>
            </form>

            <div className="mt-5 flex flex-col gap-2 text-center text-xs text-[#9DA5AE]">
              {mode === "login" && (
                <>
                  <button
                    onClick={() => setMode("reset")}
                    className="hover:text-[#FFC300] transition-colors"
                  >
                    Password dimenticata?
                  </button>
                  <button
                    onClick={() => setMode("register")}
                    className="hover:text-[#111] transition-colors"
                  >
                    Non hai un account?{" "}
                    <span className="font-bold text-[#111]">Registrati</span>
                  </button>
                </>
              )}
              {mode === "register" && (
                <button
                  onClick={() => setMode("login")}
                  className="hover:text-[#111] transition-colors"
                >
                  Hai già un account?{" "}
                  <span className="font-bold text-[#111]">Accedi</span>
                </button>
              )}
              {mode === "reset" && (
                <button
                  onClick={() => setMode("login")}
                  className="hover:text-[#111] transition-colors"
                >
                  ← Torna al login
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
