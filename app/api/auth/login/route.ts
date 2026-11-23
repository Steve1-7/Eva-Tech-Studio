import { NextRequest, NextResponse } from 'next/server'
import { cookies } from 'next/headers'
import { createSession } from '@/lib/auth'

const AUTHORIZED_EMAILS = (process.env.AUTHORIZED_EMAIL || '')
  .split(',')
  .map(email => email.trim().toLowerCase())
  .filter(Boolean)

export async function POST(request: NextRequest) {
  let body: { email?: unknown }
  try {
    body = await request.json()
  } catch {
    return NextResponse.json({ error: 'Invalid request body.' }, { status: 400 })
  }

  try {
    const email = typeof body.email === 'string' ? body.email.trim() : ''

    if (!AUTHORIZED_EMAILS.length) {
      return NextResponse.json({ error: 'Administrator login is not configured.' }, { status: 503 })
    }

    if (!email || !AUTHORIZED_EMAILS.includes(email.toLowerCase())) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const token = await createSession(email)

    const cookieStore = await cookies()
    cookieStore.set({
      name: 'admin_session',
      value: token,
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      path: '/',
      maxAge: 24 * 60 * 60 // 24 hours
    })

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('[LOGIN] Session creation failed', error)
    return NextResponse.json({ error: 'Login failed' }, { status: 500 })
  }
}
