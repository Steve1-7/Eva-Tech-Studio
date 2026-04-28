'use client'
import { useState, useEffect } from 'react'
import SectionLabel from './SectionLabel'
import Link from 'next/link'
import Confetti from './Confetti'

interface AuditData {
  url: string
  biz: string
  goal: string
  result: string
  timestamp: number
}

interface ParsedSection {
  emoji: string
  title: string
  content: string[]
}

function parseAuditResult(result: string): ParsedSection[] {
  const sections: ParsedSection[] = []
  const lines = result.split('\n')
  let currentSection: ParsedSection | null = null

  for (const line of lines) {
    const trimmed = line.trim()
    if (!trimmed) continue

    // Check if line is a section header (starts with emoji)
    // Emoji detection using regex that matches common emoji characters
    const emojiMatch = trimmed.match(/^(\ud83c[\udf00-\udfff]|\ud83d[\udc00-\uddff])\s*(.+)/)
    if (emojiMatch) {
      if (currentSection) {
        sections.push(currentSection)
      }
      currentSection = {
        emoji: emojiMatch[1],
        title: emojiMatch[2].trim(),
        content: []
      }
    } else if (currentSection) {
      // Remove bullet points and clean up
      const cleanLine = trimmed.replace(/^[•\-\*]\s*/, '').trim()
      if (cleanLine) {
        currentSection.content.push(cleanLine)
      }
    }
  }

  if (currentSection) {
    sections.push(currentSection)
  }

  return sections
}

export default function AIAuditWidget() {
  const [step, setStep] = useState<'form'|'loading'|'result'>('form')
  const [url, setUrl] = useState('')
  const [biz, setBiz] = useState('')
  const [goal, setGoal] = useState('')
  const [result, setResult] = useState('')
  const [parsedSections, setParsedSections] = useState<ParsedSection[]>([])
  const [error, setError] = useState('')
  const [confettiTrigger, setConfettiTrigger] = useState(false)
  const [isOffline, setIsOffline] = useState(false)

  // Load saved audit from localStorage on mount
  useEffect(() => {
    const saved = localStorage.getItem('ai_audit_data')
    if (saved) {
      try {
        const data: AuditData = JSON.parse(saved)
        // Only restore if less than 7 days old
        if (Date.now() - data.timestamp < 7 * 24 * 60 * 60 * 1000) {
          setUrl(data.url)
          setBiz(data.biz)
          setGoal(data.goal)
          setResult(data.result)
          setParsedSections(parseAuditResult(data.result))
          // Don't auto-show result, let user choose to view it
        }
      } catch {
        localStorage.removeItem('ai_audit_data')
      }
    }
  }, [])

  const handleGenerate = async () => {
    if (!biz.trim()) return
    setStep('loading'); setError(''); setIsOffline(false)

    try {
      const res = await fetch('/api/ai-audit', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ url, biz, goal }),
      })
      const data = await res.json()

      if (!data.success) {
        throw new Error(data.message || 'Failed to generate audit')
      }

      const auditResult = data.result
      setResult(auditResult)
      setParsedSections(parseAuditResult(auditResult))
      setStep('result')
      setConfettiTrigger(true)

      // Save to localStorage
      const auditData: AuditData = {
        url,
        biz,
        goal,
        result: auditResult,
        timestamp: Date.now()
      }
      localStorage.setItem('ai_audit_data', JSON.stringify(auditData))

      // Track if it was a fallback response
      if (data.fallback) {
        setIsOffline(true)
      }

    } catch (err: any) {
      setError(err.message || 'Unable to generate audit. Please try again or contact us directly.')
      setStep('form')
    }
  }

  const handleReset = () => {
    setStep('form')
    setResult('')
    setParsedSections([])
    setError('')
    setIsOffline(false)
    // Keep the form data for convenience, just clear the result
  }

  const handleClearAll = () => {
    setStep('form')
    setUrl('')
    setBiz('')
    setGoal('')
    setResult('')
    setParsedSections([])
    setError('')
    setIsOffline(false)
    localStorage.removeItem('ai_audit_data')
  }

  const handleCopyAudit = () => {
    if (typeof window === 'undefined' || !navigator.clipboard) return
    navigator.clipboard.writeText(result)
      .then(() => {
        // Could add toast notification here
        console.log('[AI-AUDIT] Audit copied to clipboard')
      })
      .catch((err) => {
        console.error('[AI-AUDIT] Failed to copy:', err)
      })
  }

  // Check if there's a saved audit to restore
  const hasSavedAudit = () => {
    if (typeof window === 'undefined') return false
    const saved = localStorage.getItem('ai_audit_data')
    if (!saved) return false
    try {
      const data: AuditData = JSON.parse(saved)
      return Date.now() - data.timestamp < 7 * 24 * 60 * 60 * 1000
    } catch {
      return false
    }
  }

  return (
    <>
      <Confetti trigger={confettiTrigger} />
      <section className="py-[100px] px-6 md:px-[60px]" style={{ background: 'var(--obsidian-2)' }}>
        <div className="max-w-[1200px] mx-auto">
          <div className="text-center max-w-[620px] mx-auto mb-14">
            <SectionLabel center>AI-Powered</SectionLabel>
            <h2 className="text-[clamp(2rem,4vw,3.2rem)] font-semibold mt-2 mb-4" style={{ color: '#E8E3D8' }}>
              Get Your Free AI Growth Audit
            </h2>
            <p className="font-light leading-[1.75]" style={{ color: '#6B6860' }}>
              Powered by Google Gemini AI. Enter your business details and get an instant, personalised
              growth audit in seconds — no email required.
            </p>
          </div>

          <div className="max-w-[900px] mx-auto">
            {step === 'form' && (
              <div className="rounded-[24px] p-10 md:p-12" style={{ background: 'var(--obsidian-3)', border: '1px solid rgba(232,227,216,0.06)' }}>
                {/* Restore previous audit banner */}
                {hasSavedAudit() && result && (
                  <div className="mb-6 p-4 rounded-[16px]" style={{ background: 'rgba(201,169,110,0.08)', border: '1px solid rgba(201,169,110,0.2)' }}>
                    <div className="flex items-center justify-between flex-wrap gap-3">
                      <div>
                        <p className="text-[0.85rem] font-medium" style={{ color: '#C9A96E' }}>
                          ✨ You have a saved audit from your previous session
                        </p>
                        <p className="text-[0.75rem] mt-1" style={{ color: '#6B6860' }}>
                          Business: {biz.substring(0, 50)}{biz.length > 50 ? '...' : ''}
                        </p>
                      </div>
                      <button
                        onClick={() => { setParsedSections(parseAuditResult(result)); setStep('result'); }}
                        className="px-4 py-2 rounded-full text-[0.8rem] font-medium transition-all cursor-pointer"
                        style={{ background: 'rgba(201,169,110,0.15)', color: '#C9A96E', border: '1px solid rgba(201,169,110,0.3)' }}
                      >
                        View Saved Audit →
                      </button>
                    </div>
                  </div>
                )}

                <div className="flex flex-col gap-5">
                  <div>
                    <label className="block text-[0.72rem] font-bold uppercase tracking-[0.1em] mb-2" style={{ color: '#6B6860' }}>Website URL (optional)</label>
                    <input
                      type="text"
                      placeholder="https://yourwebsite.com"
                      value={url}
                      onChange={e => setUrl(e.target.value)}
                      className="form-input"
                    />
                  </div>
                  <div>
                    <label className="block text-[0.72rem] font-bold uppercase tracking-[0.1em] mb-2" style={{ color: '#6B6860' }}>Describe Your Business *</label>
                    <textarea
                      rows={3}
                      placeholder="e.g. We sell premium skincare products online to South African women aged 25–45. We have a Shopify store but struggle with traffic and conversion..."
                      value={biz}
                      onChange={e => setBiz(e.target.value)}
                      className="form-input resize-none"
                    />
                  </div>
                  <div>
                    <label className="block text-[0.72rem] font-bold uppercase tracking-[0.1em] mb-2" style={{ color: '#6B6860' }}>Your #1 Growth Goal</label>
                    <input
                      type="text"
                      placeholder="e.g. Double monthly revenue in 6 months"
                      value={goal}
                      onChange={e => setGoal(e.target.value)}
                      className="form-input"
                    />
                  </div>
                  {error && (
                    <div className="p-3 rounded-[12px]" style={{ background: 'rgba(239,68,68,0.1)', border: '1px solid rgba(239,68,68,0.2)' }}>
                      <p className="text-red-400 text-[0.82rem]">⚠️ {error}</p>
                    </div>
                  )}
                  <button
                    onClick={handleGenerate}
                    disabled={!biz.trim() || biz.trim().length < 5}
                    className="w-full py-4 rounded-full font-semibold text-[0.88rem] transition-all hover:-translate-y-0.5 disabled:opacity-30 disabled:cursor-not-allowed cursor-pointer"
                    style={{ background: 'var(--gold)', color: 'var(--obsidian)', boxShadow: '0 0 30px rgba(201,169,110,0.15)' }}
                  >
                    {!biz.trim() ? 'Enter Business Description' : biz.trim().length < 5 ? 'Description too short (min 5 chars)' : 'Generate My Free Audit ✨'}
                  </button>
                  <p className="text-[0.72rem] text-center tracking-[0.04em]" style={{ color: '#3A3830' }}>Powered by Google Gemini AI · Instant results · No email required · Saved locally</p>
                </div>
              </div>
            )}

            {step === 'loading' && (
              <div className="rounded-[24px] p-16 text-center" style={{ background: 'var(--obsidian-3)', border: '1px solid rgba(232,227,216,0.06)' }}>
                <div className="w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-6" style={{ background: 'rgba(201,169,110,0.08)', border: '1px solid rgba(201,169,110,0.15)' }}>
                  <div className="w-7 h-7 border-2 border-t-transparent rounded-full animate-spin" style={{ borderColor: 'var(--gold)', borderTopColor: 'transparent' }} />
                </div>
                <h3 className="font-cormorant text-[1.7rem] font-semibold mb-3" style={{ color: '#E8E3D8' }}>Analysing Your Business...</h3>
                <p className="text-[0.85rem]" style={{ color: '#6B6860' }}>Our AI is crafting personalised growth recommendations</p>
                <div className="mt-6 flex justify-center gap-2">
                  <span className="w-2 h-2 rounded-full animate-pulse" style={{ background: 'var(--gold)', animationDelay: '0ms' }}></span>
                  <span className="w-2 h-2 rounded-full animate-pulse" style={{ background: 'var(--gold)', animationDelay: '150ms' }}></span>
                  <span className="w-2 h-2 rounded-full animate-pulse" style={{ background: 'var(--gold)', animationDelay: '300ms' }}></span>
                </div>
              </div>
            )}

            {step === 'result' && (
              <div>
                {/* Input Summary Card */}
                <div className="rounded-[20px] p-6 mb-5" style={{ background: 'rgba(201,169,110,0.05)', border: '1px solid rgba(201,169,110,0.15)' }}>
                  <div className="flex items-center justify-between mb-4">
                    <h4 className="text-[0.8rem] font-bold uppercase tracking-[0.1em]" style={{ color: '#C9A96E' }}>📋 Audit Input Summary</h4>
                    {isOffline && (
                      <span className="px-3 py-1 rounded-full text-[0.7rem] font-medium" style={{ background: 'rgba(201,169,110,0.15)', color: '#C9A96E' }}>
                        ⚡ Offline Mode
                      </span>
                    )}
                  </div>
                  <div className="grid md:grid-cols-3 gap-4 text-[0.85rem]">
                    {url && (
                      <div>
                        <span className="block text-[0.7rem] uppercase tracking-[0.08em] mb-1" style={{ color: '#6B6860' }}>Website</span>
                        <span style={{ color: '#E8E3D8' }}>{url}</span>
                      </div>
                    )}
                    <div className={url ? '' : 'md:col-span-2'}>
                      <span className="block text-[0.7rem] uppercase tracking-[0.08em] mb-1" style={{ color: '#6B6860' }}>Business</span>
                      <span style={{ color: '#E8E3D8' }}>{biz}</span>
                    </div>
                    {goal && (
                      <div>
                        <span className="block text-[0.7rem] uppercase tracking-[0.08em] mb-1" style={{ color: '#6B6860' }}>Goal</span>
                        <span style={{ color: '#E8E3D8' }}>{goal}</span>
                      </div>
                    )}
                  </div>
                </div>

                {/* Structured Audit Results */}
                <div className="rounded-[24px] p-8 md:p-10 mb-5" style={{ background: 'var(--obsidian-3)', border: '1px solid rgba(232,227,216,0.06)' }}>
                  <div className="flex items-center gap-3 mb-8 pb-5" style={{ borderBottom: '1px solid rgba(232,227,216,0.05)' }}>
                    <div className="w-10 h-10 rounded-full flex items-center justify-center text-[0.85rem] font-bold" style={{ background: 'rgba(201,169,110,0.12)', color: '#C9A96E' }}>AI</div>
                    <div>
                      <div className="font-semibold text-[0.95rem]" style={{ color: '#E8E3D8' }}>Your Personal Growth Audit</div>
                      <div className="text-[0.75rem]" style={{ color: '#6B6860' }}>Generated by Google Gemini AI · Eve-Tech-Studio</div>
                    </div>
                  </div>

                  {parsedSections.length > 0 ? (
                    <div className="space-y-6">
                      {parsedSections.map((section, index) => (
                        <div key={index} className="p-5 rounded-[16px]" style={{ background: 'rgba(232,227,216,0.03)', border: '1px solid rgba(232,227,216,0.05)' }}>
                          <h4 className="text-[1rem] font-semibold mb-3 flex items-center gap-2" style={{ color: '#C9A96E' }}>
                            <span>{section.emoji}</span>
                            <span>{section.title}</span>
                          </h4>
                          <ul className="space-y-2">
                            {section.content.map((item, itemIndex) => (
                              <li key={itemIndex} className="flex items-start gap-2 text-[0.87rem] leading-[1.7]" style={{ color: '#B8B2A8' }}>
                                <span style={{ color: '#C9A96E' }}>•</span>
                                <span>{item}</span>
                              </li>
                            ))}
                          </ul>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="whitespace-pre-wrap text-[0.87rem] leading-[1.85] font-light" style={{ color: '#B8B2A8' }}>{result}</div>
                  )}
                </div>

                {/* Action Buttons */}
                <div className="flex flex-col sm:flex-row gap-3">
                  <Link href="/contact" className="btn-primary flex-1 text-center text-[0.86rem] py-4">
                    Book a Full Strategy Session →
                  </Link>
                  <button
                    onClick={handleCopyAudit}
                    className="flex-1 py-4 rounded-full text-[0.86rem] font-medium transition-all cursor-pointer hover:border-[rgba(201,169,110,0.3)]"
                    style={{ border: '1px solid rgba(232,227,216,0.08)', color: '#6B6860' }}
                  >
                    📋 Copy Audit
                  </button>
                  <button
                    onClick={handleReset}
                    className="flex-1 py-4 rounded-full text-[0.86rem] font-medium transition-all cursor-pointer hover:border-[rgba(201,169,110,0.3)]"
                    style={{ border: '1px solid rgba(232,227,216,0.08)', color: '#6B6860' }}
                  >
                    Generate Another
                  </button>
                </div>

                {/* Clear Data Option */}
                <div className="mt-4 text-center">
                  <button
                    onClick={handleClearAll}
                    className="text-[0.75rem] transition-colors hover:text-red-400"
                    style={{ color: '#6B6860' }}
                  >
                    Clear all saved data
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </section>
    </>
  )
}
