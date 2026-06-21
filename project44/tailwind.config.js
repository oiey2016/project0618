/** @type {import('tailwindcss').Config} */

export default {
  darkMode: "class",
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        wasteland: {
          bg: "#0f0f0f",
          surface: "#1a1a1a",
          surface2: "#262626",
          border: "#333333",
          text: "#e5e5e5",
          muted: "#737373",
        },
        rust: {
          50: "#fef3c7",
          100: "#fde68a",
          200: "#fcd34d",
          300: "#fbbf24",
          400: "#f59e0b",
          500: "#d97706",
          600: "#b45309",
          700: "#92400e",
          800: "#78350f",
          900: "#451a03",
        },
        military: {
          50: "#ecfccb",
          100: "#d9f99d",
          200: "#bef264",
          300: "#a3e635",
          400: "#84cc16",
          500: "#65a30d",
          600: "#4d7c0f",
          700: "#3f6212",
          800: "#365314",
          900: "#1a2e05",
        },
        danger: {
          400: "#f87171",
          500: "#ef4444",
          600: "#dc2626",
          700: "#b91c1c",
        },
        warning: {
          400: "#facc15",
          500: "#eab308",
          600: "#ca8a04",
        },
        safe: {
          400: "#4ade80",
          500: "#22c55e",
          600: "#16a34a",
        },
      },
      fontFamily: {
        display: ["Impact", "Haettenschweiler", "Arial Narrow Bold", "sans-serif"],
        body: ["system-ui", "-apple-system", "sans-serif"],
      },
      boxShadow: {
        "rust-glow": "0 0 15px rgba(180, 83, 9, 0.5)",
        "danger-glow": "0 0 15px rgba(220, 38, 38, 0.5)",
        "safe-glow": "0 0 15px rgba(22, 163, 74, 0.5)",
        "inner-dark": "inset 0 2px 4px 0 rgba(0, 0, 0, 0.5)",
      },
      animation: {
        "pulse-slow": "pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite",
        "shake": "shake 0.5s ease-in-out",
        "float": "float 3s ease-in-out infinite",
        "scan": "scan 2s linear infinite",
      },
      keyframes: {
        shake: {
          "0%, 100%": { transform: "translateX(0)" },
          "25%": { transform: "translateX(-4px)" },
          "75%": { transform: "translateX(4px)" },
        },
        float: {
          "0%, 100%": { transform: "translateY(0)" },
          "50%": { transform: "translateY(-8px)" },
        },
        scan: {
          "0%": { transform: "translateY(-100%)" },
          "100%": { transform: "translateY(100%)" },
        },
      },
    },
  },
  plugins: [],
};
