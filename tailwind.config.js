/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './main.js', './js/**/*.js'],
  theme: {
    extend: {
      colors: {
        'fintech-teal': '#000000',
        'bg-dark': '#ffffff',
      },
      fontFamily: {
        inter: ['Inter', 'sans-serif'],
      },
      fontSize: {
        'hero': 'clamp(3rem, 7vw, 6.5rem)',
        'section': 'clamp(2rem, 4vw, 3rem)',
      },
    },
  },
  plugins: [],
}
