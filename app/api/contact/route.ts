import { NextRequest, NextResponse } from 'next/server'
import { Resend } from 'resend'
import { z } from 'zod'
import { markets, defaultMarketCurrency, type MarketCurrencyCode } from '@/config/markets'
import { checkRateLimit, contactFormLimiter } from '@/lib/rate-limit'

const recipientEmails = [
  'info@eva-tech-studio.com',
  'support@eva-tech-studio.com',
  'sales@eva-tech-studio.com',
  'marketing@eva-tech-studio.com',
]
const fromEmail = 'Eva-Tech-Studio <contact@eva-tech-studio.com>'
const currencyCodes = markets.map((market) => market.code) as [MarketCurrencyCode, ...MarketCurrencyCode[]]
const optionalText = (maxLength: number) => z.string().trim().max(maxLength).optional().default('')

const contactSchema = z.object({
  name: z.string().trim().min(1, 'Please enter your name').max(120),
  email: z.string().trim().email('Please enter a valid email address').max(254),
  phone: optionalText(40),
  service: optionalText(120),
  budget: optionalText(100),
  currency: z.enum(currencyCodes).default(defaultMarketCurrency),
  timeline: optionalText(80),
  country: optionalText(100),
  message: z.string().trim().min(1, 'Please enter a message').max(3000),
  website: optionalText(200),
})

const resendApiKey = process.env.RESEND_EMAIL_RESEND_API_KEY || process.env.RESEND_API_KEY
const resend = resendApiKey ? new Resend(resendApiKey) : null

export async function POST(request: NextRequest) {
  const forwardedIp = request.headers.get('x-vercel-forwarded-for') || request.headers.get('x-forwarded-for')
  const clientIp = forwardedIp?.split(',')[0]?.trim() || 'unknown'
  const rateLimit = checkRateLimit(contactFormLimiter, clientIp)

  if (!rateLimit.allowed) {
    return NextResponse.json(
      { success: false, error: 'Too many messages. Please try again later.' },
      {
        status: 429,
        headers: {
          'Retry-After': Math.max(1, Math.ceil((rateLimit.resetTime - Date.now()) / 1000)).toString(),
          'X-RateLimit-Remaining': '0',
        },
      }
    )
  }

  let body: unknown
  try {
    body = await request.json()
  } catch {
    return NextResponse.json({ success: false, error: 'Please submit a valid form.' }, { status: 400 })
  }

  const parsed = contactSchema.safeParse(body)
  if (!parsed.success) {
    return NextResponse.json(
      { success: false, error: parsed.error.issues[0]?.message || 'Please check your form and try again.' },
      { status: 400 }
    )
  }

  const { name, email, phone, service, budget, currency, timeline, country, message, website } = parsed.data

  if (website) {
    return NextResponse.json({ success: true, message: 'Message received.' })
  }

  if (!resend) {
    return NextResponse.json(
      { success: false, error: 'The contact form is temporarily unavailable. Please email info@eva-tech-studio.com.' },
      { status: 503 }
    )
  }

  const timestamp = new Date().toLocaleString('en-ZA', {
    timeZone: 'Africa/Johannesburg',
    dateStyle: 'full',
    timeStyle: 'short',
  })
  const details = [
    ['Name', name],
    ['Email', email],
    ['Phone', phone || 'Not provided'],
    ['Country', country || 'Not provided'],
    ['Service', service || 'Not specified'],
    ['Budget', budget ? `${budget} (${currency})` : 'Not specified'],
    ['Timeline', timeline || 'Not specified'],
  ]
  const detailRows = details
    .map(([label, value]) => `<tr><th align="left" style="padding:8px 12px;color:#6b6860">${escapeHtml(label)}</th><td style="padding:8px 12px;color:#1a1a1a">${escapeHtml(value)}</td></tr>`)
    .join('')
  const safeMessage = escapeHtml(message).replace(/\n/g, '<br>')

  try {
    const notification = await resend.emails.send({
      from: fromEmail,
      to: recipientEmails,
      subject: 'New contact request from Eva-Tech-Studio',
      reply_to: email,
      html: `
        <div style="font-family:Arial,sans-serif;max-width:640px;margin:auto;padding:24px;color:#1a1a1a">
          <h1 style="font-size:22px;margin:0 0 8px">New contact request</h1>
          <p style="color:#6b6860;margin:0 0 20px">Received ${escapeHtml(timestamp)}</p>
          <table style="border-collapse:collapse;width:100%;background:#f8f8f8">${detailRows}</table>
          <h2 style="font-size:16px;margin:24px 0 8px">Message</h2>
          <p style="background:#f8f8f8;padding:16px;border-left:3px solid #c9a96e;line-height:1.6">${safeMessage}</p>
          <p><a href="mailto:${encodeURIComponent(email)}">Reply to ${escapeHtml(name)}</a></p>
        </div>
      `,
    })

    if (notification.error) {
      console.error('[CONTACT] Internal notification delivery failed')
      return NextResponse.json(
        { success: false, error: 'We could not send your message just now. Please try again shortly.' },
        { status: 502 }
      )
    }

    try {
      const acknowledgement = await resend.emails.send({
        from: fromEmail,
        to: email,
        subject: 'We received your message — Eva-Tech-Studio',
        html: `
          <div style="font-family:Arial,sans-serif;max-width:600px;margin:auto;padding:24px;color:#1a1a1a;line-height:1.6">
            <h1 style="font-size:22px">Thanks for getting in touch, ${escapeHtml(name)}.</h1>
            <p>Your message has reached our team. We will review the details and share next steps within 48 hours.</p>
            <p>If you need to add anything in the meantime, reply directly to this email.</p>
            <p style="margin-top:28px;color:#6b6860">Eva-Tech-Studio</p>
          </div>
        `,
      })

      if (acknowledgement.error) console.error('[CONTACT] Customer acknowledgement delivery failed')
    } catch {
      console.error('[CONTACT] Customer acknowledgement delivery failed')
    }

    return NextResponse.json({ success: true, message: 'Message sent. We will share next steps within 48 hours.' })
  } catch {
    console.error('[CONTACT] Contact request processing failed')
    return NextResponse.json(
      { success: false, error: 'We could not send your message just now. Please try again shortly.' },
      { status: 502 }
    )
  }
}

function escapeHtml(value: string) {
  return value
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;')
}
