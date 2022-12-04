/* eslint-disable no-undef */
/** @type {import('tailwindcss').Config} */

module.exports = {
  content: ["./index.html", "./src/**/*.{js,ts,vue,jsx,tsx}"],
  theme: {
    extend: {
      fontFamily: {
        doppio: ["Doppio One"],
      },
    },
  },
  plugins: [],
};
