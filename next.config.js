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
      { source: '/services/ai-development', destination: '/services/custom-software', permanent: true },
      { source: '/services/api-development', destination: '/services/web-applications', permanent: true },
      { source: '/services/cloud-solutions', destination: '/services/web-applications', permanent: true },
      { source: '/services/crm-development', destination: '/services/automation', permanent: true },
      { source: '/services/e-commerce', destination: '/services/website-development', permanent: true },
      { source: '/services/saas-development', destination: '/services/web-applications', permanent: true },
      { source: '/services/startup-mvp-development', destination: '/services/custom-software', permanent: true },
      { source: '/services/ui-ux-design', destination: '/services/website-development', permanent: true },
      { source: '/services/branding', destination: '/services', permanent: true },
      { source: '/services/digital-marketing', destination: '/services', permanent: true },
      { source: '/services/graphic-design', destination: '/services', permanent: true },
      { source: '/services/seo-services', destination: '/services', permanent: true },
    ]
  },
}

module.exports = nextConfig
