/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        background: "#060c1a",
        foreground: "#e2e8f8",
        card: "#0b1427",
        primary: "#3b7ef8",
        secondary: "#111d35",
        "secondary-foreground": "#b8c7e8",
        muted: "#6a85b5",
        border: "rgba(59,126,248,0.12)",
        input: "#111d35",
      },
      fontFamily: {
        outfit: ["var(--font-outfit)"],
        jakarta: ["var(--font-jakarta)"],
      },
      borderRadius: {
        xl2: "1.25rem",
      },
    },
  },
  plugins: [],
};
