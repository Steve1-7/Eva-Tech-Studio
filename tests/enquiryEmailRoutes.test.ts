import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { NextRequest } from 'next/server'

const resendHarness = vi.hoisted(() => ({
  send: vi.fn(),
  construct: vi.fn(),
}))

vi.mock('server-only', () => ({}))
vi.mock('resend', () => ({
  Resend: class {
    emails = { send: resendHarness.send }

    constructor(apiKey: string) {
      resendHarness.construct(apiKey)
    }
  },
}))

import { getEnquiryRecipients, primaryEnquiryRecipient } from '../lib/server/enquiry-email'
import { POST as postChat } from '../app/api/chat/route'
import { POST as postNegotiation } from '../app/api/send-negotiation/route'

const previousApiKeys = {
  RESEND_EMAIL_RESEND_API_KEY: process.env.RESEND_EMAIL_RESEND_API_KEY,
  RESEND_API_KEY: process.env.RESEND_API_KEY,
}

function makeRequest(path: string, payload: unknown) {
  return new NextRequest(`http://localhost:3000${path}`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  })
}

beforeEach(() => {
  process.env.RESEND_EMAIL_RESEND_API_KEY = 'mock-integration-resend-key'
  process.env.RESEND_API_KEY = 'mock-legacy-resend-key'
  resendHarness.send.mockReset().mockResolvedValue({ data: { id: 'mock-email-id' }, error: null })
  resendHarness.construct.mockReset()
})

afterEach(() => {
  if (previousApiKeys.RESEND_EMAIL_RESEND_API_KEY === undefined) delete process.env.RESEND_EMAIL_RESEND_API_KEY
  else process.env.RESEND_EMAIL_RESEND_API_KEY = previousApiKeys.RESEND_EMAIL_RESEND_API_KEY
  if (previousApiKeys.RESEND_API_KEY === undefined) delete process.env.RESEND_API_KEY
  else process.env.RESEND_API_KEY = previousApiKeys.RESEND_API_KEY
  vi.restoreAllMocks()
})

describe('enquiry email routing', () => {
  it('sends booking-oriented chat requests to the configured recipients', async () => {
    const response = await postChat(makeRequest('/api/chat', {
      email: 'chat-lead@example.com',
      message: 'I need to schedule a booking consultation with a person.',
    }))
    const body = await response.json()
    const email = resendHarness.send.mock.calls[0]?.[0] as { to: string[]; html: string }

    expect(response.status).toBe(200)
    expect(body.success).toBe(true)
    expect(resendHarness.send).toHaveBeenCalledTimes(1)
    expect(email.to).toEqual(getEnquiryRecipients('chat'))
    expect(email.to[0]).toBe(primaryEnquiryRecipient)
    expect(email.html).toContain('chat-lead@example.com')
    expect(email.html).toContain('booking consultation')
    expect(resendHarness.construct).toHaveBeenCalledWith('mock-integration-resend-key')
  })

  it('sends quote negotiation details to the configured recipients', async () => {
    const response = await postNegotiation(makeRequest('/api/send-negotiation', {
      name: 'Quote Lead',
      email: 'quote-lead@example.com',
      businessName: 'Aster Labs',
      budget: 'R30,000',
      timeline: 'Within six weeks',
      message: 'We need a customer portal.',
      quoteResult: 'Draft scope for a customer portal.',
      services: ['Web application', 'API integration'],
      tier: 'growth',
    }))
    const body = await response.json()
    const email = resendHarness.send.mock.calls[0]?.[0] as { to: string[]; html: string; reply_to: string }

    expect(response.status).toBe(200)
    expect(body.success).toBe(true)
    expect(email.to).toEqual(getEnquiryRecipients('negotiation'))
    expect(email.to[0]).toBe(primaryEnquiryRecipient)
    expect(email.reply_to).toBe('quote-lead@example.com')
    expect(email.html).toContain('Quote Lead')
    expect(email.html).toContain('quote-lead@example.com')
    expect(email.html).toContain('Aster Labs')
    expect(email.html).toContain('R30,000')
    expect(email.html).toContain('Within six weeks')
    expect(email.html).toContain('We need a customer portal.')
    expect(email.html).toContain('Draft scope for a customer portal.')
    expect(email.html).toContain('Web application, API integration')
    expect(resendHarness.construct).toHaveBeenCalledWith('mock-integration-resend-key')
  })
})
