import type { Metadata } from 'next'
import Link from 'next/link'
import SectionLabel from '@/components/SectionLabel'
import ScrollReveal from '@/components/ScrollReveal'
import MagneticButton from '@/components/MagneticButton'

export const metadata: Metadata = {
  title: 'Privacy Policy | Eva-Tech-Studio',
  description: 'How we collect, use, and protect your personal information.',
}

const sections = [
  {
    title: 'Information We Collect',
    content: [
      'Personal Information: When you contact us or use our services, we may collect your name, email address, phone number, and company details.',
      'Usage Data: We automatically collect information about how you interact with our website, including pages visited, time spent, and device information.',
      'Communication Data: Any messages, emails, or inquiries you send us are stored to help us provide better support and service.',
    ],
  },
  {
    title: 'How We Use Your Information',
    content: [
      'To deliver our services and communicate with you about projects, updates, and support.',
      'To improve our website, services, and user experience through analytics and feedback.',
      'To send you relevant updates, insights, and marketing communications (only with your consent).',
      'To comply with legal obligations and protect our rights and interests.',
    ],
  },
  {
    title: 'Data Sharing & Third Parties',
    content: [
      'We do not sell, trade, or rent your personal information to third parties. Ever.',
      'We work with trusted service providers (hosting, analytics, email) who help us operate our business. These partners are bound by confidentiality agreements.',
      'We may disclose information when required by law or to protect our legal rights.',
    ],
  },
  {
    title: 'Data Security',
    content: [
      'We implement industry-standard security measures including encryption, secure servers, and access controls.',
      'Regular security audits and updates help us maintain a secure environment for your data.',
      'While we take every precaution, no online transmission is 100% secure. We work continuously to protect your information.',
    ],
  },
  {
    title: 'Cookies & Tracking',
    content: [
      'We use cookies to enhance your browsing experience, remember preferences, and analyze website traffic.',
      'You can control cookies through your browser settings. Disabling cookies may affect some website features.',
      'We use analytics tools to understand how visitors use our site and improve functionality.',
    ],
  },
  {
    title: 'Your Rights',
    content: [
      'Access: Request a copy of the personal data we hold about you.',
      'Correction: Update or correct inaccurate information.',
      'Deletion: Request deletion of your data (subject to legal retention requirements).',
      'Opt-out: Unsubscribe from marketing communications at any time.',
    ],
  },
]

export default function PrivacyPage() {
  return (
    <>
      {/* Hero */}
      <section className="pt-[180px] pb-[80px] px-6 md:px-[60px] relative overflow-hidden" style={{ background: 'var(--obsidian)' }}>
        <div className="aurora-bg" style={{ opacity: 0.25 }}>
          <div className="aurora-orb aurora-orb-1" />
          <div className="aurora-orb aurora-orb-2" />
        </div>
        <div className="max-w-[800px] mx-auto relative z-10">
          <ScrollReveal>
            <SectionLabel center>Legal</SectionLabel>
          </ScrollReveal>
          <ScrollReveal delay={80}>
            <h1 className="text-[clamp(2.6rem,6vw,4rem)] font-semibold mt-4 mb-6 text-center" style={{ color: '#E8E3D8' }}>
              Privacy Policy
            </h1>
          </ScrollReveal>
          <ScrollReveal delay={160}>
            <p className="font-light leading-[1.8] text-[1.05rem] max-w-[600px] mx-auto text-center" style={{ color: '#6B6860' }}>
              We believe transparency builds trust. This policy explains how we collect, use, and protect your information when you use our website and services.
            </p>
          </ScrollReveal>
          <ScrollReveal delay={240}>
            <p className="text-[0.8rem] mt-6 text-center" style={{ color: '#3A3830' }}>
              Last updated: January 2026
            </p>
          </ScrollReveal>
        </div>
      </section>

      {/* Content */}
      <section className="py-[80px] px-6 md:px-[60px]" style={{ background: 'var(--obsidian-2)' }}>
        <div className="max-w-[800px] mx-auto">
          {/* Introduction */}
          <ScrollReveal>
            <div className="p-8 md:p-10 rounded-[20px] mb-8" style={{ background: 'var(--obsidian-3)', border: '1px solid rgba(201,169,110,0.1)' }}>
              <h2 className="font-cormorant text-[1.6rem] font-semibold mb-4" style={{ color: '#E8E3D8' }}>
                Our Commitment to You
              </h2>
              <p className="leading-[1.8]" style={{ color: '#6B6860' }}>
                At Eva-Tech-Studio, your privacy is fundamental to how we operate. We are committed to protecting your personal information and being transparent about our data practices. This policy applies to all information collected through our website, services, and communications.
              </p>
            </div>
          </ScrollReveal>

          {/* Sections */}
          <div className="space-y-6">
            {sections.map((section, i) => (
              <ScrollReveal key={section.title} delay={i * 60}>
                <div className="p-8 rounded-[16px]" style={{ background: 'var(--obsidian-3)', border: '1px solid rgba(232,227,216,0.06)' }}>
                  <h3 className="font-semibold text-[1.1rem] mb-4" style={{ color: '#E8E3D8' }}>
                    {section.title}
                  </h3>
                  <ul className="space-y-3">
                    {section.content.map((item, j) => (
                      <li key={j} className="flex gap-3" style={{ color: '#6B6860' }}>
                        <span className="text-[#C9A96E] flex-shrink-0">•</span>
                        <span className="leading-[1.7] text-[0.95rem]">{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </ScrollReveal>
            ))}
          </div>

          {/* Contact */}
          <ScrollReveal delay={400}>
            <div className="mt-12 p-8 md:p-10 rounded-[20px] text-center" style={{ background: 'var(--obsidian-4)', border: '1px solid rgba(201,169,110,0.15)' }}>
              <h3 className="font-cormorant text-[1.5rem] font-semibold mb-3" style={{ color: '#E8E3D8' }}>
                Questions About Your Privacy?
              </h3>
              <p className="leading-[1.7] mb-6 max-w-[480px] mx-auto" style={{ color: '#6B6860' }}>
                If you have any questions about this Privacy Policy or how we handle your data, please reach out.
              </p>
              <MagneticButton>
                <a 
                  href="mailto:stevezuluu@gmail.com" 
                  className="btn-primary text-[0.9rem] px-6 py-3 inline-block"
                >
                  Contact Us →
                </a>
              </MagneticButton>
              <p className="text-[0.8rem] mt-4" style={{ color: '#6B6860' }}>
                stevezuluu@gmail.com
              </p>
            </div>
          </ScrollReveal>
        </div>
      </section>
    </>
  )
}
