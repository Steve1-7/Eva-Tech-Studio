import Link from 'next/link'

export default function Sidebar({ className = '' }: { className?: string }) {
  return (
    <aside className={`w-full md:w-64 p-4 ${className}`}>
      <div className="mb-6">
        <div className="text-sm font-semibold" style={{ color: '#E8E3D8' }}>Client Portal</div>
        <div className="text-xs" style={{ color: '#6B6860' }}>Overview</div>
      </div>

      <nav className="space-y-2">
        <Link href="/client-portal" className="block py-2 px-3 rounded hover:bg-[rgba(201,169,110,0.06)]" style={{ color: '#E8E3D8' }}>Dashboard</Link>
        <a className="block py-2 px-3 rounded hover:bg-[rgba(201,169,110,0.06)]" style={{ color: '#E8E3D8' }}>Metrics</a>
        <a className="block py-2 px-3 rounded hover:bg-[rgba(201,169,110,0.06)]" style={{ color: '#E8E3D8' }}>Reports</a>
        <a className="block py-2 px-3 rounded hover:bg-[rgba(201,169,110,0.06)]" style={{ color: '#E8E3D8' }}>Support</a>
      </nav>
    </aside>
  )
}
