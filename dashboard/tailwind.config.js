/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{vue,js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          50: '#FAF8F5',
          100: '#F5E6D3',
          200: '#E8B86D',
          300: '#D4A574',
          400: '#C9956A',
          500: '#B8956A',
          600: '#A8856A',
          700: '#8A6F5A',
          800: '#6C594A',
          900: '#4A3F35',
        },
      },
      fontFamily: {
        cairo: ['Cairo', 'sans-serif'],
        tajawal: ['Tajawal', 'sans-serif'],
      },
    },
  },
  plugins: [],
}