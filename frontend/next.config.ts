import type { NextConfig } from "next";

/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'export',      // Tells Next.js to build static HTML
  basePath: '/uoft-boxing-club',  // Required for GitHub Pages (repo name subpath)
  // distDir: 'out',        // Tells it to put files in the folder Firebase looks for

  images: {
    unoptimized: true,
  },
};

export default nextConfig;
