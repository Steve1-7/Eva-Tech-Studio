import { NextRequest, NextResponse } from 'next/server'
import { cookies } from 'next/headers'
import { createSession } from '@/lib/auth'

const AUTHORIZED_EMAIL = 'stevezuluu@gmail.com'

export async function POST(request: NextRequest) {
  try {
    const { email } = await request.json()

    console.log('[LOGIN] Attempting login with email:', email)
    console.log('[LOGIN] Authorized email:', AUTHORIZED_EMAIL)

    if (!email || email.toLowerCase() !== AUTHORIZED_EMAIL.toLowerCase()) {
      console.log('[LOGIN] Email mismatch or empty')
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    console.log('[LOGIN] Email authorized, creating session...')

    // Generate session token and store in Supabase
    const token = await createSession(email)
    console.log('[LOGIN] Token generated:', token.substring(0, 30) + '...')

    // Set HTTP-only cookie with explicit path
    const cookieStore = await cookies()
    cookieStore.set({
      name: 'admin_session',
      value: token,
      httpOnly: true,
      secure: false, // Set to false for local development
      sameSite: 'lax',
      path: '/',
      maxAge: 24 * 60 * 60 // 24 hours
    })

    console.log('[LOGIN] Session created and cookie set')
    return NextResponse.json({ success: true, token })
  } catch (error) {
    console.error('[LOGIN] Error:', error)
    return NextResponse.json({ error: 'Login failed' }, { status: 400 })
  }
}
