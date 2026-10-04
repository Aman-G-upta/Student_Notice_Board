/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      fontFamily: {
        display: ['"Bricolage Grotesque"', 'ui-sans-serif', 'system-ui', 'sans-serif'],
        sans: ['"Instrument Sans"', 'ui-sans-serif', 'system-ui', 'sans-serif'],
      },
      colors: {
        brand: {
          50: '#eef2ff',
          100: '#e0e8ff',
          200: '#c3d0ff',
          300: '#9db1ff',
          400: '#6f87f7',
          500: '#4a63e8',
          600: '#3549d1',
          700: '#2b3ba8',
          800: '#25327f',
          900: '#1c2559',
        },
        paper: '#f4f6fb',
      },
      boxShadow: {
        card: '0 1px 2px rgba(23,32,51,0.05), 0 4px 14px -6px rgba(23,32,51,0.10)',
        lift: '0 2px 4px rgba(23,32,51,0.06), 0 14px 30px -12px rgba(23,32,51,0.22)',
      },
    },
  },
  plugins: [],
};
