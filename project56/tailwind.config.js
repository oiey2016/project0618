/** @type {import('tailwindcss').Config} */

export default {
  darkMode: "class",
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        'rust-dark': '#1a0f08',
        'rust-brown': '#2D1B0E',
        'rust-deep': '#3d2414',
        'rust-mid': '#5c3d2e',
        'rust-light': '#8b6914',
        'rust-gold': '#c9a227',
        'blood-dark': '#3d0a0a',
        'blood-red': '#5C1A1A',
        'blood-bright': '#8b1a1a',
        'parchment': '#D4C4A8',
        'parchment-dark': '#a89880',
        'parchment-light': '#E8DCC8',
        'moss-dark': '#1A2F1A',
        'moss-green': '#2d4a2d',
        'candle-orange': '#FF8C00',
        'candle-yellow': '#ffd700',
        'shadow-black': '#0a0502',
        'fog-gray': '#3a3a3a',
      },
      fontFamily: {
        'gothic': ['"UnifrakturMaguntia"', 'cursive'],
        'serif-old': ['"Playfair Display"', 'Georgia', 'serif'],
        'handwritten': ['"Caveat"', 'cursive'],
      },
      animation: {
        'flicker': 'flicker 3s ease-in-out infinite',
        'flicker-slow': 'flicker 5s ease-in-out infinite',
        'float': 'float 6s ease-in-out infinite',
        'pulse-slow': 'pulse 4s ease-in-out infinite',
        'shake': 'shake 0.5s ease-in-out',
        'fade-in': 'fadeIn 0.8s ease-out forwards',
        'fade-out': 'fadeOut 0.8s ease-out forwards',
        'slide-up': 'slideUp 0.5s ease-out forwards',
        'typewriter': 'typewriter 2s steps(40) forwards',
        'drip': 'drip 3s ease-in-out infinite',
        'glow': 'glow 2s ease-in-out infinite alternate',
      },
      keyframes: {
        flicker: {
          '0%, 100%': { opacity: '1' },
          '50%': { opacity: '0.8' },
          '75%': { opacity: '0.9' },
          '25%': { opacity: '0.85' },
        },
        float: {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-10px)' },
        },
        shake: {
          '0%, 100%': { transform: 'translateX(0)' },
          '25%': { transform: 'translateX(-5px)' },
          '75%': { transform: 'translateX(5px)' },
        },
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        fadeOut: {
          '0%': { opacity: '1' },
          '100%': { opacity: '0' },
        },
        slideUp: {
          '0%': { opacity: '0', transform: 'translateY(20px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        typewriter: {
          '0%': { width: '0' },
          '100%': { width: '100%' },
        },
        drip: {
          '0%, 100%': { transform: 'scaleY(1)' },
          '50%': { transform: 'scaleY(1.1)' },
        },
        glow: {
          '0%': { filter: 'drop-shadow(0 0 5px rgba(255, 140, 0, 0.5))' },
          '100%': { filter: 'drop-shadow(0 0 20px rgba(255, 140, 0, 0.8))' },
        },
      },
    },
  },
  plugins: [],
};
