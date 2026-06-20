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
        arena: {
          bg: "#0f172a",
          surface: "#1e293b",
          border: "#334155",
        },
        player1: {
          DEFAULT: "#3b82f6",
          glow: "#60a5fa",
          dark: "#1d4ed8",
        },
        player2: {
          DEFAULT: "#f97316",
          glow: "#fb923c",
          dark: "#c2410c",
        },
        accent: {
          DEFAULT: "#10b981",
          glow: "#34d399",
        },
      },
      fontFamily: {
        display: ['Orbitron', 'sans-serif'],
        body: ['"Space Grotesk"', 'sans-serif'],
      },
      animation: {
        'pulse-glow': 'pulse-glow 2s ease-in-out infinite',
        'float': 'float 3s ease-in-out infinite',
        'bounce-in': 'bounce-in 0.6s cubic-bezier(0.68, -0.55, 0.265, 1.55)',
        'fade-in': 'fade-in 0.4s ease-out',
        'slide-up': 'slide-up 0.5s ease-out',
        'shake': 'shake 0.4s ease-in-out',
      },
      keyframes: {
        'pulse-glow': {
          '0%, 100%': { boxShadow: '0 0 20px 4px rgba(59, 130, 246, 0.3)' },
          '50%': { boxShadow: '0 0 40px 8px rgba(59, 130, 246, 0.5)' },
        },
        'float': {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-8px)' },
        },
        'bounce-in': {
          '0%': { transform: 'scale(0.3)', opacity: '0' },
          '50%': { transform: 'scale(1.05)' },
          '70%': { transform: 'scale(0.95)' },
          '100%': { transform: 'scale(1)', opacity: '1' },
        },
        'fade-in': {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        'slide-up': {
          '0%': { transform: 'translateY(20px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
        'shake': {
          '0%, 100%': { transform: 'translateX(0)' },
          '25%': { transform: 'translateX(-4px)' },
          '75%': { transform: 'translateX(4px)' },
        },
      },
      boxShadow: {
        'glow-blue': '0 0 30px 6px rgba(59, 130, 246, 0.4)',
        'glow-orange': '0 0 30px 6px rgba(249, 115, 22, 0.4)',
        'glow-green': '0 0 20px 4px rgba(16, 185, 129, 0.4)',
      },
    },
  },
  plugins: [],
};
