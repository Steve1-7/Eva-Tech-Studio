'use client'
import { useState } from 'react'
import SectionLabel from './SectionLabel'
import Link from 'next/link'
import Confetti from './Confetti'

export default function AIAuditWidget() {
  const [step, setStep] = useState<'form'|'loading'|'result'>('form')
  const [url, setUrl] = useState('')
  const [biz, setBiz] = useState('')
  const [goal, setGoal] = useState('')
  const [result, setResult] = useState('')
  const [error, setError] = useState('')
  const [confettiTrigger, setConfettiTrigger] = useState(false)

  const handleGenerate = async () => {
    if (!biz.trim()) return
    setStep('loading'); setError('')
    try {
      const res = await fetch('https://api.anthropic.com/v1/messages', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          model: 'claude-sonnet-4-20250514',
          max_tokens: 1000,
          system: `You are a senior digital growth strategist at Eve-Tech-Studio. Write concise, expert growth audits. Format with emoji section headers. Be specific and action-oriented. Under 350 words.`,
          messages: [{ role: 'user', content: `Write a growth audit for:\nWebsite: ${url||'Not provided'}\nBusiness: ${biz}\nGoal: ${goal||'Increase revenue'}\n\nSections:\n🔍 CURRENT GAPS\n🚀 TOP 3 GROWTH OPPORTUNITIES\n📊 QUICK WINS (next 30 days)\n💡 LONG-TERM STRATEGY\n⚡ EVE-TECH-STUDIO RECOMMENDATION` }],
        }),
      })
      const data = await res.json()
      if (data.error) throw new Error(data.error.message)
      const text = data.content?.find((b: any) => b.type === 'text')?.text || ''
      setResult(text); setStep('result'); setConfettiTrigger(true)
    } catch {
      setError('Unable to generate audit. Please try again or contact us directly.')
      setStep('form')
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
            Powered by Claude AI. Enter your business details and get an instant, personalised
            growth audit in seconds — no email required.
          </p>
        </div>

        <div className="max-w-[760px] mx-auto">
          {step === 'form' && (
            <div className="rounded-[24px] p-10 md:p-12" style={{ background: 'var(--obsidian-3)', border: '1px solid rgba(232,227,216,0.06)' }}>
              <div className="flex flex-col gap-5">
                <div>
                  <label className="block text-[0.72rem] font-bold uppercase tracking-[0.1em] mb-2" style={{ color: '#6B6860' }}>Website URL (optional)</label>
                  <input type="text" placeholder="https://yourwebsite.com" value={url} onChange={e => setUrl(e.target.value)} className="form-input" />
                </div>
                <div>
                  <label className="block text-[0.72rem] font-bold uppercase tracking-[0.1em] mb-2" style={{ color: '#6B6860' }}>Describe Your Business *</label>
                  <textarea rows={3} placeholder="e.g. We sell premium skincare products online to South African women aged 25–45. We have a Shopify store but struggle with traffic and conversion..." value={biz} onChange={e => setBiz(e.target.value)} className="form-input resize-none" />
                </div>
                <div>
                  <label className="block text-[0.72rem] font-bold uppercase tracking-[0.1em] mb-2" style={{ color: '#6B6860' }}>Your #1 Growth Goal</label>
                  <input type="text" placeholder="e.g. Double monthly revenue in 6 months" value={goal} onChange={e => setGoal(e.target.value)} className="form-input" />
                </div>
                {error && <p className="text-red-400 text-[0.82rem]">{error}</p>}
                <button onClick={handleGenerate} disabled={!biz.trim()}
                  className="w-full py-4 rounded-full font-semibold text-[0.88rem] transition-all hover:-translate-y-0.5 disabled:opacity-30 disabled:cursor-not-allowed cursor-pointer"
                  style={{ background: 'var(--gold)', color: 'var(--obsidian)', boxShadow: '0 0 30px rgba(201,169,110,0.15)' }}>
                  Generate My Free Audit ✨
                </button>
                <p className="text-[0.72rem] text-center tracking-[0.04em]" style={{ color: '#3A3830' }}>Powered by Claude AI · Instant results · No email required</p>
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
            </div>
          )}

          {step === 'result' && (
            <div>
              <div className="rounded-[24px] p-10 md:p-12 mb-5" style={{ background: 'var(--obsidian-3)', border: '1px solid rgba(232,227,216,0.06)' }}>
                <div className="flex items-center gap-3 mb-6 pb-5" style={{ borderBottom: '1px solid rgba(232,227,216,0.05)' }}>
                  <div className="w-9 h-9 rounded-full flex items-center justify-center text-[0.78rem] font-bold" style={{ background: 'rgba(201,169,110,0.12)', color: '#C9A96E' }}>AI</div>
                  <div>
                    <div className="font-semibold text-[0.88rem]" style={{ color: '#E8E3D8' }}>Your Personal Growth Audit</div>
                    <div className="text-[0.72rem]" style={{ color: '#6B6860' }}>Generated by Claude AI · Eve-Tech-Studio</div>
                  </div>
                </div>
                <div className="whitespace-pre-wrap text-[0.87rem] leading-[1.85] font-light" style={{ color: '#B8B2A8' }}>{result}</div>
              </div>
              <div className="flex flex-col sm:flex-row gap-4">
                <Link href="/contact" className="btn-primary flex-1 text-center text-[0.86rem] py-4">Book a Full Strategy Session →</Link>
                <button onClick={() => { setStep('form'); setResult('') }}
                  className="flex-1 py-4 rounded-full text-[0.86rem] font-medium transition-all cursor-pointer hover:border-[rgba(201,169,110,0.3)]"
                  style={{ border: '1px solid rgba(232,227,216,0.08)', color: '#6B6860' }}>
                  Generate Another Audit
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
