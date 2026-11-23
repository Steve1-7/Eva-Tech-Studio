import type { Metadata } from 'next'
import Link from 'next/link'
import { services } from '@/lib/siteContent'

export const metadata: Metadata = {
  title: 'Services',
  description: 'Website, app, software, chatbot, trading-system, and automation engineering from Eva Tech Studio.',
  alternates: { canonical: '/services' },
}

export default function ServicesPage() {
  return (
    <div className="ets-page">
      <section className="ets-section ets-hero">
        <div className="ets-container">
          <p className="ets-eyebrow">What we do</p>
          <h1>Good engineering for <em>real work.</em></h1>
          <p className="ets-lede">From a first website to a connected software product, get senior help across the full build—from the first question to the handover.</p>
        </div>
      </section>
      <section className="ets-section ets-services">
        <div className="ets-container">
          <div className="ets-service-grid">
            {services.map((service) => (
              <article className="ets-service-card" key={service.href}>
                <div className="ets-service-card-top"><span>{service.number}</span><span className="ets-mini-visual">{service.number}</span></div>
                <p className="ets-eyebrow">{service.tag}</p>
                <h3>{service.title}</h3>
                <p>{service.description}</p>
                <Link className="ets-text-link" href={service.href}>Learn more <span aria-hidden="true">↗</span></Link>
              </article>
            ))}
          </div>
        </div>
      </section>
      <section className="ets-final-cta">
        <div className="ets-container ets-final-cta-inner">
          <div><p className="ets-eyebrow">Not sure where to start?</p><h2>Bring us the problem, not a perfect spec.</h2><p>We’ll help turn your idea into a practical scope and next step.</p></div>
          <Link className="ets-button primary" href="/contact">Get a free project quote <span aria-hidden="true">↗</span></Link>
        </div>
      </section>
    </div>
  )
}
