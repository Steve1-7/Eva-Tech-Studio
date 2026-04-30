import { NextRequest, NextResponse } from 'next/server'
import { cookies } from 'next/headers'
import { createSession } from '@/lib/auth'

const AUTHORIZED_EMAIL = 'stevezuluu@gmail.com'

export async function POST(request: NextRequest) {
  try {
    const { email } = await request.json()

    if (!email || email.toLowerCase() !== AUTHORIZED_EMAIL.toLowerCase()) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // Generate session token and store in Supabase
    const token = createSession(email)

    // Set HTTP-only cookie
    const cookieStore = await cookies()
    cookieStore.set('admin_session', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 24 * 60 * 60 // 24 hours
    })

    return NextResponse.json({ success: true, token })
  } catch (error) {
    return NextResponse.json({ error: 'Invalid request' }, { status: 400 })
  }
}
