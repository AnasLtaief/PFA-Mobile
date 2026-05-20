/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        background: "#0A0A0F",
        surface: "#13131A",
        primary: "#6C63FF",
        accent: "#00D4AA",
        emergency: "#FF6B35",
        textPrimary: "#F0F0F5",
        textSecondary: "#8A8A9E",
      }
    },
  },
  plugins: [],
}
