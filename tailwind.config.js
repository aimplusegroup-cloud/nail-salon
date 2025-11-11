/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/app/**/*.{js,ts,jsx,tsx}",
    "./src/components/**/*.{js,ts,jsx,tsx}",
    "./src/pages/**/*.{js,ts,jsx,tsx}",   // اگر از pages استفاده می‌کنی
    "./src/layouts/**/*.{js,ts,jsx,tsx}", // اگر layout جدا داری
  ],
  theme: {
    extend: {
      fontFamily: {
        bnazanin: ["BNazanin", "sans-serif"],
      },
      colors: {
        rose: {
          50: "#fff5f8",
          100: "#ffeaf2",
          200: "#ffd6e3",
          300: "#ffb4cd",
          400: "#ff8eb5",
          500: "#f66aa0",
          600: "#e5488b",
          700: "#c73778",
          800: "#a22d65",
          900: "#862657",
        },
        brand: {
          pink: "#ec4899",
          rose: "#f43f5e",
        },
      },
      boxShadow: {
        xl: "0 12px 28px rgba(236,72,153,0.30)",
        glow: "0 0 20px rgba(236,72,153,0.45)",
      },
      keyframes: {
        fadeIn: {
          "0%": { opacity: "0" },
          "100%": { opacity: "1" },
        },
        scaleIn: {
          "0%": { opacity: "0", transform: "scale(0.95)" },
          "100%": { opacity: "1", transform: "scale(1)" },
        },
        slideUp: {
          "0%": { transform: "translateY(20px)", opacity: "0" },
          "100%": { transform: "translateY(0)", opacity: "1" },
        },
      },
      animation: {
        fadeIn: "fadeIn 0.3s ease-out",
        scaleIn: "scaleIn 0.3s ease-out",
        slideUp: "slideUp 0.4s ease-out",
      },
    },
  },
  plugins: [
    require("@tailwindcss/aspect-ratio"),
    // ❌ line-clamp حذف شد
  ],
};
