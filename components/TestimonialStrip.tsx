import Image from 'next/image'
import type { Testimonial } from '@/config/site'
import { siteConfig } from '@/config/site'

type TestimonialStripProps = {
  testimonials: Testimonial[]
}

export default function TestimonialStrip({ testimonials }: TestimonialStripProps) {
  if (!siteConfig.proofEnabled || !siteConfig.testimonialsEnabled || testimonials.length === 0) {
    return null
  }

  return (
    <section
      aria-label="Client testimonials"
      className="py-16 px-6 md:px-[60px]"
      style={{ background: 'var(--obsidian-2)' }}
    >
      <div className="max-w-[1200px] mx-auto grid gap-5 md:grid-cols-2">
        {testimonials.map((testimonial) => (
          <figure
            key={`${testimonial.name}-${testimonial.company}`}
            className="rounded-[20px] p-8"
            style={{ background: 'var(--obsidian-3)', border: '1px solid rgba(201,169,110,0.12)' }}
          >
            <blockquote className="font-cormorant text-[1.35rem] leading-[1.55]" style={{ color: '#E8E3D8' }}>
              “{testimonial.quote}”
            </blockquote>
            <figcaption className="mt-6 flex items-center gap-3">
              {testimonial.logo && (
                <Image
                  src={testimonial.logo}
                  alt={`${testimonial.company} logo`}
                  width={36}
                  height={36}
                  unoptimized
                  className="h-9 w-9 rounded-full object-contain"
                />
              )}
              <div>
                <div className="text-sm font-semibold" style={{ color: '#E8E3D8' }}>{testimonial.name}</div>
                <div className="text-xs" style={{ color: '#6B6860' }}>
                  {testimonial.role}, {testimonial.company}
                </div>
              </div>
            </figcaption>
          </figure>
        ))}
      </div>
    </section>
  )
}
