/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        editor: {
          bg: '#ffffff',
          text: '#37352f',
          border: '#e9e9e7',
          hover: '#f7f6f3',
          selected: '#e3e2e0',
        },
      },
    },
  },
  plugins: [],
}
