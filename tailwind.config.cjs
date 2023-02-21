/** @type {import('tailwindcss').Config} */
const plugin = require("tailwindcss/plugin");

module.exports = {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
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
    },
  },
  plugins: [
    require("@tailwindcss/typography"),
    require("@tailwindcss/line-clamp"),
    plugin(function ({ addVariant }) {
      addVariant("hocus", ["&:hover", "&:focus"]);
    }),
  ],
};
