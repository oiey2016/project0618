/** @type {import('tailwindcss').Config} */

export default {
  darkMode: "class",
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    container: {
      center: true,
    },
    extend: {
      colors: {
        primary: {
          50: "#FFF5F7",
          100: "#FFE4EC",
          200: "#FFC1D6",
          300: "#FF9EC0",
          400: "#FF7AAA",
          500: "#FF6B9D",
          600: "#E85A8C",
          700: "#C44A75",
          800: "#A03A5E",
          900: "#7C2A47",
        },
        secondary: {
          50: "#F5F3FF",
          100: "#EDE9FE",
          200: "#DDD6FE",
          300: "#C4B5FD",
          400: "#A78BFA",
          500: "#8B5CF6",
          600: "#7C3AED",
          700: "#6D28D9",
          800: "#5B21B6",
          900: "#4C1D95",
        },
        accent: {
          50: "#F0FDFF",
          100: "#CFFAFE",
          200: "#A5F3FC",
          300: "#67E8F9",
          400: "#22D3EE",
          500: "#06B6D4",
        },
        pastel: {
          pink: "#FFB6C1",
          purple: "#DDA0DD",
          blue: "#B0E0E6",
          peach: "#FFDAB9",
          mint: "#98FB98",
          lavender: "#E6E6FA",
        },
      },
      fontFamily: {
        cute: ['"Comic Sans MS"', '"Chalkboard SE"', '"Baloo 2"', "cursive"],
        display: ['"Fredoka"', '"Nunito"', '"Quicksand"', "sans-serif"],
      },
      animation: {
        "bounce-slow": "bounce 2s infinite",
        "pulse-soft": "pulse 3s ease-in-out infinite",
        "float": "float 3s ease-in-out infinite",
        "wiggle": "wiggle 0.5s ease-in-out infinite",
        "pop": "pop 0.3s ease-out",
        "fade-in": "fadeIn 0.5s ease-out",
        "slide-down": "slideDown 0.3s ease-out",
        "glow": "glow 2s ease-in-out infinite",
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
          "0%": { transform: "scale(0.5)", opacity: "0" },
          "50%": { transform: "scale(1.2)" },
          "100%": { transform: "scale(1)", opacity: "1" },
        },
        fadeIn: {
          "0%": { opacity: "0" },
          "100%": { opacity: "1" },
        },
        slideDown: {
          "0%": { transform: "translateY(-20px)", opacity: "0" },
          "100%": { transform: "translateY(0)", opacity: "1" },
        },
        glow: {
          "0%, 100%": { boxShadow: "0 0 20px rgba(255, 107, 157, 0.4)" },
          "50%": { boxShadow: "0 0 40px rgba(255, 107, 157, 0.8)" },
        },
      },
      backdropBlur: {
        xs: "2px",
      },
    },
  },
  plugins: [],
};
