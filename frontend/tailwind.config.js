/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{html,ts}"],
  theme: {
    extend: {
      colors: {
        primary: "var(--primary)",
        secondary: "var(--secondary)",
        background: "var(--background)",
        "accent-1": "var(--accent-1)",
        "accent-2": "var(--accent-2)",
        "accent-3": "var(--accent-3)",
        text: "var(--text)",
        "text-2": "var(--text-2)",
        canvas: "var(--canvas)",
      },
      fontFamily: {
        lora: ["Lora", "serif"],
        sans: ["Open Sans", "sans-serif"],
      },
      fontWeight: {
        normal: 400,
        bold: 600,
      },
    },
  },
  plugins: [],
};

// Other colors:
// background: #fdfffe;
/* mintcream, #D3FCE8 or #FDFFFE*/
