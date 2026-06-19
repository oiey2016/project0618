/** @type {import('tailwindcss').Config} */

export default {
  darkMode: "class",
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        cosmic: {
          950: "#0a0e27",
          900: "#12183d",
          800: "#1a2256",
          700: "#26317a",
        },
        nebula: {
          500: "#6d28d9",
          600: "#4a1a6b",
          700: "#3b135a",
        },
        life: {
          400: "#34d399",
          500: "#10b981",
          600: "#059669",
        },
        divine: {
          300: "#fcd34d",
          400: "#fbbf24",
          500: "#f59e0b",
        },
        ocean: {
          400: "#38bdf8",
          500: "#0ea5e9",
          600: "#0284c7",
        },
        earth: {
          500: "#92400e",
          600: "#78350f",
        },
        civilization: {
          400: "#fb923c",
          500: "#f97316",
          600: "#ea580c",
        },
      },
      fontFamily: {
        display: ['"ZCOOL XiaoWei"', "serif"],
        body: ['"Noto Sans SC"', "sans-serif"],
      },
      animation: {
        "float-slow": "float 6s ease-in-out infinite",
        "float-medium": "float 4s ease-in-out infinite",
        "float-fast": "float 3s ease-in-out infinite",
        "pulse-glow": "pulse-glow 2s ease-in-out infinite",
        "twinkle": "twinkle 3s ease-in-out infinite",
        "drift": "drift 20s linear infinite",
        "merge-burst": "merge-burst 0.6s ease-out forwards",
        "spawn": "spawn 0.4s ease-out forwards",
        "unlock": "unlock 2s ease-out forwards",
        "bg-shift": "bg-shift 15s ease-in-out infinite alternate",
      },
      keyframes: {
        float: {
          "0%, 100%": { transform: "translateY(0px)" },
          "50%": { transform: "translateY(-10px)" },
        },
        "pulse-glow": {
          "0%, 100%": { boxShadow: "0 0 20px rgba(251, 191, 36, 0.4)" },
          "50%": { boxShadow: "0 0 40px rgba(251, 191, 36, 0.8)" },
        },
        twinkle: {
          "0%, 100%": { opacity: "0.3" },
          "50%": { opacity: "1" },
        },
        drift: {
          "0%": { transform: "translateX(0) translateY(0)" },
          "50%": { transform: "translateX(20px) translateY(-15px)" },
          "100%": { transform: "translateX(0) translateY(0)" },
        },
        "merge-burst": {
          "0%": { transform: "scale(0.5)", opacity: "0" },
          "50%": { transform: "scale(1.3)", opacity: "1" },
          "100%": { transform: "scale(1)", opacity: "1" },
        },
        spawn: {
          "0%": { transform: "scale(0) rotate(-180deg)", opacity: "0" },
          "60%": { transform: "scale(1.2) rotate(10deg)", opacity: "1" },
          "100%": { transform: "scale(1) rotate(0deg)", opacity: "1" },
        },
        unlock: {
          "0%": { transform: "translateY(20px) scale(0.8)", opacity: "0" },
          "20%": { transform: "translateY(0) scale(1.1)", opacity: "1" },
          "80%": { transform: "translateY(0) scale(1)", opacity: "1" },
          "100%": { transform: "translateY(-20px) scale(0.9)", opacity: "0" },
        },
        "bg-shift": {
          "0%": { backgroundPosition: "0% 50%" },
          "100%": { backgroundPosition: "100% 50%" },
        },
      },
      backdropBlur: {
        xs: "2px",
      },
    },
  },
  plugins: [],
};
