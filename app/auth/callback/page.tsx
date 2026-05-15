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
        const { data, error } = await supabase.auth.getSessionFromUrl({ storeSession: true })
        if (error) console.warn('[auth/callback] getSessionFromUrl error', error)
        if (!mounted) return
        if (data?.session) {
          // Signed in — send the user to the client portal
          router.replace('/client-portal')
        } else {
          router.replace('/client-portal')
        }
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
