import type { Metadata } from 'next'
import Link from 'next/link'
import SectionLabel from '@/components/SectionLabel'
import ScrollReveal from '@/components/ScrollReveal'
import MagneticButton from '@/components/MagneticButton'

export const metadata: Metadata = {
  title: 'Terms of Service | Eva-Tech-Studio',
  description: 'The terms and conditions governing your use of our website and services.',
}

const sections = [
  {
    title: 'Services Overview',
    content: [
      'Eva-Tech-Studio provides digital marketing, web development, branding, and growth consulting services.',
      'Specific service terms, deliverables, and timelines are defined in individual client agreements.',
      'We reserve the right to modify, suspend, or discontinue any aspect of our services with reasonable notice.',
    ],
  },
  {
    title: 'User Responsibilities',
    content: [
      'Provide accurate and complete information when engaging with our services.',
      'Use our website and services lawfully and in compliance with all applicable regulations.',
      'Respect intellectual property rights and do not reproduce, distribute, or exploit our content without permission.',
      'Maintain confidentiality of any account credentials and notify us immediately of unauthorized access.',
    ],
  },
  {
    title: 'Intellectual Property',
    content: [
      'All content on this website — including text, graphics, logos, and code — is the property of Eva-Tech-Studio unless otherwise stated.',
      'Client projects: Upon full payment, clients receive rights to final deliverables as specified in their service agreement.',
      'We retain the right to showcase completed work in our portfolio unless explicitly agreed otherwise.',
      'Unauthorized use, reproduction, or distribution of our content is strictly prohibited.',
    ],
  },
  {
    title: 'Limitation of Liability',
    content: [
      'Our services are provided on an "as available" basis. While we strive for excellence, we cannot guarantee uninterrupted or error-free service.',
      'We are not liable for indirect, incidental, or consequential damages arising from the use of our services.',
      'Our total liability is limited to the amount paid for the specific service in question.',
      'Clients are responsible for reviewing and approving all deliverables before implementation.',
    ],
  },
  {
    title: 'Termination',
    content: [
      'Either party may terminate a service agreement with notice as defined in the specific contract terms.',
      'We reserve the right to suspend or terminate access to our website for violations of these terms.',
      'Upon termination, clients retain rights to completed deliverables as per their agreement, while we retain rights to our methodologies and proprietary tools.',
    ],
  },
  {
    title: 'Changes to Terms',
    content: [
      'We may update these Terms of Service periodically to reflect changes in our practices or legal requirements.',
      'Significant changes will be communicated via email or website notice with reasonable advance notice.',
      'Continued use of our services after changes constitutes acceptance of the updated terms.',
      'We encourage you to review these terms regularly to stay informed.',
    ],
  },
]

export default function TermsPage() {
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
              Terms of Service
            </h1>
          </ScrollReveal>
          <ScrollReveal delay={160}>
            <p className="font-light leading-[1.8] text-[1.05rem] max-w-[600px] mx-auto text-center" style={{ color: '#6B6860' }}>
              By using our website and services, you agree to these terms. We have written them in clear language so you understand your rights and responsibilities.
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
                Agreement to Terms
              </h2>
              <p className="leading-[1.8] mb-4" style={{ color: '#6B6860' }}>
                These Terms of Service govern your access to and use of the Eva-Tech-Studio website, services, and any related applications. By accessing or using our services, you agree to be bound by these terms.
              </p>
              <p className="leading-[1.8]" style={{ color: '#6B6860' }}>
                If you are using our services on behalf of a business or organization, you represent that you have authority to bind that entity to these terms.
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
                Have Questions?
              </h3>
              <p className="leading-[1.7] mb-6 max-w-[480px] mx-auto" style={{ color: '#6B6860' }}>
                If you have any questions about these Terms of Service, please contact us. We are happy to clarify anything.
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
