import type { MetadataRoute } from 'next'
import { canonicalUrl } from '@/lib/metadata'

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      { userAgent: '*', allow: '/', disallow: ['/admin/', '/api/', '/auth/', '/client-portal/'] },
    ],
    sitemap: canonicalUrl('/sitemap.xml'),
    host: 'https://www.eva-tech-studio.com',
  }
}
