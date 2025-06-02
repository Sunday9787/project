/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./src/**/*.{vue,tsx}'],
  theme: {
    extend: {
      colors: {
        white: '#fcfcfc',
        black: '#333',
        primary: '#2F318B'
      },
      screens: {
        xs: '350px',
        // => @media (min-width: 350px) { ... }

        sm: '576px',
        // => @media (min-width: 576px) { ... }

        md: '768px',
        // => @media (min-width: 768px) { ... }

        lg: '992px',
        // => @media (min-width: 992px) { ... }

        xl: '1200px',
        // => @media (min-width: 1200px) { ... }

        '2xl': '1400px'
        // => @media (min-width: 1400px) { ... }
      }
    }
  },
  plugins: []
}
