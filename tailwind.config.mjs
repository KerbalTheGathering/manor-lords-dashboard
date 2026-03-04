/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        parchment: '#F5ECD7',
        'dark-brown': '#3C2415',
        'medium-brown': '#6B4226',
        'warm-gold': '#C5973B',
        'deep-red': '#8B2500',
        'forest-green': '#2E5230',
        slate: '#4A4A4A',
        'light-tan': '#E8DCC8',
      },
      fontFamily: {
        medieval: ['EB Garamond', 'Georgia', 'serif'],
        display: ['MedievalSharp', 'cursive'],
        mono: ['Fira Code', 'monospace'],
      },
      backgroundImage: {
        'parchment-texture': "url('/textures/parchment.svg')",
      },
      boxShadow: {
        'medieval': '0 2px 8px rgba(60, 36, 21, 0.2)',
        'medieval-lg': '0 4px 16px rgba(60, 36, 21, 0.3)',
      },
    },
  },
  plugins: [],
};
