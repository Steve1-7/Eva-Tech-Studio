import { createElement } from 'react'
import { ImageResponse } from 'next/og'

export const runtime = 'edge'

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const title = (searchParams.get('title') || 'Eva Tech Studio').slice(0, 80)
  const subtitle = (searchParams.get('subtitle') || 'Senior engineering for digital products.').slice(0, 140)

  const image = createElement(
    'div',
    {
      style: {
        width: '100%',
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between',
        padding: '76px 82px',
        color: '#E8E3D8',
        background: 'linear-gradient(135deg, #10100F 0%, #1C1A16 58%, #282217 100%)',
        fontFamily: 'Arial, sans-serif',
      },
    },
    createElement(
      'div',
      { style: { display: 'flex', alignItems: 'center', gap: 18, color: '#C9A96E', fontSize: 24, letterSpacing: 5 } },
      createElement('span', { style: { width: 48, height: 2, background: '#C9A96E' } }),
      'EVA TECH STUDIO',
    ),
    createElement(
      'div',
      { style: { display: 'flex', flexDirection: 'column', gap: 22, maxWidth: 1000 } },
      createElement('div', { style: { fontSize: 62, lineHeight: 1.1, fontWeight: 700, letterSpacing: -2 } }, title),
      createElement('div', { style: { color: '#B8B2A8', fontSize: 29, lineHeight: 1.35 } }, subtitle),
    ),
    createElement('div', { style: { width: 100, height: 5, background: '#C9A96E' } }),
  )

  return new ImageResponse(image, { width: 1200, height: 630 })
}
