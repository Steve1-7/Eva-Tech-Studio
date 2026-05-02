'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import SectionLabel from '@/components/SectionLabel'
import ScrollReveal from '@/components/ScrollReveal'

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

export default function BlogPage() {
  const [posts, setPosts] = useState<BlogPost[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    loadPosts()
  }, [])

  const loadPosts = async () => {
    try {
      const res = await fetch('/api/blog')
      if (res.ok) {
        const data = await res.json()
        setPosts(data.posts || [])
      }
    } catch (error) {
      console.error('Failed to load posts:', error)
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ background: 'var(--obsidian)' }}>
        <div className="text-center">
          <div className="animate-spin w-8 h-8 border-2 border-[#C9A96E] border-t-transparent rounded-full mx-auto mb-4"></div>
          <p style={{ color: '#6B6860' }}>Loading articles...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen" style={{ background: 'var(--obsidian)' }}>
      {/* Header */}
      <section className="pt-[140px] pb-[80px] px-6 md:px-[60px]">
        <div className="max-w-[1200px] mx-auto">
          <ScrollReveal>
            <div className="text-center max-w-[620px] mx-auto">
              <SectionLabel center>Blog</SectionLabel>
              <h1 className="text-[clamp(2.2rem,5vw,4rem)] font-semibold mt-4 mb-6" style={{ color: '#E8E3D8' }}>
                Insights &<br />
                <span className="text-shimmer italic font-light">Strategies</span>
              </h1>
              <p className="leading-[1.85] font-light text-[1rem]" style={{ color: '#6B6860' }}>
                Expert perspectives on digital marketing, technology, and business growth from the Eve-Tech-Studio team.
              </p>
            </div>
          </ScrollReveal>
        </div>
      </section>

      {/* Blog Posts Grid */}
      <section className="py-[60px] px-6 md:px-[60px]" style={{ background: 'var(--obsidian-2)' }}>
        <div className="max-w-[1200px] mx-auto">
          {posts.length === 0 ? (
            <div className="text-center py-12">
              <p style={{ color: '#6B6860' }}>No articles published yet.</p>
            </div>
          ) : (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {posts.map((post: BlogPost, i: number) => (
                <ScrollReveal key={post.id} delay={i * 100}>
                  <Link href={`/blog/${post.id}`} className="block group">
                    <article className="rounded-[20px] overflow-hidden card h-full transition-all duration-300 group-hover:border-[rgba(201,169,110,0.2)]"
                      style={{ background: 'var(--obsidian-3)', border: '1px solid rgba(232,227,216,0.06)' }}>
                      {/* Cover Image */}
                      <div className="aspect-[16/10] overflow-hidden">
                        {post.coverImage ? (
                          <img 
                            src={post.coverImage} 
                            alt={post.title}
                            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                          />
                        ) : (
                          <div className="w-full h-full bg-gradient-to-br from-[rgba(201,169,110,0.1)] to-[rgba(74,122,100,0.1)] flex items-center justify-center"
                            style={{ background: 'linear-gradient(135deg, var(--obsidian-4), var(--obsidian-3))' }}>
                            <span className="text-4xl">📝</span>
                          </div>
                        )}
                      </div>

                      {/* Content */}
                      <div className="p-6">
                        <div className="flex items-center gap-3 mb-3">
                          <span className="text-[0.68rem] font-bold uppercase tracking-[0.08em] px-2 py-1 rounded-full"
                            style={{ background: 'rgba(201,169,110,0.1)', color: '#C9A96E' }}>
                            {post.category}
                          </span>
                          <span className="text-[0.68rem]" style={{ color: '#3A3830' }}>5 min read</span>
                        </div>

                        <h2 className="font-cormorant text-[1.3rem] font-semibold mb-3 leading-tight group-hover:text-[#C9A96E] transition-colors"
                          style={{ color: '#E8E3D8' }}>
                          {post.title}
                        </h2>

                        <p className="text-[0.85rem] leading-[1.7] mb-4 line-clamp-3" style={{ color: '#6B6860' }}>
                          {post.excerpt}
                        </p>

                        <div className="flex items-center justify-between pt-4" style={{ borderTop: '1px solid rgba(232,227,216,0.05)' }}>
                          <div className="flex items-center gap-2">
                            <div className="w-8 h-8 rounded-full flex items-center justify-center text-[0.75rem] font-bold"
                              style={{ background: 'rgba(201,169,110,0.15)', color: '#C9A96E' }}>
                              {post.author.split(' ').map((n: string) => n[0]).join('')}
                            </div>
                            <div>
                              <div className="text-[0.75rem] font-medium" style={{ color: '#E8E3D8' }}>{post.author}</div>
                              <div className="text-[0.68rem]" style={{ color: '#3A3830' }}>{new Date(post.date).toLocaleDateString('en-ZA', { month: 'short', day: 'numeric', year: 'numeric' })}</div>
                            </div>
                          </div>
                          <span className="text-[0.75rem] font-semibold transition-all duration-200 group-hover:gap-2 flex items-center gap-1"
                            style={{ color: '#C9A96E' }}>
                            Read <span>→</span>
                          </span>
                        </div>
                      </div>
                    </article>
                  </Link>
                </ScrollReveal>
              ))}
            </div>
          )}
        </div>
      </section>
    </div>
  )
}
