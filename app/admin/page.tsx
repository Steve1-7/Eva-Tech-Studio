'use client'
import { useState, useEffect, useRef } from 'react'
import SectionLabel from '@/components/SectionLabel'
import { generateLinkedInPost, formatLinkedInForCopy } from '@/lib/linkedin'

const AUTHORIZED_EMAIL = 'stevezuluu@gmail.com'

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

export default function AdminDashboard() {
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [email, setEmail] = useState('')
  const [adminEmail, setAdminEmail] = useState('')
  const [posts, setPosts] = useState<BlogPost[]>([])
  const [isEditing, setIsEditing] = useState(false)
  const [editingPost, setEditingPost] = useState<BlogPost | null>(null)
  const [showLinkedInPreview, setShowLinkedInPreview] = useState(false)
  const contentRef = useRef<HTMLTextAreaElement>(null)

  const insertMarkdown = (before: string, after?: string) => {
    const textarea = contentRef.current
    if (!textarea) return

    const start = textarea.selectionStart
    const end = textarea.selectionEnd
    const text = textarea.value
    const selectedText = text.substring(start, end)

    const newText = text.substring(0, start) + before + selectedText + (after || '') + text.substring(end)
    setEditingPost({ ...editingPost!, content: newText })

    // Restore cursor position
    setTimeout(() => {
      textarea.focus()
      textarea.setSelectionRange(start + before.length, start + before.length + selectedText.length)
    }, 0)
  }

  // Load posts from backend API
  const loadPosts = async () => {
    try {
      const res = await fetch('/api/blog?includeDrafts=true')
      const data = await res.json()
      if (data.posts) {
        setPosts(data.posts)
      }
    } catch (error) {
      console.error('Failed to load posts:', error)
    }
  }

  useEffect(() => {
    if (isAuthenticated && adminEmail) {
      loadPosts()
    }
  }, [isAuthenticated, adminEmail])

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email })
      })
      const data = await res.json()
      if (data.success) {
        setIsAuthenticated(true)
        setAdminEmail(email)
      } else {
        alert('Unauthorized access')
      }
    } catch (error) {
      alert('Login failed. Please try again.')
    }
  }

  const handleLogout = () => {
    setIsAuthenticated(false)
    setEmail('')
  }

  const handleCreatePost = () => {
    const newPost: BlogPost = {
      id: 0,
      title: '',
      excerpt: '',
      content: '',
      author: 'Steve Zulu',
      date: new Date().toISOString().split('T')[0],
      coverImage: '',
      category: '',
      published: false,
      metaDescription: '',
      tags: []
    }
    setEditingPost(newPost)
    setIsEditing(true)
  }

  const handleEditPost = (post: BlogPost) => {
    setEditingPost(post)
    setIsEditing(true)
  }

  const handleDeletePost = async (id: number) => {
    if (confirm('Are you sure you want to delete this post?')) {
      try {
        const res = await fetch(`/api/blog/${id}`, {
          method: 'DELETE'
        })
        if (res.ok) {
          await loadPosts()
        }
      } catch (error) {
        console.error('Failed to delete post:', error)
      }
    }
  }

  const handleTogglePublish = async (id: number) => {
    const post = posts.find(p => p.id === id)
    if (!post) return

    try {
      const res = await fetch(`/api/blog/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ ...post, published: !post.published })
      })
      if (res.ok) {
        await loadPosts()
      }
    } catch (error) {
      console.error('Failed to toggle publish status:', error)
    }
  }

  const handleSavePost = async (updatedPost: BlogPost) => {
    try {
      const url = updatedPost.id === 0 ? '/api/blog' : `/api/blog/${updatedPost.id}`
      const method = updatedPost.id === 0 ? 'POST' : 'PUT'

      const res = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(updatedPost)
      })

      if (res.ok) {
        await loadPosts()
        setIsEditing(false)
        setEditingPost(null)
      }
    } catch (error) {
      console.error('Failed to save post:', error)
    }
  }

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen flex items-center justify-center px-6" style={{ background: 'var(--obsidian)' }}>
        <div className="w-full max-w-md">
          <div className="text-center mb-8">
            <h1 className="text-[2rem] font-semibold mb-2" style={{ color: '#E8E3D8' }}>Admin Dashboard</h1>
            <p style={{ color: '#6B6860' }}>Enter your email to access</p>
          </div>
          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label className="block text-[0.72rem] font-bold uppercase tracking-[0.08em] mb-2" style={{ color: '#6B6860' }}>
                Email
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter your email"
                className="form-input"
                required
              />
            </div>
            <button type="submit" className="btn-primary w-full py-3">
              Access Dashboard
            </button>
          </form>
        </div>
      </div>
    )
  }

  if (isEditing && editingPost) {
    return (
      <div className="min-h-screen py-[140px] px-6 md:px-[60px]" style={{ background: 'var(--obsidian)' }}>
        <div className="max-w-[800px] mx-auto">
          <div className="flex items-center justify-between mb-8">
            <button
              onClick={() => setIsEditing(false)}
              className="text-[0.8rem] font-medium transition-colors hover:text-[#C9A96E]"
              style={{ color: '#6B6860' }}
            >
              ← Back to Dashboard
            </button>
            <h1 className="text-[1.5rem] font-semibold" style={{ color: '#E8E3D8' }}>
              {editingPost.title ? 'Edit Post' : 'Create Post'}
            </h1>
          </div>

          <div className="space-y-6">
            <div>
              <label className="block text-[0.72rem] font-bold uppercase tracking-[0.08em] mb-2" style={{ color: '#6B6860' }}>
                Title
              </label>
              <input
                type="text"
                value={editingPost.title}
                onChange={(e) => setEditingPost({ ...editingPost, title: e.target.value })}
                className="form-input"
                placeholder="Post title"
              />
            </div>

            <div>
              <label className="block text-[0.72rem] font-bold uppercase tracking-[0.08em] mb-2" style={{ color: '#6B6860' }}>
                Category
              </label>
              <input
                type="text"
                value={editingPost.category}
                onChange={(e) => setEditingPost({ ...editingPost, category: e.target.value })}
                className="form-input"
                placeholder="e.g. AI & Technology"
              />
            </div>

            <div>
              <label className="block text-[0.72rem] font-bold uppercase tracking-[0.08em] mb-2" style={{ color: '#6B6860' }}>
                Excerpt
              </label>
              <textarea
                value={editingPost.excerpt}
                onChange={(e) => setEditingPost({ ...editingPost, excerpt: e.target.value })}
                className="form-input"
                rows={3}
                placeholder="Brief description for the blog listing"
              />
            </div>

            <div>
              <label className="block text-[0.72rem] font-bold uppercase tracking-[0.08em] mb-2" style={{ color: '#6B6860' }}>
                Meta Description (SEO)
              </label>
              <textarea
                value={editingPost.metaDescription || ''}
                onChange={(e) => setEditingPost({ ...editingPost, metaDescription: e.target.value })}
                className="form-input"
                rows={2}
                placeholder="SEO meta description for search engines (max 160 chars)"
                maxLength={160}
              />
              <div className="text-[0.68rem] mt-1" style={{ color: '#3A3830' }}>
                {(editingPost.metaDescription?.length || 0)}/160 characters
              </div>
            </div>

            <div>
              <label className="block text-[0.72rem] font-bold uppercase tracking-[0.08em] mb-2" style={{ color: '#6B6860' }}>
                Tags (comma-separated)
              </label>
              <input
                type="text"
                value={editingPost.tags?.join(', ') || ''}
                onChange={(e) => setEditingPost({ ...editingPost, tags: e.target.value.split(',').map(t => t.trim()).filter(Boolean) })}
                className="form-input"
                placeholder="e.g. AI, Marketing, Technology"
              />
            </div>

            <div>
              <label className="block text-[0.72rem] font-bold uppercase tracking-[0.08em] mb-2" style={{ color: '#6B6860' }}>
                Content (Rich Text Editor)
              </label>
              <div className="rounded-lg overflow-hidden" style={{ border: '1px solid rgba(232,227,216,0.1)' }}>
                {/* Toolbar */}
                <div className="flex flex-wrap gap-1 p-2" style={{ background: 'var(--obsidian-4)', borderBottom: '1px solid rgba(232,227,216,0.05)' }}>
                  {[
                    { label: 'H1', action: () => insertMarkdown('# ') },
                    { label: 'H2', action: () => insertMarkdown('## ') },
                    { label: 'H3', action: () => insertMarkdown('### ') },
                    { label: 'B', action: () => insertMarkdown('**', '**') },
                    { label: 'I', action: () => insertMarkdown('*', '*') },
                    { label: '—', action: () => insertMarkdown('---\n') },
                    { label: '•', action: () => insertMarkdown('- ') },
                    { label: '1.', action: () => insertMarkdown('1. ') },
                    { label: '>', action: () => insertMarkdown('> ') },
                    { label: '[]', action: () => insertMarkdown('[', '](url)') },
                  ].map((btn, i) => (
                    <button
                      key={i}
                      type="button"
                      onClick={btn.action}
                      className="px-3 py-1.5 rounded text-[0.75rem] font-medium transition-colors hover:bg-[rgba(201,169,110,0.15)]"
                      style={{ color: '#6B6860' }}
                    >
                      {btn.label}
                    </button>
                  ))}
                </div>
                <textarea
                  ref={contentRef}
                  value={editingPost.content}
                  onChange={(e) => setEditingPost({ ...editingPost, content: e.target.value })}
                  className="form-input rounded-none border-0"
                  rows={15}
                  placeholder="Write your blog post content here..."
                  style={{ background: 'var(--obsidian-3)' }}
                />
              </div>
            </div>

            <div>
              <label className="block text-[0.72rem] font-bold uppercase tracking-[0.08em] mb-2" style={{ color: '#6B6860' }}>
                Cover Image
              </label>
              <div className="space-y-3">
                <input
                  type="file"
                  accept="image/*"
                  onChange={(e) => {
                    const file = e.target.files?.[0]
                    if (file) {
                      const reader = new FileReader()
                      reader.onloadend = () => {
                        setEditingPost({ ...editingPost, coverImage: reader.result as string })
                      }
                      reader.readAsDataURL(file)
                    }
                  }}
                  className="w-full text-[0.8rem]"
                  style={{ color: '#6B6860' }}
                />
                <input
                  type="text"
                  value={editingPost.coverImage}
                  onChange={(e) => setEditingPost({ ...editingPost, coverImage: e.target.value })}
                  className="form-input"
                  placeholder="Or paste image URL"
                />
                {editingPost.coverImage && (
                  <div className="aspect-[16/10] rounded-lg overflow-hidden" style={{ background: 'var(--obsidian-4)' }}>
                    <img src={editingPost.coverImage} alt="Preview" className="w-full h-full object-cover" />
                  </div>
                )}
              </div>
            </div>

            <div className="flex items-center gap-3">
              <input
                type="checkbox"
                id="published"
                checked={editingPost.published}
                onChange={(e) => setEditingPost({ ...editingPost, published: e.target.checked })}
                className="w-4 h-4"
              />
              <label htmlFor="published" className="text-[0.85rem]" style={{ color: '#E8E3D8' }}>
                Published
              </label>
            </div>

            {/* LinkedIn Preview */}
            {editingPost.published && editingPost.title && (
              <div className="rounded-lg p-4" style={{ background: 'var(--obsidian-4)', border: '1px solid rgba(201,169,110,0.2)' }}>
                <div className="flex items-center justify-between mb-3">
                  <h4 className="text-[0.75rem] font-bold uppercase tracking-[0.08em]" style={{ color: '#C9A96E' }}>
                    LinkedIn Post Preview
                  </h4>
                  <button
                    type="button"
                    onClick={() => setShowLinkedInPreview(!showLinkedInPreview)}
                    className="text-[0.75rem] font-medium transition-colors"
                    style={{ color: '#6B6860' }}
                  >
                    {showLinkedInPreview ? 'Hide' : 'Show'}
                  </button>
                </div>
                {showLinkedInPreview && (
                  <div className="space-y-3">
                    <div className="p-3 rounded text-[0.8rem] leading-relaxed whitespace-pre-wrap" style={{ background: 'var(--obsidian-3)', color: '#B8B2A8' }}>
                      {formatLinkedInForCopy(generateLinkedInPost(editingPost))}
                    </div>
                    <button
                      type="button"
                      onClick={() => {
                        const text = formatLinkedInForCopy(generateLinkedInPost(editingPost))
                        navigator.clipboard.writeText(text)
                        alert('LinkedIn post copied to clipboard!')
                      }}
                      className="w-full py-2 rounded text-[0.8rem] font-medium transition-colors cursor-pointer"
                      style={{ background: 'rgba(201,169,110,0.15)', color: '#C9A96E', border: '1px solid rgba(201,169,110,0.3)' }}
                    >
                      Copy LinkedIn Post
                    </button>
                    <a
                      href="https://www.linkedin.com/company/111078966"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="block w-full py-2 rounded text-center text-[0.8rem] font-medium transition-colors cursor-pointer"
                      style={{ background: '#0077b5', color: 'white' }}
                    >
                      Open LinkedIn Page
                    </a>
                  </div>
                )}
              </div>
            )}

            <div className="flex gap-4">
              <button
                onClick={() => handleSavePost(editingPost)}
                className="btn-primary flex-1 py-3"
              >
                Save Post
              </button>
              <button
                onClick={() => setIsEditing(false)}
                className="btn-outline flex-1 py-3"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen py-[140px] px-6 md:px-[60px]" style={{ background: 'var(--obsidian)' }}>
      <div className="max-w-[1200px] mx-auto">
        <div className="flex items-center justify-between mb-8">
          <div>
            <SectionLabel>Admin Dashboard</SectionLabel>
            <h1 className="text-[2rem] font-semibold mt-2" style={{ color: '#E8E3D8' }}>
              Blog Management
            </h1>
          </div>
          <div className="flex gap-4">
            <button
              onClick={handleCreatePost}
              className="btn-primary py-2.5 px-6"
            >
              + Create Post
            </button>
            <button
              onClick={handleLogout}
              className="btn-outline py-2.5 px-6"
            >
              Logout
            </button>
          </div>
        </div>

        <div className="rounded-[20px] overflow-hidden" style={{ background: 'var(--obsidian-3)', border: '1px solid rgba(232,227,216,0.06)' }}>
          <table className="w-full">
            <thead>
              <tr style={{ background: 'var(--obsidian-4)' }}>
                <th className="text-left p-4 text-[0.72rem] font-bold uppercase tracking-[0.08em]" style={{ color: '#6B6860' }}>
                  Title
                </th>
                <th className="text-left p-4 text-[0.72rem] font-bold uppercase tracking-[0.08em]" style={{ color: '#6B6860' }}>
                  Category
                </th>
                <th className="text-left p-4 text-[0.72rem] font-bold uppercase tracking-[0.08em]" style={{ color: '#6B6860' }}>
                  Date
                </th>
                <th className="text-left p-4 text-[0.72rem] font-bold uppercase tracking-[0.08em]" style={{ color: '#6B6860' }}>
                  Status
                </th>
                <th className="text-right p-4 text-[0.72rem] font-bold uppercase tracking-[0.08em]" style={{ color: '#6B6860' }}>
                  Actions
                </th>
              </tr>
            </thead>
            <tbody>
              {posts.map((post) => (
                <tr key={post.id} style={{ borderBottom: '1px solid rgba(232,227,216,0.05)' }}>
                  <td className="p-4">
                    <div className="font-medium text-[0.9rem]" style={{ color: '#E8E3D8' }}>{post.title}</div>
                  </td>
                  <td className="p-4">
                    <span className="text-[0.8rem]" style={{ color: '#6B6860' }}>{post.category}</span>
                  </td>
                  <td className="p-4">
                    <span className="text-[0.8rem]" style={{ color: '#6B6860' }}>{post.date}</span>
                  </td>
                  <td className="p-4">
                    <button
                      onClick={() => handleTogglePublish(post.id)}
                      className={`text-[0.75rem] font-medium px-3 py-1 rounded-full ${
                        post.published
                          ? 'bg-[rgba(74,122,100,0.15)] text-[#4A7A64]'
                          : 'bg-[rgba(201,169,110,0.1)] text-[#C9A96E]'
                      }`}
                    >
                      {post.published ? 'Published' : 'Draft'}
                    </button>
                  </td>
                  <td className="p-4 text-right">
                    <div className="flex justify-end gap-2">
                      <button
                        onClick={() => handleEditPost(post)}
                        className="text-[0.8rem] font-medium transition-colors hover:text-[#C9A96E]"
                        style={{ color: '#6B6860' }}
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => handleDeletePost(post.id)}
                        className="text-[0.8rem] font-medium transition-colors hover:text-red-400"
                        style={{ color: '#6B6860' }}
                      >
                        Delete
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
