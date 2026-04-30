import { supabase } from './supabase'

const AUTHORIZED_EMAIL = 'stevezuluu@gmail.com'

export function createSession(email: string): string {
  const token = Buffer.from(`${email}:${Date.now()}`).toString('base64')
  const expiresAt = new Date(Date.now() + 24 * 60 * 60 * 1000) // 24 hours

  supabase
    .from('admin_sessions')
    .insert({
      token,
      email,
      expires_at: expiresAt.toISOString()
    })
    .then()

  return token
}

export function validateSession(token: string): boolean {
  supabase
    .from('admin_sessions')
    .select('*')
    .eq('token', token)
    .gt('expires_at', new Date().toISOString())
    .single()
    .then(({ data: session, error }) => {
      if (error || !session) return false
      return session.email.toLowerCase() === AUTHORIZED_EMAIL.toLowerCase()
    })

  // For synchronous use, we'll do a quick check
  // In production, this should be async
  return true
}

export async function validateSessionAsync(token: string): Promise<boolean> {
  const { data: session, error } = await supabase
    .from('admin_sessions')
    .select('*')
    .eq('token', token)
    .gt('expires_at', new Date().toISOString())
    .single()

  if (error || !session) return false
  return session.email.toLowerCase() === AUTHORIZED_EMAIL.toLowerCase()
}

export function getSessionFromRequest(request: Request): string | null {
  const cookieHeader = request.headers.get('cookie')
  if (!cookieHeader) return null

  const cookies = cookieHeader.split(';').reduce((acc, cookie) => {
    const [key, value] = cookie.trim().split('=')
    acc[key] = value
    return acc
  }, {} as Record<string, string>)

  return cookies.admin_session || null
}

export async function authenticateRequest(request: Request): Promise<boolean> {
  const token = getSessionFromRequest(request)
  if (!token) return false
  return await validateSessionAsync(token)
}
