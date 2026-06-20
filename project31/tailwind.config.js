/** @type {import('tailwindcss').Config} */

export default {
  darkMode: "class",
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    container: {
      center: true,
    },
    extend: {
      fontFamily: {
        display: ['"Cinzel Decorative"', 'serif'],
        body: ['"Cormorant Garamond"', 'serif'],
      },
      colors: {
        primitive: {
          primary: '#8B6914',
          secondary: '#CD853F',
          accent: '#DEB887',
          bg: '#2C1810',
        },
        bronze: {
          primary: '#B8860B',
          secondary: '#DAA520',
          accent: '#6B8E23',
          bg: '#1C1A0A',
        },
        agricultural: {
          primary: '#556B2F',
          secondary: '#8FBC8F',
          accent: '#D2691E',
          bg: '#0F1A0F',
        },
        industrial: {
          primary: '#708090',
          secondary: '#4682B4',
          accent: '#2F4F4F',
          bg: '#0A0F14',
        },
        modern: {
          primary: '#4169E1',
          secondary: '#9370DB',
          accent: '#00CED1',
          bg: '#0A0A1F',
        },
        future: {
          primary: '#00FFFF',
          secondary: '#FF69B4',
          accent: '#7FFFD4',
          bg: '#0A001A',
        },
      },
      animation: {
        'pulse-glow': 'pulse-glow 2s ease-in-out infinite',
        'float': 'float 3s ease-in-out infinite',
        'shake': 'shake 0.5s ease-in-out',
        'grow': 'grow 1.5s ease-out forwards',
      },
      keyframes: {
        'pulse-glow': {
          '0%, 100%': { boxShadow: '0 0 20px currentColor' },
          '50%': { boxShadow: '0 0 40px currentColor, 0 0 60px currentColor' },
        },
        'float': {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-10px)' },
        },
        'shake': {
          '0%, 100%': { transform: 'translateX(0)' },
          '25%': { transform: 'translateX(-8px)' },
          '75%': { transform: 'translateX(8px)' },
        },
        'grow': {
          '0%': { transform: 'scaleY(0)', transformOrigin: 'bottom' },
          '100%': { transform: 'scaleY(1)', transformOrigin: 'bottom' },
        },
      },
    },
  },
  plugins: [],
};
