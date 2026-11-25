'use client'

import { useEffect, useState } from 'react'
import type { FormEvent } from 'react'

const demoReplies = [
  'Thanks. In a real project, I would answer from the studio’s approved service and support information.',
  'That is a useful starting point. A project brief helps us recommend the right approach and next step.',
  'This is a sample response from the on-page demo, not a live assistant or a support channel.',
]

export function ChatbotDemo() {
  const [messages, setMessages] = useState([
    { from: 'studio', text: 'Hi. What are you looking to build?' },
  ])
  const [draft, setDraft] = useState('')

  function sendMessage(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    const text = draft.trim()
    if (!text) return
    setMessages((current) => [
      ...current,
      { from: 'visitor', text },
      { from: 'studio', text: demoReplies[(current.length - 1) % demoReplies.length] },
    ])
    setDraft('')
  }

  return (
    <div className="ets-demo-window">
      <div className="ets-demo-bar">
        <span className="ets-status-dot" />
        <span>Eva assistant</span>
        <span className="ets-demo-label">DEMO</span>
      </div>
      <div className="ets-chat-messages" aria-live="polite">
        {messages.map((message, index) => (
          <p key={`${index}-${message.from}`} className={`ets-chat-bubble ${message.from}`}>
            {message.text}
          </p>
        ))}
      </div>
      <form className="ets-chat-form" onSubmit={sendMessage}>
        <label className="sr-only" htmlFor="chat-demo-message">Try the chatbot demo</label>
        <input
          id="chat-demo-message"
          value={draft}
          onChange={(event) => setDraft(event.target.value)}
          placeholder="Type a sample question"
          maxLength={240}
        />
        <button type="submit" aria-label="Send demo message">Send</button>
      </form>
      <p className="ets-demo-caption">Sample interface · replies are scripted, not AI-generated.</p>
    </div>
  )
}

export function TradingBotDemo() {
  return (
    <div className="ets-trading-demo">
      <div className="ets-demo-bar">
        <span>Strategy monitor</span>
        <span className="ets-demo-label">SIMULATION</span>
      </div>
      <div className="ets-trading-summary">
        <div><span>Account</span><strong>Paper trading</strong></div>
        <div><span>Environment</span><strong>Test data</strong></div>
        <div><span>Live orders</span><strong>Disabled</strong></div>
      </div>
      <div className="ets-chart" role="img" aria-label="Illustrative sample trading chart">
        {[35, 44, 38, 58, 52, 70, 63, 76, 68, 87, 74, 92].map((height, index) => (
          <span key={index} style={{ height: `${height}%` }} />
        ))}
      </div>
      <p className="ets-demo-caption">Illustrative UI only · no exchange connection, signals, or performance claims.</p>
    </div>
  )
}

const markets = [
  { city: 'Johannesburg', zone: 'Africa/Johannesburg', label: 'SAST' },
  { city: 'London', zone: 'Europe/London', label: 'UK' },
  { city: 'New York', zone: 'America/New_York', label: 'ET' },
  { city: 'Singapore', zone: 'Asia/Singapore', label: 'SGT' },
]

export function MarketTimes() {
  const [now, setNow] = useState<Date | null>(null)

  useEffect(() => {
    const interval = window.setInterval(() => setNow(new Date()), 60_000)
    setNow(new Date())
    return () => window.clearInterval(interval)
  }, [])

  return (
    <>
      <div className="ets-markets-grid">
        {markets.map((market) => (
          <div className="ets-market" key={market.city}>
            <span>{market.city}</span>
            <strong>
              {now
                ? new Intl.DateTimeFormat('en-GB', {
                    timeZone: market.zone,
                    hour: '2-digit',
                    minute: '2-digit',
                  }).format(now)
                : 'Local time'}
            </strong>
            <small>{market.label}</small>
          </div>
        ))}
      </div>
      <p className="ets-market-note">Sample time zones for global collaboration, not a list of current client locations.</p>
    </>
  )
}
