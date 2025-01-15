/** @type {import('tailwindcss').Config} */
const plugin = require("tailwindcss/plugin");

module.exports = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],

  theme: {
    extend: {
      backgroundImage: {
        "gradient-radial": "radial-gradient(var(--tw-gradient-stops))",
        "gradient-conic":
          "conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))",
      },
      boxShadow: {
        "custom-left": "4px 4px 0px -0 #131720",
        "custom-right": "-4px 4px 0px -0 #131720",
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
        "xs-max": { max: "375px" },
        "sm-max": { max: "640px" },
        "md-max": { max: "768px" },
        "lg-max": { max: "1024px" },
        "xl-max": { max: "1280px" },
        "2xl-max": { max: "1536px" },
        "3xl-max": { max: "1920px" },
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
          primary: "#0278fd",
          "primary-content": "#ffffff",
          secondary: "#79808B",
          "secondary-content": "#ffffff",
          accent: "#1d4ed8",
          "accent-content": "#cfdefb",
          neutral: "#1f2937",
          "neutral-content": "#cdd0d3",
          "base-100": "#131720",
          "base-200": "#0f121a",
          "base-300": "#0b0e15",
          "base-content": "#cacbcd",
          info: "#202735",
          "info-content": "#cdcfd3",
          success: "#32e7c9",
          "success-content": "#01130f",
          warning: "#fcb406",
          "warning-content": "#160c00",
          error: "#d44040",
          "error-content": "#100101",
        },
      },
    ],
  },
  plugins: [
    require("daisyui"),
    require("@tailwindcss/typography"),
    require("@tailwindcss/container-queries"),
    plugin(function ({ addVariant }) {
      addVariant("hocus", ["&:hover", "&:focus"]);
      [...Array(24).keys()].forEach((i) => {
        addVariant(`child-${i + 1}`, `&:nth-child(${i + 1})`);
      });
      [...Array(24).keys()].forEach((i) => {
        addVariant(`child-${i + 1}n`, `&:nth-child(${i + 1}n)`);
      });
      [...Array(24).keys()].forEach((i) => {
        addVariant(`child-${i + 1}n+1`, `&:nth-child(${i + 1}n+1)`);
      });
      [...Array(24).keys()].forEach((i) => {
        addVariant(`child-${i + 1}n-1`, `&:nth-child(${i + 1}n-1)`);
      });
    }),
  ],
};
