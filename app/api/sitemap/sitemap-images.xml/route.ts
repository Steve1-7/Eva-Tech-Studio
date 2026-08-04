import { NextResponse } from 'next/server'
import { readdir } from 'fs/promises'

export async function GET() {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://eva-tech-studio.com'
  const publicDir = process.cwd() + '/public'
  const imageDirs = ['og', 'images']
  const found: { loc: string; img: string }[] = []

  try {
    for (const d of imageDirs) {
      const dir = publicDir + '/' + d
      try {
        const files = await readdir(dir)
        for (const f of files) {
          if (/\.(jpg|jpeg|png|webp|avif|gif)$/i.test(f)) {
            const imgPath = `/${d}/${f}`
            // attempt to infer page location from filename (e.g., about-hero.jpg -> /about)
            const name = f.replace(/\.[^.]+$/, '')
            const page = name.includes('-') ? `/${name.split('-')[0]}` : '/' 
            found.push({ loc: page, img: imgPath })
          }
        }
      } catch (e) {
        // skip if folder doesn't exist
      }
    }
  } catch (e) {
    // ignore
  }

  // fallback sample if nothing found
  if (found.length === 0) {
    found.push({ loc: '/', img: '/og/home-hero.jpg' })
  }

  const urls = found
    .map(
      (i) => `  <url>\n    <loc>${baseUrl}${i.loc}</loc>\n    <image:image>\n      <image:loc>${baseUrl}${i.img}</image:loc>\n    </image:image>\n  </url>`
    )
    .join('\n')

  const xml = `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:image="http://www.google.com/schemas/sitemap-image/1.1">\n${urls}\n</urlset>`

  return new NextResponse(xml, { headers: { 'Content-Type': 'application/xml' } })
}
