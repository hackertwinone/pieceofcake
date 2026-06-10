/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        matte:   '#0A0A0A',
        lacquer: '#111111',
        ivory: {
          DEFAULT: '#F0EBE0',
          dim:     '#C8BFA8',
        },
        gold: '#B8975A',
      },
      fontFamily: {
        cinzel:   ["'Cinzel Decorative'", 'serif'],
        garamond: ["'EB Garamond'", 'serif'],
      },
    },
  },
  plugins: [],
}
