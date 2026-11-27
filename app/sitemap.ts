import type { MetadataRoute } from 'next'
import { canonicalUrl } from '@/lib/metadata'
import { services, projects } from '@/lib/siteContent'
import { blogPosts } from '@/lib/blogContent'
import { LIVE_MARKETS } from '@/config/markets'

const additionalPublicRoutes = [
  '/ai',
  '/ai-audit',
  '/ai-consultant',
  '/ai-quote',
  '/careers',
  '/services/ai-development',
  '/services/api-development',
  '/services/branding',
  '/services/cloud-solutions',
  '/services/crm-development',
  '/services/digital-marketing',
  '/services/e-commerce',
  '/services/graphic-design',
  '/services/saas-development',
  '/services/seo-services',
  '/services/startup-mvp-development',
  '/services/ui-ux-design',
]

const publicRoutes = [
  '/',
  '/about',
  '/services',
  '/case-studies',
  '/pricing',
  '/blog',
  '/faq',
  '/tools',
  '/contact',
  '/privacy',
  '/terms',
  ...additionalPublicRoutes,
  ...LIVE_MARKETS.map((market) => market.path),
  ...projects.map((project) => project.href),
  ...services.map((service) => service.href),
  ...blogPosts.map((post) => `/blog/${post.slug}`),
]

const liveMarketAlternates = Object.fromEntries([
  ...LIVE_MARKETS.map((market) => [market.locale, canonicalUrl(market.path)]),
  ['x-default', canonicalUrl('/')],
])

export default function sitemap(): MetadataRoute.Sitemap {
  return publicRoutes.map((route) => {
    const isMarketPage = LIVE_MARKETS.some((market) => market.path === route)
    return {
      url: canonicalUrl(route),
      changeFrequency: route === '/' ? 'weekly' : 'monthly',
      priority: route === '/' ? 1 : route === '/services' || route === '/contact' ? 0.9 : 0.7,
      ...(isMarketPage ? { alternates: { languages: liveMarketAlternates } } : {}),
    }
  })
}
