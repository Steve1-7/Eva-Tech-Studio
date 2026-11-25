import type { Metadata } from 'next'
import ContactForm from './ContactForm'
import { BOOKING_URL } from '@/config/site'

export const metadata: Metadata = {
  title: 'Send a Project Brief',
  description: 'Tell Eva Tech Studio what you want to build. Get a free project scope and technical audit in 48 hours.',
  alternates: { canonical: '/contact' },
}

export default function ContactPage() {
  return (
    <div className="ets-page">
      <section className="ets-section ets-hero">
        <div className="ets-container">
          <p className="ets-eyebrow">Start a project conversation</p>
          <h1>Tell us what you’re <em>working on.</em></h1>
          <p className="ets-lede">Share the essentials. We’ll review your enquiry and send a clear first scope and next steps within 48 hours.</p>
        </div>
      </section>
      <section className="ets-section ets-contact-section">
        <div className="ets-container ets-contact-layout">
          <aside className="ets-contact-aside">
            <p className="ets-eyebrow">Direct contact</p>
            <h2>Real people. Clear next steps.</h2>
            <p>We’ll review your message, ask the right follow-up questions, and tell you honestly if we’re a fit.</p>
            <a href="mailto:info@eva-tech-studio.com">info@eva-tech-studio.com</a>
            {BOOKING_URL && <a className="ets-contact-booking" href={BOOKING_URL} target="_blank" rel="noopener noreferrer">Book a 20-minute call <span aria-hidden="true">↗</span></a>}
            <a href="tel:+27676283210">+27 67 628 3210</a>
            <span>Johannesburg, South Africa</span>
            <span>Mon–Fri · 8am–6pm SAST</span>
            <p className="ets-contact-turnaround">Get a free scope in 48 hours</p>
          </aside>
          <ContactForm />
        </div>
      </section>
    </div>
  )
}
