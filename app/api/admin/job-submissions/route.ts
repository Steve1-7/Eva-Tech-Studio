import { NextRequest, NextResponse } from 'next/server'
import { requireAdmin } from '@/lib/rbac'
import { supabaseAdmin } from '@/lib/supabase'

export async function GET(request: NextRequest) {
  if (!(await requireAdmin(request))) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  if (!(process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.SUPABASE_SERVICE_KEY)) {
    return NextResponse.json({ error: 'Submission inbox is not configured.' }, { status: 503 })
  }

  const status = request.nextUrl.searchParams.get('status') || 'review'
  const allowedStatuses = ['received', 'review', 'published', 'rejected', 'failed']
  if (!allowedStatuses.includes(status)) return NextResponse.json({ error: 'Invalid status filter.' }, { status: 400 })

  const { data, error } = await supabaseAdmin
    .from('job_submissions')
    .select('id,source_type,sender_id,raw_content,extracted_fields,validation_errors,status,job_id,received_at,processed_at')
    .eq('status', status)
    .order('received_at', { ascending: false })
    .limit(100)

  if (error) {
    console.error('[JOB SUBMISSIONS] Inbox query failed', error)
    return NextResponse.json({ error: 'Unable to load job submissions.' }, { status: 500 })
  }

  return NextResponse.json({ submissions: data || [] })
}
