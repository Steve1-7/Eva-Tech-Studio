import { supabaseAdmin } from './supabase'
import { randomBytes } from 'node:crypto'

function authorizedEmails(): string[] {
  return (process.env.AUTHORIZED_EMAIL || '')
    .split(',')
    .map(email => email.trim().toLowerCase())
    .filter(Boolean)
}

export async function createSession(email: string): Promise<string> {
  const token = randomBytes(32).toString('base64url')
  const expiresAt = new Date(Date.now() + 24 * 60 * 60 * 1000) // 24 hours

  const { data, error } = await supabaseAdmin
    .from('admin_sessions')
    .insert({ token, email, expires_at: expiresAt.toISOString() })
    .select('id')

  if (error || !data?.length) {
    console.error('[AUTH] Supabase session insert failed', error || 'No session row was created.')
    throw new Error(`Failed to create session${error ? `: ${error.message}` : '.'}`)
  }

  return token
}

export async function validateSession(token: string): Promise<boolean> {
  if (!token) return false

  try {
    const { data: session, error } = await supabaseAdmin
      .from('admin_sessions')
      .select('*')
      .eq('token', token)
      .gt('expires_at', new Date().toISOString())
      .maybeSingle()

    if (error) {
      console.error('[AUTH] validateSession query error:', error)
      return false
    }

    if (!session) return false

    return authorizedEmails().includes(session.email?.toLowerCase())
  } catch (e) {
    console.error('[AUTH] validateSession unexpected error', e)
    return false
  }
}

export async function validateSessionAsync(token: string): Promise<boolean> {
  return validateSession(token)
}

export function getSessionFromRequest(request: Request): string | null {
  const cookieHeader = request.headers.get('cookie')

  if (!cookieHeader) return null

  const cookies: Record<string, string> = {}
  cookieHeader.split(';').forEach(cookie => {
    const separator = cookie.indexOf('=')
    if (separator > -1) {
      const key = cookie.slice(0, separator).trim()
      const value = cookie.slice(separator + 1).trim()
      cookies[key] = value
    }
  })

  let token = cookies.admin_session || null
  if (token) {
    try {
      token = decodeURIComponent(token).trim()
    } catch {
      return null
    }
  }

  return token
}

export async function authenticateRequest(request: Request): Promise<boolean> {
  const token = getSessionFromRequest(request)
  if (!token) {
    return false
  }
  return await validateSessionAsync(token)
}

export async function getAuthInfo(request: Request): Promise<{ isAdmin: boolean; userId?: string | null }> {
  const token = getSessionFromRequest(request)
  const isAdmin = token ? await validateSessionAsync(token) : false

  // Try to infer a client user id from common headers or cookies
  const headerUserId = request.headers.get('x-user-id')
  const cookieHeader = request.headers.get('cookie') || ''
  let cookieUserId: string | null = null
  cookieHeader.split(';').forEach(c => {
    const [k, ...v] = c.trim().split('=')
    if (k === 'sb-user-id') cookieUserId = decodeURIComponent(v.join('='))
  })

  const userId = headerUserId || cookieUserId || null
  return { isAdmin, userId }
}
