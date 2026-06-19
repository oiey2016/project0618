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
        space: {
          50: "#E8ECFF",
          100: "#C7CEFF",
          200: "#8A94D6",
          300: "#4A548C",
          400: "#1E2550",
          500: "#0A0E27",
          600: "#070A1C",
          700: "#040612",
          800: "#02030A",
          900: "#010206",
        },
        stardust: {
          50: "#FFF8E1",
          100: "#FFEFA8",
          200: "#FFE26B",
          300: "#E6C548",
          400: "#D4AF37",
          500: "#B8941F",
          600: "#8A6E12",
        },
        plasma: {
          50: "#E0FBFF",
          100: "#A8F0FF",
          200: "#55E2FF",
          300: "#00D4FF",
          400: "#00AACC",
          500: "#007A94",
        },
        alert: {
          300: "#FF8098",
          400: "#FF4D6D",
          500: "#E03554",
          600: "#B4213D",
        },
        parchment: {
          50: "#FBF5E6",
          100: "#F5E9C8",
          200: "#E8D49A",
          300: "#D4B86A",
        },
      },
      fontFamily: {
        display: ["Cinzel", "Georgia", "serif"],
        serif: ["Cormorant Garamond", "Georgia", "serif"],
        mono: ["JetBrains Mono", "Consolas", "monospace"],
      },
      animation: {
        "pulse-slow": "pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite",
        "glow-gold": "glowGold 2s ease-in-out infinite alternate",
        "twinkle": "twinkle 4s ease-in-out infinite",
        "float": "float 6s ease-in-out infinite",
        "fade-in": "fadeIn 0.5s ease-out forwards",
        "scale-in": "scaleIn 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275) forwards",
        "slide-up": "slideUp 0.4s ease-out forwards",
      },
      keyframes: {
        glowGold: {
          "0%": { boxShadow: "0 0 10px rgba(212, 175, 55, 0.3)" },
          "100%": { boxShadow: "0 0 25px rgba(212, 175, 55, 0.7)" },
        },
        twinkle: {
          "0%, 100%": { opacity: "0.3", transform: "scale(1)" },
          "50%": { opacity: "1", transform: "scale(1.2)" },
        },
        float: {
          "0%, 100%": { transform: "translateY(0)" },
          "50%": { transform: "translateY(-10px)" },
        },
        fadeIn: {
          "0%": { opacity: "0" },
          "100%": { opacity: "1" },
        },
        scaleIn: {
          "0%": { opacity: "0", transform: "scale(0.8)" },
          "100%": { opacity: "1", transform: "scale(1)" },
        },
        slideUp: {
          "0%": { opacity: "0", transform: "translateY(20px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
      },
      backgroundImage: {
        "starfield":
          "radial-gradient(ellipse at center, #1E2550 0%, #0A0E27 50%, #02030A 100%)",
        "victory":
          "linear-gradient(135deg, #0A0E27 0%, #1E2550 40%, #8A6E12 100%)",
        "defeat":
          "linear-gradient(135deg, #0A0E27 0%, #1E1220 50%, #5C1A2B 100%)",
      },
      boxShadow: {
        "gold": "0 0 20px rgba(212, 175, 55, 0.4)",
        "plasma": "0 0 20px rgba(0, 212, 255, 0.4)",
        "inner-gold": "inset 0 0 20px rgba(212, 175, 55, 0.15)",
      },
    },
  },
  plugins: [],
};
