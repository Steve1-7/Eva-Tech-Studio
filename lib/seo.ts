export function generateMeta({
  title,
  description,
  url,
  image,
  type = 'website',
  publishedTime,
  modifiedTime
}: {
  title: string
  description: string
  url: string
  image?: string
  type?: string
  publishedTime?: string
  modifiedTime?: string
}) {
  const meta = {
    title,
    description,
    url,
    image: image || `${process.env.NEXT_PUBLIC_SITE_URL || 'https://eva-tech-studio.com'}/api/og?title=${encodeURIComponent(title)}`,
    type,
    publishedTime,
    modifiedTime
  }
  return meta
}

export function organizationSchema() {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://eva-tech-studio.com'
  return {
    "@context": "https://schema.org",
    "@type": "Organization",
    "name": "Eva Tech Studio",
    "url": baseUrl,
    "logo": `${baseUrl}/icons/logo.png`,
    "sameAs": [
      "https://www.linkedin.com/company/eva-tech-studio",
      "https://twitter.com/evatechstudio"
    ]
  }
}

export function localBusinessSchema() {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://eva-tech-studio.com'
  return {
    "@context": "https://schema.org",
    "@type": "LocalBusiness",
    "name": "Eva Tech Studio",
    "image": `${baseUrl}/icons/og-logo.png`,
    "@id": baseUrl,
    "url": baseUrl,
    "telephone": "+61-400-000-000",
    "address": {
      "@type": "PostalAddress",
      "streetAddress": "",
      "addressLocality": "Gold Coast",
      "addressRegion": "QLD",
      "postalCode": "",
      "addressCountry": "AU"
    },
    "sameAs": [
      "https://www.linkedin.com/company/eva-tech-studio",
      "https://twitter.com/evatechstudio"
    ]
  }
}
