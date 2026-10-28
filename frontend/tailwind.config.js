/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        saathi: {
          navy: '#0b192c',
          blue: '#1e3e62',
          accent: '#0066cc',
          light: '#f0f6ff',
          card: '#ffffff',
          dark: '#070f1e',
        }
      }
    },
  },
  plugins: [],
}
