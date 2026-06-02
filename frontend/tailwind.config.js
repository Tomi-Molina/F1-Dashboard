/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        bg: {
          primary: "#0A0A0A",
          secondary: "#111111",
          card: "#161616",
          hover: "#1C1C1C",
        },
        border: {
          DEFAULT: "#2A2A2A",
          bright: "#3A3A3A",
        },
        f1: {
          red: "#E10600",
          "red-dark": "#B30500",
          orange: "#FF7C2A",
        },
        team: {
          redbull: "#3671C6",
          ferrari: "#E8002D",
          mercedes: "#27F4D2",
          mclaren: "#FF8000",
          aston: "#358C75",
        },
      },
      fontFamily: {
        display: ["'Rajdhani'", "sans-serif"],
        mono: ["'Space Mono'", "monospace"],
        body: ["'DM Sans'", "sans-serif"],
      },
      backgroundImage: {
        "grid-pattern":
          "linear-gradient(rgba(255,255,255,0.03) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.03) 1px, transparent 1px)",
      },
      backgroundSize: {
        grid: "40px 40px",
      },
    },
  },
  plugins: [],
};
