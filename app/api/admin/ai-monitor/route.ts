import { NextRequest, NextResponse } from 'next/server'
import { requireAdmin } from '@/lib/rbac'
import { supabaseAdmin } from '@/lib/supabase'

export async function GET(request: NextRequest) {
  // Require admin access
  if (!(await requireAdmin(request))) {
    return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 })
  }

  try {
    // Total AI-generated reports
    const reportsRes = await supabaseAdmin.from('ai_reports').select('id,report_type', { count: 'exact' })
    const totalReports = reportsRes.count || 0

    // Breakdown by report type
    const breakdownRes = await supabaseAdmin.rpc('count_by_report_type')
      .catch(() => null)

    // Recent consultant requests
    const { data: recentRequests } = await supabaseAdmin
      .from('ai_consultant_requests')
      .select('id,business_name,industry,created_at')
      .order('created_at', { ascending: false })
      .limit(20)

    // Analytics events related to AI
    const { data: aiEvents, count: aiEventCount } = await supabaseAdmin
      .from('analytics_events')
      .select('*', { count: 'exact' })
      .ilike('event_type', 'ai_%')

    // Return aggregated metrics
    return NextResponse.json({
      success: true,
      metrics: {
        totalReports,
        aiEventCount: aiEventCount || 0,
        recentRequests: recentRequests || [],
        breakdownByType: breakdownRes || null
      }
    })
  } catch (err: any) {
    console.error('[ADMIN-AI-MONITOR] Error:', err)
    return NextResponse.json({ success: false, error: 'Failed to fetch metrics' }, { status: 500 })
  }
}
