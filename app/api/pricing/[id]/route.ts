import { NextRequest, NextResponse } from 'next/server'
import { requireAdmin } from '@/lib/rbac'
import { supabaseAdmin } from '@/lib/supabase'

export async function DELETE(request: NextRequest, { params }: { params: { id: string } }) {
  if (!(await requireAdmin(request))) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const { error } = await supabaseAdmin.from('pricing_plans').delete().eq('id', params.id)
  if (error) {
    console.error('[PRICING] Delete failed', error)
    return NextResponse.json({ error: 'Unable to delete the plan.' }, { status: 500 })
  }

  return NextResponse.json({ success: true })
}