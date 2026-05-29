import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: "#1a3c2e", // forest green
          light: "#255341",
          dark: "#10251c",
        },
        secondary: {
          DEFAULT: "#c8922a", // amber gold
          light: "#dfa73b",
          dark: "#a3761e",
        },
        bgOffWhite: "#f8f5f0", // off-white background
        charcoal: "#2d2d2d", // dark text
        muted: "#6b7280", // grey
      },
      fontFamily: {
        // Titles/headings use DM Sans (the `serif` key is kept so existing `font-serif` usages stay valid).
        serif: ["var(--font-dmsans)", "sans-serif"],
        sans: ["var(--font-inter)", "sans-serif"],
      },
      borderRadius: {
        "xl": "12px",
      },
      transitionDuration: {
        "300": "300ms",
      },
    },
  },
  plugins: [],
};

export default config;
