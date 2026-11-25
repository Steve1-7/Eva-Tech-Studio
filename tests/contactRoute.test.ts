import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { NextRequest } from 'next/server'
import { POST } from '../app/api/contact/route'

const envKeys = ['RESEND_API_KEY', 'RESEND_EMAIL_RESEND_API_KEY', 'RESEND_EMAIL_DOMAIN', 'CONTACT_TO_EMAIL'] as const
const previousEnv = new Map<(typeof envKeys)[number], string | undefined>()

const validPayload = {
  name: 'Endpoint smoke test',
  email: 'contact-smoke-test@example.com',
  phone: '',
  country: 'South Africa',
  service: 'Website Development',
  budget: 'R 5 000–R 15 000',
  timeline: 'Within 2–4 weeks',
  message: 'Automated contact endpoint test payload.',
  website: '',
}

function makeRequest(payload: unknown, ip: string) {
  return new NextRequest('http://localhost:3000/api/contact', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', 'x-real-ip': ip },
    body: JSON.stringify(payload),
  })
}

beforeEach(() => {
  for (const key of envKeys) previousEnv.set(key, process.env[key])
  process.env.RESEND_API_KEY = 'mock-resend-key-for-tests'
  process.env.RESEND_EMAIL_DOMAIN = 'eva-tech-studio.com'
  process.env.CONTACT_TO_EMAIL = 'info@eva-tech-studio.com'
})

afterEach(() => {
  for (const key of envKeys) {
    const value = previousEnv.get(key)
    if (value === undefined) delete process.env[key]
    else process.env[key] = value
  }
  vi.unstubAllGlobals()
  vi.restoreAllMocks()
})

describe('POST /api/contact', () => {
  it('accepts real select values, optional phone, and an empty honeypot', async () => {
    const fetchMock = vi.fn().mockResolvedValue(new Response(JSON.stringify({ id: 'email-id' }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    }))
    vi.stubGlobal('fetch', fetchMock)

    const response = await POST(makeRequest(validPayload, '192.0.2.1'))
    const body = await response.json()
    const emailRequest = JSON.parse(String(fetchMock.mock.calls[0]?.[1]?.body))

    expect(response.status).toBe(200)
    expect(body.success).toBe(true)
    expect(fetchMock).toHaveBeenCalledTimes(2)
    expect(emailRequest.from).toBe('Eva Tech Studio <contact@eva-tech-studio.com>')
    expect(emailRequest.to).toEqual(['info@eva-tech-studio.com'])
    expect(emailRequest.text).toContain('Within 2–4 weeks')
  })

  it('returns a provider error code and logs a recoverable lead without the API key', async () => {
    const fetchMock = vi.fn().mockResolvedValue(new Response(JSON.stringify({
      name: 'invalid_from_address',
      message: 'The sender address is not allowed.',
    }), {
      status: 403,
      headers: { 'Content-Type': 'application/json' },
    }))
    vi.stubGlobal('fetch', fetchMock)
    const errorLog = vi.spyOn(console, 'error').mockImplementation(() => undefined)

    const response = await POST(makeRequest(validPayload, '192.0.2.2'))
    const body = await response.json()
    const loggedText = errorLog.mock.calls.flat().join(' ')

    expect(response.status).toBe(502)
    expect(body.code).toBe('provider_rejected')
    expect(body.fallbackStored).toBe('server_log')
    expect(loggedText).toContain('statusCode')
    expect(loggedText).toContain('The sender address is not allowed.')
    expect(loggedText).toContain('Endpoint smoke test')
    expect(loggedText).not.toContain('mock-resend-key-for-tests')
  })
})
