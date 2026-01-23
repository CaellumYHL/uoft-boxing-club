import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",        // Scans the 'app' folder
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",      // Scans 'pages' (if you have it)
    "./components/**/*.{js,ts,jsx,tsx,mdx}", // Scans 'components'
  ],
  theme: {
    extend: {
      colors: {
        background: '#152238',
        primary: '#C92C2C',
        secondary: '#3B71CA',
      },
      fontFamily: {
        sans: ['var(--font-outfit)'],
      },
    },
  },
  plugins: [],
};
export default config;