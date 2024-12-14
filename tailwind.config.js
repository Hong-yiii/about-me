/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: "class", // Fixes the typo from "darkmode" to "darkMode"
  content: [
    "./src/**/*.{js,ts,jsx,tsx,mdx}", // Ensures Tailwind scans your components and pages
    "./_posts/**/*.md", // Adds support for markdown files in the _posts folder
    "./_mainIntroduction/**/*.md", // Adds support for markdown files in the _mainIntroduction folder
  ],
  theme: {
    extend: {
      colors: {
        // Example custom colors (optional)
        primary: "#1D4ED8", // Tailwind blue-700
        secondary: "#9333EA", // Tailwind purple-700
      },
      spacing: {
        // Example custom spacing (optional)
        "128": "32rem",
        "144": "36rem",
      },
    },
  },
  plugins: [
  ],
};
