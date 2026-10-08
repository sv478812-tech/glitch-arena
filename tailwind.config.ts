import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  darkMode: "class",
  theme: {
    extend: {
      colors: {
        cyber: {
          bg: "#0B0F19",
          card: "#0F172A",
          surface: "#1E293B",
          border: "#334155",
          cyan: "#06B6D4",
          purple: "#A855F7",
          amber: "#F59E0B",
          red: "#EF4444",
          green: "#10B981",
          pink: "#EC4899",
        },
      },
      fontFamily: {
        mono: [
          "JetBrains Mono",
          "Fira Code",
          "Cascadia Code",
          "ui-monospace",
          "SFMono-Regular",
          "Menlo",
          "Monaco",
          "Consolas",
          "monospace",
        ],
      },
      keyframes: {
        glitch: {
          "0%, 100%": { transform: "translate(0)" },
          "20%": { transform: "translate(-2px, 2px)" },
          "40%": { transform: "translate(-2px, -2px)" },
          "60%": { transform: "translate(2px, 2px)" },
          "80%": { transform: "translate(2px, -2px)" },
        },
        pulseGlow: {
          "0%, 100%": { opacity: "1", filter: "drop-shadow(0 0 12px rgba(6, 182, 212, 0.7))" },
          "50%": { opacity: "0.7", filter: "drop-shadow(0 0 4px rgba(6, 182, 212, 0.3))" },
        },
        scanline: {
          "0%": { transform: "translateY(-100%)" },
          "100%": { transform: "translateY(1000%)" },
        },
      },
      animation: {
        glitch: "glitch 0.3s cubic-bezier(0.25, 0.46, 0.45, 0.94) both infinite",
        pulseGlow: "pulseGlow 2.5s ease-in-out infinite",
        scanline: "scanline 8s linear infinite",
      },
    },
  },
  plugins: [],
};
export default config;
