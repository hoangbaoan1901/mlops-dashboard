/** @type {import('tailwindcss').Config} */
const defaultConfig = require("tailwindcss/defaultConfig");

module.exports = {
  ...defaultConfig,
  darkMode: ["class"],
  content: ["./src/**/*.{js,ts,jsx,tsx,mdx}"],
  plugins: [require("tailwindcss-animate")],
  corePlugins: {
    preflight: false
  }
};
