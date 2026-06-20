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
        'old-brown': '#1a1510',
        'blood-red': '#8b2635',
        'moss-green': '#2d4a3e',
        'bone-white': '#d4c5a9',
        'aged-wood': '#3d2f22',
        'rust': '#6b3a2e',
      },
      fontFamily: {
        'display': ['"ZCOOL XiaoWei"', 'serif'],
        'body': ['"Noto Serif SC"', 'serif'],
      },
      animation: {
        'flicker': 'flicker 3s infinite',
        'breath': 'breath 4s ease-in-out infinite',
        'float': 'float 6s ease-in-out infinite',
        'shake': 'shake 0.5s ease-in-out',
        'glow': 'glow 2s ease-in-out infinite alternate',
      },
      keyframes: {
        flicker: {
          '0%, 100%': { opacity: '1' },
          '50%': { opacity: '0.8' },
          '75%': { opacity: '0.9' },
        },
        breath: {
          '0%, 100%': { transform: 'scale(1)', opacity: '0.8' },
          '50%': { transform: 'scale(1.05)', opacity: '1' },
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
        glow: {
          '0%': { boxShadow: '0 0 5px rgba(139, 38, 53, 0.5)' },
          '100%': { boxShadow: '0 0 20px rgba(139, 38, 53, 0.8)' },
        },
      },
      opacity: {
        '05': '0.05',
        '15': '0.15',
        '35': '0.35',
        '45': '0.45',
        '55': '0.55',
        '65': '0.65',
        '85': '0.85',
        '95': '0.95',
      },
    },
  },
  plugins: [],
};
