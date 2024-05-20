/** @type {import('tailwindcss').Config} */
export const content = ['./src/renderer/**/*.{js,ts,jsx,tsx}']
export const darkMode = 'selector'
export const theme = {
  extend: {
    fontFamily: {
      poppins: ['Poppins', 'sans-serif']
    },
    colors: {
      foreground: '#FFFFFF',
      background: '#000000'
    }
  },
  plugins: []
}
