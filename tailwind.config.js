/** @type {import('tailwindcss').Config} */
const plugin = require("tailwindcss/plugin");

module.exports = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      backgroundImage: {
        "gradient-radial": "radial-gradient(var(--tw-gradient-stops))",
        "gradient-conic":
          "conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))",
      },
      boxShadow: {
        "custom-left": "4px 4px 0px -0 #202735",
        "custom-right": "-4px 4px 0px -0 #202735",
      },
      colors: {
        base: {
          "dark-gray": "#202735",
          gray: "#79808B",
        },
        primary: {
          blue: "#0278FD",
          yellow: "#FCB406",
          red: "#D44040",
        },
      },
      aspectRatio: {
        poster: "2 / 3",
      },
      screens: {
        xs: "375px",
      },
      gridTemplateColumns: {
        24: "repeat(24, minmax(0, 1fr))",
      },
      gridColumn: {
        "span-13": "span 13 / span 13",
        "span-14": "span 14 / span 14",
        "span-24": "span 24 / span 24",
      },
    },
  },
  plugins: [
    require("autoprefixer"),
    require("@tailwindcss/typography"),
    plugin(function ({ addVariant }) {
      addVariant("hocus", ["&:hover", "&:focus"]);
    }),
  ],
};
