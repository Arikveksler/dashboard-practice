/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,jsx}"],
  theme: {
    extend: {
      colors: {
        panel: {
          950: "#0a0a0a",
          900: "#121212",
          800: "#1a1a1a",
          700: "#232323",
        },
        rim: {
          400: "#3a3a3a",
          500: "#2a2a2a",
          600: "#222222",
        },
        redline: {
          DEFAULT: "#e10600",
          bright: "#ff1e1e",
          dark: "#8a0400",
        },
      },
      fontFamily: {
        digital: ["Rajdhani", "sans-serif"],
        display: ["Orbitron", "sans-serif"],
        body: ["Assistant", "sans-serif"],
      },
      boxShadow: {
        glow: "0 0 12px 2px rgba(255, 30, 30, 0.55)",
        "glow-sm": "0 0 6px 1px rgba(255, 30, 30, 0.45)",
      },
    },
  },
  plugins: [],
};
