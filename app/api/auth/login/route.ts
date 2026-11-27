import { NextRequest, NextResponse } from 'next/server'
import { isAuthorizedAdminEmail, normalizeAdminEmail } from '@/lib/auth'
import { checkRateLimit, adminLoginLimiter } from '@/lib/rate-limit'
import { createClient as createSupabaseServerClient } from '@/lib/supabase/server'
import { supabaseAdmin } from '@/lib/supabase'

const GENERIC_LOGIN_MESSAGE = 'If this address is authorized, a sign-in link is on its way.'

export async function POST(request: NextRequest) {
  let body: { email?: unknown }
  try {
    body = await request.json()
  } catch {
    return NextResponse.json({ error: 'Invalid request body.' }, { status: 400 })
  }

  const email = typeof body.email === 'string' ? normalizeAdminEmail(body.email) : ''
  if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return NextResponse.json({ error: 'Enter a valid email address.' }, { status: 400 })
  }

  try {
    if (!(await isAuthorizedAdminEmail(email))) {
      return NextResponse.json({ success: true, message: GENERIC_LOGIN_MESSAGE })
    }

    if (!checkRateLimit(adminLoginLimiter, email).allowed) {
      return NextResponse.json({ error: 'Too many sign-in requests. Try again later.' }, { status: 429 })
    }

    const emailRedirectTo = process.env.NODE_ENV !== 'production' && process.env.NEXT_PUBLIC_DEV_SUPABASE_REDIRECT_URL
      ? process.env.NEXT_PUBLIC_DEV_SUPABASE_REDIRECT_URL
      : new URL('/auth/callback', request.url).toString()

    const supabase = await createSupabaseServerClient()
    const { error } = await supabase.auth.signInWithOtp({
      email,
      options: {
        shouldCreateUser: false,
        emailRedirectTo,
      },
    })

    if (error) {
      console.error('[LOGIN] Supabase sign-in link request failed', error)
      return NextResponse.json({ error: 'Could not send a sign-in link. Please try again later.' }, { status: 503 })
    }

    return NextResponse.json({ success: true, message: GENERIC_LOGIN_MESSAGE })
  } catch (error) {
    console.error('[LOGIN] Admin access check failed', error)
    return NextResponse.json({ error: 'Could not send a sign-in link. Please try again later.' }, { status: 503 })
  }
}
