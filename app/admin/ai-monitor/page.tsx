import dynamic from 'next/dynamic'
import React from 'react'

const AdminAIMonitor = dynamic(() => import('@/components/AdminAIMonitor'), { ssr: false })

export const metadata = {
  title: 'Admin — AI Monitoring'
}

export default function Page() {
  return (
    <main className="max-w-5xl mx-auto py-10 px-6">
      <h1 className="text-3xl font-semibold mb-6">AI Monitoring</h1>
      <AdminAIMonitor />
    </main>
  )
}
