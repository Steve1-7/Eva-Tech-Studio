import type { Metadata } from 'next'
import Link from 'next/link'
import { projects } from '@/lib/siteContent'

export const metadata: Metadata = {
  title: 'Case Studies',
  description: 'Selected websites, applications, and software projects by Eva Tech Studio.',
  alternates: { canonical: '/case-studies' },
}

export default function CaseStudiesPage() {
  return (
    <div className="ets-page">
      <section className="ets-section ets-hero">
        <div className="ets-container">
          <p className="ets-eyebrow">Selected work</p>
          <h1>Built for <em>people who use it.</em></h1>
          <p className="ets-lede">A selection of live products and platforms. We share what was built, not unverified performance claims.</p>
        </div>
      </section>
      <section className="ets-section ets-projects">
        <div className="ets-container ets-project-grid">
          {projects.map((project, index) => (
            <article className="ets-project-card" key={project.name}>
              <div className={`ets-project-art tone-${index + 1}`} aria-hidden="true"><span>{project.type}</span><b>0{index + 1}</b></div>
              <div className="ets-project-info">
                <p className="ets-eyebrow">{project.type}</p>
                <h2>{project.name}</h2>
                <p>{project.description}</p>
                <small>{project.tech}</small>
                <Link
                  href={project.href}
                  target={project.href.startsWith('http') ? '_blank' : undefined}
                  rel={project.href.startsWith('http') ? 'noreferrer' : undefined}
                  className="ets-text-link"
                >
                  {project.href.startsWith('http') ? 'Visit project' : 'Read project details'} <span aria-hidden="true">↗</span>
                </Link>
              </div>
            </article>
          ))}
        </div>
      </section>
    </div>
  )
}
