/* eslint-disable no-undef */
/** @type {import('tailwindcss').Config} */



export default {
  content: ["./index.html", "./src/**/*.{js,ts,vue,jsx,tsx}"],
  theme: {
    extend: {
      fontFamily: {
        doppio: ["Doppio One"],
        rajdhani: ["Rajdhani"],
      },
    },
  },
  plugins: [require("tailwind-scrollbar")],
};
