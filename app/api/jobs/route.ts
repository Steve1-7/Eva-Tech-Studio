import { NextRequest, NextResponse } from 'next/server'
import { withAdmin } from '@/lib/routeWrappers'
import { requireAdmin } from '@/lib/rbac'
import { supabase, supabaseAdmin } from '@/lib/supabase'
import {
  createJobSlug,
  hashJobContent,
  isSafeHttpsUrl,
  isValidDateOnly,
  validateJobFields,
} from '@/lib/jobAutomation'
import { randomUUID } from 'node:crypto'

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

    const q = searchParams.get('q')?.slice(0, 100).replace(/[,*().%\\]/g, '')
    const category = searchParams.get('category')
    const remote = searchParams.get('remote')
    const jobType = searchParams.get('type')
    const featured = searchParams.get('featured')
    const limit = Math.min(Math.max(parseInt(searchParams.get('limit') || '50', 10) || 50, 1), 100)

    let query: any = (adminView ? supabaseAdmin : supabase)
      .from('jobs')
      .select('*')
      .order('created_at', { ascending: false })

    if (!adminView) {
      query = query.eq('status', 'published')
    }
    if (category) query = query.eq('category', category)
    if (remote === 'true') query = query.eq('remote', true)
    if (jobType) query = query.eq('job_type', jobType)
    if (featured === 'true') query = query.eq('featured', true)
    if (q) query = query.or(`title.ilike.%${q}%,company.ilike.%${q}%,description.ilike.%${q}%`)

    query = query.limit(adminView ? limit : 500)

    const { data: jobs, error } = await query

    if (error) {
      console.error('[JOBS] Listing query failed', error)
      return NextResponse.json({ error: 'Unable to load job listings.' }, { status: 500 })
    }

    const formatted = (jobs || []).map((j: any) => ({
      id: j.id,
      slug: j.slug,
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
      deadline: j.deadline,
      sourceUrl: j.source_url,
      verificationStatus: j.verification_status,
      createdAt: j.created_at,
      updatedAt: j.updated_at
    })).filter((job: any) => adminView || !job.deadline || job.deadline >= new Date().toISOString().slice(0, 10)).slice(0, limit)

    return NextResponse.json({ jobs: formatted })
  } catch (err: any) {
    return NextResponse.json({ error: err.message || 'Unknown error' }, { status: 500 })
  }
}

// POST - create job listing (admin only)
export const POST = withAdmin(async (request: Request) => {
  try {
    const body = await request.json()
    const title = typeof body.title === 'string' ? body.title.trim() : ''
    const company = typeof body.company === 'string' ? body.company.trim() : ''

    if (!title || !company) {
      return NextResponse.json({ error: 'Job title and company are required.' }, { status: 400 })
    }

    const applyUrl = normalizeApplyUrl(body.applyUrl)
    if (body.applyUrl && !applyUrl) {
      return NextResponse.json({ error: 'Application link must be a valid HTTPS URL.' }, { status: 400 })
    }

    const sourceUrl = normalizeApplyUrl(body.sourceUrl)
    if (body.sourceUrl && !sourceUrl) {
      return NextResponse.json({ error: 'Source link must be a valid HTTPS URL.' }, { status: 400 })
    }

    const deadline = typeof body.deadline === 'string' && body.deadline
      ? body.deadline
      : null
    if (deadline && !isValidDateOnly(deadline)) {
      return NextResponse.json({ error: 'Deadline must be a valid calendar date in YYYY-MM-DD format.' }, { status: 400 })
    }

    const fields = {
      title,
      company,
      description: typeof body.description === 'string' ? body.description.trim() : '',
      applyUrl: applyUrl || undefined,
      sourceUrl: sourceUrl || undefined,
      deadline: deadline || undefined,
    }
    const validationErrors = validateJobFields(fields)
    if (validationErrors.length) {
      return NextResponse.json({ error: 'Correct the job validation issues before publishing.', validationErrors }, { status: 400 })
    }
    const payload = {
      title,
      company,
      location: typeof body.location === 'string' ? body.location.trim() : '',
      job_type: typeof body.jobType === 'string' ? body.jobType.trim() : '',
      salary: typeof body.salary === 'string' ? body.salary.trim() : '',
      description: fields.description,
      apply_url: applyUrl || '',
      remote: body.remote === true,
      featured: body.featured === true,
      category: typeof body.category === 'string' ? body.category.trim() : '',
      source_url: sourceUrl || '',
      deadline: deadline || '',
      verification_status: 'unverified',
      risk_status: 'clear',
      source_type: 'admin',
      content_hash: hashJobContent(fields),
      slug: createJobSlug(title, company, randomUUID()),
    }

    const { data: job, error } = await supabaseAdmin.rpc('create_published_job', { p_job: payload })

    if (error) {
      console.error('[JOBS] Create failed', error)
      if (/potential duplicate/i.test(error.message || '')) {
        return NextResponse.json({ error: 'A potentially duplicate listing already exists.' }, { status: 409 })
      }
      return NextResponse.json({ error: 'Unable to publish this job.' }, { status: 500 })
    }

    const formatted = {
      id: job.id,
      slug: job.slug,
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
      deadline: job.deadline,
      sourceUrl: job.source_url,
      verificationStatus: job.verification_status,
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
    const normalized = value.trim()
    return isSafeHttpsUrl(normalized) ? new URL(normalized).toString() : null
  } catch {
    return null
  }
}
