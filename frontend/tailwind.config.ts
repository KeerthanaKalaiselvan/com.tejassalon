import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./app/**/*.{ts,tsx}", "./components/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        gold: {
          DEFAULT: "#C9A24B",
          light: "#E3C077",
          dark: "#9C7A34",
        },
        glow: "#F0C869",
        cream: {
          DEFAULT: "#FBF3E3",
          dim: "#F1E3C6",
        },
        ink: {
          DEFAULT: "#14110F",
          soft: "#1E1A15",
        },
        navy: {
          DEFAULT: "#0F1D36",
          light: "#16294A",
          deep: "#0A1526",
        },
      },
      fontFamily: {
        serif: ["var(--font-display)", "Georgia", "Times New Roman", "serif"],
        sans: ["var(--font-body)", "Helvetica", "Arial", "sans-serif"],
      },
      borderRadius: {
        card: "1.75rem",
        pill: "999px",
      },
      boxShadow: {
        glow: "0 0 0 1px rgba(201,162,75,0.25), 0 20px 60px -20px rgba(201,162,75,0.35)",
        soft: "0 20px 50px -25px rgba(0,0,0,0.5)",
      },
      backgroundImage: {
        "gold-radial":
          "radial-gradient(circle at 30% 20%, rgba(240,200,105,0.18), transparent 60%)",
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
          "0%": { opacity: "0", transform: "translateY(24px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
      },
      animation: {
        "scroll-x": "scroll-x 32s linear infinite",
        confetti: "confetti 3.2s ease-in forwards",
        "fade-up": "fade-up 0.7s ease-out forwards",
      },
    },
  },
  plugins: [],
};

export default config;
