import { NextResponse } from 'next/server'
import fs from 'fs/promises'
import path from 'path'

async function scanAppForPages(dir: string, baseDir: string): Promise<string[]> {
  const entries = await fs.readdir(dir, { withFileTypes: true })
  const urls: string[] = []

  for (const e of entries) {
    const full = path.join(dir, e.name)
    if (e.isDirectory()) {
      // Skip folder patterns that are not routes
      if (['api', 'components', 'lib', 'shims', 'public', 'scripts', 'tests'].includes(e.name)) continue
      const childUrls = await scanAppForPages(full, baseDir)
      urls.push(...childUrls)
    } else if (e.isFile()) {
      if (/^page\.(js|jsx|ts|tsx)$/.test(e.name)) {
        // compute route path
        const rel = path.relative(baseDir, dir)
        const urlPath = rel === '' ? '/' : `/${rel.replace(/\\\\/g, '/')}`
        urls.push(urlPath)
      }
    }
  }

  return urls
}

export async function GET() {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://eva-tech-studio.com'
  const appDir = path.join(process.cwd(), 'app')

  let pages: string[] = []
  try {
    pages = await scanAppForPages(appDir, appDir)
  } catch (e) {
    // fallback to a conservative static list
    pages = ['/', '/about', '/services', '/contact', '/pricing', '/blog', '/work']
  }

  // Retired tools and the client portal should not be advertised in search.
  const retiredRoutes = new Set(['/ai', '/ai-audit', '/ai-quote', '/ai-consultant', '/client-portal'])
  pages = Array.from(new Set(pages)).filter(page => !retiredRoutes.has(page)).sort()

  const urlsXml = pages
    .map((u) => `  <url>\\n    <loc>${baseUrl}${u}</loc>\\n    <changefreq>weekly</changefreq>\\n    <priority>0.8</priority>\\n  </url>`)
    .join('\\n')

  const xml = `<?xml version="1.0" encoding="UTF-8"?>\\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\\n${urlsXml}\\n</urlset>`

  return new NextResponse(xml, { headers: { 'Content-Type': 'application/xml' } })
}
