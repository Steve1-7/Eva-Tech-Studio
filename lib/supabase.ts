import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
const supabaseServiceRole = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.SUPABASE_SERVICE_KEY || ''

export const supabase = createClient(supabaseUrl, supabaseAnonKey)

// Server-side client with elevated privileges (SERVICE ROLE) - must NOT be exposed to clients
export const supabaseAdmin = supabaseServiceRole
	? createClient(supabaseUrl, supabaseServiceRole)
	: createClient(supabaseUrl, supabaseAnonKey)
