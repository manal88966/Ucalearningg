/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        flame: '#e8490f',
        azure: '#2563ff',
        mint: '#00b894',
        gold: '#f0a500',
        ink: '#0a0a0f',
        cream: '#f5f3ee',
      },
      fontFamily: {
        syne: ['Syne', 'sans-serif'],
        dm: ['DM Sans', 'sans-serif'],
      },
    },
  },
  plugins: [],
}
