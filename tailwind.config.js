/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: "class",
  content: [
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        /* Custom background colors */
        "background-light": "#F9F6EE", // soft beige-like background
        "background-dark": "#121212", // deep dark theme background

        /* Primary color palette */
        primary: "#4CAF50",
        "primary-dark": "#2E7D32",
        accent: "#8BC34A",
        "accent-dark": "#689F38",

        /* Other subtle tones */
        brown: "#8D6E63",
        beige: "#F0EAD6",
      },

      boxShadow: {
        soft: "0 4px 20px rgba(0,0,0,0.1)",
      },
    },
  },
  plugins: [],
};
