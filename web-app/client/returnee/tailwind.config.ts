/** @type {import('tailwindcss').Config} */
import tailwindScrollbar from "tailwind-scrollbar";

const tailwindConfig = {
  content: ["./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        PrimaryColor: "#7ED321", // custom green color
        AccentColor: "#FA812F",
        AccentColorHover: "#f26d13",
      },
    },
  },
  plugins: [tailwindScrollbar],
};

export default tailwindConfig;
