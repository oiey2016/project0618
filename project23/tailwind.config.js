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
        'game-orange': '#FF8C42',
        'game-sky': '#5CC8FF',
        'game-green': '#7BC67E',
        'game-cream': '#FFF8F0',
        'game-brown': '#3D2B1F',
      },
      fontFamily: {
        fredoka: ['Fredoka One', 'cursive'],
        nunito: ['Nunito', 'sans-serif'],
      },
    },
  },
  plugins: [],
};
