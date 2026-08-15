/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        ivory: '#F5F3EE',
        surface: '#FAF9F6',
        panel: '#FFFCF8',
        ink: '#20201E',
        'ink-soft': '#3A3936',
        mute: '#6F6C66',
        line: '#E8E4DC',
        bronze: '#9A6735',
        'bronze-soft': '#B07D45',
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
        soft: '0 1px 0 rgba(32,32,30,0.04), 0 10px 28px rgba(32,32,30,0.05)',
        lift: '0 1px 0 rgba(32,32,30,0.04), 0 14px 36px rgba(32,32,30,0.08)',
      },
      borderRadius: {
        card: '20px',
      },
    },
  },
  plugins: [],
};
