import AIProjectConsultant from '@/components/AIProjectConsultant'

export const metadata = {
  title: 'AI Project Consultant — Eva Tech Studio',
  description: 'Interactive AI-powered project consultation and recommended solutions.'
}

export default function Page() {
  return (
    <main className="max-w-5xl mx-auto py-16 px-6">
      <header className="mb-8">
        <h1 className="text-3xl font-bold">AI Project Consultant</h1>
        <p className="text-gray-600 mt-2">Get an interactive project summary, recommended solution, investment breakdown and next steps from our AI consultant.</p>
      </header>

      <AIProjectConsultant />
    </main>
  )
}
