export function canonicalUrl(path = '/') {
  const base = process.env.NEXT_PUBLIC_SITE_URL || 'https://eva-tech-studio.com'
  return `${base.replace(/\/$/, '')}${path.startsWith('/') ? path : '/' + path}`
}

export function hreflangLinks(path = '/') {
  const base = process.env.NEXT_PUBLIC_SITE_URL || 'https://eva-tech-studio.com'
  // Scaffold for future locales
  return [
    { hrefLang: 'en', href: `${base}${path}` },
    // Add other locales later: { hrefLang: 'es', href: `${base}/es${path}` }
  ]
}
