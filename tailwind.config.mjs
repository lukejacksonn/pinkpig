/** @type {import('tailwindcss').Config} */
import typography from "@tailwindcss/typography";
import fluid, { extract, screens, fontSize } from "fluid-tailwind";

const colors = require("tailwindcss/colors");

export default {
  content: {
    files: [
      "./src/**/*.{astro,html,js,jsx,md,mdx,svelte,ts,tsx,vue}",
      "./schemas/**/*.tsx",
    ],
    extract,
  },
  theme: {
    screens,
    fontSize,
    extend: {
      fontFamily: {
        display: ["Goldman", "sans-serif"],
        prose: ["Space Grotesk", "sans-serif"],
      },
      colors: {
        base: colors["zinc"][100],
        surface: colors["white"],
        title: colors["zinc"][900],
        prose: colors["zinc"][700],
        line: colors["zinc"][300],
        primary: colors["zinc"],
        highlight: colors["yellow"],
      },
    },
  },
  plugins: [
    typography,
    fluid({
      checkSC144: false, // default: true
    }),
  ],
};
