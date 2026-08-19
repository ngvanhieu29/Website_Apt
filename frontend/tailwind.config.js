/** @type {import('tailwindcss').Config} */

export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      fontFamily: {
        jacques: ['"Jacques Francois"', "cursive"],
        playfair: ['"Playfair Display"', "cursive"],
        beiruti: ["Beiruti", "sans-serif"],
        roboto: ["Roboto", "sans-serif"],
      },

      colors: {
        primary: {
          50: "#E1E8EF",
          100: "#D4DEE7",
          200: "#B7C7D7",
          300: "#99B0C7",
          400: "#7C99B6",
          500: "#5E82A6",
          600: "#4C6B8A",
          700: "#3C546C",
          800: "#2C3D4F",
          900: "#1B2631",
          950: "#141C24",
        },
        accent: {
          50: "#FAF5F0",
          100: "#F4ECE1",
          200: "#E8D6BF",
          300: "#DDC2A2",
          400: "#D2AF84",
          500: "#C69963",
          600: "#B78343",
          700: "#926835",
          800: "#6C4D28",
          900: "#4B351B",
          950: "#382814",
        },
      },
    },
    keyframes: {
      fadeIn: {
        "0%": { opacity: 0 },
        "100%": { opacity: 1 },
      },
      scaleIn: {
        "0%": { transform: "scale(0.95)" },
        "100%": { transform: "scale(1)" },
      },
    },
    animation: {
      fadeIn: "fadeIn 0.3s ease-out",
      scaleIn: "scaleIn 0.3s ease-out",
    },
  },
  plugins: [],
};
