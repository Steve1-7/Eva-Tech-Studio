import { NextRequest, NextResponse } from 'next/server'
import { withAdmin } from '@/lib/routeWrappers'
import { requireAdmin } from '@/lib/rbac'
import { supabase, supabaseAdmin } from '@/lib/supabase'

// GET - public job listings with simple filters
export async function GET(request: NextRequest) {
  try {
    const url = new URL(request.url)
    const searchParams = url.searchParams
    const adminView = searchParams.get('admin') === 'true'

    if (adminView && !(await requireAdmin(request))) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    if (!process.env.NEXT_PUBLIC_SUPABASE_URL || !process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY) {
      return NextResponse.json({ jobs: [] })
    }

    const q = searchParams.get('q')
    const category = searchParams.get('category')
    const remote = searchParams.get('remote')
    const jobType = searchParams.get('type')
    const featured = searchParams.get('featured')
    const limit = Math.min(Math.max(parseInt(searchParams.get('limit') || '50', 10) || 50, 1), 100)

    let query: any = (adminView ? supabaseAdmin : supabase)
      .from('jobs')
      .select('*')
      .order('created_at', { ascending: false })

    if (category) query = query.eq('category', category)
    if (remote === 'true') query = query.eq('remote', true)
    if (jobType) query = query.eq('job_type', jobType)
    if (featured === 'true') query = query.eq('featured', true)
    if (q) query = query.or(`title.ilike.%${q}%,company.ilike.%${q}%,description.ilike.%${q}%`)

    query = query.limit(limit)

    const { data: jobs, error } = await query

    if (error) return NextResponse.json({ error: error.message }, { status: 500 })

    const formatted = (jobs || []).map((j: any) => ({
      id: j.id,
      title: j.title,
      company: j.company,
      location: j.location,
      jobType: j.job_type,
      salary: j.salary,
      description: j.description,
      applyUrl: j.apply_url,
      remote: j.remote,
      featured: j.featured,
      category: j.category,
      createdAt: j.created_at,
      updatedAt: j.updated_at
    }))

    return NextResponse.json({ jobs: formatted })
  } catch (err: any) {
    return NextResponse.json({ error: err.message || 'Unknown error' }, { status: 500 })
  }
}

// POST - create job listing (admin only)
export const POST = withAdmin(async (request: Request) => {
  try {
    const body = await request.json()
    const title = String(body.title || '').trim()
    const company = String(body.company || '').trim()

    if (!title || !company) {
      return NextResponse.json({ error: 'Job title and company are required.' }, { status: 400 })
    }

    const applyUrl = normalizeApplyUrl(body.applyUrl)
    if (body.applyUrl && !applyUrl) {
      return NextResponse.json({ error: 'Application link must be a valid HTTP or HTTPS URL.' }, { status: 400 })
    }

    const payload: any = {
      title,
      company,
      location: body.location || null,
      job_type: body.jobType || null,
      salary: body.salary || null,
      description: body.description || null,
      apply_url: applyUrl,
      remote: body.remote || false,
      featured: body.featured || false,
      category: body.category || null
    }

    if (body.ownerId) payload.owner_id = body.ownerId

    const { data: job, error } = await supabaseAdmin.from('jobs').insert(payload).select().single()

    if (error) return NextResponse.json({ error: error.message }, { status: 500 })

    const formatted = {
      id: job.id,
      title: job.title,
      company: job.company,
      location: job.location,
      jobType: job.job_type,
      salary: job.salary,
      description: job.description,
      applyUrl: job.apply_url,
      remote: job.remote,
      featured: job.featured,
      category: job.category,
      createdAt: job.created_at
    }

    return NextResponse.json({ job: formatted }, { status: 201 })
  } catch (err) {
    return NextResponse.json({ error: 'Invalid request' }, { status: 400 })
  }
}) as any

function normalizeApplyUrl(value: unknown): string | null {
  if (typeof value !== 'string' || !value.trim()) return null

  try {
    const url = new URL(value.trim())
    return url.protocol === 'https:' || url.protocol === 'http:' ? url.toString() : null
  } catch {
    return null
  }
}
