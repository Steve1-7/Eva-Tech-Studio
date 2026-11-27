import type { Metadata } from 'next'

const BRAND_NAME = 'Eva Tech Studio'

export function canonicalUrl(path = '/') {
  const base = process.env.NEXT_PUBLIC_SITE_URL || 'https://www.eva-tech-studio.com'
  return `${base.replace(/\/$/, '')}${path.startsWith('/') ? path : '/' + path}`
}

export function createPageMetadata({
  title,
  description,
  path,
  type = 'website',
}: {
  title: string
  description: string
  path: string
  type?: 'website' | 'article'
}): Metadata {
  const brandedTitle = `${title} | ${BRAND_NAME}`
  const canonical = canonicalUrl(path)
  const image = canonicalUrl(`/api/og?title=${encodeURIComponent(brandedTitle)}&subtitle=${encodeURIComponent(description)}`)

  return {
    title,
    description,
    alternates: { canonical },
    openGraph: {
      type,
      title: brandedTitle,
      description,
      url: canonical,
      siteName: BRAND_NAME,
      images: [{ url: image, width: 1200, height: 630, alt: brandedTitle }],
    },
    twitter: {
      card: 'summary_large_image',
      title: brandedTitle,
      description,
      images: [image],
    },
  }
}

export function hreflangLinks(path = '/') {
  const base = process.env.NEXT_PUBLIC_SITE_URL || 'https://www.eva-tech-studio.com'
  return [{ hrefLang: 'en', href: `${base}${path}` }]
}
