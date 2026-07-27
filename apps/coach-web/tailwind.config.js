/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        ink: '#070D18',
        surface: '#101C2E',
        elevated: '#172538',
        gold: '#2DD4BF',
        'gold-bright': '#5EEAD4',
        'gold-pressed': '#14B8A6',
        mute: '#A8A8A8',
        line: '#243447',
      },
      fontFamily: {
        display: ['var(--font-syne)', 'system-ui', 'sans-serif'],
        sans: ['var(--font-outfit)', 'system-ui', 'sans-serif'],
      },
      boxShadow: {
        card: '0 1px 0 rgba(255,255,255,0.04), 0 12px 40px rgba(0,0,0,0.35)',
      },
    },
  },
  plugins: [],
};
