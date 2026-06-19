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
        noir: {
          bg: '#0D0D0D',
          card: '#1A1A2E',
          border: '#2A2A3A',
          amber: '#D4A847',
          crimson: '#8B2252',
          paper: '#3A3A4A',
        },
      },
      fontFamily: {
        serif: ['"Noto Serif SC"', 'serif'],
        sans: ['"Noto Sans SC"', 'sans-serif'],
      },
      animation: {
        'fade-in': 'fadeInUp 0.3s ease-out forwards',
        'suspicion-pulse': 'suspicionPulse 1.5s ease-in-out infinite',
        'glow': 'pulseGlow 2s ease-in-out infinite',
      },
    },
  },
  plugins: [],
};
