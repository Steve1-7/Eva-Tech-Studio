import { NextRequest, NextResponse } from 'next/server'
import { requireAdmin } from '@/lib/rbac'
import { supabaseAdmin } from '@/lib/supabase'

export async function POST(request: NextRequest, { params }: { params: { id: string } }) {
  if (!(await requireAdmin(request))) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  if (!(process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.SUPABASE_SERVICE_KEY)) {
    return NextResponse.json({ error: 'Automation retry is not configured.' }, { status: 503 })
  }

  const id = Number(params.id)
  if (!Number.isSafeInteger(id) || id < 1) return NextResponse.json({ error: 'Invalid event ID.' }, { status: 400 })

  const { data: event, error: eventError } = await supabaseAdmin
    .from('automation_events')
    .select('id,event_type,status,payload')
    .eq('id', id)
    .maybeSingle()
  if (eventError) return NextResponse.json({ error: 'Unable to load automation event.' }, { status: 500 })
  if (!event) return NextResponse.json({ error: 'Automation event was not found.' }, { status: 404 })

  let payload = event.payload
  let eligible = ['failed', 'dead'].includes(event.status)
  if (event.status === 'done' && event.event_type === 'job_published') {
    const { count, error } = await supabaseAdmin
      .from('distribution_logs')
      .select('id', { count: 'exact', head: true })
      .eq('event_id', id)
      .eq('status', 'failed')
    if (error) return NextResponse.json({ error: 'Unable to inspect delivery failures.' }, { status: 500 })
    eligible = Boolean(count)
    payload = { ...payload, subscriber_after_id: 0 }
  }
  if (!eligible) return NextResponse.json({ error: 'Event is not eligible for retry.' }, { status: 409 })

  const { data, error } = await supabaseAdmin
    .from('automation_events')
    .update({
      status: 'pending',
      attempts: 0,
      last_error: null,
      available_at: new Date().toISOString(),
      locked_at: null,
      completed_at: null,
      payload,
    })
    .eq('id', id)
    .eq('status', event.status)
    .select('id')
    .maybeSingle()
  if (error) return NextResponse.json({ error: 'Unable to retry automation event.' }, { status: 500 })
  if (!data) return NextResponse.json({ error: 'Event changed while preparing the retry.' }, { status: 409 })
  return NextResponse.json({ success: true })
}
