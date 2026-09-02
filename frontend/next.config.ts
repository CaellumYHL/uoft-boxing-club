import type { NextConfig } from "next";

/**
 * Base path the site is served from. GitHub Pages serves project sites under
 * /<repo>, so CI sets NEXT_PUBLIC_BASE_PATH; local dev leaves it unset.
 *
 * This is the single source of truth: client code reads the same env var (via
 * lib/site.ts) for raw browser APIs like history.replaceState and <img src>,
 * so the two can never drift apart.
 */
const basePath = process.env.NEXT_PUBLIC_BASE_PATH || '';

const nextConfig: NextConfig = {
  output: 'export',   // Static HTML export - there is no server at runtime.

  // Emit `store/index.html` rather than `store.html`, so a URL typed or shared
  // with a trailing slash resolves instead of falling through to the 404 page.
  // GitHub Pages redirects the slashless form to it, so both work.
  trailingSlash: true,
  basePath,
  assetPrefix: basePath || undefined,

  images: {
    unoptimized: true,
  },
};

export default nextConfig;
