import { NextResponse } from 'next/server'
import { requireAdmin } from '@/lib/rbac'
import { supabaseAdmin } from '@/lib/supabase'

export async function GET(request: Request) {
  if (!(await requireAdmin(request))) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  if (!(process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.SUPABASE_SERVICE_KEY)) {
    return NextResponse.json({ error: 'Automation monitoring is not configured.' }, { status: 503 })
  }

  const [events, distributions] = await Promise.all([
    supabaseAdmin.from('automation_events')
      .select('id,event_type,payload,status,attempts,last_error,available_at,created_at,completed_at')
      .order('created_at', { ascending: false })
      .limit(50),
    supabaseAdmin.from('distribution_logs')
      .select('id,event_id,job_id,destination,status,attempt_count,error_message,created_at,updated_at')
      .order('created_at', { ascending: false })
      .limit(50),
  ])

  if (events.error || distributions.error) {
    console.error('[AUTOMATION] Monitoring query failed', events.error || distributions.error)
    return NextResponse.json({ error: 'Unable to load automation status.' }, { status: 500 })
  }
  return NextResponse.json({ events: events.data || [], distributions: distributions.data || [] })
}
