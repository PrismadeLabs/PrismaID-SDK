module.exports = {
  content: ["./public/**/*.html", "./src/**/*.tsx", "./src/**/*.ts", "./src/**/*.js", "./src/**/*.json"],

  theme: {
    fontFamily: {
      sans: ["Gilroy", "sans-serif"],
    },

    extend: {
      colors: {
        "prismade-red": "#fa0000",
        "prismade-blue": "#00368e",

        "status-red": "#e64a19",
        "status-yellow": "#ffd740",
        "status-orange": "#ff8c00",
        "status-green": "#81c784",
      },

      maxHeight: {
        "1/2-screen": "50vh",
      },

      spacing: {
        100: "28rem",
        104: "32rem",
        108: "36rem",
        112: "40rem",
        116: "44rem",

        "safe-top": "env(safe-area-inset-top)",
        "safe-bottom": "env(safe-area-inset-bottom)",
        "safe-left": "env(safe-area-inset-left)",
        "safe-right": "env(safe-area-inset-right)",
      },
    },
  },

  plugins: [require("@tailwindcss/typography")],
};
