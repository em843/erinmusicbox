/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{html,ts}"],
  theme: {
    extend: {
      colors: {
        primary: "#C8AEDB", // Wisteria
        secondary: "#91AFCA", // Powder blue
        background: "#FDF5EC", // Linen
        "accent-1": "#E15554", // Indian red
        "accent-2": "#b89f7f", // Taupe
        "accent-3": "#afb1a6", // Gray-green
        text: "#000000", // Strong black
        canvas: "#fdfffe",
      },
      fontFamily: {
        lora: ["Lora", "serif"], // Add Lora with a fallback to serif
      },
    },
  },
  plugins: [],
};

// Other colors:
// background: #fdfffe;
/* mintcream, #D3FCE8 or #FDFFFE*/
