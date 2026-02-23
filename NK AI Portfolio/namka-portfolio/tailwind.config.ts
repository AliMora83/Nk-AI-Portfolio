import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
  ],
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
        syne: ["var(--font-syne)"],
        instrument: ["var(--font-instrument)"],
        mono: ["var(--font-ibm-plex-mono)"],
      },
    },
  },
  plugins: [],
};
export default config;
