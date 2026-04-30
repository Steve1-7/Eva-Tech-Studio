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

// GET - Fetch single post
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  const { data: post, error } = await supabase
    .from('blog_posts')
    .select('*')
    .eq('id', parseInt(params.id))
    .single()

  if (error || !post) {
    return NextResponse.json({ error: 'Post not found' }, { status: 404 })
  }

  // If post is draft, require authentication
  if (!post.published && !(await authenticateRequest(request))) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
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

  return NextResponse.json({ post: formattedPost })
}

// PUT - Update post (admin only)
export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  if (!(await authenticateRequest(request))) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  try {
    const body = await request.json()

    const { data: post, error } = await supabase
      .from('blog_posts')
      .update({
        title: body.title,
        excerpt: body.excerpt,
        content: body.content,
        cover_image: body.coverImage,
        category: body.category,
        published: body.published,
        meta_description: body.metaDescription,
        tags: body.tags
      })
      .eq('id', parseInt(params.id))
      .select()
      .single()

    if (error || !post) {
      return NextResponse.json({ error: 'Post not found' }, { status: 404 })
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

    return NextResponse.json({ post: formattedPost })
  } catch (error) {
    return NextResponse.json({ error: 'Invalid request' }, { status: 400 })
  }
}

// DELETE - Delete post (admin only)
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  if (!(await authenticateRequest(request))) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const { error } = await supabase
    .from('blog_posts')
    .delete()
    .eq('id', parseInt(params.id))

  if (error) {
    return NextResponse.json({ error: 'Post not found' }, { status: 404 })
  }

  return NextResponse.json({ success: true })
}
