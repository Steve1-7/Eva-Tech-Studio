"use client"
import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { supabase } from '@/lib/supabase'

export default function AuthCallbackPage() {
  const router = useRouter()

  useEffect(() => {
    let mounted = true
    ;(async () => {
      try {
        // supabase.auth.getSessionFromUrl may not be available in this client version.
        // Parse the URL fragment (hash) that contains the magic-link tokens and set the session.
        const hash = window.location.hash || ''
        const params = new URLSearchParams(hash.replace(/^#/, ''))
        const access_token = params.get('access_token')
        const refresh_token = params.get('refresh_token')

        if (access_token) {
          // Set the session so supabase client can use it
          await supabase.auth.setSession({ access_token, refresh_token: refresh_token ?? '' })
        }

        if (!mounted) return
        router.replace('/client-portal')
      } catch (e) {
        console.error('[auth/callback] error', e)
        router.replace('/')
      }
    })()

    return () => { mounted = false }
  }, [router])

  return (
    <div className="p-8">
      <div className="font-semibold">Signing you in…</div>
      <div className="text-sm text-muted">If you are not redirected, return to the portal and try again.</div>
    </div>
  )
}
