import { supabaseAdmin } from './supabase'
import { getSessionFromRequest, validateSession } from './auth'

export async function isAdminToken(token: string | null | undefined): Promise<boolean> {
  if (!token) return false
  return validateSession(token)
}

export async function requireAdmin(request: Request): Promise<boolean> {
  const token = getSessionFromRequest(request)
  return await isAdminToken(token)
}

export function serviceClient() {
  return supabaseAdmin
}
