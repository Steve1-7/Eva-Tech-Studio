'use client'
import React from 'react'
import { apiFetch } from '@/lib/api'

export default function CaseStudyDownload({ title, content, filename }: { title: string; content: string; filename?: string }) {
  const handleDownload = async () => {
    try {
      const finalFilename = filename || `${title.replace(/\s+/g, '-').toLowerCase()}.pdf`
      const res = await apiFetch('/api/export-pdf', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ title, content, filename: finalFilename, contentType: 'case-study' })
      })

      if (!res.ok) {
        const data = await res.json().catch(() => ({}))
        throw new Error(data?.error || 'Failed to generate PDF')
      }

      const blob = await res.blob()
      const url = URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url
      a.download = finalFilename
      document.body.appendChild(a)
      a.click()
      document.body.removeChild(a)
      URL.revokeObjectURL(url)
    } catch (err: any) {
      console.error('[CASE STUDY] Download error:', err)
      alert('Failed to download case study. Please try again or contact info@eva-tech-studio.com')
    }
  }

  return (
    <button onClick={handleDownload} className="mt-6 btn-primary">
      📥 Download Case Study
    </button>
  )
}
