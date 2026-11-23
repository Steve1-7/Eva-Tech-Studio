import Link from 'next/link'
import { notFound } from 'next/navigation'
import { services } from '@/lib/siteContent'

const serviceDetails: Record<string, { intro: string; outcomes: string[]; fit: string; approach: string }> = {
  'website-development': {
    intro: 'A fast, maintainable website should make it easier for the right people to understand your offer and take the next step. We plan and build the full experience, from structure to launch.',
    outcomes: ['Clear page structure and content hierarchy', 'Responsive, accessible interface', 'CMS and third-party integrations where needed', 'Search-friendly technical foundations', 'Testing, launch support, and handover'],
    fit: 'For businesses that need a new site, a rebuild, or a more dependable foundation for a growing product.',
    approach: 'We agree the pages and success criteria first, then design, build, test on real devices, and launch with a clear handover.',
  },
  'web-applications': {
    intro: 'We turn operational needs and product ideas into browser-based applications people can rely on, with sensible data structures and clear user flows.',
    outcomes: ['Product flows and interface design', 'Accounts, permissions, and dashboards', 'APIs, data models, and integrations', 'Testing for critical user journeys', 'Deployment, documentation, and ownership handover'],
    fit: 'For teams replacing spreadsheets, launching a software product, or extending an existing web platform.',
    approach: 'We reduce risk by mapping the main user journeys and technical dependencies before building a focused first release.',
  },
  'mobile-app-development': {
    intro: 'We design mobile-first products for customers and teams, choosing native, cross-platform, or installable web technology to fit the job.',
    outcomes: ['User flows and platform recommendation', 'Responsive or cross-platform app interface', 'Backend and API integration', 'Device and accessibility testing', 'Store or web deployment guidance'],
    fit: 'For businesses that need a mobile experience for customers, staff, bookings, or field operations.',
    approach: 'We confirm devices, integrations, and launch requirements early so the app is practical to maintain after release.',
  },
  'custom-software': {
    intro: 'When off-the-shelf tools do not fit, we build focused software around your processes instead of forcing the business to work around the tool.',
    outcomes: ['Workflow and requirements mapping', 'Purpose-built internal tools', 'Role-based access and audit-friendly records', 'Integration with existing systems', 'Documentation and source-code handover'],
    fit: 'For teams with repeated manual work, disconnected systems, or a specific operating problem that generic software cannot solve.',
    approach: 'We start with the smallest useful workflow, validate it with the people who use it, and expand only when the evidence supports it.',
  },
  'ai-chatbots': {
    intro: 'A useful chatbot answers a defined set of questions, knows when it is unsure, and gives people a clear way to reach your team.',
    outcomes: ['Use-case and approved-source review', 'Chat interface and conversation design', 'Knowledge and business-system integrations', 'Escalation and fallback paths', 'Testing, monitoring, and usage guidance'],
    fit: 'For teams that want to help customers find answers or support staff with repeatable information tasks.',
    approach: 'We define what the assistant may answer, test the failure cases, and keep human review and escalation in the design.',
  },
  'trading-bots': {
    intro: 'We engineer trading software integrations and strategy tooling with explicit controls, observable behaviour, and a test-first workflow.',
    outcomes: ['Strategy requirements and API review', 'Simulation and test-environment setup', 'Order, position, and error handling', 'Risk limits and operator controls', 'Monitoring and technical documentation'],
    fit: 'For teams needing a technical prototype, data integration, or a controlled automation system—not a promise of investment returns.',
    approach: 'We validate assumptions in simulation first. Live execution is a separate, carefully reviewed decision and is never represented as risk-free.',
  },
  automation: {
    intro: 'We connect your tools and remove repetitive work while keeping important decisions visible and recoverable.',
    outcomes: ['Process and exception mapping', 'API, webhook, and CRM integrations', 'Approval steps for sensitive actions', 'Retries, logs, and failure notifications', 'Runbooks and ownership handover'],
    fit: 'For teams moving information between systems, repeating admin tasks, or losing time to manual hand-offs.',
    approach: 'We map normal and failure paths before automating, then release in stages with clear logs and a way to intervene.',
  },
}

export default function ServiceDetail({ slug }: { slug: string }) {
  const service = services.find((item) => item.href === `/services/${slug}`)
  const detail = serviceDetails[slug]
  if (!service || !detail) notFound()

  const schema = {
    '@context': 'https://schema.org',
    '@type': 'Service',
    name: service.title,
    description: service.description,
    provider: {
      '@type': 'Organization',
      name: 'Eva Tech Studio',
      url: 'https://www.eva-tech-studio.com',
    },
    areaServed: 'Worldwide',
    url: `https://www.eva-tech-studio.com${service.href}`,
  }

  return (
    <div className="ets-page">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }} />
      <section className="ets-section ets-hero">
        <div className="ets-container">
          <p className="ets-eyebrow">{service.number} · {service.tag}</p>
          <h1 className="ets-service-title">{service.title}<em>, built with care.</em></h1>
          <p className="ets-lede">{service.description}</p>
          <div className="ets-button-row">
            <Link href="/contact" className="ets-button primary">Get a project quote <span aria-hidden="true">↗</span></Link>
            <Link href="/pricing" className="ets-button secondary">View pricing</Link>
          </div>
        </div>
      </section>
      <section className="ets-section ets-results">
        <div className="ets-container ets-service-detail-grid">
          <div>
            <p className="ets-eyebrow">The work</p>
            <h2>{service.title} for the way you work.</h2>
            <p>{detail.intro}</p>
            <h3>What the project can include</h3>
            <ul>{detail.outcomes.map((outcome) => <li key={outcome}>{outcome}</li>)}</ul>
          </div>
          <aside>
            <p className="ets-eyebrow">A good fit for</p>
            <p>{detail.fit}</p>
            <p className="ets-eyebrow">How we approach it</p>
            <p>{detail.approach}</p>
            {slug === 'trading-bots' && <p className="ets-risk-note">We do not provide investment advice, promise returns, or recommend deploying untested software with real funds.</p>}
          </aside>
        </div>
      </section>
      <section className="ets-section">
        <div className="ets-container ets-service-cta">
          <div><p className="ets-eyebrow">Start with a clear scope</p><h2>Free technical scoping in 48 hours.</h2><p>Share what you need to change. We’ll come back with questions, risks, and a practical next step.</p></div>
          <Link className="ets-button primary" href="/contact">Send a brief <span aria-hidden="true">↗</span></Link>
        </div>
      </section>
    </div>
  )
}
