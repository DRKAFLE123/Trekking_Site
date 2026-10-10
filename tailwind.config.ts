import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./lib/**/*.{js,ts,jsx,tsx,mdx}",
    // Admin components (src/, components/payload) are styled by the admin's own CSS,
    // not Tailwind; scanning them only added dead classes to every website page.
    "!./components/payload/**",
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
          // Deep gold: 5.1:1 on white, so white-on-gold buttons and gold text on light
          // backgrounds pass WCAG AA. Was #c8922a (2.8:1). Use `secondary-light` on dark backgrounds.
          DEFAULT: "#8f6618",
          light: "#dfa73b",
          dark: "#74520f",
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
