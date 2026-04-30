import { NextRequest, NextResponse } from 'next/server'
import { authenticateRequest } from '@/lib/auth'
import { supabase } from '@/lib/supabase'

interface BlogPost {
  id: number
  title: string
  excerpt: string
  content: string
  author: string
  date: string
  cover_image: string
  category: string
  published: boolean
  meta_description?: string
  tags?: string[]
}

// GET - Fetch all posts (public) or all posts including drafts (admin)
export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url)
  const includeDrafts = searchParams.get('includeDrafts') === 'true'

  // If requesting drafts, require authentication
  if (includeDrafts && !(await authenticateRequest(request))) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  let query = supabase
    .from('blog_posts')
    .select('*')
    .order('date', { ascending: false })

  if (!includeDrafts) {
    query = query.eq('published', true)
  }

  const { data: posts, error } = await query

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }

  // Convert snake_case to camelCase for frontend
  const formattedPosts = posts?.map(post => ({
    id: post.id,
    title: post.title,
    excerpt: post.excerpt,
    content: post.content,
    author: post.author,
    date: post.date,
    coverImage: post.cover_image,
    category: post.category,
    published: post.published,
    metaDescription: post.meta_description,
    tags: post.tags
  }))

  return NextResponse.json({ posts: formattedPosts || [] })
}

// POST - Create new post (admin only)
export async function POST(request: NextRequest) {
  if (!(await authenticateRequest(request))) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  try {
    const body = await request.json()

    const { data: post, error } = await supabase
      .from('blog_posts')
      .insert({
        title: body.title,
        excerpt: body.excerpt,
        content: body.content,
        author: body.author || 'Steve Zulu',
        date: new Date().toISOString().split('T')[0],
        cover_image: body.coverImage || '',
        category: body.category || '',
        published: body.published || false,
        meta_description: body.metaDescription,
        tags: body.tags || []
      })
      .select()
      .single()

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    // Convert to camelCase
    const formattedPost = {
      id: post.id,
      title: post.title,
      excerpt: post.excerpt,
      content: post.content,
      author: post.author,
      date: post.date,
      coverImage: post.cover_image,
      category: post.category,
      published: post.published,
      metaDescription: post.meta_description,
      tags: post.tags
    }

    return NextResponse.json({ post: formattedPost }, { status: 201 })
  } catch (error) {
    return NextResponse.json({ error: 'Invalid request' }, { status: 400 })
  }
}
