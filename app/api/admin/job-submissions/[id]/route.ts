import { NextRequest, NextResponse } from 'next/server'
import { createJobSlug, hashJobContent, validateJobFields } from '@/lib/jobAutomation'
import type { ExtractedJobFields } from '@/lib/jobAutomation'
import { requireAdmin } from '@/lib/rbac'
import { supabaseAdmin } from '@/lib/supabase'
import { randomUUID } from 'node:crypto'

function cleanString(value: unknown): string | undefined {
  return typeof value === 'string' && value.trim() ? value.trim() : undefined
}

export async function PATCH(request: NextRequest, { params }: { params: { id: string } }) {
  if (!(await requireAdmin(request))) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  if (!(process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.SUPABASE_SERVICE_KEY)) {
    return NextResponse.json({ error: 'Submission inbox is not configured.' }, { status: 503 })
  }

  const submissionId = Number(params.id)
  if (!Number.isSafeInteger(submissionId) || submissionId < 1) {
    return NextResponse.json({ error: 'Invalid submission ID.' }, { status: 400 })
  }

  let body: any
  try {
    body = await request.json()
  } catch {
    return NextResponse.json({ error: 'Invalid JSON request.' }, { status: 400 })
  }

  if (body.action === 'reject') {
    const { data, error } = await supabaseAdmin
      .from('job_submissions')
      .update({ status: 'rejected', processed_at: new Date().toISOString() })
      .eq('id', submissionId)
      .eq('status', 'review')
      .select('id')
      .maybeSingle()
    if (error) return NextResponse.json({ error: 'Unable to reject this submission.' }, { status: 500 })
    if (!data) return NextResponse.json({ error: 'Submission is no longer awaiting review.' }, { status: 409 })
    return NextResponse.json({ success: true })
  }

  if (body.action !== 'publish' || !body.fields || typeof body.fields !== 'object') {
    return NextResponse.json({ error: 'Choose publish or reject and provide job fields.' }, { status: 400 })
  }

  const fields: ExtractedJobFields = {
    title: cleanString(body.fields.title),
    company: cleanString(body.fields.company),
    location: cleanString(body.fields.location),
    jobType: cleanString(body.fields.jobType),
    salary: cleanString(body.fields.salary),
    description: cleanString(body.fields.description),
    applyUrl: cleanString(body.fields.applyUrl),
    sourceUrl: cleanString(body.fields.sourceUrl),
    deadline: cleanString(body.fields.deadline),
    category: cleanString(body.fields.category),
    remote: body.fields.remote === true,
  }
  const validationErrors = validateJobFields(fields)
  if (validationErrors.length) return NextResponse.json({ error: 'Correct the validation issues before publishing.', validationErrors }, { status: 400 })

  const contentHash = hashJobContent(fields)
  const job = {
    title: fields.title,
    company: fields.company,
    location: fields.location || '',
    job_type: fields.jobType || '',
    salary: fields.salary || '',
    description: fields.description || '',
    apply_url: fields.applyUrl || '',
    source_url: fields.sourceUrl || '',
    deadline: fields.deadline || '',
    remote: fields.remote === true,
    category: fields.category || '',
    slug: createJobSlug(fields.title || '', fields.company || '', randomUUID()),
    content_hash: contentHash,
    extracted_fields: fields,
  }

  const { data, error } = await supabaseAdmin.rpc('approve_job_submission', {
    p_submission_id: submissionId,
    p_job: job,
    p_validation_errors: validationErrors,
  })
  if (error) {
    console.error('[JOB SUBMISSIONS] Approval failed', error)
    if (/duplicate|already exists/i.test(error.message || '')) {
      return NextResponse.json({ error: 'A potentially duplicate listing already exists. Review the current listings first.' }, { status: 409 })
    }
    return NextResponse.json({ error: 'Unable to publish this submission.' }, { status: 500 })
  }

  return NextResponse.json({ job: data })
}
