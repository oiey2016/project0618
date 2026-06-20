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
        'dodge-blue': '#00D4FF',
        'dodge-blue-dark': '#0066FF',
        'dodge-red': '#FF3D68',
        'dodge-red-dark': '#CC1133',
        'dodge-purple': '#A855F7',
        'dodge-purple-dark': '#7C3AED',
        'dodge-orange': '#FF8C00',
        'dodge-yellow': '#FACC15',
        'dodge-bg-dark': '#0F172A',
        'dodge-bg-mid': '#1E293B',
      },
      fontFamily: {
        'display': ['"Press Start 2P"', 'system-ui', 'sans-serif'],
        'game': ['"JetBrains Mono"', 'monospace'],
      },
      animation: {
        'pulse-glow': 'pulseGlow 2s ease-in-out infinite',
        'bounce-slow': 'bounce 2s infinite',
        'shake': 'shake 0.3s ease-in-out',
        'rainbow': 'rainbow 3s linear infinite',
        'float': 'float 3s ease-in-out infinite',
      },
      keyframes: {
        pulseGlow: {
          '0%, 100%': { boxShadow: '0 0 20px rgba(168, 85, 247, 0.5), 0 0 40px rgba(168, 85, 247, 0.3)' },
          '50%': { boxShadow: '0 0 30px rgba(168, 85, 247, 0.8), 0 0 60px rgba(168, 85, 247, 0.5)' },
        },
        shake: {
          '0%, 100%': { transform: 'translateX(0)' },
          '25%': { transform: 'translateX(-5px)' },
          '75%': { transform: 'translateX(5px)' },
        },
        rainbow: {
          '0%': { color: '#00D4FF' },
          '33%': { color: '#FF3D68' },
          '66%': { color: '#A855F7' },
          '100%': { color: '#00D4FF' },
        },
        float: {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-10px)' },
        },
      },
      boxShadow: {
        'neon-blue': '0 0 15px rgba(0, 212, 255, 0.6), 0 0 30px rgba(0, 212, 255, 0.3)',
        'neon-red': '0 0 15px rgba(255, 61, 104, 0.6), 0 0 30px rgba(255, 61, 104, 0.3)',
        'neon-purple': '0 0 20px rgba(168, 85, 247, 0.7), 0 0 40px rgba(168, 85, 247, 0.4)',
        'neon-yellow': '0 0 15px rgba(250, 204, 21, 0.6), 0 0 30px rgba(250, 204, 21, 0.3)',
      },
    },
  },
  plugins: [],
};
