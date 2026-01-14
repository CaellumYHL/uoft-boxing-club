/** @type {import('postcss-load-config').Config} */
const config = {
  plugins: {
    '@tailwindcss/postcss': {}, // <--- This is the new plugin name
    // 'autoprefixer': {},      // Note: Tailwind v4 handles prefixing automatically, so you usually don't need autoprefixer anymore.
  },
};

export default config;