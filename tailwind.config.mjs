/** @type {import('tailwindcss').Config} */
export default {
  content: ["./src/**/*.{astro,html,js,jsx,md,mdx,svelte,ts,tsx,vue}"],
  darkMode: "class",
  theme: {
    extend: {
      colors: {
        primary: "#6a00ff",
        secondary: "#770fff",
        dark: "#0b0b0b",
        light: "#ffffff",
      },
      fontFamily: {
        sans: ["Montserrat Variable", "sans-serif"],
      },
    },
  },
  plugins: [require("@tailwindcss/typography"),
     require("flowbite/plugin")],
};
