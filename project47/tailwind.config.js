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
        warm: {
          50: "#FFFBF2",
          100: "#FDF6E3",
          200: "#F5E6C8",
          300: "#EBD4A5",
          400: "#DFBE7E",
          500: "#D4A757",
          600: "#B8893E",
          700: "#8F6A30",
          800: "#664B23",
          900: "#3D2D15",
        },
        dusk: {
          50: "#F8F7FC",
          100: "#EEE9F7",
          200: "#D8CEEC",
          300: "#B9A8DD",
          400: "#9782CB",
          500: "#8B9DC3",
          600: "#6B5AA7",
          700: "#524485",
          800: "#3A2F63",
          900: "#231B41",
        },
        forest: {
          50: "#F5F7F6",
          100: "#E8EDEB",
          200: "#CFD8D5",
          300: "#A6B6B0",
          400: "#7D948B",
          500: "#2C3E50",
          600: "#243241",
          700: "#1B2531",
          800: "#121921",
          900: "#090D11",
        },
        note: {
          glow: "#FFB347",
          pink: "#E8B4D4",
          purple: "#C9A8E6",
        },
      },
      fontFamily: {
        serif: ['"Noto Serif SC"', '"Songti SC"', 'SimSun', 'serif'],
        sans: ['"Noto Sans SC"', '"PingFang SC"', '"Microsoft YaHei"', 'sans-serif'],
      },
      animation: {
        'float': 'float 6s ease-in-out infinite',
        'pulse-soft': 'pulseSoft 3s ease-in-out infinite',
        'fade-in': 'fadeIn 1.2s ease-out forwards',
        'fade-up': 'fadeUp 1s ease-out forwards',
        'shimmer': 'shimmer 2s ease-in-out infinite',
        'breath': 'breath 4s ease-in-out infinite',
      },
      keyframes: {
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-20px)' },
        },
        pulseSoft: {
          '0%, 100%': { opacity: 0.6, transform: 'scale(1)' },
          '50%': { opacity: 1, transform: 'scale(1.05)' },
        },
        fadeIn: {
          '0%': { opacity: 0 },
          '100%': { opacity: 1 },
        },
        fadeUp: {
          '0%': { opacity: 0, transform: 'translateY(20px)' },
          '100%': { opacity: 1, transform: 'translateY(0)' },
        },
        shimmer: {
          '0%, 100%': { backgroundPosition: '-200% center' },
          '50%': { backgroundPosition: '200% center' },
        },
        breath: {
          '0%, 100%': { opacity: 0.5 },
          '50%': { opacity: 1 },
        },
      },
      backdropBlur: {
        xs: '2px',
      },
      boxShadow: {
        'glow': '0 0 40px rgba(255, 179, 71, 0.4)',
        'glow-soft': '0 0 20px rgba(255, 179, 71, 0.2)',
        'card': '0 8px 32px rgba(44, 62, 80, 0.15)',
      },
    },
  },
  plugins: [],
};
