/** @type {import('tailwindcss').Config} */
const tailwindConfig = {
  content: ["./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        PrimaryColor: "#7ED321", // custom green color
      },
    },
  },
  plugins: [],
};

export default tailwindConfig;
