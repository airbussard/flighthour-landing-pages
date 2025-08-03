/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'standalone',
  images: {
    domains: ['flighthour.de'],
  },
  experimental: {
    outputFileTracingRoot: undefined,
  },
}

export default nextConfig
