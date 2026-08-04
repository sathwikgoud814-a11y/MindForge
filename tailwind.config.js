/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: "class",
  theme: {
    extend: {
      colors: {
        "primary": "#111111",
        "primary-muted": "#666666",
        "gold": "#D4AF37",
        "gold-light": "#F9F3E3",
        "gold-hover": "#C59F27",
        "surface": "#FFFFFF",
        "background": "#FAFAFA",
        "surface-subtle": "#F5F5F7",
        "surface-card": "#FFFFFF",
        "border-subtle": "rgba(0, 0, 0, 0.06)",
        "border-gold": "rgba(212, 175, 55, 0.3)",
      },
      borderRadius: {
        'apple': '1.5rem',
        'apple-lg': '2rem',
        'apple-sm': '1rem',
      },
      boxShadow: {
        'apple-soft': '0 4px 24px rgba(0, 0, 0, 0.03), 0 1px 2px rgba(0, 0, 0, 0.02)',
        'apple-hover': '0 12px 32px rgba(0, 0, 0, 0.06), 0 2px 4px rgba(0, 0, 0, 0.03)',
        'gold-subtle': '0 4px 20px rgba(212, 175, 55, 0.2)',
      },
      fontFamily: {
        sans: ['Inter', '-apple-system', 'BlinkMacSystemFont', 'sans-serif'],
      }
    },
  },
  plugins: [],
}
