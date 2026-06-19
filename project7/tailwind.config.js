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
        parchment: {
          50: "#FBF4E0",
          100: "#F5E6C8",
          200: "#EAD9A8",
          300: "#D9C284",
        },
        royal: {
          50: "#FAE6E8",
          100: "#E8B8BD",
          500: "#8B2A31",
          700: "#6B1D23",
          900: "#3D0F13",
        },
        gold: {
          300: "#D4AF37",
          500: "#B8860B",
          700: "#8B6508",
        },
        ink: {
          700: "#3E2C1C",
          900: "#1F140A",
        },
      },
      fontFamily: {
        display: ["'Cinzel'", "'Noto Serif SC'", "Georgia", "serif"],
        body: ["'Noto Serif SC'", "'Source Han Serif CN'", "Georgia", "serif"],
      },
      boxShadow: {
        card: "0 20px 40px -15px rgba(0,0,0,0.6), 0 8px 20px -8px rgba(0,0,0,0.4), inset 0 0 0 1px rgba(184,134,11,0.3)",
        innerGlow: "inset 0 1px 0 rgba(255,255,255,0.15), inset 0 -20px 40px rgba(0,0,0,0.1)",
      },
      keyframes: {
        slideOutLeft: {
          "0%": { transform: "translateX(0) rotate(0)", opacity: "1" },
          "100%": { transform: "translateX(-150%) rotate(-20deg)", opacity: "0" },
        },
        slideOutRight: {
          "0%": { transform: "translateX(0) rotate(0)", opacity: "1" },
          "100%": { transform: "translateX(150%) rotate(20deg)", opacity: "0" },
        },
        slideIn: {
          "0%": { transform: "translateY(30px) scale(0.95)", opacity: "0" },
          "100%": { transform: "translateY(0) scale(1)", opacity: "1" },
        },
        pulseWarning: {
          "0%,100%": { opacity: "1" },
          "50%": { opacity: "0.5" },
        },
        bounceIn: {
          "0%": { transform: "scale(0.3)", opacity: "0" },
          "50%": { transform: "scale(1.05)" },
          "70%": { transform: "scale(0.9)" },
          "100%": { transform: "scale(1)", opacity: "1" },
        },
        fadeIn: {
          "0%": { opacity: "0" },
          "100%": { opacity: "1" },
        },
      },
      animation: {
        slideOutLeft: "slideOutLeft 0.4s ease-in forwards",
        slideOutRight: "slideOutRight 0.4s ease-in forwards",
        slideIn: "slideIn 0.35s cubic-bezier(0.22, 1, 0.36, 1) forwards",
        pulseWarning: "pulseWarning 1s ease-in-out infinite",
        bounceIn: "bounceIn 0.6s cubic-bezier(0.175, 0.885, 0.32, 1.275) forwards",
        fadeIn: "fadeIn 0.25s ease-out forwards",
      },
    },
  },
  plugins: [],
};
