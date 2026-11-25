import AIProjectConsultant from '@/components/AIProjectConsultant'
import { createPageMetadata } from '@/lib/metadata'
import { BreadcrumbJsonLd } from '@/components/site/JsonLd'

export const metadata = createPageMetadata({
  title: 'AI Project Consultant',
  description: 'Interactive AI-powered project consultation and recommended solutions.',
  path: '/ai-consultant',
})

export default function Page() {
  return (
    <main className="max-w-5xl mx-auto py-16 px-6">
      <BreadcrumbJsonLd items={[{ name: 'Home', path: '/' }, { name: 'AI tools', path: '/ai' }, { name: 'Project Consultant', path: '/ai-consultant' }]} />
      <header className="mb-8">
        <h1 className="text-3xl font-bold">AI Project Consultant</h1>
        <p className="text-gray-600 mt-2">Get an interactive project summary, recommended solution, investment breakdown and next steps from our AI consultant.</p>
      </header>

      <AIProjectConsultant />
    </main>
  )
}
