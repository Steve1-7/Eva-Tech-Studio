import Image from 'next/image'
import { SHOW_TESTIMONIALS } from '@/config/site'

export type Testimonial = {
  quote: string
  name: string
  role: string
  company: string
  logo?: string
}

export default function TestimonialsStrip({ testimonials }: { testimonials: Testimonial[] }) {
  if (!SHOW_TESTIMONIALS || testimonials.length === 0) return null

  return (
    <section className="ets-quote-marquee ets-testimonials" aria-label="Client testimonials">
      <div className="ets-container ets-testimonial-grid">
        {testimonials.map((testimonial) => (
          <figure className="ets-testimonial-card" key={`${testimonial.name}-${testimonial.company}`}>
            <blockquote>{testimonial.quote}</blockquote>
            <figcaption>
              {testimonial.logo && (
                <Image src={testimonial.logo} alt={`${testimonial.company} logo`} width={96} height={32} unoptimized />
              )}
              <span>{testimonial.name}, {testimonial.role} at {testimonial.company}</span>
            </figcaption>
          </figure>
        ))}
      </div>
    </section>
  )
}
