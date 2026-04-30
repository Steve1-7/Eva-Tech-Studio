import Link from 'next/link'

export default function Footer() {
  return (
    <footer style={{ background: 'var(--obsidian)', borderTop: '1px solid rgba(201,169,110,0.1)' }} className="pt-16 pb-8 px-6 md:px-[60px]">
      <style>{`
        .footer-social-link { border: 1px solid rgba(232,227,216,0.07); color: #6B6860; width:36px; height:36px; border-radius:50%; display:flex; align-items:center; justify-content:center; font-size:0.85rem; transition: all 0.2s; text-decoration:none; }
        .footer-social-link:hover { border-color: rgba(201,169,110,0.4); color: #C9A96E; }
        .footer-link { display:block; font-size:0.875rem; margin-bottom:0.75rem; color:#6B6860; text-decoration:none; transition:color 0.2s; }
        .footer-link:hover { color:#C9A96E; }
        .footer-legal-link { font-size:0.72rem; color:#3A3830; text-decoration:none; transition:color 0.2s; }
        .footer-legal-link:hover { color:#6B6860; }
      `}</style>

      <div className="max-w-[1200px] mx-auto">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-12 mb-12">

          {/* Brand */}
          <div className="lg:col-span-2">
            <Link href="/" className="flex items-center gap-2 mb-4">
              <img src="/logo5.webp" alt="Eve-Tech-Studio" className="h-16 w-auto max-w-[210px] object-contain" />
            </Link>
            <p className="text-sm leading-relaxed max-w-xs" style={{ color: '#6B6860' }}>
              A growth-driven digital agency helping ambitious brands scale through smart marketing,
              powerful technology, and systems that compound.
            </p>
            <div className="flex gap-3 mt-6">
              <a href="https://www.linkedin.com/company/111078966" target="_blank" rel="noopener noreferrer" className="footer-social-link" title="LinkedIn">in</a>
              <a href="https://github.com/Steve1-7" target="_blank" rel="noopener noreferrer" className="footer-social-link" title="GitHub">gh</a>
              <a href="mailto:stevezuluu@gmail.com" className="footer-social-link" title="Email">@</a>
            </div>
          </div>

          {/* Services */}
          <div>
            <h4 className="font-syne text-[0.68rem] font-bold tracking-[0.14em] uppercase mb-5" style={{ color: '#3A3830' }}>
              Services
            </h4>
            {['Social Media', 'Paid Advertising', 'Web Development', 'E-commerce', 'SEO & Automation'].map(s => (
              <Link key={s} href="/services" className="footer-link">{s}</Link>
            ))}
          </div>

          {/* Company */}
          <div>
            <h4 className="font-syne text-[0.68rem] font-bold tracking-[0.14em] uppercase mb-5" style={{ color: '#3A3830' }}>
              Company
            </h4>
            {[['About Us', '/about'], ['Case Studies', '/work'], ['Pricing', '/pricing'], ['Contact', '/contact']].map(([label, href]) => (
              <Link key={label} href={href} className="footer-link">{label}</Link>
            ))}
            <div className="mt-5 pt-5" style={{ borderTop: '1px solid rgba(232,227,216,0.05)' }}>
              <p className="text-sm" style={{ color: '#6B6860' }}>stevezuluu@gmail.com</p>
              <p className="text-sm mt-1" style={{ color: '#6B6860' }}>Johannesburg, South Africa</p>
            </div>
          </div>
        </div>

        <div className="gold-line mb-6" />

        <div className="flex flex-col sm:flex-row items-center justify-between gap-3">
          <p className="text-[0.72rem] tracking-[0.04em]" style={{ color: '#3A3830' }}>
            © 2026 Eve-Tech-Studio. All rights reserved.
          </p>
          <div className="flex gap-5">
            <a href="#" className="footer-legal-link">Privacy Policy</a>
            <a href="#" className="footer-legal-link">Terms of Service</a>
          </div>
        </div>
      </div>
    </footer>
  )
}
