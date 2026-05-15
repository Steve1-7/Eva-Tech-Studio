'use client'
import { useState } from 'react'
import { submitPackageInquiry } from '@/lib/forms'

export default function PricingModal({ selectedPackage, onClose }:{selectedPackage:string,onClose:()=>void}){
  const [fullName,setFullName]=useState('')
  const [company,setCompany]=useState('')
  const [email,setEmail]=useState('')
  const [phone,setPhone]=useState('')
  const [goals,setGoals]=useState('')
  const [budget,setBudget]=useState('')
  const [notes,setNotes]=useState('')
  const [loading,setLoading]=useState(false)
  const [success,setSuccess]=useState(false)
  const [error,setError]=useState('')

  const handleSubmit = async (e:React.FormEvent) => {
    e.preventDefault()
    setLoading(true); setError('')
    try{
      await submitPackageInquiry({
        fullName, companyName: company, email, phone, selectedPackage, projectGoals: goals, budgetRange: budget, additionalNotes: notes
      })
      setSuccess(true)
    }catch(err:any){
      setError(err?.message||'Submission failed')
    }finally{setLoading(false)}
  }

  if(success) return (
    <div className="p-6">
      <h3 className="font-semibold text-lg" style={{ color: '#E8E3D8' }}>Thanks — we received your inquiry</h3>
      <p style={{ color: '#6B6860' }} className="mt-2">We'll review and be in touch within 24 hours.</p>
      <div className="mt-4"><button className="btn-primary" onClick={onClose}>Close</button></div>
    </div>
  )

  return (
    <div className="p-6 max-w-lg">
      <h3 className="font-semibold mb-2" style={{ color: '#E8E3D8' }}>Selected Package: {selectedPackage}</h3>
      <form onSubmit={handleSubmit} className="flex flex-col gap-3">
        <input required placeholder="Full Name" value={fullName} onChange={e=>setFullName(e.target.value)} className="form-input" />
        <input placeholder="Company Name" value={company} onChange={e=>setCompany(e.target.value)} className="form-input" />
        <input required placeholder="Email" value={email} onChange={e=>setEmail(e.target.value)} className="form-input" />
        <input placeholder="Phone" value={phone} onChange={e=>setPhone(e.target.value)} className="form-input" />
        <input placeholder="Budget Range" value={budget} onChange={e=>setBudget(e.target.value)} className="form-input" />
        <textarea placeholder="Project Goals" value={goals} onChange={e=>setGoals(e.target.value)} className="form-input" rows={3} />
        <textarea placeholder="Additional Notes" value={notes} onChange={e=>setNotes(e.target.value)} className="form-input" rows={3} />
        {error && <div className="text-red-400">{error}</div>}
        <div className="flex gap-3 mt-2">
          <button className="btn-primary" disabled={loading}>{loading? 'Sending…':'Send Inquiry'}</button>
          <button type="button" className="btn-outline" onClick={onClose}>Cancel</button>
        </div>
      </form>
    </div>
  )
}
