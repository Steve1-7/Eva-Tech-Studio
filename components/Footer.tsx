import Image from 'next/image'
import Link from 'next/link'
import { services } from '@/lib/siteContent'
import { BOOKING_URL, COMPANY_REGISTRATION_NUMBER, PRIMARY_CTA_LABEL, REGISTERED_ADDRESS } from '@/config/site'

const resourceLinks = [
  ['Case studies', '/case-studies'],
  ['Jargon buster', '/blog'],
  ['FAQs', '/faq'],
  ['Free tools', '/tools'],
  ['Pricing', '/pricing'],
]

export default function Footer() {
  return (
    <footer className="ets-footer">
      <div className="ets-footer-main">
        <div className="ets-footer-brand">
          <Link href="/" aria-label="Eva Tech Studio home">
            <Image src="/logo5.webp" alt="Eva Tech Studio" width={118} height={40} />
          </Link>
          <p>Senior engineering for websites, apps, and software that solve real problems.</p>
          <p className="ets-footer-location">Johannesburg, South Africa · Serving clients globally</p>
          {COMPANY_REGISTRATION_NUMBER && <p className="ets-footer-location">Company registration number: {COMPANY_REGISTRATION_NUMBER}</p>}
          {REGISTERED_ADDRESS && <p className="ets-footer-location">Registered address: {REGISTERED_ADDRESS}</p>}
        </div>
        <div>
          <h2>Services</h2>
          {services.map((service) => <Link key={service.href} href={service.href}>{service.title}</Link>)}
        </div>
        <div>
          <h2>Resources</h2>
          {resourceLinks.map(([label, href]) => <Link key={href} href={href}>{label}</Link>)}
        </div>
        <div>
          <h2>Company</h2>
          <Link href="/contact" className="ets-footer-primary-cta">{PRIMARY_CTA_LABEL}</Link>
          {BOOKING_URL && <a href={BOOKING_URL} target="_blank" rel="noopener noreferrer">Book a 20-minute call</a>}
          <Link href="/about">About</Link>
          <Link href="/privacy">Privacy policy</Link>
          <Link href="/terms">Terms</Link>
          <a href="tel:+27676283210">+27 67 628 3210</a>
          <a href="mailto:info@eva-tech-studio.com">info@eva-tech-studio.com</a>
          <a href="mailto:sales@eva-tech-studio.com">sales@eva-tech-studio.com</a>
          <a href="mailto:support@eva-tech-studio.com">support@eva-tech-studio.com</a>
          <a href="https://www.linkedin.com/company/eva-tech-studio" target="_blank" rel="noreferrer">LinkedIn</a>
          <a href="https://www.tiktok.com/@evatechstudio" target="_blank" rel="noreferrer">TikTok</a>
        </div>
      </div>
      <div className="ets-footer-bottom">
        <span>© {new Date().getFullYear()} Eva Tech Studio. All rights reserved.</span>
        <span>Thoughtful engineering. Clear ownership.</span>
      </div>
    </footer>
  )
}
