const plugin = require('tailwindcss/plugin');

/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './App.{js,ts,tsx}',
    './app/**/*.{js,ts,tsx}',
    './screens/**/*.{js,ts,tsx}',
    './components/**/*.{js,ts,tsx}',
    './layouts/**/*.{js,ts,tsx}', 
  ],
   presets: [require('nativewind/preset')],
  theme: {
    extend: {
      // Пусто, все в плагине
    },
  },
  plugins: [
    plugin(function ({ addUtilities }) {
      addUtilities({
        '.font-onest-regular': { fontFamily: 'Onest-Regular' },
        '.font-onest-medium': { fontFamily: 'Onest-Medium' },
        '.font-onest-semibold': { fontFamily: 'Onest-SemiBold' },
        '.font-onest-extrabold': { fontFamily: 'Onest-ExtraBold' },
      });
    }),
  ],
};