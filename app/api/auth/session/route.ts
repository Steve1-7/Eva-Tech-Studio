import { NextRequest, NextResponse } from 'next/server'
import { cookies } from 'next/headers'
import { createSession, getAdminSessionEmail, getSessionFromRequest, isAuthorizedAdminEmail, normalizeAdminEmail } from '@/lib/auth'
import { supabaseAdmin } from '@/lib/supabase'

const SESSION_COOKIE = 'admin_session'
const SESSION_MAX_AGE = 24 * 60 * 60

function setSessionCookie(cookieStore: Awaited<ReturnType<typeof cookies>>, token: string) {
  cookieStore.set({
    name: SESSION_COOKIE,
    value: token,
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    path: '/',
    maxAge: SESSION_MAX_AGE,
  })
}

export async function GET(request: NextRequest) {
  const email = await getAdminSessionEmail(getSessionFromRequest(request))
  return NextResponse.json({ isAuthenticated: Boolean(email), email })
}

export async function POST(request: NextRequest) {
  let body: { accessToken?: unknown }
  try {
    body = await request.json()
  } catch {
    return NextResponse.json({ error: 'Invalid request body.' }, { status: 400 })
  }

  if (typeof body.accessToken !== 'string' || !body.accessToken) {
    return NextResponse.json({ error: 'Sign-in could not be verified.' }, { status: 401 })
  }

  try {
    const { data, error } = await supabaseAdmin.auth.getUser(body.accessToken)
    const user = data?.user
    if (error || !user?.email || !user.email_confirmed_at) {
      return NextResponse.json({ error: 'Sign-in could not be verified.' }, { status: 401 })
    }

    const email = normalizeAdminEmail(user.email)
    if (!(await isAuthorizedAdminEmail(email))) {
      return NextResponse.json({ error: 'Sign-in could not be verified.' }, { status: 401 })
    }

    const token = await createSession(email)
    const cookieStore = await cookies()
    setSessionCookie(cookieStore, token)

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('[AUTH] Verified sign-in session creation failed', error)
    return NextResponse.json({ error: 'Could not complete sign-in. Please request a new link.' }, { status: 503 })
  }
}

export async function DELETE() {
  const cookieStore = await cookies()
  cookieStore.set({
    name: SESSION_COOKIE,
    value: '',
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    path: '/',
    maxAge: 0,
  })

  return NextResponse.json({ success: true })
}
