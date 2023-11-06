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
  daisyui: {
    themes: [
      {
        mytheme: {
          primary: "#0278FD",
          secondary: "#79808B",
          accent: "#1d4ed8",
          neutral: "#1c1917",
          "base-100": "#202735",
          info: "#202735",
          success: "#32e7c9",
          warning: "#FCB406",
          error: "#D44040",
        },
      },
    ],
  },
  plugins: [
    require("daisyui"),
    require("@tailwindcss/typography"),
    plugin(function ({ addVariant }) {
      addVariant("hocus", ["&:hover", "&:focus"]);
    }),
  ],
};
