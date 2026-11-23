import type { Metadata } from 'next'
import Link from 'next/link'
import ScopeBriefTool from '@/components/site/ScopeBriefTool'

export const metadata: Metadata = {
  title: 'Free Tools',
  description: 'A free project brief builder from Eva Tech Studio.',
  alternates: { canonical: '/tools' },
}

export default function ToolsPage() {
  return (
    <div className="ets-page">
      <section className="ets-section ets-hero">
        <div className="ets-container">
          <p className="ets-eyebrow">Free tools</p>
          <h1>Make a better <em>first decision.</em></h1>
          <p className="ets-lede">Use this tool to frame a project and start a useful conversation. Your notes are a starting point, not a fixed quote.</p>
        </div>
      </section>
      <section className="ets-section ets-services">
        <div className="ets-container">
          <ScopeBriefTool />
          <div className="ets-tool-cta">
            <div><p className="ets-eyebrow">Want a senior review?</p><h2>We’ll scope your brief for free.</h2><p>Copy your notes, then paste them into the contact form for a technical assessment in 48 hours.</p></div>
            <Link className="ets-button primary" href="/contact">Open contact form <span aria-hidden="true">↗</span></Link>
          </div>
        </div>
      </section>
    </div>
  )
}
