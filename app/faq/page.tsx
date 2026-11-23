import type { Metadata } from 'next'
import { faqs } from '@/lib/siteContent'

export const metadata: Metadata = {
  title: 'Frequently Asked Questions',
  description: 'Straight answers about Eva Tech Studio’s engineering services, project delivery, ownership, and support.',
  alternates: { canonical: '/faq' },
}

const faqSchema = {
  '@context': 'https://schema.org',
  '@type': 'FAQPage',
  mainEntity: faqs.map((faq) => ({
    '@type': 'Question',
    name: faq.question,
    acceptedAnswer: { '@type': 'Answer', text: faq.answer },
  })),
}

export default function FaqPage() {
  return (
    <div className="ets-page">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }} />
      <section className="ets-section ets-hero">
        <div className="ets-container">
          <p className="ets-eyebrow">Frequently asked</p>
          <h1>Clear answers, <em>before we start.</em></h1>
          <p className="ets-lede">If your question isn’t here, send it with your brief and we’ll answer directly.</p>
        </div>
      </section>
      <section className="ets-section ets-faq">
        <div className="ets-container ets-faq-layout">
          <div><p className="ets-eyebrow">No jargon</p><h2>How the work gets done.</h2></div>
          <div className="ets-accordion">
            {faqs.map((faq) => (
              <details key={faq.question}>
                <summary>{faq.question}<span aria-hidden="true">+</span></summary>
                <p>{faq.answer}</p>
              </details>
            ))}
          </div>
        </div>
      </section>
    </div>
  )
}
