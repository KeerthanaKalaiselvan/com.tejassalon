import type { Config } from "tailwindcss";

/**
 * Tejas design system.
 * A deliberately single-world palette: a night-lit room.
 * Token NAMES are kept from v1 so existing component classes keep working;
 * only the VALUES move to the Tejas identity (plum-black ground, one gold accent).
 */
const config: Config = {
  content: ["./app/**/*.{ts,tsx}", "./components/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        gold: {
          DEFAULT: "#C9A24B",
          light: "#E8CE9B",
          dark: "#A9762C",
        },
        glow: "#F5E7C9",
        cream: {
          DEFAULT: "#F4EBDD",
          dim: "#D8CABD",
        },
        ink: {
          DEFAULT: "#150E13",   // page ground: warm plum-black
          soft: "#1C131A",      // raised surface
        },
        // v1 used `navy` for its dark sections - remapped to plum so every
        // existing bg-navy / text-navy class lands on the Tejas palette.
        navy: {
          DEFAULT: "#1C131A",
          light: "#241A22",
          deep: "#120C10",
        },
        muted: {
          DEFAULT: "#A28D82",   // warm-biased neutral, never a flat grey
          dim: "#7C6A63",
        },
      },
      fontFamily: {
        serif: ["var(--font-display)", "Palatino Linotype", "Palatino", "Georgia", "serif"],
        sans: ["var(--font-body)", "Futura", "system-ui", "sans-serif"],
      },
      borderRadius: {
        card: "2px",   // the identity is editorial, not rounded-card
        pill: "999px",
      },
      boxShadow: {
        glow: "0 0 0 1px rgba(201,155,76,0.22), 0 24px 70px -30px rgba(201,155,76,0.30)",
        soft: "0 24px 60px -30px rgba(0,0,0,0.65)",
      },
      backgroundImage: {
        "gold-radial":
          "radial-gradient(circle at 30% 20%, rgba(201,155,76,0.16), transparent 62%)",
      },
      letterSpacing: {
        label: "0.30em",
        wordmark: "0.10em",
      },
      keyframes: {
        "scroll-x": {
          "0%": { transform: "translateX(0)" },
          "100%": { transform: "translateX(-50%)" },
        },
        confetti: {
          "0%": { transform: "translateY(-10%) rotate(0deg)", opacity: "1" },
          "100%": { transform: "translateY(120vh) rotate(360deg)", opacity: "0" },
        },
        "fade-up": {
          "0%": { opacity: "0", transform: "translateY(20px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
        "draw-x": {
          "0%": { opacity: "0", transform: "scaleX(0)" },
          "100%": { opacity: "1", transform: "scaleX(1)" },
        },
      },
      animation: {
        "scroll-x": "scroll-x 32s linear infinite",
        confetti: "confetti 3.2s ease-in forwards",
        "fade-up": "fade-up 0.9s cubic-bezier(.22,.61,.36,1) forwards",
        "draw-x": "draw-x 1.2s cubic-bezier(.22,.61,.36,1) forwards",
      },
    },
  },
  plugins: [],
};

export default config;
