import type { Metadata } from 'next'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { blogPosts } from '@/lib/blogContent'
import { PRIMARY_CTA_LABEL } from '@/config/site'

type Props = { params: { id: string } }

export function generateStaticParams() {
  return blogPosts.map((post) => ({ id: post.slug }))
}

export function generateMetadata({ params }: Props): Metadata {
  const post = blogPosts.find((item) => item.slug === params.id)
  if (!post) return { title: 'Article not found' }
  return {
    title: post.title,
    description: post.excerpt,
    alternates: { canonical: `/blog/${post.slug}` },
    openGraph: { type: 'article', title: post.title, description: post.excerpt },
  }
}

export default function BlogArticlePage({ params }: Props) {
  const post = blogPosts.find((item) => item.slug === params.id)
  if (!post) notFound()

  const schema = {
    '@context': 'https://schema.org',
    '@type': 'BlogPosting',
    headline: post.title,
    description: post.excerpt,
    author: { '@type': 'Organization', name: 'Eva Tech Studio' },
    publisher: { '@type': 'Organization', name: 'Eva Tech Studio', url: 'https://www.eva-tech-studio.com' },
    mainEntityOfPage: `https://www.eva-tech-studio.com/blog/${post.slug}`,
  }

  return (
    <article className="ets-page">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }} />
      <header className="ets-section ets-hero">
        <div className="ets-container ets-article-header">
          <Link className="ets-text-link" href="/blog">← All notes</Link>
          <p className="ets-eyebrow">{post.category}</p>
          <h1>{post.title}</h1>
          <p className="ets-lede">{post.excerpt}</p>
        </div>
      </header>
      <div className="ets-article-body">
        {post.sections.map((section) => (
          <section key={section.heading}>
            <h2>{section.heading}</h2>
            {section.paragraphs.map((paragraph) => <p key={paragraph}>{paragraph}</p>)}
          </section>
        ))}
        <aside>
          <p className="ets-eyebrow">Talk it through</p>
          <p>Have a project in mind? Get a clear first scope and practical next steps within 48 hours.</p>
          <Link className="ets-button primary" href="/contact">{PRIMARY_CTA_LABEL} <span aria-hidden="true">↗</span></Link>
        </aside>
      </div>
    </article>
  )
}
