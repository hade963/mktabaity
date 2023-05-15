/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      colors:{
        'main': '#DAC6ED',
        'accent': '#9D4CDC',
        'card': '#D9D9D9',
        'nav': '#9FA3A5',
      },
    },
  },
  plugins: [],
}

