/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'export',  // Enable static exports
  basePath: '/CalDo', // Base path for GitHub Pages
  images: {
    unoptimized: true, // Required for static export
  },
  reactStrictMode: true,
  swcMinify: true,
}

module.exports = nextConfig 