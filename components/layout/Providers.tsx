"use client";
import { CartProvider } from "@/context/CartContext";
import { AuthProvider } from "@/context/AuthContext";
import { Toaster } from "react-hot-toast";
import CartDrawer from "./CartDrawer";

export default function Providers({ children }: { children: React.ReactNode }) {
  return (
    <AuthProvider>
      <CartProvider>
        {children}
        <CartDrawer />
        <Toaster
          position="bottom-right"
          toastOptions={{
            style: {
              borderRadius: "0",
              border: "1px solid #0A0A0A",
              fontFamily: "inherit",
              fontSize: "0.875rem",
              boxShadow: "4px 4px 0px #0A0A0A",
            },
          }}
        />
      </CartProvider>
    </AuthProvider>
  );
}
