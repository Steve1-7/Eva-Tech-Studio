import Button from '../../../components/Button'

export const metadata = {
  title: 'Gold Coast Mining Review — Case Study',
  description: 'Case study: Gold Coast Mining Review — Mining news & advertising platform',
}

export default function Page() {
  return (
    <main className="max-w-6xl mx-auto py-16 px-6">
      <header className="mb-12">
        <h1 className="text-4xl font-bold mb-4">Gold Coast Mining Review</h1>
        <p className="text-gray-600">Mining News & Advertising Platform — Website, CMS, SEO, Advertising</p>
        <div className="mt-6">
          <Button href="https://www.goldcoastminingreview.com" variant="outline">Visit the site</Button>
        </div>
      </header>

      <section className="grid gap-8 lg:grid-cols-3 mb-12">
        <div className="lg:col-span-2">
          <h2 className="text-2xl font-semibold mb-3">Project Overview</h2>
          <p className="text-gray-700 mb-4">Gold Coast Mining Review engaged Eva Tech Studio to build a modern publishing platform that supports news, magazine downloads, and advertising opportunities with enterprise-grade SEO and responsive design.</p>

          <h3 className="text-lg font-medium mt-6">Client Goals</h3>
          <ul className="list-disc list-inside text-gray-700">
            <li>Launch a fast, searchable news site for mining industry audiences.</li>
            <li>Provide downloadable magazines and gated content.</li>
            <li>Offer advertising placements and sponsorship management.</li>
            <li>Achieve strong SEO and performance on mobile.</li>
          </ul>

          <h3 className="text-lg font-medium mt-6">Challenges</h3>
          <ul className="list-disc list-inside text-gray-700">
            <li>Migrate legacy content without losing SEO value.</li>
            <li>Support ad inventory and reporting for sponsors.</li>
            <li>Maintain fast page loads on media-heavy pages.</li>
          </ul>

          <h3 className="text-lg font-medium mt-6">Solutions Delivered</h3>
          <ul className="list-disc list-inside text-gray-700">
            <li>Custom CMS workflows for editorial publishing and magazine downloads.</li>
            <li>Ad slots with flexible placements and tracking.</li>
            <li>Responsive, accessibility-minded UI and image optimization pipeline.</li>
            <li>SEO migration plan, structured data, and canonical mappings.</li>
          </ul>
        </div>

        <aside className="bg-gray-50 p-6 rounded-md">
          <h4 className="font-semibold mb-2">Technology Stack</h4>
          <p className="text-sm text-gray-700 mb-4">Next.js, TypeScript, Tailwind CSS, Supabase, Vercel, Google Analytics, Lighthouse optimisations</p>

          <h4 className="font-semibold mb-2">Business Impact</h4>
          <ul className="text-sm text-gray-700 list-disc list-inside">
            <li>Improved organic traffic by X% (client metric)</li>
            <li>Increased ad revenue with better inventory management</li>
            <li>Reduced page load times and improved engagement</li>
          </ul>
        </aside>
      </section>

      <section className="mb-12">
        <h2 className="text-2xl font-semibold mb-4">Key Features</h2>
        <ul className="grid gap-3 md:grid-cols-2">
          <li className="p-4 border rounded">News Publishing System with tagging & authors</li>
          <li className="p-4 border rounded">Magazine downloads & gated content</li>
          <li className="p-4 border rounded">Advertising placements & reporting</li>
          <li className="p-4 border rounded">SEO & structured data implementation</li>
          <li className="p-4 border rounded">Responsive and accessible design</li>
          <li className="p-4 border rounded">Editorial review & scheduling workflows</li>
        </ul>
      </section>

      <section className="mb-12">
        <h2 className="text-2xl font-semibold mb-4">Screenshots</h2>
        <p className="text-gray-700 mb-4">Placeholder images — add production screenshots to public/portfolio/goldcoast/.</p>
        <div className="grid gap-4 md:grid-cols-3">
          <div className="h-40 bg-gray-100 rounded" />
          <div className="h-40 bg-gray-100 rounded" />
          <div className="h-40 bg-gray-100 rounded" />
        </div>
      </section>

      <section>
        <h2 className="text-2xl font-semibold mb-4">Results Achieved</h2>
        <p className="text-gray-700">A measurable uplift in organic visibility, simplified ad management, and a modern publishing foundation enabling ongoing growth.</p>
      </section>
    </main>
  )
}
