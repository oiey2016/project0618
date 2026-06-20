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
          50: '#FFFDF9',
          100: '#FFF9F0',
          200: '#FFF5E6',
          300: '#FFEFD5',
          400: '#FFE4C4',
        },
        candy: {
          pink: '#FF6B9D',
          teal: '#4ECDC4',
          yellow: '#FFE66D',
          mint: '#95E1D3',
          coral: '#F38181',
          purple: '#AA96DA',
          baby: '#FCBAD3',
        }
      },
      fontFamily: {
        pixel: ['"Press Start 2P"', 'cursive'],
        cute: ['"ZCOOL KuaiLe"', 'cursive'],
      },
      boxShadow: {
        'pixel': '4px 4px 0px 0px rgba(0,0,0,0.2)',
        'pixel-hover': '6px 6px 0px 0px rgba(0,0,0,0.2)',
        'pixel-inset': 'inset 2px 2px 0px 0px rgba(0,0,0,0.1)',
      },
      animation: {
        'bounce-slow': 'bounce 2s infinite',
        'shake': 'shake 0.5s ease-in-out',
        'pop': 'pop 0.3s ease-out',
        'confetti': 'confetti 1s ease-out forwards',
        'glow': 'glow 2s ease-in-out infinite alternate',
        'rainbow': 'rainbow 3s linear infinite',
      },
      keyframes: {
        shake: {
          '0%, 100%': { transform: 'translateX(0)' },
          '20%, 60%': { transform: 'translateX(-5px)' },
          '40%, 80%': { transform: 'translateX(5px)' },
        },
        pop: {
          '0%': { transform: 'scale(0.8)', opacity: '0' },
          '50%': { transform: 'scale(1.2)' },
          '100%': { transform: 'scale(1)', opacity: '1' },
        },
        confetti: {
          '0%': { transform: 'translateY(0) rotate(0deg)', opacity: '1' },
          '100%': { transform: 'translateY(100px) rotate(720deg)', opacity: '0' },
        },
        glow: {
          '0%': { filter: 'brightness(1)' },
          '100%': { filter: 'brightness(1.3)' },
        },
        rainbow: {
          '0%': { filter: 'hue-rotate(0deg)' },
          '100%': { filter: 'hue-rotate(360deg)' },
        },
      },
    },
  },
  plugins: [],
};
