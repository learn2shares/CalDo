/** @type {import('next').NextConfig} */
const nextConfig = {
  // Configuration for GitHub Pages deployment
  output: 'export',  // Enable static exports
  basePath: '/CalDo',
  images: {
    unoptimized: true, // Required for static export
  },
  trailingSlash: true,
  reactStrictMode: true,
  swcMinify: true,
  distDir: 'out'
}

module.exports = nextConfig 