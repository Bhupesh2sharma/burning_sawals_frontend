/** @type {import('tailwindcss').Config} */
module.exports = {
    content: [
      "./src/**/*.{js,ts,jsx,tsx,mdx}"
    ],
    theme: {
      extend: {
        colors: {
          primary: "#E63946",
          text: "#FFF8F2",
          accent: "#FF6B6B",
          accent2: "#F4A261",
          flameYellow: "#FFD600",
          flameOrange: "#FF5722",
          flameRed: "#E63946",
          flamePink: "#FF2E63",
          flameDark: "#9B1D20",
          flameGray: "#BDBDBD",
          flamePurple: "#6B4CA5EE"
        },
        backgroundImage: {
          'flame-gradient': 'linear-gradient(to right, #FFD600, #F4A261, #FF5722, #E63946, #FF2E63, #6B4CA5EE)',
        },
        fontFamily: {
          tilt: ['"Tilt Warp"', 'cursive'],
          rubik: ['Rubik', 'sans-serif'],
          playfair: ['"Playfair Display"', 'serif'],
          didot: ['"GFS Didot"', 'serif'],
          bodoni: ['"Libre Bodoni"', 'serif'],
          italiana: ['Italiana', 'serif']
        },
      },
    },
    plugins: [],
  };
  