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
        cream: {
          50: '#FFFBF8',
          100: '#FFF5EE',
          200: '#FFE8D9',
          300: '#FFD6C0',
        },
        peach: {
          50: '#FFF3EE',
          100: '#FFE6DD',
          200: '#FFD6C8',
          300: '#FFC4B0',
          400: '#FFB097',
          500: '#FF9A78',
        },
        sky: {
          soft: '#A8D8EA',
          light: '#D4ECF5',
          pastel: '#E8F4FA',
        },
        mint: {
          soft: '#B8E0C4',
          light: '#D4EEDB',
          pastel: '#E9F7EE',
        },
        lavender: {
          soft: '#D4C5E8',
          light: '#E8DEF0',
        },
        sunny: {
          soft: '#FFE5A0',
          light: '#FFF1CC',
          gold: '#FFD466',
        },
        cocoa: {
          soft: '#8B7355',
          light: '#A69178',
        },
      },
      fontFamily: {
        cute: ['"ZCOOL KuaiLe"', '"Comic Sans MS"', 'cursive'],
        sans: ['"Noto Sans SC"', '-apple-system', 'BlinkMacSystemFont', 'sans-serif'],
      },
      boxShadow: {
        'soft': '0 8px 32px rgba(255, 180, 160, 0.25)',
        'cute': '0 4px 20px rgba(168, 216, 234, 0.35)',
        'pop': '0 12px 40px rgba(255, 154, 120, 0.4)',
        'inner-soft': 'inset 0 2px 8px rgba(255, 255, 255, 0.6)',
      },
      borderRadius: {
        'cute': '28px',
        'blob': '40% 60% 60% 40% / 60% 40% 60% 40%',
      },
      animation: {
        'bounce-soft': 'bounceSoft 2s ease-in-out infinite',
        'float': 'float 4s ease-in-out infinite',
        'wiggle': 'wiggle 1.5s ease-in-out infinite',
        'pulse-glow': 'pulseGlow 2s ease-in-out infinite',
        'squish': 'squish 0.6s ease-out',
        'sparkle': 'sparkle 1.2s ease-out forwards',
      },
      keyframes: {
        bounceSoft: {
          '0%, 100%': { transform: 'translateY(0) scale(1, 1)' },
          '50%': { transform: 'translateY(-12px) scale(0.98, 1.03)' },
        },
        float: {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-18px)' },
        },
        wiggle: {
          '0%, 100%': { transform: 'rotate(-3deg)' },
          '50%': { transform: 'rotate(3deg)' },
        },
        pulseGlow: {
          '0%, 100%': { boxShadow: '0 0 20px rgba(255, 212, 102, 0.5)' },
          '50%': { boxShadow: '0 0 40px rgba(255, 212, 102, 0.9)' },
        },
        squish: {
          '0%': { transform: 'scale(1.3)' },
          '50%': { transform: 'scale(0.92, 1.08)' },
          '100%': { transform: 'scale(1)' },
        },
        sparkle: {
          '0%': { transform: 'scale(0) rotate(0deg)', opacity: '0' },
          '50%': { transform: 'scale(1.2) rotate(180deg)', opacity: '1' },
          '100%': { transform: 'scale(1) rotate(360deg)', opacity: '1' },
        },
      },
    },
  },
  plugins: [],
};
