import type { MetadataRoute } from 'next'
import { canonicalUrl } from '@/lib/metadata'
import { services } from '@/lib/siteContent'
import { blogPosts } from '@/lib/blogContent'

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
  '/work/bagmaa',
  '/work/gold-coast-mining-review',
  ...services.map((service) => service.href),
  ...blogPosts.map((post) => `/blog/${post.slug}`),
]

export default function sitemap(): MetadataRoute.Sitemap {
  return publicRoutes.map((route) => ({
    url: canonicalUrl(route),
    changeFrequency: route === '/' ? 'weekly' : 'monthly',
    priority: route === '/' ? 1 : route === '/services' || route === '/contact' ? 0.9 : 0.7,
  }))
}
