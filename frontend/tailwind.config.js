/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          50: '#e6f2ff',
          100: '#bfddff',
          200: '#99c9ff',
          300: '#73b4ff',
          400: '#4da0ff',
          500: '#268bff',
          600: '#1f70cc',
          700: '#175599',
          800: '#0f3b66',
          900: '#082033',
        },
        secondary: {
          50: '#fff8e6',
          100: '#ffecbf',
          200: '#ffe099',
          300: '#ffd473',
          400: '#ffc84d',
          500: '#ffbc26',
          600: '#cc961f',
          700: '#997117',
          800: '#664b0f',
          900: '#332608',
        },
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
      },
    },
  },
}
