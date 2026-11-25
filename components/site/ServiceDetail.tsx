import Link from 'next/link'
import { notFound } from 'next/navigation'
import { services } from '@/lib/siteContent'
import { PRIMARY_CTA_LABEL } from '@/config/site'
import { BreadcrumbJsonLd, JsonLd } from '@/components/site/JsonLd'
import ServicePrice from '@/components/site/ServicePrice'
import type { ServicePricingSlug } from '@/config/pricing'

const serviceDetails: Record<string, {
  intro: string
  problem: string
  outcomes: string[]
  fit: string
  approach: string
  faqs: Array<{ question: string; answer: string }>
  relatedCases: Array<{ name: string; href: string }>
}> = {
  'website-development': {
    intro: 'A fast, maintainable website should make it easier for the right people to understand your offer and take the next step. We plan and build the full experience, from structure to launch.',
    problem: 'When a website is hard to navigate, slow to maintain, or disconnected from the way a business works, visitors and staff both have to work around it.',
    outcomes: ['Clear page structure and content hierarchy', 'Responsive, accessible interface', 'CMS and third-party integrations where needed', 'Search-friendly technical foundations', 'Testing, launch support, and handover'],
    fit: 'For businesses that need a new site, a rebuild, or a more dependable foundation for a growing product.',
    approach: 'We agree the pages and success criteria first, then design, build, test on real devices, and launch with a clear handover.',
    faqs: [
      { question: 'What does a website project include?', answer: 'The scope can include page structure, responsive implementation, content management, integrations, testing, deployment, and handover. The written proposal lists the agreed deliverables.' },
      { question: 'Can you improve an existing website?', answer: 'Yes. We can review the current site and scope a focused rebuild, performance improvement, accessibility update, or new feature.' },
      { question: 'Can our team edit the site after launch?', answer: 'Content editing can be included when the project needs a CMS. The chosen approach and training are agreed during scoping.' },
      { question: 'How do you handle search optimisation?', answer: 'We can include technical foundations such as crawlable structure, metadata, and performance considerations. Ongoing content strategy is scoped separately.' },
    ],
    relatedCases: [{ name: 'AWSP', href: '/work/awsp' }, { name: 'CleanSmith', href: '/work/cleansmith' }],
  },
  'web-applications': {
    intro: 'We turn operational needs and product ideas into browser-based applications people can rely on, with sensible data structures and clear user flows.',
    problem: 'A web application is a fit when people need to sign in, save information, follow a process, or work with different permissions—not just read public pages.',
    outcomes: ['Product flows and interface design', 'Accounts, permissions, and dashboards', 'APIs, data models, and integrations', 'Testing for critical user journeys', 'Deployment, documentation, and ownership handover'],
    fit: 'For teams replacing spreadsheets, launching a software product, or extending an existing web platform.',
    approach: 'We reduce risk by mapping the main user journeys and technical dependencies before building a focused first release.',
    faqs: [
      { question: 'Can you build a first version of a software product?', answer: 'Yes. We can define a focused first release around the main user journey and the technical requirements needed to support it.' },
      { question: 'Do you handle accounts and permissions?', answer: 'User accounts and role-based access can be included when they are part of the agreed requirements.' },
      { question: 'Can a web app connect to our existing tools?', answer: 'Integrations are scoped around the services, APIs, access, and data flows available for the project.' },
      { question: 'What happens after the application launches?', answer: 'The handover covers the agreed source code, documentation, and deployment details. Ongoing support can be scoped separately.' },
    ],
    relatedCases: [{ name: 'Bagmaa', href: '/work/bagmaa' }, { name: 'PromptlyOS', href: '/work/promptlyos' }],
  },
  'mobile-app-development': {
    intro: 'We design mobile-first products for customers and teams, choosing native, cross-platform, or installable web technology to fit the job.',
    problem: 'A mobile experience needs to work within real device, connectivity, and user-flow constraints. Choosing a platform before understanding those constraints can add avoidable maintenance.',
    outcomes: ['User flows and platform recommendation', 'Responsive or cross-platform app interface', 'Backend and API integration', 'Device and accessibility testing', 'Store or web deployment guidance'],
    fit: 'For businesses that need a mobile experience for customers, staff, bookings, or field operations.',
    approach: 'We confirm devices, integrations, and launch requirements early so the app is practical to maintain after release.',
    faqs: [
      { question: 'Do I need a native app or a mobile website?', answer: 'The right choice depends on device features, offline needs, distribution, and the tasks users need to complete. We review these before recommending a platform.' },
      { question: 'Can you build for iOS and Android?', answer: 'Cross-platform options can target both platforms where the requirements and chosen technology support them.' },
      { question: 'Can the app work with an existing backend?', answer: 'Yes, subject to the existing system providing suitable and authorised APIs.' },
      { question: 'Are app-store submissions included?', answer: 'Store preparation and release support can be included in the written project scope.' },
    ],
    relatedCases: [{ name: 'Bagmaa', href: '/work/bagmaa' }, { name: 'Drip-Gather', href: '/work/drip-gather' }],
  },
  'custom-software': {
    intro: 'When off-the-shelf tools do not fit, we build focused software around your processes instead of forcing the business to work around the tool.',
    problem: 'Disconnected tools and repeated manual work can make a process difficult to track. Custom software can help when a defined workflow needs a better fit.',
    outcomes: ['Workflow and requirements mapping', 'Purpose-built internal tools', 'Role-based access and audit-friendly records', 'Integration with existing systems', 'Documentation and source-code handover'],
    fit: 'For teams with repeated manual work, disconnected systems, or a specific operating problem that generic software cannot solve.',
    approach: 'We start with the smallest useful workflow, validate it with the people who use it, and expand only when the evidence supports it.',
    faqs: [
      { question: 'When is custom software worth considering?', answer: 'It may be appropriate when a specific, repeated workflow cannot be handled well by existing tools. We assess alternatives before proposing a build.' },
      { question: 'Can custom software connect to our current tools?', answer: 'Integrations depend on the APIs and access offered by each system and are confirmed during technical discovery.' },
      { question: 'Can the project be delivered in stages?', answer: 'Yes. We can define a small first release and agree later stages after the main workflow has been tested.' },
      { question: 'Who owns the source code?', answer: 'Ownership and handover are documented in the proposal and agreement before development begins.' },
    ],
    relatedCases: [{ name: 'PromptlyOS', href: '/work/promptlyos' }, { name: 'Bagmaa', href: '/work/bagmaa' }],
  },
  'ai-chatbots': {
    intro: 'A useful chatbot answers a defined set of questions, knows when it is unsure, and gives people a clear way to reach your team.',
    problem: 'Unbounded automated answers can mislead people. A chatbot needs approved sources, clear limits, and a reliable path to human help.',
    outcomes: ['Use-case and approved-source review', 'Chat interface and conversation design', 'Knowledge and business-system integrations', 'Escalation and fallback paths', 'Testing, monitoring, and usage guidance'],
    fit: 'For teams that want to help customers find answers or support staff with repeatable information tasks.',
    approach: 'We define what the assistant may answer, test the failure cases, and keep human review and escalation in the design.',
    faqs: [
      { question: 'What content can a chatbot use?', answer: 'The assistant should use sources you approve and that the project is authorised to access. Source quality and update ownership are part of scoping.' },
      { question: 'Can it hand a conversation to a person?', answer: 'A human escalation path can be included and should be designed for the support process you use.' },
      { question: 'Can a chatbot guarantee correct answers?', answer: 'No. AI systems can make mistakes. We design explicit limits, fallback behaviour, and testing around the risks of the use case.' },
      { question: 'Can it connect to our systems?', answer: 'That depends on the system APIs, permissions, and the actions the assistant is allowed to take.' },
    ],
    // TODO(content): Add two relevant, approved chatbot case studies when available.
    relatedCases: [],
  },
  'trading-bots': {
    intro: 'We engineer trading software integrations and strategy tooling with explicit controls, observable behaviour, and a test-first workflow.',
    problem: 'Automated trading can create financial risk when assumptions, execution failures, or operator controls are not made explicit and tested.',
    outcomes: ['Strategy requirements and API review', 'Simulation and test-environment setup', 'Order, position, and error handling', 'Risk limits and operator controls', 'Monitoring and technical documentation'],
    fit: 'For teams needing a technical prototype, data integration, or a controlled automation system—not a promise of investment returns.',
    approach: 'We validate assumptions in simulation first. Live execution is a separate, carefully reviewed decision and is never represented as risk-free.',
    faqs: [
      { question: 'Do trading bots guarantee a return?', answer: 'No. Markets are uncertain, and software cannot guarantee profit or remove investment risk.' },
      { question: 'Can you test a strategy before live use?', answer: 'Simulation and test-environment work can be part of the scope. Test results do not guarantee future performance.' },
      { question: 'Do you provide investment advice?', answer: 'No. The service is software engineering and does not provide investment or financial advice.' },
      { question: 'Can a system include risk controls?', answer: 'Risk limits, operator controls, and error handling can be specified as engineering requirements. They do not make trading risk-free.' },
    ],
    // TODO(content): Add two relevant, approved trading-system case studies when available.
    relatedCases: [],
  },
  automation: {
    intro: 'We connect your tools and remove repetitive work while keeping important decisions visible and recoverable.',
    problem: 'Repeated copying, disconnected systems, and hidden failure states make workflows harder to operate and review.',
    outcomes: ['Process and exception mapping', 'API, webhook, and CRM integrations', 'Approval steps for sensitive actions', 'Retries, logs, and failure notifications', 'Runbooks and ownership handover'],
    fit: 'For teams moving information between systems, repeating admin tasks, or losing time to manual hand-offs.',
    approach: 'We map normal and failure paths before automating, then release in stages with clear logs and a way to intervene.',
    faqs: [
      { question: 'What kinds of workflows can be automated?', answer: 'We assess repeatable, rules-based work and the systems involved before deciding whether automation is appropriate.' },
      { question: 'What happens when an integration fails?', answer: 'Retry, alerting, logging, and manual recovery behaviour can be defined in the scope for each workflow.' },
      { question: 'Can people approve sensitive actions?', answer: 'Yes. Approval steps can be included for consequential actions where the connected systems support them.' },
      { question: 'Will automation replace our existing tools?', answer: 'Not necessarily. The aim is to connect systems that fit your needs and reduce unnecessary hand-offs, not to replace tools by default.' },
    ],
    relatedCases: [{ name: 'Bagmaa', href: '/work/bagmaa' }, { name: 'PromptlyOS', href: '/work/promptlyos' }],
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
    provider: { '@type': 'Organization', name: 'Eva Tech Studio' },
    areaServed: 'Worldwide',
    url: `https://www.eva-tech-studio.com${service.href}`,
  }
  const faqSchema = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: detail.faqs.map((faq) => ({
      '@type': 'Question',
      name: faq.question,
      acceptedAnswer: { '@type': 'Answer', text: faq.answer },
    })),
  }

  return (
    <div className="ets-page">
      <JsonLd data={schema} />
      <JsonLd data={faqSchema} />
      <BreadcrumbJsonLd items={[{ name: 'Home', path: '/' }, { name: 'Services', path: '/services' }, { name: service.title, path: service.href }]} />
      <section className="ets-section ets-hero">
        <div className="ets-container">
          <p className="ets-eyebrow">{service.number} · {service.tag}</p>
          <h1 className="ets-service-title">{service.title}<em>, built with care.</em></h1>
          <p className="ets-lede">{service.description}</p>
          <div className="ets-button-row">
            <Link href="/contact" className="ets-button primary">{PRIMARY_CTA_LABEL} <span aria-hidden="true">↗</span></Link>
            <Link href="/pricing" className="ets-button secondary">View pricing</Link>
          </div>
        </div>
      </section>
      <section className="ets-section ets-results">
        <div className="ets-container ets-service-detail-grid">
          <div>
            <p className="ets-eyebrow">The problem</p>
            <h2>{service.title} for the way you work.</h2>
            <p>{detail.problem}</p>
            <h3>What the project can include</h3>
            <p>{detail.intro}</p>
            <ul>{detail.outcomes.map((outcome) => <li key={outcome}>{outcome}</li>)}</ul>
          </div>
          <aside>
            <p className="ets-eyebrow">Who it is for</p>
            <p>{detail.fit}</p>
            <p className="ets-eyebrow">Our process</p>
            <p>{detail.approach}</p>
            {slug === 'trading-bots' && <p className="ets-risk-note">We do not provide investment advice, promise returns, or recommend deploying untested software with real funds.</p>}
          </aside>
        </div>
      </section>
      <ServicePrice slug={slug as ServicePricingSlug} serviceName={service.title} />
      {detail.relatedCases.length > 0 && (
        <section className="ets-section ets-projects">
          <div className="ets-container">
            <p className="ets-eyebrow">Selected work</p>
            <h2>Related case studies</h2>
            <div className="ets-button-row">
              {detail.relatedCases.map((project) => (
                <Link className="ets-button secondary" href={project.href} key={project.href}>
                  {project.name} <span aria-hidden="true">↗</span>
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}
      <section className="ets-section ets-faq">
        <div className="ets-container">
          <p className="ets-eyebrow">Frequently asked</p>
          <h2>Questions about {service.title.toLowerCase()}</h2>
          <div className="ets-accordion">
            {detail.faqs.map((faq) => (
              <details key={faq.question}>
                <summary>{faq.question}<span aria-hidden="true">+</span></summary>
                <p>{faq.answer}</p>
              </details>
            ))}
          </div>
        </div>
      </section>
      <section className="ets-section">
        <div className="ets-container ets-service-cta">
          <div><p className="ets-eyebrow">Start with a clear scope</p><h2>Free technical scoping in 48 hours.</h2><p>Share what you need to change. We’ll come back with questions, risks, and a practical next step.</p></div>
          <Link className="ets-button primary" href="/contact">{PRIMARY_CTA_LABEL} <span aria-hidden="true">↗</span></Link>
        </div>
      </section>
    </div>
  )
}
