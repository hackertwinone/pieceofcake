module.exports = {
  content: ["./src/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      colors: {
        matte: "#0A0A0A",
        lacquer: "#111111",
        ivory: {
          DEFAULT: "#F0EBE0",
          dim: "#C8BFA8",
          border: "#E8E4DC",
        },
        gold: "#B8975A",
      },
      fontFamily: {
        cinzel: ["'Cinzel Decorative'", "serif"],
        garamond: ["'EB Garamond'", "serif"],
      },
    },
  },
  plugins: [],
};
