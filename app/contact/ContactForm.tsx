'use client'
import { useState } from 'react'
import Link from 'next/link'
import SectionLabel from '@/components/SectionLabel'
import ScrollReveal from '@/components/ScrollReveal'
import MagneticButton from '@/components/MagneticButton'
import Confetti from '@/components/Confetti'

const services = ['Social Media Marketing','Paid Ads Management','Website Development','E-commerce Development','SEO Optimisation','Business Automation / CRM','Full Growth Partnership','Other / Not Sure Yet']
const budgets = ['Under R10,000/month','R10,000 – R25,000/month','R25,000 – R50,000/month','R50,000+/month','One-time project']

export default function ContactPage() {
  const [submitted, setSubmitted] = useState(false)
  const [confettiTrigger, setConfettiTrigger] = useState(false)
  const [form, setForm] = useState({ firstName:'',lastName:'',email:'',phone:'',service:'',budget:'',message:'' })

  if (submitted) return (
    <>
      <Confetti trigger={confettiTrigger} />
      <div className="min-h-screen flex items-center justify-center px-6" style={{ background: 'var(--obsidian)' }}>
        <div className="text-center max-w-md animate-fade-up">
          <div className="text-[3.5rem] mb-6">🎉</div>
          <h2 className="font-cormorant text-[2.5rem] font-semibold mb-4" style={{ color: '#E8E3D8' }}>Message Sent!</h2>
          <p className="leading-[1.7] mb-8" style={{ color: '#6B6860' }}>Thanks for reaching out! We will be in touch within 24 hours.</p>
          <MagneticButton><Link href="/" className="btn-primary">Back to Home</Link></MagneticButton>
        </div>
      </div>
    </>
  )

  return (
    <>
      <section className="pt-[180px] pb-[100px] px-6 md:px-[60px] relative overflow-hidden text-center" style={{ background: 'var(--obsidian)' }}>
        <div className="aurora-bg" style={{ opacity: 0.3 }}><div className="aurora-orb aurora-orb-1" /><div className="aurora-orb aurora-orb-2" /></div>
        <div className="max-w-[800px] mx-auto relative z-10">
          <SectionLabel center>Get In Touch</SectionLabel>
          <h1 className="text-[clamp(2.6rem,6vw,5rem)] font-semibold mt-2 mb-5" style={{ color: '#E8E3D8' }}>
            Let's Build Your<br /><span className="text-shimmer italic">Growth Engine</span>
          </h1>
          <p className="font-light leading-[1.8] text-[1.05rem]" style={{ color: '#6B6860' }}>Whether you are ready to start or just exploring, we would love to hear about your business.</p>
        </div>
      </section>

      <section className="py-[100px] px-6 md:px-[60px]" style={{ background: 'var(--obsidian-2)' }}>
        <div className="max-w-[1200px] mx-auto grid md:grid-cols-[1fr_1.5fr] gap-20 items-start">
          <ScrollReveal direction="left">
            <div>
              <SectionLabel>Contact Details</SectionLabel>
              <h3 className="font-cormorant text-[1.8rem] font-semibold mt-1 mb-5" style={{ color: '#E8E3D8' }}>Free Audit — No Strings Attached</h3>
              <p className="text-[0.9rem] leading-[1.8] mb-8" style={{ color: '#6B6860' }}>Book a 30-minute strategy session. We will audit your digital presence, identify your growth levers, and share a custom roadmap — completely free.</p>
              {[['📧','stevezuluu@gmail.com'],['📞','+27 (0) 11 123 4567'],['📍','Johannesburg, South Africa'],['🕐','Mon–Fri, 8am–6pm SAST']].map(([icon,text]) => (
                <div key={text} className="flex items-center gap-4 mb-4">
                  <div className="w-10 h-10 rounded-[10px] flex items-center justify-center shrink-0 text-lg" style={{ background: 'var(--obsidian-4)', border: '1px solid rgba(201,169,110,0.12)' }}>{icon}</div>
                  <span className="text-[0.87rem]" style={{ color: '#B8B2A8' }}>{text}</span>
                </div>
              ))}
              <div className="mt-8 p-6 rounded-[16px]" style={{ background: 'rgba(201,169,110,0.05)', border: '1px solid rgba(201,169,110,0.12)' }}>
                <p className="font-semibold text-[0.88rem] mb-3" style={{ color: '#E8E3D8' }}>What happens next?</p>
                <div className="text-[0.82rem] leading-[1.9]" style={{ color: '#6B6860' }}>1. We review your details within 24 hours<br />2. Schedule a free 30-min discovery call<br />3. Receive a custom growth proposal<br />4. You decide — zero pressure, ever</div>
              </div>
            </div>
          </ScrollReveal>

          <ScrollReveal direction="right">
            <div className="rounded-[24px] p-10 md:p-12" style={{ background: 'var(--obsidian-3)', border: '1px solid rgba(232,227,216,0.06)' }}>
              <h3 className="font-cormorant text-[1.6rem] font-semibold mb-1" style={{ color: '#E8E3D8' }}>Send Us a Message</h3>
              <p className="text-[0.85rem] mb-8" style={{ color: '#6B6860' }}>Or book a call directly below</p>
              <form onSubmit={e => { e.preventDefault(); setConfettiTrigger(true); setSubmitted(true) }} className="flex flex-col gap-4">
                <div className="grid sm:grid-cols-2 gap-4">
                  {[['firstName','First Name','Your first name'],['lastName','Last Name','Your last name']].map(([k,l,p]) => (
                    <div key={k} className="flex flex-col gap-2">
                      <label className="text-[0.72rem] font-bold uppercase tracking-[0.08em]" style={{ color: '#6B6860' }}>{l}</label>
                      <input type="text" required placeholder={p} className="form-input" value={form[k as keyof typeof form]} onChange={e => setForm({...form,[k]:e.target.value})} />
                    </div>
                  ))}
                </div>
                {[['email','Email','your@email.com','email'],['phone','Phone','+27 (0) ___','tel']].map(([k,l,p,t]) => (
                  <div key={k} className="flex flex-col gap-2">
                    <label className="text-[0.72rem] font-bold uppercase tracking-[0.08em]" style={{ color: '#6B6860' }}>{l}</label>
                    <input type={t} required={k==='email'} placeholder={p} className="form-input" value={form[k as keyof typeof form]} onChange={e => setForm({...form,[k]:e.target.value})} />
                  </div>
                ))}
                <div className="flex flex-col gap-2">
                  <label className="text-[0.72rem] font-bold uppercase tracking-[0.08em]" style={{ color: '#6B6860' }}>Service</label>
                  <select className="form-input" value={form.service} onChange={e => setForm({...form,service:e.target.value})}>
                    <option value="">Select a service...</option>
                    {services.map(s => <option key={s}>{s}</option>)}
                  </select>
                </div>
                <div className="flex flex-col gap-2">
                  <label className="text-[0.72rem] font-bold uppercase tracking-[0.08em]" style={{ color: '#6B6860' }}>Monthly Budget</label>
                  <select className="form-input" value={form.budget} onChange={e => setForm({...form,budget:e.target.value})}>
                    <option value="">Select a range...</option>
                    {budgets.map(b => <option key={b}>{b}</option>)}
                  </select>
                </div>
                <div className="flex flex-col gap-2">
                  <label className="text-[0.72rem] font-bold uppercase tracking-[0.08em]" style={{ color: '#6B6860' }}>Your Goals</label>
                  <textarea rows={4} placeholder="What are your biggest growth challenges?" className="form-input resize-y" value={form.message} onChange={e => setForm({...form,message:e.target.value})} />
                </div>
                <button type="submit" className="btn-primary w-full justify-center mt-2 py-4 text-[0.9rem]">
                  Send Message & Book a Call →
                </button>
                <p className="text-[0.72rem] text-center tracking-[0.03em]" style={{ color: '#3A3830' }}>We respond within 24 hours. No spam, ever.</p>
              </form>
            </div>
          </ScrollReveal>
        </div>
      </section>
    </>
  )
}
