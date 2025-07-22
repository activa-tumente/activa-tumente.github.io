/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'blue-dark': '#172554', // Azul oscuro (blue-950 de Tailwind)
      },
    },
  },
  plugins: [],
}
