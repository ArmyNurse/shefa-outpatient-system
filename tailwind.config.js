/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{ts,tsx}"],
  theme: {
    extend: {
      fontFamily: {
        cairo: ["Cairo", "sans-serif"],
        tajawal: ["Tajawal", "sans-serif"],
      },
      colors: {
        theme: {
          50: "var(--primary-50)",
          100: "var(--primary-100)",
          200: "var(--primary-200)",
          300: "var(--primary-300)",
          400: "var(--primary-400)",
          500: "var(--primary-500)",
          600: "var(--primary-600)",
          700: "var(--primary-700)",
          800: "var(--primary-800)",
          900: "var(--primary-900)",
        },
        accent: {
          50: "var(--accent-50)",
          100: "var(--accent-100)",
          200: "var(--accent-200)",
          500: "var(--accent-500)",
          700: "var(--accent-700)",
        },
      },
      backgroundColor: {
        "theme-gradient-from": "var(--bg-gradient-from)",
        "theme-gradient-to": "var(--bg-gradient-to)",
        "theme-table-header": "var(--bg-table-header)",
        "theme-row-even": "var(--bg-row-even)",
        "theme-row-odd": "var(--bg-row-odd)",
        "theme-card": "var(--bg-card)",
      },
      textColor: {
        theme: {
          primary: "var(--text-primary)",
          secondary: "var(--text-secondary)",
          muted: "var(--text-muted)",
        },
      },
      borderColor: {
        theme: "var(--border-color)",
      },
    },
  },
  plugins: [],
};
