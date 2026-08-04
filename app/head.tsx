import React from 'react'
import { organizationSchema, localBusinessSchema } from '../lib/seo'

export default function Head() {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://eva-tech-studio.com'
  const title = 'Eva Tech Studio — Premium Digital Agency'
  const description = 'Eva Tech Studio builds premium digital products, AI solutions, and beautiful brand experiences.'
  const image = `${baseUrl}/icons/og-home.png`

  const orgSchema = JSON.stringify(organizationSchema())
  const localSchema = JSON.stringify(localBusinessSchema())

  return (
    <>
      <title>{title}</title>
      <meta name="description" content={description} />
      <meta name="theme-color" content="#09090B" />

      {/* Canonical */}
      <link rel="canonical" href={baseUrl} />

      {/* Open Graph */}
      <meta property="og:title" content={title} />
      <meta property="og:description" content={description} />
      <meta property="og:type" content="website" />
      <meta property="og:url" content={baseUrl} />
      <meta property="og:image" content={image} />

      {/* Twitter */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={title} />
      <meta name="twitter:description" content={description} />
      <meta name="twitter:image" content={image} />

      {/* Robots */}
      <meta name="robots" content="index, follow" />

      {/* Structured Data */}
      <script type="application/ld+json">{orgSchema}</script>
      <script type="application/ld+json">{localSchema}</script>

      {/* Hreflang placeholder for future internationalization */}
      <link rel="alternate" hrefLang="en" href={baseUrl} />
    </>
  )
}
