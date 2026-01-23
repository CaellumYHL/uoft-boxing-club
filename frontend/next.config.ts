import type { NextConfig } from "next";

/** @type {import('next').NextConfig} */
const nextConfig = {
  // output: 'export',      // Tells Next.js to build static HTML
  // distDir: 'out',        // Tells it to put files in the folder Firebase looks for
  images: {
    unoptimized: true,   // Essential for Firebase Hosting
  },
};

export default nextConfig;
