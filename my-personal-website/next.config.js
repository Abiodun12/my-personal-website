/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  swcMinify: true,
  experimental: {
    // Enable if you're using app directory
    appDir: true,
  }
}

module.exports = nextConfig
  