/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        ivory: '#F7F4EF',
        'ivory-2': '#F1ECE4',
        panel: '#FFFCF8',
        ink: '#1A1A1A',
        'ink-soft': '#3A3A3A',
        mute: '#6B6560',
        line: '#E6E0D6',
        bronze: '#8C6B3E',
        'bronze-soft': '#B08A55',
        success: '#2F6B4F',
        warning: '#9A6B1F',
        danger: '#8B2E2E',
        info: '#3D5A73',
      },
      fontFamily: {
        display: ['var(--font-fraunces)', 'Georgia', 'serif'],
        sans: ['var(--font-figtree)', 'system-ui', 'sans-serif'],
      },
      boxShadow: {
        soft: '0 1px 0 rgba(26,26,26,0.04), 0 8px 24px rgba(26,26,26,0.04)',
      },
      borderRadius: {
        card: '14px',
      },
    },
  },
  plugins: [],
};
