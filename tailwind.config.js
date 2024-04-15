/** @type {import('tailwindcss').Config} */
export default {
  content: ['./src/**/*.html', './src/**/*.jsx', './src/**/*.tsx'],
  theme: {
    extend: {},
  },
  plugins: [
    require('tailwindcss'),
    require('autoprefixer'),
    require('daisyui'),
  ],
}

