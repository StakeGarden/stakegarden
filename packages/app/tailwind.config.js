/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/ui/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    fontFamily: {
      sans: ["system-ui", "sans-serif"], // will be Stabil Grotesk
    },
    boxShadow: {
      xs: " 0px 1px 2px -1px rgba(17, 12, 34, 0.08)",
      sm: "0px 2px 4px -2px rgba(17, 12, 34, 0.12)",
      md: "0px 6px 16px -6px rgba(17, 12, 34, 0.1)",
      lg: "0px 16px 20px -8px rgba(17, 12, 34, 0.1)",
      xl: "0px 20px 24px -10px rgba(17, 12, 34, 0.1)",
      "2xl": "0px 32px 32px -12px rgba(17, 12, 34, 0.12)",
    },
    colors: {
      primary: {
        50: "#f0fdf5",
        100: "#dcfce9",
        200: "#bbf7d4",
        300: "#87eeb2",
        400: "#31d878",
        500: "#23c468",
        600: "#17a252",
        700: "#167f43",
        800: "#176439",
        900: "#145331",
        950: "#052e18",
      },
      gray: {
        100: "#E2E4E1",
        200: "#D9DBD7",
        300: "#C5C9C2",
        400: "#B2B8AE",
        500: "#8C9486",
        600: "#65705D",
        700: "#44513A",
        800: "#2C3B20",
        900: "#0F2002",
      },
      danger: {
        75: "#FFE0E0",
        200: "#FFA7A7",
        500: "#F03D3D",
        600: "#CF2A2A",
      },
      em: {
        high: "#060D00",
        med: "#4D4F4C",
        low: "#969894",
        disabled: "#C9CBC8",
      },
      surface: {
        25: "#F8F8F7",
        50: "#F3F4F2",
        75: "#ECEDEB",
      },
      white: "#FFFFFF",
      black: "#060D00",
    },
    extend: {
      opacity: {
        8: "0.08",
      },
      height: {
        "nav-height": "72px",
      },
      inset: {
        "nav-height": "72px",
      },
    },
  },
  plugins: [require("@headlessui/tailwindcss")],
};
