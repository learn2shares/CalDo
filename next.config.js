/** @type {import('next').NextConfig} */
const nextConfig = {
  // Configuration for GitHub Pages deployment
  output: 'export',  // Enable static exports
  basePath: '/CalDo', // Base path for GitHub Pages
  images: {
    unoptimized: true, // Required for static export
  },
  reactStrictMode: true,
  swcMinify: true,
}

module.exports = nextConfig 