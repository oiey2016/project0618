/** @type {import('tailwindcss').Config} */

export default {
  darkMode: "class",
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        primary: {
          50: "#eff6ff",
          100: "#dbeafe",
          200: "#bfdbfe",
          300: "#93c5fd",
          400: "#60a5fa",
          500: "#4A90D9",
          600: "#3b82f6",
          700: "#2563eb",
          800: "#1d4ed8",
          900: "#1e40af",
        },
        accent: {
          orange: "#FF8C42",
          green: "#52C41A",
          red: "#FF6B6B",
          yellow: "#FFD93D",
        },
        cream: "#FFF8E7",
        sand: "#F5E6D3",
      },
      fontFamily: {
        game: [
          '"Comic Sans MS"',
          '"Marker Felt"',
          '"Segoe Print"',
          "cursive",
          "sans-serif",
        ],
      },
      animation: {
        "bounce-slow": "bounce 2s infinite",
        "pulse-slow": "pulse 3s infinite",
        "float": "float 3s ease-in-out infinite",
        "wiggle": "wiggle 0.5s ease-in-out",
        "pop": "pop 0.3s ease-out",
        "slide-in-right": "slideInRight 0.3s ease-out",
        "fade-in": "fadeIn 0.5s ease-out",
        "sparkle": "sparkle 0.6s ease-out",
        "shake": "shake 0.5s ease-in-out",
      },
      keyframes: {
        float: {
          "0%, 100%": { transform: "translateY(0)" },
          "50%": { transform: "translateY(-10px)" },
        },
        wiggle: {
          "0%, 100%": { transform: "rotate(-3deg)" },
          "50%": { transform: "rotate(3deg)" },
        },
        pop: {
          "0%": { transform: "scale(0.8)", opacity: "0" },
          "50%": { transform: "scale(1.1)" },
          "100%": { transform: "scale(1)", opacity: "1" },
        },
        slideInRight: {
          "0%": { transform: "translateX(100%)", opacity: "0" },
          "100%": { transform: "translateX(0)", opacity: "1" },
        },
        fadeIn: {
          "0%": { opacity: "0", transform: "translateY(20px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
        sparkle: {
          "0%": { transform: "scale(0) rotate(0deg)", opacity: "1" },
          "100%": { transform: "scale(1.5) rotate(180deg)", opacity: "0" },
        },
        shake: {
          "0%, 100%": { transform: "translateX(0)" },
          "25%": { transform: "translateX(-5px)" },
          "75%": { transform: "translateX(5px)" },
        },
      },
      boxShadow: {
        "game": "0 8px 0 rgba(0,0,0,0.1), 0 12px 20px rgba(0,0,0,0.1)",
        "game-hover": "0 6px 0 rgba(0,0,0,0.1), 0 10px 16px rgba(0,0,0,0.1)",
        "card": "0 4px 15px rgba(0,0,0,0.08)",
        "glow": "0 0 20px rgba(74, 144, 217, 0.4)",
      },
    },
  },
  plugins: [],
};
