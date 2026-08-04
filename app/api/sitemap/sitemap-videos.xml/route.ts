import { NextResponse } from 'next/server'

export async function GET() {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://eva-tech-studio.com'

  // Placeholder: add video entries if site hosts videos
  const videos: Array<{ page: string; thumbnail: string; title: string; description: string; src: string }> = []

  const urls = videos
    .map((v) => `  <url>\n    <loc>${baseUrl}${v.page}</loc>\n    <video:video>\n      <video:thumbnail_loc>${baseUrl}${v.thumbnail}</video:thumbnail_loc>\n      <video:title>${v.title}</video:title>\n      <video:description>${v.description}</video:description>\n      <video:content_loc>${baseUrl}${v.src}</video:content_loc>\n    </video:video>\n  </url>`)
    .join('\n')

  const xml = `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:video="http://www.google.com/schemas/sitemap-video/1.1">\n${urls}\n</urlset>`

  return new NextResponse(xml, { headers: { 'Content-Type': 'application/xml' } })
}
