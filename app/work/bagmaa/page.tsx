import type { Metadata } from 'next'
import Link from 'next/link'
import SectionLabel from '@/components/SectionLabel'

export const metadata: Metadata = {
  title: 'Bagmaa — Case Study | Eva-Tech-Studio',
  description: 'A responsive, installable customer ordering and booking web app with a Supabase-backed administration dashboard.',
  openGraph: {
    title: 'Bagmaa — Case Study | Eva-Tech-Studio',
    description: 'Customer ordering, ticket sales, car-wash bookings, and operations management in one web app.',
  },
}

const customerFeatures = [
  'Responsive, mobile-friendly customer application',
  'PWA installation capability on supported browsers and devices',
  'Customer registration, login, and profile details',
  'Food and product ordering',
  'Ticket purchasing',
  'Car-wash service and package bookings',
  'Order tracking and customer order history',
]

const adminFeatures = [
  'Secure administrative dashboard',
  'View registered users and newly created accounts',
  'Add, edit, and delete products and product categories',
  'Manage car-wash packages, add-ons, and package options',
  'Track food orders, ticket sales, and car-wash bookings',
  'Monitor customer activity and manage application content',
]

export default function BagmaaCaseStudy() {
  return (
    <main style={{ background: 'var(--obsidian)', color: '#E8E3D8' }}>
      <section className="px-6 pb-16 pt-[180px] md:px-[60px]">
        <div className="mx-auto max-w-[1100px]">
          <SectionLabel>Bagmaa · Web Application</SectionLabel>
          <div className="mt-4 grid gap-8 md:grid-cols-[1fr_auto] md:items-end">
            <div>
              <h1 className="font-cormorant text-[clamp(2.8rem,6vw,5rem)] font-semibold leading-tight">Food, tickets, and bookings in one place.</h1>
              <p className="mt-5 max-w-[720px] text-base leading-8" style={{ color: '#B8B2A8' }}>
                Bagmaa is a responsive customer web app that brings product and food orders, ticket purchases, and car-wash bookings together with account management and order tracking.
              </p>
            </div>
            <a href="https://bagmaa.vercel.app/" target="_blank" rel="noopener noreferrer" className="btn-primary whitespace-nowrap px-6 py-3">Visit Bagmaa ↗</a>
          </div>
          <div className="mt-10 flex flex-wrap gap-3" aria-label="Project technologies">
            {['Responsive Web App', 'PWA', 'Supabase', 'Vercel'].map(item => <span key={item} className="border px-3 py-2 text-sm" style={{ borderColor: 'rgba(232,227,216,0.16)', color: '#B8B2A8' }}>{item}</span>)}
          </div>
        </div>
      </section>

      <section className="border-y px-6 py-14 md:px-[60px]" style={{ background: 'var(--obsidian-2)', borderColor: 'rgba(232,227,216,0.08)' }}>
        <div className="mx-auto grid max-w-[1100px] gap-10 md:grid-cols-2">
          <div>
            <SectionLabel>Customer Application</SectionLabel>
            <h2 className="mt-3 font-cormorant text-3xl font-semibold">A single account for everyday tasks</h2>
            <ul className="mt-6 space-y-3 text-sm leading-6" style={{ color: '#B8B2A8' }}>
              {customerFeatures.map(feature => <li key={feature} className="flex gap-3"><span style={{ color: '#C9A96E' }}>—</span>{feature}</li>)}
            </ul>
          </div>
          <div>
            <SectionLabel>Admin Dashboard</SectionLabel>
            <h2 className="mt-3 font-cormorant text-3xl font-semibold">Tools for day-to-day operations</h2>
            <ul className="mt-6 space-y-3 text-sm leading-6" style={{ color: '#B8B2A8' }}>
              {adminFeatures.map(feature => <li key={feature} className="flex gap-3"><span style={{ color: '#C9A96E' }}>—</span>{feature}</li>)}
            </ul>
          </div>
        </div>
      </section>

      <section className="px-6 py-16 md:px-[60px]">
        <div className="mx-auto grid max-w-[1100px] gap-10 md:grid-cols-[1fr_0.8fr]">
          <div>
            <SectionLabel>Technical Delivery</SectionLabel>
            <h2 className="mt-3 font-cormorant text-3xl font-semibold">Built for customers on mobile and desktop</h2>
            <p className="mt-5 max-w-[680px] text-sm leading-7" style={{ color: '#B8B2A8' }}>
              The project covers frontend and backend development, database integration, authentication, ordering and booking business logic, administration tools, deployment, responsive optimisation, testing, and refinement. Supabase hosts the backend and database, with the live web app deployed at Vercel.
            </p>
            <p className="mt-4 max-w-[680px] text-sm leading-7" style={{ color: '#8B877F' }}>
              Customers can use the app in a mobile or desktop browser. PWA installation is available on browsers and operating systems that support installing web apps; it is not a native app-store download.
            </p>
          </div>
          <aside className="border-l-2 pl-6" style={{ borderColor: '#C9A96E' }}>
            <h3 className="font-syne text-xs font-bold uppercase tracking-wider">Technology & Hosting</h3>
            <dl className="mt-5 space-y-4 text-sm">
              <div><dt style={{ color: '#8B877F' }}>Application</dt><dd className="mt-1">Responsive web app with PWA capability</dd></div>
              <div><dt style={{ color: '#8B877F' }}>Backend & database</dt><dd className="mt-1">Supabase</dd></div>
              <div><dt style={{ color: '#8B877F' }}>Deployment</dt><dd className="mt-1">Vercel</dd></div>
              <div><dt style={{ color: '#8B877F' }}>Core systems</dt><dd className="mt-1">Authentication, ordering, ticket sales, bookings, and admin management</dd></div>
            </dl>
          </aside>
        </div>
      </section>

      <section className="border-t px-6 py-12 md:px-[60px]" style={{ borderColor: 'rgba(232,227,216,0.08)', background: 'var(--obsidian-2)' }}>
        <div className="mx-auto flex max-w-[1100px] flex-wrap items-center justify-between gap-5">
          <Link href="/work" className="text-sm" style={{ color: '#C9A96E' }}>← All projects</Link>
          <a href="https://wa.me/27676283210?text=Hi%2C%20I%27d%20like%20to%20discuss%20a%20web%20app%20project." target="_blank" rel="noopener noreferrer" className="btn-primary px-6 py-3">Discuss a similar project</a>
        </div>
      </section>
    </main>
  )
}