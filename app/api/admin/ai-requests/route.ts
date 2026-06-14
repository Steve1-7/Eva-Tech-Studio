import { NextRequest, NextResponse } from 'next/server'
import { withAdmin } from '@/lib/routeWrappers'
import { supabaseAdmin } from '@/lib/supabase'

export const GET = withAdmin(async (request: Request) => {
  try {
    const url = new URL((request as Request).url)
    const page = Math.max(1, parseInt(url.searchParams.get('page') || '1', 10))
    const pageSize = Math.min(200, Math.max(10, parseInt(url.searchParams.get('pageSize') || '20', 10)))
    const q = url.searchParams.get('q') || ''

    const start = (page - 1) * pageSize
    const end = start + pageSize - 1

    let query: any = supabaseAdmin.from('ai_consultant_requests').select('*', { count: 'exact' }).order('submitted_at', { ascending: false })

    if (q) {
      const like = `%${q}%`
      query = query.or(`business_name.ilike.${like},industry.ilike.${like}`)
    }

    query = query.range(start, end)

    const { data, count, error } = await query

    if (error) return NextResponse.json({ error: error.message }, { status: 500 })

    return NextResponse.json({ requests: data, count: count || 0 })
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 })
  }
}) as any
