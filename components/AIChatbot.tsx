 'use client'
import { useState, useRef, useEffect } from 'react'
import { submitContact } from '@/lib/forms'

export default function AIChatbot() {
  const [isOpen, setIsOpen] = useState(false)
  const [input, setInput] = useState('')
  const [email, setEmail] = useState('')
  const [name, setName] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState(false)
  const inputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    if (isOpen) inputRef.current?.focus()
  }, [isOpen])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setSuccess(false)

    if (!input.trim()) {
      setError('Please enter a message')
      return
    }

    setLoading(true)
    try {
      await submitContact({
        firstName: name || undefined,
        lastName: undefined,
        email: email || '',
        message: input.trim(),
      })
      setSuccess(true)
      setInput('')
    } catch (err: any) {
      setError(err.message || 'Unable to send message. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={`fixed bottom-6 right-6 z-50 w-14 h-14 rounded-full flex items-center justify-center shadow-lg transition-all duration-300 ${isOpen ? 'rotate-90' : 'hover:scale-110'}`}
        style={{
          background: 'linear-gradient(135deg, var(--gold), var(--gold-bright))',
          boxShadow: '0 4px 20px rgba(201, 169, 110, 0.4)',
        }}
      >
        {isOpen ? (
          <svg className="w-6 h-6 text-[#07080F]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        ) : (
          <svg className="w-6 h-6 text-[#07080F]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
          </svg>
        )}
      </button>

      {isOpen && (
        <div
          className="fixed bottom-24 right-6 z-50 w-[360px] h-[500px] rounded-[24px] overflow-hidden shadow-2xl animate-fade-up"
          style={{
            background: 'var(--obsidian-3)',
            border: '1px solid rgba(201, 169, 110, 0.2)',
            boxShadow: '0 20px 60px rgba(0, 0, 0, 0.5), 0 0 40px rgba(201, 169, 110, 0.1)',
          }}
        >
          <div className="px-5 py-4 flex items-center gap-3" style={{ background: 'linear-gradient(135deg, var(--obsidian-4), var(--obsidian-3))' }}>
            <div className="w-10 h-10 rounded-full flex items-center justify-center" style={{ background: 'rgba(201, 169, 110, 0.15)' }}>
              <span className="text-lg">💬</span>
            </div>
            <div>
              <div className="font-semibold text-[0.9rem]" style={{ color: '#E8E3D8' }}>Talk to the Team</div>
              <div className="text-[0.65rem]" style={{ color: '#6B6860' }}>Quick messages go to our inbox; we'll reply within 24 hours.</div>
            </div>
          </div>

          <div className="h-[340px] overflow-y-auto px-4 py-3" style={{ scrollbarWidth: 'thin' }}>
            <div className="mb-4 text-[0.92rem] leading-[1.6]" style={{ color: '#B8B2A8' }}>
              Ask a question or send a quick brief — include your email so we can reply.
            </div>

            {success && (
              <div className="mb-4 p-3 rounded-[12px]" style={{ background: 'rgba(201,169,110,0.08)', color: '#C9A96E' }}>
                Thanks — your message was sent. We'll be in touch within 24 hours.
              </div>
            )}

            {error && (
              <div className="mb-4 p-3 rounded-[12px] bg-rose-800 text-white">{error}</div>
            )}

            <form onSubmit={handleSubmit} className="flex flex-col gap-3">
              <input
                ref={inputRef}
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Your name (optional)"
                className="form-input"
              />
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Your email (recommended)"
                className="form-input"
              />
              <textarea
                rows={4}
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Write your message..."
                className="form-input resize-none"
              />
              <div className="flex items-center gap-3">
                <button
                  type="submit"
                  disabled={loading}
                  className="btn-primary flex-1 py-3"
                >
                  {loading ? 'Sending...' : 'Send Message'}
                </button>
                <button type="button" onClick={() => { setIsOpen(false); setError(''); setSuccess(false) }} className="px-4 py-3 rounded-full" style={{ border: '1px solid rgba(232,227,216,0.06)' }}>
                  Close
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  )
}
