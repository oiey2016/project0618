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
        'ice-pink': '#FF69B4',
        'ice-mint': '#98FB98',
        'neon-purple': '#9400D3',
        'warning-red': '#FF0000',
        'creep-yellow': '#FFFF00',
        'dark-bg': '#0a0a0f',
        'dark-card': '#1a1a2e',
      },
      fontFamily: {
        'creepster': ['Creepster', 'cursive'],
        'vt323': ['VT323', 'monospace'],
      },
      animation: {
        'pulse-slow': 'pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'flicker': 'flicker 0.15s infinite',
        'glow': 'glow 2s ease-in-out infinite alternate',
        'shake': 'shake 0.5s ease-in-out',
        'float': 'float 3s ease-in-out infinite',
      },
      keyframes: {
        flicker: {
          '0%, 100%': { opacity: '1' },
          '50%': { opacity: '0.8' },
        },
        glow: {
          '0%': { boxShadow: '0 0 5px #FF69B4, 0 0 10px #FF69B4, 0 0 15px #FF69B4' },
          '100%': { boxShadow: '0 0 10px #FF69B4, 0 0 20px #FF69B4, 0 0 30px #FF69B4, 0 0 40px #FF69B4' },
        },
        shake: {
          '0%, 100%': { transform: 'translateX(0)' },
          '25%': { transform: 'translateX(-5px)' },
          '75%': { transform: 'translateX(5px)' },
        },
        float: {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-10px)' },
        },
      },
    },
  },
  plugins: [],
};
