import { randomUUID } from 'node:crypto'
import { NextRequest, NextResponse } from 'next/server'
import { z } from 'zod'

export const runtime = 'nodejs'
export const maxDuration = 10

const requestWindowMs = 15 * 60 * 1000
const requestLimit = 5
const requestsByIp = new Map<string, { startedAt: number; count: number }>()
const resendApiUrl = 'https://api.resend.com/emails'
const primaryEmailTimeoutMs = 6500
const autoReplyTimeoutMs = 1500
const defaultRecipient = 'info@eva-tech-studio.com'
const recoveryEmail = 'info@eva-tech-studio.com or stevezuluu@gmail.com'
const contactBodySchema = z.object({
  name: z.string().trim().max(160).optional(),
  firstName: z.string().trim().max(80).optional(),
  lastName: z.string().trim().max(80).optional(),
  email: z.string().trim().min(1).max(254).email(),
  phone: z.string().trim().max(50).optional(),
  country: z.string().trim().max(100).optional(),
  service: z.string().trim().max(120).optional(),
  budget: z.string().trim().max(80).optional(),
  timeline: z.string().trim().max(80).optional(),
  message: z.string().trim().min(1).max(5000),
  website: z.string().trim().max(200).optional(),
}).superRefine((body, context) => {
  const name = body.name || [body.firstName, body.lastName].filter(Boolean).join(' ')
  if (!name) context.addIssue({ code: 'custom', path: ['name'], message: 'Name is required.' })
  if (name.length > 160) context.addIssue({ code: 'custom', path: ['name'], message: 'Name is too long.' })
})

type ContactSubmission = z.infer<typeof contactBodySchema>
type ContactFailureCode = 'provider_rejected' | 'config_missing' | 'timeout'
type ProviderFailure = {
  statusCode: number | null
  providerCode: string | null
  message: string
}
type EmailResult =
  | { ok: true; statusCode: number }
  | ({ ok: false } & ProviderFailure)

class DeliveryTimeoutError extends Error {
  constructor() {
    super('Resend request exceeded its delivery deadline.')
    this.name = 'DeliveryTimeoutError'
  }
}

function escapeHtml(value: string): string {
  return value
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;')
}

function getClientKey(request: NextRequest): string {
  const trustedIp = request.headers.get('x-real-ip')
  const forwardedIp = request.headers.get('x-forwarded-for')?.split(',')[0]?.trim()
  return trustedIp || forwardedIp || 'unknown'
}

function isRateLimited(key: string): boolean {
  const now = Date.now()
  requestsByIp.forEach((entry, storedKey) => {
    if (now - entry.startedAt >= requestWindowMs) requestsByIp.delete(storedKey)
  })
  if (requestsByIp.size >= 5000 && !requestsByIp.has(key)) {
    let oldestKey: string | null = null
    requestsByIp.forEach((_, storedKey) => {
      if (oldestKey === null) oldestKey = storedKey
    })
    if (oldestKey !== null) requestsByIp.delete(oldestKey)
  }
  const current = requestsByIp.get(key)
  if (!current || now - current.startedAt >= requestWindowMs) {
    requestsByIp.set(key, { startedAt: now, count: 1 })
    return false
  }
  current.count += 1
  return current.count > requestLimit
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null && !Array.isArray(value)
}

function safeDiagnosticMessage(message: string, apiKey: string): string {
  const withoutApiKey = apiKey ? message.split(apiKey).join('[redacted]') : message
  const redacted = withoutApiKey
    .replace(/Bearer\s+[^\s"']+/gi, 'Bearer [redacted]')
    .replace(/\bre_[A-Za-z0-9_-]{8,}\b/g, '[redacted]')
  return redacted.slice(0, 500) || 'No provider message was returned.'
}

function safeProviderCode(value: unknown, apiKey: string): string | null {
  if (typeof value !== 'string') return null
  if ((apiKey && value.includes(apiKey)) || /\bre_[A-Za-z0-9_-]{8,}\b/.test(value)) return null
  const code = value.replace(/[^a-zA-Z0-9_-]/g, '').slice(0, 64)
  return code || null
}

async function sendResendEmail(
  apiKey: string,
  payload: Record<string, unknown>,
  timeoutMs: number,
): Promise<EmailResult> {
  const controller = new AbortController()
  const timeout = setTimeout(() => controller.abort(), timeoutMs)

  try {
    const response = await fetch(resendApiUrl, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(payload),
      cache: 'no-store',
      signal: controller.signal,
    })
    const body: unknown = await response.json().catch(() => null)
    if (response.ok) return { ok: true, statusCode: response.status }

    const details = isRecord(body) ? body : {}
    const message = typeof details.message === 'string'
      ? details.message
      : `Resend returned HTTP ${response.status}.`
    return {
      ok: false,
      statusCode: response.status,
      providerCode: safeProviderCode(details.name ?? details.code, apiKey),
      message: safeDiagnosticMessage(message, apiKey),
    }
  } catch (error) {
    if (controller.signal.aborted) throw new DeliveryTimeoutError()
    throw error
  } finally {
    clearTimeout(timeout)
  }
}

function logProviderFailure(event: string, requestId: string, failure: ProviderFailure, apiKey: string) {
  console.error(`[CONTACT] ${JSON.stringify({
    event,
    requestId,
    provider: 'Resend',
    statusCode: failure.statusCode,
    providerCode: failure.providerCode,
    message: safeDiagnosticMessage(failure.message, apiKey),
  })}`)
}

function logLeadFallback(
  requestId: string,
  submission: Omit<ContactSubmission, 'website' | 'firstName' | 'lastName'>,
  code: ContactFailureCode,
  failure: ProviderFailure,
  apiKey: string,
) {
  console.error(`[CONTACT_LEAD_FALLBACK] ${JSON.stringify({
    event: 'contact_delivery_failed',
    requestId,
    occurredAt: new Date().toISOString(),
    fallbackStorage: 'vercel_runtime_log',
    errorCode: code,
    provider: 'Resend',
    statusCode: failure.statusCode,
    providerCode: failure.providerCode,
    providerMessage: safeDiagnosticMessage(failure.message, apiKey),
    lead: submission,
  })}`)
}

function getFallbackMessage(code: ContactFailureCode): string {
  const reason = code === 'timeout'
    ? 'Email delivery timed out.'
    : code === 'config_missing'
      ? 'Email delivery is temporarily unavailable.'
      : 'The email provider could not accept your brief.'
  return `${reason} We captured it in our server recovery log; to make sure it reaches us, email ${recoveryEmail}.`
}

function failureResponse(code: string, error: string, status: number, fallbackLogged = false) {
  return NextResponse.json(
    { success: false, code, error, ...(fallbackLogged ? { fallbackStored: 'server_log' } : {}) },
    { status },
  )
}

export async function POST(request: NextRequest) {
  if (isRateLimited(getClientKey(request))) {
    return NextResponse.json(
      { success: false, code: 'rate_limited', error: 'Too many requests. Please try again later.' },
      { status: 429, headers: { 'Retry-After': String(Math.ceil(requestWindowMs / 1000)) } },
    )
  }

  let rawBody: unknown
  try {
    rawBody = await request.json()
  } catch {
    return failureResponse('validation', 'The request body could not be read. Please try again.', 400)
  }
  if (!isRecord(rawBody)) {
    return failureResponse('validation', 'The request body must be a valid contact form.', 400)
  }

  if (typeof rawBody.website === 'string' && rawBody.website.trim()) {
    return NextResponse.json({ success: true, message: 'Message received.' })
  }

  const parsed = contactBodySchema.safeParse(rawBody)
  if (!parsed.success) {
    return failureResponse(
      'validation',
      'Please check your name, email, and project details, then try again.',
      400,
    )
  }

  const body = parsed.data
  const name = (body.name || [body.firstName, body.lastName].filter(Boolean).join(' ')).replace(/[\r\n]+/g, ' ')
  const email = body.email
  const phone = body.phone || ''
  const country = (body.country || '').replace(/[\r\n]+/g, ' ')
  const service = body.service || ''
  const budget = body.budget || ''
  const timeline = body.timeline || ''
  const message = body.message
  const apiKey = process.env.RESEND_EMAIL_RESEND_API_KEY?.trim() || process.env.RESEND_API_KEY?.trim() || ''
  const senderDomain = process.env.RESEND_EMAIL_DOMAIN?.trim() || 'eva-tech-studio.com'
  const recipient = process.env.CONTACT_TO_EMAIL?.trim() || defaultRecipient
  const sender = `Eva Tech Studio <contact@${senderDomain}>`
  const requestId = randomUUID()
  const submission = { name, email, phone, country, service, budget, timeline, message }

  const domainIsValid = /^(?=.{1,253}$)(?:[a-z0-9](?:[a-z0-9-]{0,61}[a-z0-9])?\.)+[a-z]{2,63}$/i.test(senderDomain)
  const emailIsValid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(recipient)
  if (!apiKey || !domainIsValid || !emailIsValid) {
    const failure: ProviderFailure = {
      statusCode: null,
      providerCode: null,
      message: !apiKey
        ? 'No supported Resend API key variable is configured.'
        : 'The configured sender domain or contact recipient is invalid.',
    }
    logLeadFallback(requestId, submission, 'config_missing', failure, apiKey)
    return failureResponse('config_missing', getFallbackMessage('config_missing'), 503, true)
  }

  const htmlMessage = escapeHtml(message).replace(/\n/g, '<br>')
  const primaryEmail = {
    from: sender,
    to: [recipient],
    reply_to: email,
    subject: `New project brief from ${name}`,
    text: [
      `Name: ${name}`,
      `Email: ${email}`,
      `Phone: ${phone || 'Not provided'}`,
      `Country: ${country || 'Not provided'}`,
      `Service: ${service || 'Not provided'}`,
      `Budget: ${budget || 'Not provided'}`,
      `Timeline: ${timeline || 'Not provided'}`,
      '',
      message,
    ].join('\n'),
    html: `
      <h1>New Eva Tech Studio project brief</h1>
      <p><strong>Name:</strong> ${escapeHtml(name)}</p>
      <p><strong>Email:</strong> ${escapeHtml(email)}</p>
      <p><strong>Phone:</strong> ${escapeHtml(phone || 'Not provided')}</p>
      <p><strong>Country:</strong> ${escapeHtml(country || 'Not provided')}</p>
      <p><strong>Service:</strong> ${escapeHtml(service || 'Not provided')}</p>
      <p><strong>Budget:</strong> ${escapeHtml(budget || 'Not provided')}</p>
      <p><strong>Timeline:</strong> ${escapeHtml(timeline || 'Not provided')}</p>
      <p><strong>Message:</strong></p>
      <p>${htmlMessage}</p>
    `,
  }

  let delivery: EmailResult
  try {
    delivery = await sendResendEmail(apiKey, primaryEmail, primaryEmailTimeoutMs)
  } catch (error) {
    const timedOut = error instanceof DeliveryTimeoutError
    const failure: ProviderFailure = {
      statusCode: null,
      providerCode: timedOut ? 'timeout' : null,
      message: error instanceof Error ? error.message : 'Resend request failed unexpectedly.',
    }
    const code: ContactFailureCode = timedOut ? 'timeout' : 'provider_rejected'
    logLeadFallback(requestId, submission, code, failure, apiKey)
    return failureResponse(code, getFallbackMessage(code), timedOut ? 504 : 502, true)
  }

  if (!delivery.ok) {
    logLeadFallback(requestId, submission, 'provider_rejected', delivery, apiKey)
    return failureResponse('provider_rejected', getFallbackMessage('provider_rejected'), 502, true)
  }

  try {
    const autoReply = await sendResendEmail(apiKey, {
      from: sender,
      to: [email],
      subject: 'We received your enquiry',
      text: `Hi ${name},\n\nThanks for getting in touch with Eva Tech Studio. We have received your enquiry and will review the details. We will reply within 48 hours with a clear first scope, any key questions, and practical next steps. There is no obligation to proceed.\n\nEva Tech Studio`,
      html: `<p>Hi ${escapeHtml(name)},</p><p>Thanks for getting in touch with Eva Tech Studio. We have received your enquiry and will review the details.</p><p>We will reply within <strong>48 hours</strong> with a clear first scope, any key questions, and practical next steps. There is no obligation to proceed.</p><p>Eva Tech Studio</p>`,
    }, autoReplyTimeoutMs)
    if (!autoReply.ok) logProviderFailure('auto_reply_rejected', requestId, autoReply, apiKey)
  } catch (error) {
    logProviderFailure('auto_reply_failed', requestId, {
      statusCode: null,
      providerCode: error instanceof DeliveryTimeoutError ? 'timeout' : null,
      message: error instanceof Error ? error.message : 'Resend auto-reply failed unexpectedly.',
    }, apiKey)
  }

  return NextResponse.json({ success: true, message: 'Your enquiry has been received.' })
}
