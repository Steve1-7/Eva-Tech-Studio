import { supabaseAdmin } from './supabase'
import { getSessionFromRequest } from './auth'

export async function isAdminToken(token: string | null | undefined): Promise<boolean> {
  if (!token) return false
  try {
    const { data, error } = await supabaseAdmin
      .from('admin_sessions')
      .select('email,expires_at')
      .eq('token', token)
      .gt('expires_at', new Date().toISOString())
      .maybeSingle()

    if (error) {
      console.error('[RBAC] isAdminToken error', error)
      return false
    }

    if (!data) return false

    // Admin email check can be handled elsewhere; presence of valid session implies admin
    return true
  } catch (e) {
    console.error('[RBAC] isAdminToken unexpected error', e)
    return false
  }
}

export async function requireAdmin(request: Request): Promise<boolean> {
  const token = getSessionFromRequest(request)
  return await isAdminToken(token)
}

export function serviceClient() {
  return supabaseAdmin
}
