import plugin from 'tailwindcss/plugin'

/** @type {import('tailwindcss').Config} */
export const content = ['./src/renderer/**/*.{js,ts,jsx,tsx}']
export const darkMode = 'selector'
export const theme = {
  extend: {
    fontFamily: {
      poppins: ['Poppins', 'sans-serif']
    },
    animation: {
      shimmer: 'shimmer 8s infinite',
      fadeIn: 'fadeIn 0.3s',
      fadeOut: 'fadeOut 0.2s',
    },
    colors: {
      foreground: '#FFFFFF',
      background: '#000000'
    },
    keyframes: {
      shimmer: {
        '0%, 90%, 100%': {
          'background-position': 'calc(-100% - var(--shimmer-width)) 0'
        },
        '30%, 60%': {
          'background-position': 'calc(100% + var(--shimmer-width)) 0'
        }
      },
      fadeIn: {
        '0%': {
          'opacity': '0%'
        },
        '100%': {
          'opacity': '100%'
        }
      },
      fadeOut: {
        '0%': {
          'opacity': '100%'
        },
        '100%': {
          'opacity': '0%'
        }
      }
    }
  },
  plugins: [
    plugin(function ({ matchUtilities, theme }) {
      const flattenedColors = Object.entries(theme('colors')).reduce((acc, [key, value]) => {
        if (typeof value === 'string') acc[key] = value
        else {
          Object.entries(value).forEach(([number, color]) => {
            acc[`${key}-${number}`] = color
          })
        }
        return acc
      }, {})
      matchUtilities(
        {
          'progress-bar': (value) => ({
            backgroundColor: value,
            '&::-webkit-progress-bar': {
              backgroundColor: value
            }
          }),
          'progress-value': (value) => ({
            color: value,
            '&::-webkit-progress-value': {
              backgroundColor: value
            },
            '&::-moz-progress-bar': {
              backgroundColor: value
            }
          })
        },
        {
          values: flattenedColors,
          variants: ['responsive']
        }
      )
    }),
  ]
}
