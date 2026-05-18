import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        navy: {
          DEFAULT: "#001D3D",
          light: "#0A2B5E",
          lighter: "#0D3572",
          muted: "#1a3a6b",
        },
        gold: {
          DEFAULT: "#FFC300",
          dark: "#E6B000",
          light: "#FFD54F",
          pale: "#FFF8DC",
        },
        bg: {
          DEFAULT: "#F1F4F8",
          card: "#FFFFFF",
        },
        ink: {
          DEFAULT: "#000000",
          secondary: "#57636C",
          muted: "#9DA5AE",
          faint: "#E5E7EB",
        },
        success: "#249689",
        error: "#FF5963",
      },
      fontFamily: {
        sans: ["var(--font-inter)", "Inter", "system-ui", "sans-serif"],
      },
      borderRadius: {
        sm: "4px",
        DEFAULT: "8px",
        md: "10px",
        lg: "12px",
        xl: "16px",
        full: "9999px",
      },
      boxShadow: {
        sm: "0 1px 3px rgba(0,0,0,0.08)",
        DEFAULT: "0 2px 8px rgba(0,29,61,0.10)",
        md: "0 4px 16px rgba(0,29,61,0.12)",
        lg: "0 8px 32px rgba(0,29,61,0.14)",
        xl: "0 16px 48px rgba(0,29,61,0.16)",
        gold: "0 4px 20px rgba(255,195,0,0.35)",
        navy: "0 4px 20px rgba(0,29,61,0.30)",
        inset: "inset 0 2px 4px rgba(0,0,0,0.06)",
      },
      backgroundImage: {
        "navy-gradient": "linear-gradient(135deg, #001D3D 0%, #0A2B5E 100%)",
        "navy-gradient-v": "linear-gradient(180deg, #001D3D 0%, #0A2B5E 100%)",
        "gold-gradient": "linear-gradient(135deg, #FFC300 0%, #E6B000 100%)",
        "hero-gradient": "linear-gradient(135deg, #001D3D 0%, #0D3572 60%, #0A2B5E 100%)",
      },
      maxWidth: {
        "8xl": "88rem",
      },
    },
  },
  plugins: [],
};

export default config;
