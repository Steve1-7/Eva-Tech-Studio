"use client"
import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { createClient as createSupabaseBrowserClient } from '@/lib/supabase/client'

export default function AuthCallbackPage() {
  const router = useRouter()

  useEffect(() => {
    let mounted = true

    const completeAdminSignIn = async () => {
      let supabase: ReturnType<typeof createSupabaseBrowserClient> | null = null

      try {
        supabase = createSupabaseBrowserClient()
        const callbackUrl = new URL(window.location.href)
        const code = callbackUrl.searchParams.get('code')
        window.history.replaceState(null, '', callbackUrl.pathname)
        if (!code) throw new Error('The sign-in link did not contain an authorization code.')

        const { data, error } = await supabase.auth.exchangeCodeForSession(code)
        if (error || !data.session) throw new Error('Supabase could not verify the sign-in link.')

        const response = await fetch('/api/auth/session', {
          method: 'POST',
          credentials: 'include',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ accessToken: data.session.access_token }),
        })
        if (!response.ok) throw new Error('The account is not authorized for the admin dashboard.')

        await supabase.auth.signOut().catch(() => undefined)
        if (mounted) router.replace('/admin')
      } catch (error) {
        console.error('[auth/callback] Admin sign-in verification failed', error)
        if (supabase) await supabase.auth.signOut().catch(() => undefined)
        if (mounted) router.replace('/admin?auth=failed')
      }
    }

    void completeAdminSignIn()
    return () => { mounted = false }
  }, [router])

  return (
    <main className="min-h-screen flex items-center justify-center p-8" style={{ background: 'var(--obsidian)', color: '#B8B2A8' }}>
      <p role="status">Verifying your sign-in link…</p>
    </main>
  )
}
