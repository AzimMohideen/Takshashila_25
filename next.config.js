/** @type {import('next').NextConfig} */
const nextConfig = {
  eslint: {
    // Enable ESLint during production builds
    ignoreDuringBuilds: false,
  },
  typescript: {
    // Enable type checking during production builds
    ignoreBuildErrors: false,
  },
}

module.exports = nextConfig 