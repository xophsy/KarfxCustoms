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
        gold: {
          300: "#FFE680",
          400: "#FFD633",
          500: "#F8C800",
          600: "#E0B400",
          700: "#B38F00",
        },
        surface: {
          900: "#0a0a0a",
          800: "#111111",
          700: "#1a1a1a",
          600: "#222222",
          500: "#2a2a2a",
        },
      },
      fontFamily: {
        // Set per area: globals.css for the public site, app/admin/layout.tsx for the admin.
        display: ["var(--font-display)", "Georgia", "serif"],
        body: ["var(--font-body)", "system-ui", "sans-serif"],
        brand: ["var(--font-brand)", "system-ui", "sans-serif"],
        editorial: ["var(--font-cormorant)", "Georgia", "serif"],
      },
      backgroundImage: {
        "gold-gradient":
          "linear-gradient(135deg, #F8C800 0%, #FFE04D 50%, #E8B000 100%)",
        "gold-radial":
          "radial-gradient(ellipse at center, #F8C800 0%, #E0B400 100%)",
        "dark-gradient":
          "linear-gradient(180deg, #0a0a0a 0%, #111111 50%, #0a0a0a 100%)",
      },
      animation: {
        "fade-up": "fadeUp 0.6s ease-out forwards",
        "fade-in": "fadeIn 0.4s ease-out forwards",
        shimmer: "shimmer 2s linear infinite",
        float: "float 6s ease-in-out infinite",
        marquee: "marquee 200s linear infinite",
        "marquee-reverse": "marqueeReverse 200s linear infinite",
      },
      keyframes: {
        fadeUp: {
          "0%": { opacity: "0", transform: "translateY(24px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
        fadeIn: {
          "0%": { opacity: "0" },
          "100%": { opacity: "1" },
        },
        shimmer: {
          "0%": { backgroundPosition: "-200% 0" },
          "100%": { backgroundPosition: "200% 0" },
        },
        float: {
          "0%, 100%": { transform: "translateY(0px)" },
          "50%": { transform: "translateY(-12px)" },
        },
        marquee: {
          from: { transform: "translateX(0)" },
          to: { transform: "translateX(-50%)" },
        },
        marqueeReverse: {
          from: { transform: "translateX(-50%)" },
          to: { transform: "translateX(0)" },
        },
      },
    },
  },
  plugins: [],
};
export default config;
