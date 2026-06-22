/** @type {import('tailwindcss').Config} */

export default {
  darkMode: "class",
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    container: {
      center: true,
      padding: '1rem',
      screens: {
        sm: '480px',
        md: '480px',
        lg: '480px',
        xl: '480px',
      },
    },
    extend: {
      colors: {
        mint: {
          50: '#F0F9F4',
          100: '#D9F0E4',
          200: '#B8E1CE',
          300: '#7FC8A9',
          400: '#5EB390',
          500: '#3E9C78',
          600: '#2F7A5C',
        },
        coral: {
          50: '#FFF1EE',
          100: '#FFE0D8',
          200: '#FFC9B8',
          300: '#FFB4A2',
          400: '#FF8F75',
          500: '#FF6B47',
          600: '#E85432',
        },
        cream: {
          50: '#FDFBF5',
          100: '#F8F4E3',
          200: '#F0E9D1',
          300: '#E5DBB8',
        },
        lavender: {
          100: '#E8E8F0',
          200: '#D1D1E1',
          300: '#B8B8D1',
          400: '#9D9DC2',
          500: '#8282B3',
        },
        coffee: {
          400: '#6B6B6B',
          500: '#4A4A4A',
          600: '#333333',
        },
      },
      fontFamily: {
        display: ['"ZCOOL KuaiLe"', '"Noto Sans SC"', 'sans-serif'],
        body: ['"Noto Sans SC"', 'sans-serif'],
        mono: ['"JetBrains Mono"', 'monospace'],
      },
      animation: {
        'float': 'float 3s ease-in-out infinite',
        'shake': 'shake 0.3s ease-in-out',
        'pulse-slow': 'pulse 3s ease-in-out infinite',
        'bounce-slow': 'bounce 2s ease-in-out infinite',
        'slide-up': 'slideUp 0.6s ease-out forwards',
        'slide-down': 'slideDown 0.3s ease-out forwards',
        'fade-in': 'fadeIn 0.3s ease-out forwards',
        'scale-in': 'scaleIn 0.2s ease-out forwards',
        'damage-float': 'damageFloat 1s ease-out forwards',
        'gold-float': 'goldFloat 0.8s ease-out forwards',
        'sway': 'sway 2s ease-in-out infinite',
      },
      keyframes: {
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-10px)' },
        },
        shake: {
          '0%, 100%': { transform: 'translateX(0)' },
          '25%': { transform: 'translateX(-5px)' },
          '75%': { transform: 'translateX(5px)' },
        },
        slideUp: {
          '0%': { opacity: '0', transform: 'translateY(20px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        slideDown: {
          '0%': { opacity: '0', transform: 'translateY(-20px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        scaleIn: {
          '0%': { opacity: '0', transform: 'scale(0.8)' },
          '100%': { opacity: '1', transform: 'scale(1)' },
        },
        damageFloat: {
          '0%': { opacity: '1', transform: 'translateY(0) scale(1)' },
          '100%': { opacity: '0', transform: 'translateY(-50px) scale(1.2)' },
        },
        goldFloat: {
          '0%': { opacity: '1', transform: 'translateY(0) scale(0.5)' },
          '50%': { opacity: '1', transform: 'translateY(-20px) scale(1.2)' },
          '100%': { opacity: '0', transform: 'translateY(-40px) scale(0.8)' },
        },
        sway: {
          '0%, 100%': { transform: 'rotate(-3deg)' },
          '50%': { transform: 'rotate(3deg)' },
        },
      },
      boxShadow: {
        'soft': '0 4px 20px rgba(0, 0, 0, 0.08)',
        'card': '0 8px 30px rgba(0, 0, 0, 0.1)',
        'inner-soft': 'inset 0 2px 4px rgba(0, 0, 0, 0.06)',
      },
    },
  },
  plugins: [],
};
