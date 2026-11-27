import { createPageMetadata } from '@/lib/metadata'
import { JsonLd } from '@/components/site/JsonLd'
import Link from 'next/link'
import CountUp from '@/components/CountUp'
import SitePricing from '@/components/site/SitePricing'
import { ChatbotDemo, MarketTimes, TradingBotDemo } from '@/components/site/InteractiveShowcases'
import { faqs, projects, services, techStack } from '@/lib/siteContent'
import { blogPosts } from '@/lib/blogContent'
import { PRIMARY_CTA_LABEL, SECONDARY_CTA_LABEL, SHOW_PROOF_SECTION } from '@/config/site'
import GoogleReviews from '@/components/GoogleReviews'

export const metadata = createPageMetadata({
  title: 'Senior Engineering for Digital Products',
  description: 'Websites, apps, custom software, chatbots, trading systems, and automation—built by a senior engineering studio in Johannesburg for clients worldwide.',
  path: '/',
})

const serviceTicker = [
  'Websites', 'Web Apps', 'Mobile Apps', 'Custom Software', 'Chatbots', 'Trading Bots', 'Automation',
]

const steps = [
  {
    number: '01',
    title: 'Discovery',
    goal: 'Get clear on the problem.',
    detail: 'We learn how your business works, who the product is for, and what a useful result looks like.',
    deliverables: 'Brief · risks · priorities',
  },
  {
    number: '02',
    title: 'Design and Architecture',
    goal: 'Plan before committing.',
    detail: 'We shape the experience, data model, integrations, and delivery plan around your needs.',
    deliverables: 'Flows · technical plan · milestones',
  },
  {
    number: '03',
    title: 'Build and Launch',
    goal: 'Ship a dependable first release.',
    detail: 'We build in reviewable increments, test the important paths, and prepare a controlled launch.',
    deliverables: 'Working software · QA · handover',
  },
  {
    number: '04',
    title: 'Support and Scaling',
    goal: 'Improve with evidence.',
    detail: 'We monitor what matters, resolve issues, and plan the next improvements with your team.',
    deliverables: 'Monitoring · maintenance · roadmap',
  },
]

const reasons = [
  ['Senior-only delivery', 'Work directly with the engineers making the technical decisions. No junior hand-offs.'],
  ['No lock-in contracts', 'Keep control of your accounts and choose support only when it is useful to you.'],
  ['Clear reporting', 'See what shipped, what changed, and what needs attention in plain language.'],
  ['Built for scale', 'Start with the right foundation, then extend it without rebuilding by default.'],
]

const professionalServiceSchema = {
  '@context': 'https://schema.org',
  '@type': 'ProfessionalService',
  name: 'Eva Tech Studio',
  url: 'https://www.eva-tech-studio.com',
  description: 'Senior engineering for websites, applications, custom software, chatbots, trading systems, and automation.',
  areaServed: 'Worldwide',
  hasOfferCatalog: {
    '@type': 'OfferCatalog',
    name: 'Software engineering services',
    itemListElement: services.map((service) => ({
      '@type': 'Offer',
      itemOffered: {
        '@type': 'Service',
        name: service.title,
        description: service.description,
        url: `https://www.eva-tech-studio.com${service.href}`,
      },
    })),
  },
}

const homeFaqSchema = {
  '@context': 'https://schema.org',
  '@type': 'FAQPage',
  mainEntity: faqs.slice(0, 5).map((faq) => ({
    '@type': 'Question',
    name: faq.question,
    acceptedAnswer: { '@type': 'Answer', text: faq.answer },
  })),
}

export default function Home() {
  return (
    <div className="ets-page">
      <JsonLd data={professionalServiceSchema} />
      <JsonLd data={homeFaqSchema} />

      <section className="ets-hero ets-section">
        <div className="ets-container ets-hero-grid">
          <div className="ets-hero-copy">
            <p className="ets-eyebrow"><span className="ets-status-dot" /> Senior engineering · Johannesburg · Global delivery</p>
            <h1>We build software that <em>earns its keep.</em></h1>
            <p className="ets-lede">Websites, apps, and custom software designed around your business—not a template, trend, or sales pitch.</p>
            <div className="ets-button-row">
              <Link className="ets-button primary" href="/contact">{PRIMARY_CTA_LABEL} <span aria-hidden="true">↗</span></Link>
              <Link className="ets-button secondary" href="/case-studies">{SECONDARY_CTA_LABEL} <span aria-hidden="true">↗</span></Link>
            </div>
            <div className="ets-hero-stats" aria-label="Studio facts">
              <div><strong><CountUp end={7} /></strong><span>focused services</span></div>
              <div><strong><CountUp end={48} suffix="h" /></strong><span>scoping turnaround</span></div>
              <div><strong><CountUp end={4} /></strong><span>clear delivery steps</span></div>
              <div><strong><CountUp end={0} /></strong><span>junior hand-offs</span></div>
            </div>
          </div>
          <div className="ets-hero-art" aria-label="Illustration of an application being built">
            <div className="ets-window">
              <div className="ets-window-bar"><i /><i /><i /><span>your-product / overview</span></div>
              <div className="ets-window-content">
                <div className="ets-window-side"><b /><i /><i /><i /><i /></div>
                <div className="ets-window-main">
                  <span className="ets-skeleton short" />
                  <strong>Built around your work.</strong>
                  <span className="ets-skeleton" />
                  <div className="ets-window-cards"><i /><i /><i /></div>
                  <div className="ets-window-chart"><span /><span /><span /><span /><span /><span /><span /></div>
                </div>
              </div>
            </div>
            <div className="ets-note-card"><span>01 / BUILD</span><strong>Clear scope.<br />Thoughtful engineering.</strong></div>
            <span className="ets-hero-stamp">Made in<br />Johannesburg<br /><b>↗ Worldwide</b></span>
          </div>
        </div>
      </section>

      <div className="ets-ticker" aria-label="Our services">
        <div className="ets-ticker-track" aria-hidden="true">
          {[...serviceTicker, ...serviceTicker].map((item, index) => <span key={`${item}-${index}`}>{item}<b>✦</b></span>)}
        </div>
      </div>

      {SHOW_PROOF_SECTION && (
        <section className="ets-section ets-results">
          <div className="ets-container">
            <div className="ets-section-heading">
              <p className="ets-eyebrow">Results at a glance</p>
              <h2>Proof, not promises.</h2>
              <p>We publish client outcomes only when they are verified and approved. These figures are awaiting confirmed data.</p>
            </div>
            <div className="ets-results-grid">
              {[
                ['6', 'projects showcased', 'Published project count'],
                ['Pending', 'uptime', 'Verified monitoring data needed'],
                ['Pending', 'average load time', 'Field measurement needed'],
                ['Pending', 'client retention', 'Verified client data needed'],
              ].map(([value, label, note]) => (
                <article className="ets-result-card" key={label}>
                  <strong>{value}</strong><span>{label}</span><small>{note}</small>
                </article>
              ))}
            </div>
          </div>
        </section>
      )}

      <section className="ets-section ets-services" id="services">
        <div className="ets-container">
          <div className="ets-section-heading ets-heading-split">
            <div><p className="ets-eyebrow">What we build</p><h2>Engineering for the next step.</h2></div>
            <p>Bring us a clear brief or an early idea. We will help you choose a practical route from problem to production.</p>
          </div>
          <div className="ets-service-grid">
            {services.map((service) => (
              <article className="ets-service-card" key={service.number}>
                <div className="ets-service-card-top"><span>{service.number}</span><span className="ets-mini-visual" aria-hidden="true">{service.number}</span></div>
                <p className="ets-eyebrow">{service.tag}</p>
                <h3>{service.title}</h3>
                <p>{service.description}</p>
                <Link className="ets-text-link" href={service.href}>Learn more <span aria-hidden="true">↗</span></Link>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="ets-offer-band">
        <div className="ets-container ets-offer-inner">
          <div><p className="ets-eyebrow">Free · no obligation</p><h2>Project scoping and technical audit in 48 hours.</h2><p>Get a clear first assessment, key risks, and a practical next step.</p></div>
          <Link className="ets-button light" href="/contact">{PRIMARY_CTA_LABEL} <span aria-hidden="true">↗</span></Link>
        </div>
      </section>

      <section className="ets-section ets-process">
        <div className="ets-container">
          <div className="ets-section-heading"><p className="ets-eyebrow">How we work</p><h2>Small steps. Solid foundations.</h2></div>
          <div className="ets-process-grid">
            {steps.map((step) => (
              <article className="ets-process-card" key={step.number}>
                <span className="ets-step-number">{step.number}</span>
                <h3>{step.title}</h3>
                <strong>{step.goal}</strong>
                <p>{step.detail}</p>
                <small>{step.deliverables}</small>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="ets-section ets-why">
        <div className="ets-container ets-why-grid">
          <div className="ets-section-heading"><p className="ets-eyebrow">Why Eva Tech Studio</p><h2>Experienced people. Direct answers.</h2><p>Senior attention from first conversation through launch and beyond.</p></div>
          <div className="ets-reasons">
            {reasons.map(([title, detail], index) => (
              <article key={title}><span>0{index + 1}</span><div><h3>{title}</h3><p>{detail}</p></div></article>
            ))}
          </div>
        </div>
      </section>

      <section className="ets-section ets-projects">
        <div className="ets-container">
          <div className="ets-section-heading ets-heading-split">
            <div><p className="ets-eyebrow">Selected work</p><h2>Useful things, built for real use.</h2></div>
            <Link className="ets-text-link" href="/case-studies">All case studies <span aria-hidden="true">↗</span></Link>
          </div>
          <div className="ets-project-grid">
            {projects.map((project, index) => (
              <article className="ets-project-card" key={project.name}>
                <div className={`ets-project-art tone-${index + 1}`} aria-hidden="true"><span>{project.type}</span><b>0{index + 1}</b></div>
                <div className="ets-project-info">
                  <p className="ets-eyebrow">{project.type}</p>
                  <h3>{project.name}</h3>
                  <p>{project.description}</p>
                  <small>{project.tech}</small>
                  <Link href={project.href} target={project.href.startsWith('http') ? '_blank' : undefined} rel={project.href.startsWith('http') ? 'noreferrer' : undefined} className="ets-text-link">Read case study <span aria-hidden="true">↗</span></Link>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="ets-section ets-demos">
        <div className="ets-container">
          <div className="ets-section-heading"><p className="ets-eyebrow">Small, safe previews</p><h2>See the shape of the work.</h2><p>Both examples below are demonstrations, not live client systems.</p></div>
          <div className="ets-demo-grid">
            <div><h3>Chatbot interface</h3><p>One way a guided support experience could feel.</p><ChatbotDemo /></div>
            <div><h3>Trading system dashboard</h3><p>A view of how a test environment can surface status and controls.</p><TradingBotDemo /></div>
          </div>
        </div>
      </section>

      <GoogleReviews />

      <section className="ets-stack-section">
        <div className="ets-container ets-stack-heading"><p className="ets-eyebrow">Tools we work with</p><span>Chosen for the project, not the trend.</span></div>
        <div className="ets-stack-marquee" aria-label={`Technology stack: ${techStack.join(', ')}`}>
          <div className="ets-stack-track" aria-hidden="true">
            {[...techStack, ...techStack].map((tech, index) => <span key={`${tech}-${index}`}>{tech}<b>·</b></span>)}
          </div>
        </div>
      </section>

      <section className="ets-section ets-markets">
        <div className="ets-container ets-market-layout">
          <div className="ets-section-heading"><p className="ets-eyebrow">Local roots · global teams</p><h2>Work across time zones.</h2><p>Based in Johannesburg, we work remotely with teams wherever the work is.</p></div>
          <MarketTimes />
        </div>
      </section>

      <section className="ets-section ets-notes">
        <div className="ets-container">
          <div className="ets-section-heading ets-heading-split">
            <div><p className="ets-eyebrow">The jargon buster</p><h2>Good questions, plain answers.</h2></div>
            <Link className="ets-text-link" href="/blog">Browse the notes <span aria-hidden="true">↗</span></Link>
          </div>
          <div className="ets-article-grid">
            {blogPosts.slice(0, 3).map((post, index) => (
              <article key={post.slug}><span>0{index + 1} / {post.category.toUpperCase()}</span><h3>{post.title}</h3><p>{post.excerpt}</p><Link href={`/blog/${post.slug}`} className="ets-text-link">Read article <span aria-hidden="true">↗</span></Link></article>
            ))}
          </div>
        </div>
      </section>

      <section className="ets-section ets-faq">
        <div className="ets-container ets-faq-layout">
          <div className="ets-section-heading"><p className="ets-eyebrow">Frequently asked</p><h2>Before we get started.</h2><Link className="ets-text-link" href="/faq">All questions <span aria-hidden="true">↗</span></Link></div>
          <div className="ets-accordion">
            {faqs.slice(0, 5).map((faq) => (
              <details key={faq.question}><summary>{faq.question}<span aria-hidden="true">+</span></summary><p>{faq.answer}</p></details>
            ))}
          </div>
        </div>
      </section>

      <section className="ets-section ets-home-pricing">
        <div className="ets-container">
          <div className="ets-section-heading ets-heading-split">
            <div><p className="ets-eyebrow">Service pricing</p><h2>Start with a clear scope.</h2><p>Choose a service and we will confirm deliverables and price in a written proposal.</p></div>
            <Link className="ets-text-link" href="/pricing">See all service pricing <span aria-hidden="true">↗</span></Link>
          </div>
          <SitePricing compact />
        </div>
      </section>

      <section className="ets-final-cta">
        <div className="ets-container ets-final-cta-inner">
          <div><p className="ets-eyebrow">A good first step</p><h2>Tell us what you want to make possible.</h2><p>We’ll help you work out what to build, what to leave out, and what happens next.</p></div>
          <Link href="/contact" className="ets-button primary">{PRIMARY_CTA_LABEL} <span aria-hidden="true">↗</span></Link>
        </div>
      </section>
    </div>
  )
}
