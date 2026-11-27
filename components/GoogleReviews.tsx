'use client'

import { useState } from 'react'
import Script from 'next/script'
import SectionLabel from '@/components/SectionLabel'

const ELFSIGHT_SCRIPT_ID = 'elfsight-platform-script'

export default function GoogleReviews() {
  const [scriptFailed, setScriptFailed] = useState(false)

  if (scriptFailed) return null

  return (
    <section className="w-full py-[100px] px-6 md:px-[60px]" style={{ background: 'var(--obsidian)' }} aria-labelledby="google-reviews-heading">
      <div className="container mx-auto px-4 max-w-[1200px]">
        <div className="text-center max-w-[620px] mx-auto mb-16">
          <SectionLabel center>Social Proof</SectionLabel>
          <h2 id="google-reviews-heading" className="text-[clamp(2rem,4vw,3.4rem)] font-semibold mt-2 mb-4" style={{ color: '#E8E3D8' }}>
            Reviews from our Google profile.
          </h2>
          <p className="font-light leading-[1.75]" style={{ color: '#A1A1AA' }}>
            Reviews are embedded from our connected Google Business Profile and are not reproduced as hand-written testimonials.
          </p>
        </div>

        <Script
          id={ELFSIGHT_SCRIPT_ID}
          src="https://elfsightcdn.com/platform.js"
          strategy="lazyOnload"
          onError={() => setScriptFailed(true)}
        />

        <div
          className="rounded-[20px] p-4 sm:p-6 md:p-8 w-full card google-reviews-widget"
          style={{
            background: 'var(--obsidian-3)',
            border: '1px solid rgba(109,40,217,0.25)',
          }}
        >
          <div
            className="elfsight-app-152a6634-438f-4d16-ba16-b37a5e4faf1b w-full min-h-[520px]"
            data-elfsight-app-lazy
          />
        </div>
      </div>
    </section>
  )
}
