import { NextResponse } from 'next/server'

// Dynamic XML sitemap index referencing sitemaps
export async function GET() {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://eva-tech-studio.com'
  const sitemaps = [
    'sitemap-pages.xml',
    'sitemap-images.xml',
    'sitemap-videos.xml'
  ]

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
  <sitemapindex xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
    ${sitemaps
      .map((s) => `<sitemap><loc>${baseUrl}/api/sitemap/${s}</loc></sitemap>`)
      .join('\n')}
  </sitemapindex>`

  return new NextResponse(xml, {
    headers: { 'Content-Type': 'application/xml; charset=utf-8' }
  })
}
