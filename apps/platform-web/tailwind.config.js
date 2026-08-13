/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        canvas: '#E8EEE9',
        panel: '#F4F7F4',
        ink: '#14201A',
        pine: '#1F4D3A',
        moss: '#3F6B54',
        sand: '#D7C4A3',
        mute: '#5C6B62',
        line: '#C5D0C7',
        danger: '#8B2E2E',
      },
      fontFamily: {
        display: ['var(--font-fraunces)', 'Georgia', 'serif'],
        sans: ['var(--font-figtree)', 'system-ui', 'sans-serif'],
      },
    },
  },
  plugins: [],
};
