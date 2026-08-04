import React from 'react'
import Link from 'next/link'

type FAQ = { q: string; a: string }

export default function ServiceTemplate({
  title,
  subtitle,
  intro,
  benefits,
  process,
  pricing,
  faqs,
  caseStudies,
  ctaText
}: {
  title: string
  subtitle?: string
  intro?: string
  benefits: string[]
  process: string[]
  pricing?: { label: string; price?: string; desc?: string }[]
  faqs?: FAQ[]
  caseStudies?: { title: string; href: string }[]
  ctaText?: string
}) {
  return (
    <article className="max-w-6xl mx-auto px-6 py-16">
      <header className="mb-12">
        <h1 className="text-4xl md:text-5xl font-bold text-white">{title}</h1>
        {subtitle && <p className="mt-4 text-lg text-gray-300">{subtitle}</p>}
        {intro && <p className="mt-6 text-base text-gray-300 max-w-3xl">{intro}</p>}
        <div className="mt-8 flex gap-4">
          <Link href="/contact" className="btn-primary" aria-label={`Contact about ${title}`}>
            {ctaText || 'Start Project'}
          </Link>
          <Link href="/pricing" className="btn-outline">See Pricing</Link>
        </div>
      </header>

      <section aria-labelledby="benefits" className="mb-12">
        <h2 id="benefits" className="text-2xl font-semibold text-white mb-4">Benefits</h2>
        <ul className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {benefits.map((b, i) => (
            <li key={i} className="card p-6 glass-accent">
              <h3 className="font-semibold text-white">{b.split(':')[0]}</h3>
              <p className="mt-2 text-sm text-gray-300">{b.split(':')[1] || ''}</p>
            </li>
          ))}
        </ul>
      </section>

      <section aria-labelledby="process" className="mb-12">
        <h2 id="process" className="text-2xl font-semibold text-white mb-4">Our Process</h2>
        <ol className="space-y-4">
          {process.map((p, i) => (
            <li key={i} className="p-4 card">
              <div className="text-lg font-medium text-white">{`Step ${i + 1}`}</div>
              <p className="text-gray-300 mt-1">{p}</p>
            </li>
          ))}
        </ol>
      </section>

      {pricing && (
        <section aria-labelledby="pricing" className="mb-12">
          <h2 id="pricing" className="text-2xl font-semibold text-white mb-4">Pricing</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {pricing.map((p, i) => (
              <div key={i} className="card p-6 glass">
                <div className="text-xl font-semibold text-white">{p.label}</div>
                {p.price && <div className="mt-2 text-3xl text-white">{p.price}</div>}
                {p.desc && <p className="mt-3 text-gray-300">{p.desc}</p>}
                <div className="mt-6">
                  <Link href="/contact" className="btn-primary">Get Started</Link>
                </div>
              </div>
            ))}
          </div>
        </section>
      )}

      {faqs && faqs.length > 0 && (
        <section aria-labelledby="faq" className="mb-12">
          <h2 id="faq" className="text-2xl font-semibold text-white mb-4">FAQ</h2>
          <div className="space-y-4">
            {faqs.map((f, i) => (
              <details key={i} className="card p-4" aria-labelledby={`q-${i}`}>
                <summary id={`q-${i}`} className="font-medium text-white cursor-pointer">{f.q}</summary>
                <div className="mt-2 text-gray-300">{f.a}</div>
              </details>
            ))}
          </div>
        </section>
      )}

      {caseStudies && caseStudies.length > 0 && (
        <section aria-labelledby="cases" className="mb-12">
          <h2 id="cases" className="text-2xl font-semibold text-white mb-4">Case Studies</h2>
          <ul className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {caseStudies.map((c, i) => (
              <li key={i} className="card p-6">
                <Link href={c.href} className="text-white font-semibold">{c.title}</Link>
              </li>
            ))}
          </ul>
        </section>
      )}

      <footer className="mt-12 text-center">
        <p className="text-gray-400">More about our services at <Link href="/services" className="text-white underline">Services</Link> or <Link href="/contact" className="text-white underline">contact us</Link>.</p>
      </footer>
    </article>
  )
}
