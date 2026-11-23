import { NextRequest, NextResponse } from 'next/server'
import { requireAdmin } from '@/lib/rbac'
import { supabase, supabaseAdmin } from '@/lib/supabase'
import {
  hashJobContent,
  isSafeHttpsUrl,
  isValidDateOnly,
  validateJobFields,
} from '@/lib/jobAutomation'

function normalizeApplyUrl(value: unknown): string | null | undefined {
  if (typeof value !== 'string') return undefined
  if (!value.trim()) return null

  try {
    const normalized = value.trim()
    return isSafeHttpsUrl(normalized) ? new URL(normalized).toString() : undefined
  } catch {
    return undefined
  }
}

export async function GET(_request: NextRequest, { params }: { params: { id: string } }) {
  if (!process.env.NEXT_PUBLIC_SUPABASE_URL || !process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY) {
    return NextResponse.json({ error: 'Job listings are not configured.' }, { status: 503 })
  }
  const { data, error } = await supabase
    .from('jobs')
    .select('*')
    .eq('slug', params.id)
    .eq('status', 'published')
    .maybeSingle()

  if (error) {
    console.error('[JOBS] Public detail query failed', error)
    return NextResponse.json({ error: 'Unable to load this job.' }, { status: 500 })
  }
  if (!data || (data.deadline && data.deadline < new Date().toISOString().slice(0, 10))) {
    return NextResponse.json({ error: 'Job not found.' }, { status: 404 })
  }

  return NextResponse.json({
    job: {
      id: data.id,
      slug: data.slug,
      title: data.title,
      company: data.company,
      location: data.location,
      jobType: data.job_type,
      salary: data.salary,
      description: data.description,
      applyUrl: data.apply_url,
      remote: data.remote,
      category: data.category,
      sourceUrl: data.source_url,
      deadline: data.deadline,
      verificationStatus: data.verification_status,
      createdAt: data.created_at,
    },
  })
}

export async function PUT(request: NextRequest, { params }: { params: { id: string } }) {
  if (!(await requireAdmin(request))) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }
  if (!/^\d+$/.test(params.id) || !Number.isSafeInteger(Number(params.id))) {
    return NextResponse.json({ error: 'Invalid job ID.' }, { status: 400 })
  }

  try {
    const body = await request.json()
    const title = String(body.title || '').trim()
    const company = String(body.company || '').trim()
    const applyUrl = normalizeApplyUrl(body.applyUrl)

    if (!title || !company) {
      return NextResponse.json({ error: 'Job title and company are required.' }, { status: 400 })
    }
    if (!applyUrl) {
      return NextResponse.json({ error: 'A safe public HTTPS application URL is required.' }, { status: 400 })
    }

    const sourceUrl = normalizeApplyUrl(body.sourceUrl)
    if (body.sourceUrl && !sourceUrl) {
      return NextResponse.json({ error: 'Source link must be a valid HTTPS URL.' }, { status: 400 })
    }
    const deadline = typeof body.deadline === 'string' && body.deadline ? body.deadline : null
    if (deadline && !isValidDateOnly(deadline)) {
      return NextResponse.json({ error: 'Deadline must be a valid calendar date in YYYY-MM-DD format.' }, { status: 400 })
    }
    const validationErrors = validateJobFields({
      title,
      company,
      description: typeof body.description === 'string' ? body.description.trim() : '',
      applyUrl,
      sourceUrl: sourceUrl || undefined,
      deadline: deadline || undefined,
    })
    if (validationErrors.length) {
      return NextResponse.json({ error: 'Correct the job validation issues before saving.', validationErrors }, { status: 400 })
    }

    const payload = {
      title,
      company,
      location: typeof body.location === 'string' ? body.location.trim() : '',
      job_type: typeof body.jobType === 'string' ? body.jobType.trim() : '',
      salary: typeof body.salary === 'string' ? body.salary.trim() : '',
      description: body.description.trim(),
      apply_url: applyUrl,
      remote: body.remote === true,
      featured: body.featured === true,
      category: typeof body.category === 'string' ? body.category.trim() : '',
      source_url: sourceUrl || '',
      deadline: deadline || '',
      content_hash: hashJobContent({
        title,
        company,
        description: body.description.trim(),
        applyUrl,
      }),
    }
    const { data, error } = await supabaseAdmin.rpc('update_published_job', {
      p_job_id: Number(params.id),
      p_job: payload,
    })

    if (error) {
      console.error('[JOBS] Update failed', error)
      if (/potential duplicate/i.test(error.message || '')) {
        return NextResponse.json({ error: 'A potentially duplicate listing already exists.' }, { status: 409 })
      }
      return NextResponse.json({ error: 'Unable to update this job.' }, { status: 500 })
    }
    return NextResponse.json({ job: {
      id: data.id,
      slug: data.slug,
      title: data.title,
      company: data.company,
      location: data.location,
      jobType: data.job_type,
      salary: data.salary,
      description: data.description,
      applyUrl: data.apply_url,
      remote: data.remote,
      featured: data.featured,
      category: data.category,
      deadline: data.deadline,
      sourceUrl: data.source_url,
      verificationStatus: data.verification_status,
      createdAt: data.created_at,
      updatedAt: data.updated_at,
    } })
  } catch (error) {
    console.error('[JOBS] Update failed', error)
    return NextResponse.json({ error: 'Unable to update this job.' }, { status: 500 })
  }
}

export async function DELETE(request: NextRequest, { params }: { params: { id: string } }) {
  if (!(await requireAdmin(request))) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }
  if (!/^\d+$/.test(params.id) || !Number.isSafeInteger(Number(params.id))) {
    return NextResponse.json({ error: 'Invalid job ID.' }, { status: 400 })
  }

  const { error } = await supabaseAdmin.from('jobs').delete().eq('id', params.id)
  if (error) {
    console.error('[JOBS] Delete failed', error)
    return NextResponse.json({ error: 'Unable to delete this job.' }, { status: 500 })
  }

  return NextResponse.json({ success: true })
}