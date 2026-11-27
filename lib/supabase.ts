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
	const noopQuery = (): any => {
		const result = { data: null, error: null }
		const query: any = {}
		const chain = () => query

		query.select = chain
		query.insert = chain
		query.update = chain
		query.delete = chain
		query.upsert = chain
		query.eq = chain
		query.gt = chain
		query.order = chain
		query.limit = chain
		query.match = chain
		query.single = async () => result
		query.maybeSingle = async () => result
		query.then = (resolve: (value: typeof result) => unknown, reject: (reason: unknown) => unknown) => Promise.resolve(result).then(resolve, reject)

		return query
	}

	const stub = {
		from: () => noopQuery(),
		auth: {
			signInWithOtp: async () => ({ error: null }),
			getUser: async () => ({ data: { user: null }, error: null }),
		},
		// allow other chained calls without breaking builds
		rpc: async () => ({ data: null, error: null }),
	}

	supabase = stub
	supabaseAdmin = stub
	console.warn('[supabase] NEXT_PUBLIC_SUPABASE_URL not set — using stub client for build-time safety.')
}

export { supabase, supabaseAdmin }
