import { NextRequest, NextResponse } from 'next/server'
import { defaultPricingPlans } from '@/lib/pricing'
import { requireAdmin } from '@/lib/rbac'
import { supabaseAdmin } from '@/lib/supabase'

export async function GET(request: NextRequest) {
  if (new URL(request.url).searchParams.get('admin') === 'true' && !(await requireAdmin(request))) {
    return NextResponse.json({ error: 'Sign in from the admin dashboard to manage pricing.' }, { status: 401 })
  }

  try {
    const { data, error } = await supabaseAdmin
      .from('pricing_plans')
      .select('id,name,price,description,cta,popular,sort_order,billing_period')
      .order('sort_order', { ascending: true })

    if (!error && data?.length) {
      return NextResponse.json({ plans: data, source: 'supabase' })
    }
  } catch (error) {
    console.warn('[PRICING] Supabase unavailable; returning default plans', error)
  }

  return NextResponse.json({ plans: defaultPricingPlans, source: 'defaults' })
}

export async function POST(request: NextRequest) {
  if (!(await requireAdmin(request))) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  try {
    const body = await request.json()
    const id = String(body.id || '').trim().toLowerCase().replace(/[^a-z0-9-]/g, '-')
    const name = String(body.name || '').trim()
    const description = String(body.description || '').trim()
    const cta = String(body.cta || '').trim()
    const price = Number(body.price)
    const sortOrder = Number(body.sort_order)
    const billingPeriod = body.billing_period === 'one-time' ? 'one-time' : 'monthly'

    if (!id || !name || !description || !cta || !Number.isFinite(price) || price < 0 || !Number.isInteger(sortOrder)) {
      return NextResponse.json({ error: 'Enter a plan name, description, button label, valid price, and order.' }, { status: 400 })
    }

    const { data, error } = await supabaseAdmin
      .from('pricing_plans')
      .upsert({ id, name, price, description, cta, popular: Boolean(body.popular), sort_order: sortOrder, billing_period: billingPeriod }, { onConflict: 'id' })
      .select('id,name,price,description,cta,popular,sort_order,billing_period')
      .single()

    if (error) throw error
    return NextResponse.json({ plan: data })
  } catch (error) {
    console.error('[PRICING] Save failed', error)
    return NextResponse.json({ error: 'Unable to save the plan. Confirm the Supabase pricing migration has been applied.' }, { status: 500 })
  }
}