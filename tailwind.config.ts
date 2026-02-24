import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  darkMode: ["class", '[data-theme="dark"]'],
  theme: {
    extend: {
      colors: {
        bg: "var(--bg)",
        surface: "var(--surface)",
        card: "var(--card)",
        border: "var(--border)",
        paper: "var(--paper)",
        muted: "var(--muted)",
        rust: "var(--rust)",
        amber: "var(--amber)",
        sage: "var(--sage)",
        gold: "var(--gold)",
      },
      fontFamily: {
        syne: ["var(--font-syne)", "sans-serif"],
        instrument: ["var(--font-instrument)", "serif"],
        mono: ["var(--font-mono)", "monospace"],
      },
    },
  },
  plugins: [],
};
export default config;
