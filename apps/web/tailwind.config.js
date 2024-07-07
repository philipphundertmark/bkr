const { createGlobPatternsForDependencies } = require('@nx/angular/tailwind');
const { join } = require('path');
const colors = require('tailwindcss/colors');
const defaultTheme = require('tailwindcss/defaultTheme');

/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    join(__dirname, 'src/**/!(*.stories|*.spec).{ts,html}'),
    ...createGlobPatternsForDependencies(__dirname),
  ],
  theme: {
    colors: {
      transparent: 'transparent',
      current: 'currentColor',
      black: colors.black,
      white: colors.white,
      gray: colors.slate,
      indigo: colors.indigo,
      red: colors.rose,
      green: colors.emerald,
    },
    extend: {
      animation: {
        zoom: 'zoom 1s infinite ease-in-out',
      },
      fontFamily: {
        sans: ['Inter var', ...defaultTheme.fontFamily.sans],
      },
      keyframes: {
        zoom: {
          '0%, 100%': { transform: 'scale(0)' },
          '50%': { transform: 'scale(1)' },
        },
      },
    },
  },
  plugins: [require('@tailwindcss/forms')],
};
