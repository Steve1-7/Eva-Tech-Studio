'use client'
import { useState, useEffect } from 'react'
import { supabase } from '@/lib/supabase'

export default function LoginForm() {
  const [email, setEmail] = useState('')
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState('')

  useEffect(() => {
    // clear message after a while
    if (!message) return
    const t = setTimeout(() => setMessage(''), 6000)
    return () => clearTimeout(t)
  }, [message])

  const handleMagicLink = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setMessage('')
    try {
      const { error } = await supabase.auth.signInWithOtp({ email })
      if (error) throw error
      setMessage('Magic link sent — check your email.')
      setEmail('')
    } catch (err: any) {
      setMessage(err?.message || 'Unable to send magic link')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="rounded-[16px] p-8" style={{ background: 'var(--obsidian-3)', border: '1px solid rgba(232,227,216,0.06)' }}>
      <h3 className="font-cormorant text-[1.25rem] font-semibold mb-2" style={{ color: '#E8E3D8' }}>Secure Client Login</h3>
      <p className="text-[0.9rem] mb-4" style={{ color: '#6B6860' }}>Enter your work email and we'll send a secure login link.</p>
      <form onSubmit={handleMagicLink} className="flex flex-col gap-3">
        <input type="email" required placeholder="you@company.com" className="form-input" value={email} onChange={e => setEmail(e.target.value)} />
        <button className="btn-primary py-3 mt-2" disabled={loading}>{loading ? 'Sending…' : 'Send Magic Link'}</button>
        {message && <div className="text-[0.9rem] mt-2" style={{ color: '#B8B2A8' }}>{message}</div>}
      </form>
    </div>
  )
}
