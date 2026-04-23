/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'standalone',
  experimental: {
    forceSwcTransforms: false,
  },
}

module.exports = nextConfig
