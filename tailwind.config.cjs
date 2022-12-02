/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      gridTemplateColumns: {
        gridmap: "repeat(50, 0fr)",
      },
    },
  },
  plugins: [],
};
