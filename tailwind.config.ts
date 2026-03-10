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
      },
    },
  },
  plugins: [],
};
export default config;
