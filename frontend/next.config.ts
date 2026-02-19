import type { NextConfig } from "next";

const isProd = process.env.NODE_ENV === 'production';

/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'export',      // Tells Next.js to build static HTML
  basePath: isProd ? '/uoft-boxing-club' : '',  // Only use basePath for GitHub Pages
  assetPrefix: isProd ? '/uoft-boxing-club/' : undefined,  // Ensure assets load from correct path
  // distDir: 'out',        // Tells it to put files in the folder Firebase looks for

  images: {
    unoptimized: true,
  },
};

export default nextConfig;
