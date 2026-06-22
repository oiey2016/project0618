/** @type {import('tailwindcss').Config} */

export default {
  darkMode: "class",
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: '#4FC3F7',
          light: '#81D4FA',
          dark: '#29B6F6',
        },
        secondary: {
          DEFAULT: '#81C784',
          light: '#A5D6A7',
          dark: '#66BB6A',
        },
        accent: {
          purple: '#CE93D8',
          pink: '#F48FB1',
          yellow: '#FFD54F',
        },
        game: {
          bg: '#0A1929',
          bgLight: '#132F4C',
          surface: 'rgba(255, 255, 255, 0.08)',
          border: 'rgba(255, 255, 255, 0.15)',
        }
      },
      fontFamily: {
        display: ['"Segoe UI"', 'system-ui', 'sans-serif'],
      },
      animation: {
        'pulse-slow': 'pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'float': 'float 6s ease-in-out infinite',
        'glow': 'glow 2s ease-in-out infinite alternate',
      },
      keyframes: {
        float: {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-10px)' },
        },
        glow: {
          '0%': { boxShadow: '0 0 20px rgba(79, 195, 247, 0.5)' },
          '100%': { boxShadow: '0 0 40px rgba(79, 195, 247, 0.8)' },
        }
      },
      backdropBlur: {
        xs: '2px',
      }
    },
  },
  plugins: [],
};
