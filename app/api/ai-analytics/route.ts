import { NextRequest, NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabase'

export async function POST(request: NextRequest) {
  try {
    const { eventType, properties } = await request.json()
    const ip = request.ip || request.headers.get('x-forwarded-for') || null
    const userAgent = request.headers.get('user-agent') || null

    await supabaseAdmin.from('analytics_events').insert({
      event_type: eventType,
      properties: properties || {},
      ip,
      user_agent: userAgent
    })

    // Forward to PostHog if configured (optional)
    try {
      const posthogKey = process.env.POSTHOG_API_KEY
      const posthogHost = process.env.POSTHOG_HOST || 'https://app.posthog.com'
      if (posthogKey) {
        await fetch(`${posthogHost}/capture/`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ api_key: posthogKey, event: eventType, properties: { ...(properties || {}), ip, user_agent: userAgent } })
        })
      }
    } catch (fwdErr) {
      console.warn('[AI-ANALYTICS] PostHog forward failed:', fwdErr?.message || fwdErr)
    }

    return NextResponse.json({ success: true })
  } catch (err: any) {
    console.error('[AI-ANALYTICS] Error:', err)
    return NextResponse.json({ success: false, message: err?.message || 'Failed' }, { status: 500 })
  }
}
