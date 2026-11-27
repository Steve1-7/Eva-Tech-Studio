'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { LIVE_MARKETS } from '@/config/markets'

const SUGGESTION_COOKIE = 'ets-market-suggestion'
const DISMISSED_COOKIE = 'ets-market-dismissed'

function readCookie(name: string) {
  return document.cookie
    .split('; ')
    .find((cookie) => cookie.startsWith(`${name}=`))
    ?.split('=')[1]
}

export default function MarketSuggestionBanner() {
  const pathname = usePathname()
  const [suggestedMarket, setSuggestedMarket] = useState<string | null>(null)

  useEffect(() => {
    if (readCookie(DISMISSED_COOKIE)) return
    const value = readCookie(SUGGESTION_COOKIE)
    const market = LIVE_MARKETS.find((candidate) => candidate.slug === value)
    setSuggestedMarket(market?.slug ?? null)
  }, [pathname])

  const market = LIVE_MARKETS.find((candidate) => candidate.slug === suggestedMarket)
  if (!market || pathname === market.path) return null

  function dismissSuggestion() {
    const secure = window.location.protocol === 'https:' ? '; Secure' : ''
    document.cookie = `${DISMISSED_COOKIE}=1; Path=/; Max-Age=2592000; SameSite=Lax${secure}`
    setSuggestedMarket(null)
  }

  return (
    <aside className="ets-market-suggestion" aria-label="Market page suggestion" aria-live="polite">
      <div>
        <p className="ets-eyebrow">Local market page</p>
        <p>Would you like to view our {market.name} page?</p>
        <Link href={market.path} className="ets-text-link">View {market.name} information <span aria-hidden="true">↗</span></Link>
      </div>
      <button type="button" onClick={dismissSuggestion} aria-label="Dismiss market page suggestion">Dismiss</button>
    </aside>
  )
}
