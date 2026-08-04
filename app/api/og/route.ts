import { NextResponse } from 'next/server'

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url)
  const title = (searchParams.get('title') || 'Eva Tech Studio').slice(0, 70)
  const subtitle = (searchParams.get('subtitle') || 'Premium Digital Agency').slice(0, 100)

  const primary = '#6D28D9'
  const accent = '#A855F7'
  const bg = '#09090B'

  const svg = `<?xml version="1.0" encoding="UTF-8"?>
  <svg width="1200" height="630" viewBox="0 0 1200 630" xmlns="http://www.w3.org/2000/svg">
    <defs>
      <linearGradient id="g" x1="0" x2="1" y1="0" y2="1">
        <stop offset="0%" stop-color="${primary}" stop-opacity="0.95" />
        <stop offset="100%" stop-color="${accent}" stop-opacity="0.85" />
      </linearGradient>
      <filter id="blur"><feGaussianBlur stdDeviation="30" /></filter>
    </defs>
    <rect width="1200" height="630" fill="${bg}" />
    <g filter="url(#blur)" opacity="0.6">
      <circle cx="980" cy="120" r="220" fill="url(#g)" />
      <circle cx="160" cy="500" r="300" fill="url(#g)" />
    </g>
    <g>
      <rect x="60" y="80" width="1080" height="470" rx="24" fill="rgba(255,255,255,0.02)" />
      <rect x="60" y="80" width="1080" height="470" rx="24" stroke="rgba(255,255,255,0.04)" fill="none" />
    </g>
    <g transform="translate(100,180)">
      <text x="0" y="0" font-family="Syne, Arial, sans-serif" font-weight="700" font-size="52" fill="#FAFAFA">${escapeXml(title)}</text>
      <text x="0" y="70" font-family="DM Sans, Arial, sans-serif" font-weight="500" font-size="28" fill="#D1D1D6">${escapeXml(subtitle)}</text>
    </g>
    <g transform="translate(100,420)">
      <rect x="0" y="0" width="220" height="40" rx="8" fill="${primary}" />
      <text x="18" y="27" font-family="DM Sans, Arial, sans-serif" font-weight="600" font-size="16" fill="#09090B">Visit Eva-Tech-Studio.com</text>
    </g>
  </svg>`

  return new NextResponse(svg, { headers: { 'Content-Type': 'image/svg+xml' } })
}

function escapeXml(s: string) {
  return s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;').replace(/'/g, '&apos;')
}
