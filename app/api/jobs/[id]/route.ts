import { NextRequest, NextResponse } from 'next/server'
import { requireAdmin } from '@/lib/rbac'
import { supabaseAdmin } from '@/lib/supabase'

function normalizeApplyUrl(value: unknown): string | null | undefined {
  if (typeof value !== 'string') return undefined
  if (!value.trim()) return null

  try {
    const url = new URL(value.trim())
    return url.protocol === 'https:' || url.protocol === 'http:' ? url.toString() : undefined
  } catch {
    return undefined
  }
}

export async function PUT(request: NextRequest, { params }: { params: { id: string } }) {
  if (!(await requireAdmin(request))) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  try {
    const body = await request.json()
    const title = String(body.title || '').trim()
    const company = String(body.company || '').trim()
    const applyUrl = normalizeApplyUrl(body.applyUrl)

    if (!title || !company) {
      return NextResponse.json({ error: 'Job title and company are required.' }, { status: 400 })
    }
    if (applyUrl === undefined) {
      return NextResponse.json({ error: 'Application link must be a valid HTTP or HTTPS URL.' }, { status: 400 })
    }

    const { data, error } = await supabaseAdmin
      .from('jobs')
      .update({
        title,
        company,
        location: body.location || null,
        job_type: body.jobType || null,
        salary: body.salary || null,
        description: body.description || null,
        apply_url: applyUrl,
        remote: Boolean(body.remote),
        featured: Boolean(body.featured),
        category: body.category || null,
        updated_at: new Date().toISOString(),
      })
      .eq('id', params.id)
      .select('*')
      .single()

    if (error) throw error
    return NextResponse.json({ job: {
      id: data.id,
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

  const { error } = await supabaseAdmin.from('jobs').delete().eq('id', params.id)
  if (error) {
    console.error('[JOBS] Delete failed', error)
    return NextResponse.json({ error: 'Unable to delete this job.' }, { status: 500 })
  }

  return NextResponse.json({ success: true })
}