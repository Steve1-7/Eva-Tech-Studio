import { supabaseAdmin } from './supabase'
import { randomBytes } from 'node:crypto'

const ADMIN_SESSION_PREFIX = 'v2.'

export function normalizeAdminEmail(email: string): string {
  return email.trim().toLowerCase()
}

export function isCurrentAdminSessionToken(token: string): boolean {
  return token.startsWith(ADMIN_SESSION_PREFIX)
}

export async function isAuthorizedAdminEmail(email: string): Promise<boolean> {
  const normalizedEmail = normalizeAdminEmail(email)
  if (!normalizedEmail) return false

  const { data, error } = await supabaseAdmin
    .from('admin_access')
    .select('email')
    .eq('email', normalizedEmail)
    .eq('is_active', true)
    .maybeSingle()

  if (error) {
    throw new Error(`Admin access lookup failed: ${error.message}`)
  }

  return Boolean(data)
}

export async function createSession(email: string): Promise<string> {
  const token = `${ADMIN_SESSION_PREFIX}${randomBytes(32).toString('base64url')}`
  const expiresAt = new Date(Date.now() + 24 * 60 * 60 * 1000)

  const { data, error } = await supabaseAdmin
    .from('admin_sessions')
    .insert({ token, email: normalizeAdminEmail(email), expires_at: expiresAt.toISOString() })
    .select('id')

  if (error || !data?.length) {
    console.error('[AUTH] Supabase session insert failed', error || 'No session row was created.')
    throw new Error(`Failed to create session${error ? `: ${error.message}` : '.'}`)
  }

  return token
}

export async function getAdminSessionEmail(token: string | null | undefined): Promise<string | null> {
  if (!token || !isCurrentAdminSessionToken(token)) return null

  try {
    const { data: session, error } = await supabaseAdmin
      .from('admin_sessions')
      .select('email')
      .eq('token', token)
      .gt('expires_at', new Date().toISOString())
      .maybeSingle()

    if (error) {
      console.error('[AUTH] Session lookup failed:', error)
      return null
    }

    if (!session?.email) return null
    return await isAuthorizedAdminEmail(session.email) ? normalizeAdminEmail(session.email) : null
  } catch (error) {
    console.error('[AUTH] Session validation failed:', error)
    return null
  }
}

export async function validateSession(token: string): Promise<boolean> {
  return Boolean(await getAdminSessionEmail(token))
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
