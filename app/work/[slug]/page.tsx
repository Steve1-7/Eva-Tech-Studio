import type { Metadata } from 'next'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { BreadcrumbJsonLd, JsonLd } from '@/components/site/JsonLd'
import { createPageMetadata, canonicalUrl } from '@/lib/metadata'
import { projects } from '@/lib/siteContent'

type Props = { params: { slug: string } }
const existingCaseStudySlugs = new Set(['bagmaa', 'gold-coast-mining-review'])

export function generateStaticParams() {
  return projects
    .filter((project) => !existingCaseStudySlugs.has(project.slug))
    .map((project) => ({ slug: project.slug }))
}

export function generateMetadata({ params }: Props): Metadata {
  const project = projects.find((item) => item.slug === params.slug)
  if (!project) return { title: 'Project not found', robots: { index: false, follow: false } }

  return createPageMetadata({
    title: `${project.name} Case Study`,
    description: project.description,
    path: `/work/${project.slug}`,
    type: 'article',
  })
}

export default function ProjectCaseStudyPage({ params }: Props) {
  const project = projects.find((item) => item.slug === params.slug)
  if (!project) notFound()

  const schema = {
    '@context': 'https://schema.org',
    '@type': 'CreativeWork',
    name: `${project.name} case study`,
    description: project.description,
    url: canonicalUrl(project.href),
    creator: { '@type': 'Organization', name: 'Eva Tech Studio' },
    sameAs: project.liveUrl,
  }
  const isDemo = project.liveUrl.includes('.vercel.app')

  return (
    <article className="ets-page">
      <JsonLd data={schema} />
      <BreadcrumbJsonLd items={[{ name: 'Home', path: '/' }, { name: 'Case Studies', path: '/case-studies' }, { name: project.name, path: project.href }]} />
      <header className="ets-section ets-hero">
        <div className="ets-container">
          <p className="ets-eyebrow">{project.type} · Case study</p>
          <h1>{project.name}</h1>
          <p className="ets-lede">{project.description}</p>
          <div className="ets-button-row">
            <a className="ets-button primary" href={project.liveUrl} target="_blank" rel="noopener noreferrer">
              {isDemo ? 'View demo' : 'View project'} <span aria-hidden="true">↗</span>
            </a>
            <Link className="ets-button secondary" href="/case-studies">All case studies</Link>
          </div>
        </div>
      </header>
      <section className="ets-section ets-results">
        <div className="ets-container ets-service-detail-grid">
          <div>
            <p className="ets-eyebrow">What we built</p>
            <h2>A project shaped around its intended use.</h2>
            <p>{project.description}</p>
          </div>
          <aside>
            <p className="ets-eyebrow">Technology and delivery</p>
            <p>{project.tech}</p>
            <p className="ets-eyebrow">Project link</p>
            <p>{isDemo ? 'Demo hosted on Vercel.' : 'Project link supplied in the existing portfolio.'}</p>
          </aside>
        </div>
      </section>
      {/* TODO(content): Confirm and add the original project problem and qualitative outcome before publishing. */}
      {/* TODO(confirm): Add outcome figures only when approved, independently verifiable data is supplied. */}
      <section className="ets-final-cta">
        <div className="ets-container ets-final-cta-inner">
          <div>
            <p className="ets-eyebrow">Have a related project?</p>
            <h2>Start with a clear scope.</h2>
            <p>We will clarify the requirements, assumptions, and next steps before work begins.</p>
          </div>
          <Link className="ets-button primary" href="/contact">Get a free scope in 48 hours <span aria-hidden="true">↗</span></Link>
        </div>
      </section>
    </article>
  )
}
