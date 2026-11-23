import type { Metadata } from 'next'
import Link from 'next/link'
import { blogPosts } from '@/lib/blogContent'

export const metadata: Metadata = {
  title: 'The Jargon Buster',
  description: 'Plain-language notes on software projects, websites, apps, and automation.',
  alternates: { canonical: '/blog' },
}

export default function BlogPage() {
  return (
    <div className="ets-page">
      <section className="ets-section ets-hero">
        <div className="ets-container">
          <p className="ets-eyebrow">The jargon buster</p>
          <h1>Better questions. <em>Plain answers.</em></h1>
          <p className="ets-lede">Notes to help you make better decisions about software, before a project begins and while it grows.</p>
        </div>
      </section>
      <section className="ets-section ets-notes">
        <div className="ets-container ets-article-grid">
          {blogPosts.map((post, index) => (
            <article key={post.slug}>
              <span>0{index + 1} / {post.category.toUpperCase()}</span>
              <h2>{post.title}</h2>
              <p>{post.excerpt}</p>
              <Link className="ets-text-link" href={`/blog/${post.slug}`}>Read article <span aria-hidden="true">↗</span></Link>
            </article>
          ))}
        </div>
      </section>
    </div>
  )
}
