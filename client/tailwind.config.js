/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        forest: {
          DEFAULT: '#245C45',
          dark: '#173D30',
          light: '#2E7356',
          hover: '#1e4d3a',
          50: '#f0f6f3',
          100: '#dbece2',
          500: '#245C45',
          700: '#173D30',
          800: '#102b22',
        },
        sage: {
          DEFAULT: '#DCE8D5',
          light: '#EEF4EA',
          dark: '#B8CDB0',
          border: '#C5D8BD',
        },
        cream: {
          DEFAULT: '#F7F5EB',
          light: '#FCFAF4',
          dark: '#EDE8D6',
        },
        terracotta: {
          DEFAULT: '#C77B57',
          dark: '#A95E3C',
          light: '#E19978',
        },
        charcoal: {
          DEFAULT: '#26352C',
          muted: '#4A5B51',
          light: '#72857A',
        }
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', '-apple-system', 'sans-serif'],
      },
      boxShadow: {
        'nature': '0 4px 20px -2px rgba(23, 61, 48, 0.08), 0 2px 6px -1px rgba(23, 61, 48, 0.04)',
        'nature-lg': '0 10px 30px -4px rgba(23, 61, 48, 0.12), 0 4px 10px -2px rgba(23, 61, 48, 0.06)',
      }
    },
  },
  plugins: [],
}
