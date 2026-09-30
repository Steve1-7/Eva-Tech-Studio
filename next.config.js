/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    formats: ['image/avif', 'image/webp'],
    minimumCacheTTL: 31536000,
  },
  async redirects() {
    return [
      { source: '/ai', destination: '/services', permanent: false },
      { source: '/ai-audit', destination: '/services', permanent: false },
      { source: '/ai-quote', destination: '/pricing', permanent: false },
      { source: '/ai-consultant', destination: '/services', permanent: false },
      { source: '/client-portal', destination: '/', permanent: false },
    ]
  },
}

module.exports = nextConfig
