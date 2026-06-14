import { NextRequest, NextResponse } from 'next/server'
import { withAdmin } from '@/lib/routeWrappers'
import { supabase, supabaseAdmin } from '@/lib/supabase'

// GET - public job listings with simple filters
export async function GET(request: NextRequest) {
  try {
    const url = new URL(request.url)
    const searchParams = url.searchParams

    const q = searchParams.get('q')
    const category = searchParams.get('category')
    const remote = searchParams.get('remote')
    const jobType = searchParams.get('type')
    const featured = searchParams.get('featured')
    const limit = parseInt(searchParams.get('limit') || '50', 10)

    let query: any = supabase
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

    const payload: any = {
      title: body.title,
      company: body.company,
      location: body.location || null,
      job_type: body.jobType || null,
      salary: body.salary || null,
      description: body.description || null,
      apply_url: body.applyUrl || null,
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
