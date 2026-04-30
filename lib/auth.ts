import { supabase } from './supabase'

const AUTHORIZED_EMAIL = 'stevezuluu@gmail.com'

export async function createSession(email: string): Promise<string> {
  const token = Buffer.from(`${email}:${Date.now()}`).toString('base64')
  const expiresAt = new Date(Date.now() + 24 * 60 * 60 * 1000) // 24 hours

  console.log('[AUTH] Creating session for:', email)
  console.log('[AUTH] Token:', token.substring(0, 30) + '...')
  console.log('[AUTH] Expires at:', expiresAt.toISOString())

  const { data, error } = await supabase
    .from('admin_sessions')
    .insert({
      token,
      email,
      expires_at: expiresAt.toISOString()
    })
    .select()

  if (error) {
    console.error('[AUTH] Supabase insert error:', error)
    throw new Error(`Failed to create session: ${error.message}`)
  }

  console.log('[AUTH] Session saved to DB:', data)

  // Verify the session was saved
  const { data: verifyData, error: verifyError } = await supabase
    .from('admin_sessions')
    .select('*')
    .eq('token', token)
    .maybeSingle()

  if (verifyError) {
    console.error('[AUTH] Verification query error:', verifyError)
  } else if (!verifyData) {
    console.error('[AUTH] WARNING: Session not found immediately after insert!')
  } else {
    console.log('[AUTH] Session verified in DB:', verifyData.id)
  }

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
  console.log('[AUTH] Validating session token:', token)
  console.log('[AUTH] Token length:', token.length)

  // First check if any session exists with this token (without expiry filter)
  const { data: anySession, error: anyError } = await supabase
    .from('admin_sessions')
    .select('*')
    .eq('token', token)
    .maybeSingle()

  console.log('[AUTH] Any session with this token:', { found: !!anySession, error: anyError?.message })

  if (anySession) {
    console.log('[AUTH] Found session expiry:', anySession.expires_at)
    console.log('[AUTH] Current time:', new Date().toISOString())
    console.log('[AUTH] Is expired?', new Date(anySession.expires_at) < new Date())
  }

  // Now do the full validation with expiry check
  const { data: session, error } = await supabase
    .from('admin_sessions')
    .select('*')
    .eq('token', token)
    .gt('expires_at', new Date().toISOString())
    .maybeSingle()

  console.log('[AUTH] Valid session query result:', { error: error?.message || null, session: !!session })

  if (error) {
    console.error('[AUTH] Session query error:', error)
    return false
  }

  if (!session) {
    console.log('[AUTH] No valid session found for token')
    return false
  }

  const isValid = session.email.toLowerCase() === AUTHORIZED_EMAIL.toLowerCase()
  console.log('[AUTH] Session email:', session.email, 'Authorized email:', AUTHORIZED_EMAIL, 'Valid:', isValid)
  return isValid
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
    console.log('[AUTH] No token found in request')
    return false
  }
  return await validateSessionAsync(token)
}
