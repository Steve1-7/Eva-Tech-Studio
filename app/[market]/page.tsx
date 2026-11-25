import type { Metadata } from 'next'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import SitePricing from '@/components/site/SitePricing'
import GoogleReviews from '@/components/GoogleReviews'
import { BreadcrumbJsonLd, JsonLd } from '@/components/site/JsonLd'
import { BOOKING_URL, getWhatsAppHref, PRIMARY_CTA_LABEL } from '@/config/site'
import { formatZarAsCurrency, LIVE_MARKETS, MARKETS, type MarketSlug } from '@/config/markets'
import { SERVICE_PRICING, type ServicePricingSlug } from '@/config/pricing'
import { canonicalUrl, createPageMetadata } from '@/lib/metadata'
import { getWorkHourOverlap } from '@/lib/timezone-overlap'

type Props = { params: { market: string } }

export const dynamic = 'force-dynamic'

export function generateStaticParams() {
  return LIVE_MARKETS.map((market) => ({ market: market.slug }))
}

export function generateMetadata({ params }: Props): Metadata {
  const market = MARKETS[params.market as MarketSlug]
  if (!market?.enabled) return { title: 'Market not found', robots: { index: false, follow: false } }

  const pageMetadata = createPageMetadata({
    title: `Software Development for ${market.name}`,
    description: `${market.intro} Pricing is shown in ${market.currency} and confirmed in a written proposal.`,
    path: market.path,
  })
  const languages = Object.fromEntries([
    ...LIVE_MARKETS.map((liveMarket) => [liveMarket.locale, canonicalUrl(liveMarket.path)]),
    ['x-default', canonicalUrl('/')],
  ])

  return {
    ...pageMetadata,
    alternates: { canonical: canonicalUrl(market.path), languages },
  }
}

export default function MarketLandingPage({ params }: Props) {
  const market = MARKETS[params.market as MarketSlug]
  if (!market?.enabled) notFound()

  const now = new Date()
  const overlap = getWorkHourOverlap(market.timeZone, now)
  const tradingBotsExcluded: ServicePricingSlug[] = market.tradingBotsEnabled ? [] : ['trading-bots']
  const whatsappHref = market.contactChannels.includes('whatsapp') ? getWhatsAppHref(market.path) : null
  const bookingHref = market.contactChannels.includes('booking') ? BOOKING_URL : null
  const startingPrices = Object.entries(SERVICE_PRICING)
    .filter(([slug]) => !tradingBotsExcluded.includes(slug as ServicePricingSlug))
    .flatMap(([, service]) => service.tiers.map((tier) => tier.basePriceZar))
    .filter((price): price is number => price !== null)
  const startingPrice = startingPrices.length > 0 ? Math.min(...startingPrices) : null

  const serviceSchema = {
    '@context': 'https://schema.org',
    '@type': 'Service',
    name: `Software engineering services in ${market.name}`,
    description: market.intro,
    provider: { '@type': 'Organization', name: 'Eva Tech Studio', url: canonicalUrl('/') },
    areaServed: { '@type': market.slug === 'eu' ? 'AdministrativeArea' : 'Country', name: market.country },
    url: canonicalUrl(market.path),
    offers: { '@type': 'Offer', priceCurrency: market.currency },
  }
  const faqSchema = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: market.faqs.map((faq) => ({
      '@type': 'Question',
      name: faq.question,
      acceptedAnswer: { '@type': 'Answer', text: faq.answer },
    })),
  }

  return (
    <div className="ets-page" lang={market.locale}>
      <JsonLd data={serviceSchema} />
      <JsonLd data={faqSchema} />
      <BreadcrumbJsonLd items={[{ name: 'Home', path: '/' }, { name: market.name, path: market.path }]} />
      <section className="ets-section ets-hero">
        <div className="ets-container">
          <p className="ets-eyebrow">{market.name} · Local market page</p>
          <h1>{market.headline}</h1>
          <p className="ets-lede">{market.intro}</p>
          <p className="ets-market-price">
            {startingPrice === null
              ? `Pricing in ${market.currency}: request a written quote.`
              : `Projects from ${formatZarAsCurrency(startingPrice, market.currency)}.`}
          </p>
          <div className="ets-button-row">
            <Link className="ets-button primary" href="/contact">{PRIMARY_CTA_LABEL} <span aria-hidden="true">↗</span></Link>
            {bookingHref && <a className="ets-button secondary" href={bookingHref} target="_blank" rel="noopener noreferrer">Book a 20-minute call <span aria-hidden="true">↗</span></a>}
            {whatsappHref && <a className="ets-button secondary" href={whatsappHref} target="_blank" rel="noopener noreferrer">Message on WhatsApp <span aria-hidden="true">↗</span></a>}
          </div>
        </div>
      </section>

      <section className="ets-section ets-markets">
        <div className="ets-container ets-market-layout">
          <div className="ets-section-heading">
            <p className="ets-eyebrow">Working across time zones</p>
            <h2>How we work with {market.name}.</h2>
            <p>Shared work hours are estimated from 09:00–17:00 in each location using current IANA time-zone rules. SAST remains UTC+2 throughout the year.</p>
          </div>
          <div className="ets-market-overlap" aria-live="polite">
            <p><strong>Johannesburg now:</strong> {overlap.currentSastTime}</p>
            <p><strong>{market.name} now:</strong> {overlap.currentMarketTime}</p>
            <p><strong>Shared weekday work time:</strong> {overlap.overlapHours}h{overlap.remainingMinutes ? ` ${overlap.remainingMinutes}m` : ''}</p>
            {overlap.overlapMinutes < 240 ? (
              <p>Overlap is limited. We plan asynchronous reviews and may suggest meeting slots outside one location&apos;s usual workday.</p>
            ) : (
              <p>There is time for shared reviews during both teams&apos; usual working hours.</p>
            )}
          </div>
        </div>
      </section>

      {/* TODO(content): Add approved region-specific case studies before publishing market proof. */}
      <section className="ets-section ets-home-pricing">
        <div className="ets-container">
          <div className="ets-section-heading">
            <p className="ets-eyebrow">Pricing in {market.currency}</p>
            <h2>Service scopes and quote options.</h2>
            <p>Conversions are indicative. Service prices and package inclusions remain unpublished until confirmed; final terms appear in a written proposal.</p>
          </div>
          <SitePricing defaultCurrency={market.currency} excludeServiceSlugs={tradingBotsExcluded} />
        </div>
      </section>

      <GoogleReviews />

      {market.tradingBotsEnabled && (
        <section className="ets-section ets-results">
          <div className="ets-container">
            <p className="ets-eyebrow">Trading-system engineering</p>
            <h2>Software work, not an investment promise.</h2>
            <p>Trading systems involve financial risk. We do not provide investment advice or guarantee performance; any live deployment needs independent risk review and prior testing.</p>
            <Link className="ets-text-link" href="/services/trading-bots">Trading bot engineering details <span aria-hidden="true">↗</span></Link>
          </div>
        </section>
      )}

      {market.paymentMethods.length > 0 && (
        <section className="ets-section">
          <div className="ets-container">
            <p className="ets-eyebrow">Payment methods</p>
            <h2>Available payment options.</h2>
            <ul className="ets-market-payment-list">
              {market.paymentMethods.map((method) => <li key={method}>{method}</li>)}
            </ul>
          </div>
        </section>
      )}

      {/* TODO(legal): Render a local compliance note only after its law and wording are verified in config/markets.ts. */}
      {market.privacyLaw && (
        <section className="ets-section">
          <div className="ets-container"><p>{market.privacyLaw}</p></div>
        </section>
      )}

      <section className="ets-section ets-faq">
        <div className="ets-container ets-faq-layout">
          <div className="ets-section-heading"><p className="ets-eyebrow">Market FAQ</p><h2>Questions from {market.name}.</h2></div>
          <div className="ets-accordion">
            {market.faqs.map((faq) => (
              <details key={faq.question}>
                <summary>{faq.question}<span aria-hidden="true">+</span></summary>
                <p>{faq.answer}</p>
              </details>
            ))}
          </div>
        </div>
      </section>

      <section className="ets-section ets-final-cta">
        <div className="ets-container ets-final-cta-inner">
          <div>
            <p className="ets-eyebrow">Contact · {market.name}</p>
            <h2>Talk through your project.</h2>
            <p>Share your goals and constraints. We&apos;ll reply with questions and practical next steps.</p>
          </div>
          <div className="ets-button-row">
            <Link className="ets-button primary" href="/contact">Send a project brief <span aria-hidden="true">↗</span></Link>
            {bookingHref && <a className="ets-button secondary" href={bookingHref} target="_blank" rel="noopener noreferrer">Book a call</a>}
            {whatsappHref && <a className="ets-button secondary" href={whatsappHref} target="_blank" rel="noopener noreferrer">WhatsApp</a>}
          </div>
        </div>
      </section>
    </div>
  )
}
