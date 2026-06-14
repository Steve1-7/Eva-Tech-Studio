import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || ''
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || ''
const supabaseServiceRole = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.SUPABASE_SERVICE_KEY || ''

let supabase: any
let supabaseAdmin: any

if (supabaseUrl && supabaseAnonKey) {
	supabase = createClient(supabaseUrl, supabaseAnonKey)
	// Server-side client with elevated privileges (SERVICE ROLE) - must NOT be exposed to clients
	supabaseAdmin = supabaseServiceRole ? createClient(supabaseUrl, supabaseServiceRole) : createClient(supabaseUrl, supabaseAnonKey)
} else {
	// Provide a safe stub for build-time so Next.js won't fail when env vars are missing.
	const noopQuery = () => ({
		select: async () => ({ data: null, error: null }),
		insert: async () => ({ data: null, error: null }),
		update: async () => ({ data: null, error: null }),
		delete: async () => ({ data: null, error: null }),
		upsert: async () => ({ data: null, error: null }),
		eq: () => noopQuery(),
		order: () => noopQuery(),
		limit: () => noopQuery(),
		match: () => noopQuery(),
		single: async () => ({ data: null, error: null }),
	})

	const stub = {
		from: () => noopQuery(),
		auth: { signInWithOtp: async () => ({}) },
		// allow other chained calls without breaking builds
		rpc: async () => ({ data: null, error: null }),
	}

	supabase = stub
	supabaseAdmin = stub
	console.warn('[supabase] NEXT_PUBLIC_SUPABASE_URL not set — using stub client for build-time safety.')
}

export { supabase, supabaseAdmin }
