"use client"
import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabase'
import dynamic from 'next/dynamic'

const ClientLogin = dynamic(() => import('./LoginForm'), { ssr: false })
const ClientDashboard = dynamic(() => import('./Dashboard'), { ssr: false })

export default function PortalWrapper() {
  const [user, setUser] = useState<any>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    let mounted = true
    ;(async () => {
      try {
        const { data } = await supabase.auth.getUser()
        if (!mounted) return
        setUser(data?.user ?? null)
      } catch (e) {
        console.error('[PortalWrapper] getUser failed', e)
        setUser(null)
      } finally {
        if (mounted) setLoading(false)
      }
    })()

    const { data: { subscription } = {} as any } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null)
    })

    return () => {
      mounted = false
      try { subscription?.unsubscribe?.() } catch (e) { /* ignore */ }
    }
  }, [])

  if (loading) return <div className="p-8 text-center">Loading…</div>

  if (!user) return <ClientLogin />

  return <ClientDashboard />
}
