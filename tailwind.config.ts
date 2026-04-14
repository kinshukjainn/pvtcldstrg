// tailwind.config.ts
import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        // Add your custom font here
        inter: "var(--font-inter) , sans-serif",
        lucida: "var(--font-lucida) , sans-serif",
        googleSans: "var(--font-google-sans) , sans-serif",
        segoeui: "var(--font-segoeui) , sans-serif",
        geist: "var(--font-geist-mono) , monospaced",
        roboto: "var(--font-roboto) , sans-serif",
        ubuntu: "var(--font-ubuntu) , sans-serif",
        notoSerif: "var(--font-noto-serif) , serif",
        supermercado: "var(--font-supermercado) , sans-serif",
        verdana: "var(--font-verdana) , sans-serif",
      },
    },
  },
  plugins: [],
};
export default config;
