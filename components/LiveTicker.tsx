import { siteConfig } from '@/config/site'

export default function LiveTicker() {
  const availabilityMonth = siteConfig.availabilityMonth?.trim()
  if (!availabilityMonth) return null

  return (
    <p
      className="inline-flex items-center gap-3 rounded-full px-4 py-2.5 max-w-full text-[0.78rem] font-medium"
      style={{ background: 'var(--obsidian-3)', border: '1px solid rgba(201,169,110,0.12)', color: '#B8B2A8' }}
    >
      <span className="w-2 h-2 rounded-full shrink-0" aria-hidden="true" style={{ background: '#C9A96E' }} />
      Availability: {availabilityMonth}
    </p>
  )
}
