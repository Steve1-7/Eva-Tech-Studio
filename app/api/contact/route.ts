import { NextRequest, NextResponse } from 'next/server'
import { Resend } from 'resend'

const resend = process.env.RESEND_API_KEY ? new Resend(process.env.RESEND_API_KEY) : null
const recipient = process.env.CONTACT_TO_EMAIL || 'info@eva-tech-studio.com'
const requestWindowMs = 15 * 60 * 1000
const requestLimit = 5
const requestsByIp = new Map<string, { startedAt: number; count: number }>()

type ContactBody = {
  name?: unknown
  firstName?: unknown
  lastName?: unknown
  email?: unknown
  phone?: unknown
  service?: unknown
  budget?: unknown
  timeline?: unknown
  message?: unknown
  website?: unknown
}

function text(value: unknown, maximum: number): string {
  return typeof value === 'string' ? value.trim().slice(0, maximum) : ''
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

export async function POST(request: NextRequest) {
  if (isRateLimited(getClientKey(request))) {
    return NextResponse.json(
      { success: false, error: 'Too many requests. Please try again later.' },
      { status: 429, headers: { 'Retry-After': String(Math.ceil(requestWindowMs / 1000)) } },
    )
  }

  let body: ContactBody
  try {
    const parsed: unknown = await request.json()
    if (typeof parsed !== 'object' || parsed === null || Array.isArray(parsed)) {
      return NextResponse.json({ success: false, error: 'The request body must be an object.' }, { status: 400 })
    }
    body = parsed as ContactBody
  } catch (error) {
    console.warn('[CONTACT] Invalid request body', error)
    return NextResponse.json({ success: false, error: 'The request could not be read.' }, { status: 400 })
  }

  if (text(body.website, 200)) {
    return NextResponse.json({ success: true, message: 'Message received.' })
  }

  const name = (text(body.name, 160)
    || [text(body.firstName, 80), text(body.lastName, 80)].filter(Boolean).join(' ')
  ).replace(/[\r\n]+/g, ' ')
  const email = text(body.email, 254)
  const phone = text(body.phone, 50)
  const service = text(body.service, 120)
  const budget = text(body.budget, 80)
  const timeline = text(body.timeline, 80)
  const message = text(body.message, 5000)
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

  if (!name || !email || !service || !budget || !timeline || !message) {
    return NextResponse.json(
      { success: false, error: 'Name, email, service, budget, timeline, and message are required.' },
      { status: 400 },
    )
  }
  if (!emailRegex.test(email)) {
    return NextResponse.json({ success: false, error: 'Enter a valid email address.' }, { status: 400 })
  }
  if (!resend) {
    console.error('[CONTACT] RESEND_API_KEY is not configured; refusing to accept an undeliverable brief.')
    return NextResponse.json(
      { success: false, error: 'The contact form is temporarily unavailable. Please email info@eva-tech-studio.com.' },
      { status: 503 },
    )
  }

  const htmlMessage = escapeHtml(message).replace(/\n/g, '<br>')
  const html = `
    <h1>New Eva Tech Studio project brief</h1>
    <p><strong>Name:</strong> ${escapeHtml(name)}</p>
    <p><strong>Email:</strong> ${escapeHtml(email)}</p>
    <p><strong>Phone:</strong> ${escapeHtml(phone || 'Not provided')}</p>
    <p><strong>Service:</strong> ${escapeHtml(service)}</p>
    <p><strong>Budget:</strong> ${escapeHtml(budget)}</p>
    <p><strong>Timeline:</strong> ${escapeHtml(timeline)}</p>
    <p><strong>Message:</strong></p>
    <p>${htmlMessage}</p>
  `

  try {
    const result = await resend.emails.send({
      from: 'Eva Tech Studio <contact@eva-tech-studio.com>',
      to: [recipient],
      reply_to: email,
      subject: `New project brief from ${name}`,
      text: [
        `Name: ${name}`,
        `Email: ${email}`,
        `Phone: ${phone || 'Not provided'}`,
        `Service: ${service}`,
        `Budget: ${budget}`,
        `Timeline: ${timeline}`,
        '',
        message,
      ].join('\n'),
      html,
    })
    if (result.error) {
      console.error('[CONTACT] Email provider rejected the brief', result.error)
      return NextResponse.json({ success: false, error: 'We could not deliver your brief. Please try again.' }, { status: 502 })
    }

    return NextResponse.json({ success: true, message: 'Your brief has been sent. We will be in touch soon.' })
  } catch (error) {
    console.error('[CONTACT] Email delivery failed', error)
    return NextResponse.json({ success: false, error: 'We could not deliver your brief. Please try again.' }, { status: 502 })
  }
}
