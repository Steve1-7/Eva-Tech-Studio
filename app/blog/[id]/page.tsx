'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import ScrollReveal from '@/components/ScrollReveal'
import { useParams } from 'next/navigation'

interface BlogPost {
  id: number
  title: string
  excerpt: string
  content: string
  author: string
  date: string
  coverImage: string
  category: string
  published: boolean
  metaDescription?: string
  tags?: string[]
}

export default function BlogPostPage() {
  const params = useParams()
  const [post, setPost] = useState<BlogPost | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    if (params.id) {
      loadPost()
    }
  }, [params.id])

  const loadPost = async () => {
    try {
      const res = await fetch(`/api/blog/${params.id}`)
      if (res.ok) {
        const data = await res.json()
        setPost(data.post)
      } else {
        setError('Post not found')
      }
    } catch (err) {
      setError('Failed to load post')
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ background: 'var(--obsidian)' }}>
        <div className="text-center">
          <div className="animate-spin w-8 h-8 border-2 border-[#C9A96E] border-t-transparent rounded-full mx-auto mb-4"></div>
          <p style={{ color: '#6B6860' }}>Loading article...</p>
        </div>
      </div>
    )
  }

  if (error || !post) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ background: 'var(--obsidian)' }}>
        <div className="text-center">
          <p style={{ color: '#6B6860' }}>{error || 'Post not found'}</p>
          <Link href="/blog" className="inline-flex items-center gap-2 text-[#C9A96E] mt-4">
            ← Back to Blog
          </Link>
        </div>
      </div>
    )
  }
  return (
    <div className="min-h-screen" style={{ background: 'var(--obsidian)' }}>
      {/* Header */}
      <section className="pt-[140px] pb-[60px] px-6 md:px-[60px]">
        <div className="max-w-[800px] mx-auto">
          <ScrollReveal>
            <Link href="/blog" className="inline-flex items-center gap-2 text-[0.8rem] font-medium mb-6 transition-colors hover:text-[#C9A96E]"
              style={{ color: '#6B6860' }}>
              ← Back to Blog
            </Link>

            <div className="flex items-center gap-3 mb-4">
              <span className="text-[0.68rem] font-bold uppercase tracking-[0.08em] px-2 py-1 rounded-full"
                style={{ background: 'rgba(201,169,110,0.1)', color: '#C9A96E' }}>
                {post.category}
              </span>
              <span className="text-[0.68rem]" style={{ color: '#3A3830' }}>5 min read</span>
            </div>

            <h1 className="text-[clamp(2rem,4vw,3.2rem)] font-semibold leading-tight mb-6" style={{ color: '#E8E3D8' }}>
              {post.title}
            </h1>

            <div className="flex items-center gap-3 mb-8">
              <div className="w-10 h-10 rounded-full flex items-center justify-center text-[0.85rem] font-bold"
                style={{ background: 'rgba(201,169,110,0.15)', color: '#C9A96E' }}>
                {post.author.split(' ').map((n: string) => n[0]).join('')}
              </div>
              <div>
                <div className="text-[0.85rem] font-medium" style={{ color: '#E8E3D8' }}>{post.author}</div>
                <div className="text-[0.72rem]" style={{ color: '#3A3830' }}>{new Date(post.date).toLocaleDateString('en-ZA', { month: 'long', day: 'numeric', year: 'numeric' })}</div>
              </div>
            </div>
          </ScrollReveal>
        </div>
      </section>

      {/* Content */}
      <section className="py-[60px] px-6 md:px-[60px]" style={{ background: 'var(--obsidian-2)' }}>
        <div className="max-w-[800px] mx-auto">
          <ScrollReveal delay={80}>
            <article className="prose prose-invert max-w-none" style={{ color: '#B8B2A8' }}>
              <div className="whitespace-pre-wrap leading-[1.8] font-light">
                {post.content}
              </div>
            </article>
          </ScrollReveal>
        </div>
      </section>

      {/* Related Posts */}
      <section className="py-[80px] px-6 md:px-[60px]">
        <div className="max-w-[1200px] mx-auto">
          <ScrollReveal delay={120}>
            <h2 className="text-[1.5rem] font-semibold mb-8" style={{ color: '#E8E3D8' }}>Related Articles</h2>
            <div className="grid md:grid-cols-2 gap-6">
              {[1, 2].map((i) => (
                <Link key={i} href="/blog" className="block group">
                  <div className="rounded-[16px] p-6 card transition-all duration-300 group-hover:border-[rgba(201,169,110,0.2)]"
                    style={{ background: 'var(--obsidian-3)', border: '1px solid rgba(232,227,216,0.06)' }}>
                    <h3 className="font-cormorant text-[1.1rem] font-semibold mb-2 group-hover:text-[#C9A96E] transition-colors"
                      style={{ color: '#E8E3D8' }}>
                      Scaling Your E-commerce Business in 2026
                    </h3>
                    <p className="text-[0.8rem] line-clamp-2" style={{ color: '#6B6860' }}>
                      Essential strategies for growing your online store, from conversion optimization to automated marketing funnels.
                    </p>
                  </div>
                </Link>
              ))}
            </div>
          </ScrollReveal>
        </div>
      </section>
    </div>
  )
}
