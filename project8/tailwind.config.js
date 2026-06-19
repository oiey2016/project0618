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
        'bg-dark': '#0a0e1a',
        'bg-purple': '#1a1033',
        'neon-pink': '#ff2d95',
        'neon-cyan': '#00f0ff',
        'neon-red': '#ff3b3b',
        'neon-orange': '#ff9f1c',
        'neon-green': '#39ff14',
        'text-primary': '#e8e8f0',
        'text-muted': '#7a7a9a',
      },
      fontFamily: {
        mono: ['"Share Tech Mono"', 'monospace'],
        hand: ['"ZCOOL KuaiLe"', 'sans-serif'],
        pixel: ['"VT323"', 'monospace'],
      },
      animation: {
        'avatar-breathe': 'avatar-breathe 3s ease-in-out infinite',
        'heartbeat': 'heartbeat 1.2s ease-in-out infinite',
        'danger-pulse': 'danger-pulse 0.8s ease-in-out infinite',
        'blink': 'blink 1s step-end infinite',
        'message-in': 'message-in 0.4s ease-out forwards',
        'choice-in': 'choice-in 0.5s ease-out forwards',
        'panel-slide-up': 'panel-slide-up 0.4s ease-out forwards',
        'fade-in': 'fade-in 0.6s ease-out forwards',
        'typing-dot': 'typing-dot 1.4s ease-in-out infinite',
        'wave': 'wave 0.5s ease-in-out infinite alternate',
        'glitch': 'glitch 3s infinite',
      },
      keyframes: {
        'avatar-breathe': {
          '0%, 100%': { transform: 'scale(1)', opacity: '1' },
          '50%': { transform: 'scale(1.04)', opacity: '0.95' },
        },
        'heartbeat': {
          '0%, 100%': { transform: 'scaleX(1)' },
          '14%': { transform: 'scaleX(1.1)' },
          '28%': { transform: 'scaleX(1)' },
          '42%': { transform: 'scaleX(1.08)' },
          '70%': { transform: 'scaleX(1)' },
        },
        'danger-pulse': {
          '0%, 100%': { borderColor: 'rgba(255,59,59,0.3)' },
          '50%': { borderColor: 'rgba(255,59,59,0.9)' },
        },
        'blink': {
          '0%, 100%': { opacity: '1' },
          '50%': { opacity: '0' },
        },
        'message-in': {
          '0%': { opacity: '0', transform: 'translateY(12px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        'choice-in': {
          '0%': { opacity: '0', transform: 'translateY(16px) scale(0.98)' },
          '100%': { opacity: '1', transform: 'translateY(0) scale(1)' },
        },
        'panel-slide-up': {
          '0%': { opacity: '0', transform: 'translateY(30px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        'fade-in': {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        'typing-dot': {
          '0%, 60%, 100%': { transform: 'translateY(0)', opacity: '0.4' },
          '30%': { transform: 'translateY(-4px)', opacity: '1' },
        },
        'wave': {
          '0%': { transform: 'scaleY(0.5)' },
          '100%': { transform: 'scaleY(1)' },
        },
        'glitch': {
          '0%, 90%, 100%': { transform: 'translate(0)' },
          '92%': { transform: 'translate(-1px, 1px)' },
          '94%': { transform: 'translate(1px, -1px)' },
          '96%': { transform: 'translate(-1px, -1px)' },
          '98%': { transform: 'translate(1px, 1px)' },
        },
      },
    },
  },
  plugins: [],
};
