import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        strava: {
          orange: "#FC4C02",
          dark: "#1A1A1A",
        },
      },
    },
  },
  plugins: [],
};

export default config;