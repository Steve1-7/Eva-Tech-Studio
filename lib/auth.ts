import { supabaseAdmin } from './supabase'

const AUTHORIZED_EMAIL = process.env.AUTHORIZED_EMAIL || 'stevezuluu@gmail.com'

export async function createSession(email: string): Promise<string> {
  const token = Buffer.from(`${email}:${Date.now()}`).toString('base64')
  const expiresAt = new Date(Date.now() + 24 * 60 * 60 * 1000) // 24 hours

  const { data, error } = await supabaseAdmin
    .from('admin_sessions')
    .insert({ token, email, expires_at: expiresAt.toISOString() })
    .select()

  if (error) {
    console.error('[AUTH] Supabase insert error:', error)
    throw new Error(`Failed to create session: ${error.message}`)
  }

  return token
}

export async function validateSession(token: string): Promise<boolean> {
  if (!token) return false

  try {
    const { data: session, error } = await supabase
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

    return session.email?.toLowerCase() === AUTHORIZED_EMAIL.toLowerCase()
  } catch (e) {
    console.error('[AUTH] validateSession unexpected error', e)
    return false
  }
}

export async function validateSessionAsync(token: string): Promise<boolean> {
  console.log('[AUTH] Validating session token:', token)
  console.log('[AUTH] Token length:', token.length)

  // First check if any session exists with this token (without expiry filter)
  const { data: anySession, error: anyError } = await supabaseAdmin
    .from('admin_sessions')
    .select('*')
    .eq('token', token)
    .maybeSingle()

  if (anyError) {
    console.error('[AUTH] validateSessionAsync first-query error:', anyError)
  }

  // Now do the full validation with expiry check
  const { data: session, error } = await supabaseAdmin
    .from('admin_sessions')
    .select('*')
    .eq('token', token)
    .gt('expires_at', new Date().toISOString())
    .maybeSingle()

  if (error) {
    console.error('[AUTH] Session query error:', error)
    return false
  }

  if (!session) return false

  return session.email?.toLowerCase() === AUTHORIZED_EMAIL.toLowerCase()
}

export function getSessionFromRequest(request: Request): string | null {
  const cookieHeader = request.headers.get('cookie')
  console.log('[AUTH] Cookie header length:', cookieHeader?.length || 0)
  console.log('[AUTH] Full cookie header:', cookieHeader)

  if (!cookieHeader) return null

  // Parse cookies properly
  const cookies: Record<string, string> = {}
  cookieHeader.split(';').forEach(cookie => {
    const parts = cookie.trim().split('=')
    if (parts.length >= 2) {
      const key = parts[0].trim()
      const value = parts.slice(1).join('=').trim() // Handle values that contain =
      cookies[key] = value
    }
  })

  console.log('[AUTH] Parsed cookies keys:', Object.keys(cookies))

  let token = cookies.admin_session || null

  // URL decode the token (cookie may have encoded characters like %3D for =)
  if (token) {
    try {
      token = decodeURIComponent(token).trim()
    } catch (e) {
      console.error('[AUTH] Failed to decode token:', e)
    }
  }

  console.log('[AUTH] Session token from cookie (decoded):', token ? token.substring(0, 30) + '...' : 'null')
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
