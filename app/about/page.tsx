import type { Metadata } from 'next'
import Link from 'next/link'
import { PRIMARY_CTA_LABEL } from '@/config/site'

export const metadata: Metadata = {
  title: 'About Eva Tech Studio',
  description: 'Meet Eva Tech Studio, a senior boutique engineering studio based in Johannesburg and working globally.',
  alternates: { canonical: '/about' },
}

export default function AboutPage() {
  return (
    <div className="ets-page">
      <section className="ets-section ets-hero">
        <div className="ets-container">
          <p className="ets-eyebrow">About Eva Tech Studio</p>
          <h1>Small by design. <em>Senior by default.</em></h1>
          <p className="ets-lede">We are a Johannesburg-based engineering studio helping teams make useful digital products—without turning a clear project into a complicated process.</p>
        </div>
      </section>
      <section className="ets-section ets-results">
        <div className="ets-container ets-service-detail-grid">
          <div>
            <p className="ets-eyebrow">How we think</p>
            <h2>Start with the problem. Keep the solution understandable.</h2>
            <p>Good software should make a real task easier. We ask direct questions, explain trade-offs, and choose technology to fit the work—not the other way around.</p>
          </div>
          <aside>
            <p className="ets-eyebrow">What to expect</p>
            <ul>
              <li>Direct access to senior people doing the work.</li>
              <li>A written scope, milestones, and clear decisions.</li>
              <li>Code and service accounts in your control.</li>
              <li>Support options without automatic lock-in.</li>
            </ul>
          </aside>
        </div>
      </section>
      <section className="ets-section">
        <div className="ets-container ets-service-cta">
          <div><p className="ets-eyebrow">Working globally</p><h2>Based in Johannesburg. Built for wherever you are.</h2><p>We work remotely with clients and teams across time zones.</p></div>
          <Link className="ets-button primary" href="/contact">{PRIMARY_CTA_LABEL} <span aria-hidden="true">↗</span></Link>
        </div>
      </section>
    </div>
  )
}
