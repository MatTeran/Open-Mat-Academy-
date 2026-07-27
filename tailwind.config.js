/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './App.tsx',
    './components/**/*.{js,jsx,ts,tsx}',
    './screens/**/*.{js,jsx,ts,tsx}',
    './navigation/**/*.{js,jsx,ts,tsx}',
    './lib/**/*.{js,jsx,ts,tsx}',
  ],
  presets: [require('nativewind/preset')],
  theme: {
    extend: {
      colors: {
        mat: {
          bg: '#000000',
          surface: '#111111',
          gold: '#FFFFFF',
          text: '#FFFFFF',
          muted: '#A0A0A0',
          error: '#FF4D4D',
          success: '#22C55E',
        },
      },
      fontFamily: {
        display: ['Syne_700Bold'],
        sans: ['Outfit_400Regular'],
        'sans-medium': ['Outfit_500Medium'],
        'sans-semibold': ['Outfit_600SemiBold'],
        'sans-bold': ['Outfit_700Bold'],
      },
    },
  },
  plugins: [],
};
