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
        "primary": "var(--text-primary)",
        "primary-muted": "var(--text-primary-muted)",
        "gold": "var(--accent-gold)",
        "gold-light": "var(--gold-light)",
        "gold-hover": "var(--gold-hover)",
        "surface": "var(--bg-surface)",
        "background": "var(--bg-background)",
        "surface-subtle": "var(--bg-surface-subtle)",
        "surface-card": "var(--bg-surface-card)",
        "surface-elevated": "var(--bg-surface-elevated)",
        "border-subtle": "var(--border-subtle)",
        "border-gold": "var(--border-gold)",
        "status-success": "var(--status-success)",
        "status-warning": "var(--status-warning)",
        "status-error": "var(--status-error)",
      },
      borderRadius: {
        'apple': '1.5rem',
        'apple-lg': '2rem',
        'apple-sm': '1rem',
      },
      boxShadow: {
        'apple-soft': 'var(--shadow-soft)',
        'apple-hover': 'var(--shadow-hover)',
        'gold-subtle': '0 4px 20px rgba(212, 175, 55, 0.2)',
      },
      fontFamily: {
        sans: ['Inter', '-apple-system', 'BlinkMacSystemFont', 'sans-serif'],
      }
    },
  },
  plugins: [],
}
