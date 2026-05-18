import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Prenota il tuo appuntamento",
  description: "Scegli sede, data e orario per il montaggio dei tuoi pneumatici. Prenotazione gratuita, nessun anticipo richiesto.",
  robots: { index: false, follow: false },
};

export default function CheckoutLayout({ children }: { children: React.ReactNode }) {
  return children;
}
