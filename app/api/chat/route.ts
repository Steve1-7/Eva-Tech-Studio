import { NextRequest, NextResponse } from 'next/server'
import { Resend } from 'resend'
import { getEnquiryRecipients, getResendApiKey } from '../../../lib/server/enquiry-email'

const contactIntentPattern = /\b(?:human|person|call|meeting|talk|contact|whatsapp|support|book|booking|schedule|appointment)\b/i
const FROM_EMAIL = 'Eva-Tech-Studio <contact@eva-tech-studio.com>'

export async function POST(request: NextRequest) {
  try {
    const apiKey = getResendApiKey()
    const resend = apiKey ? new Resend(apiKey) : null
    const { message, email } = await request.json()

    if (!message || !(String(message).trim().length > 0)) {
      return NextResponse.json({ success: false, error: 'Message is required' }, { status: 400 })
    }

    const timestamp = new Date().toLocaleString('en-ZA', { timeZone: 'Africa/Johannesburg' })

    console.log('[CHAT] Received message', { email: email || 'anonymous', timestamp, excerpt: String(message).slice(0, 120) })

    const question = String(message).toLowerCase()
    let reply: string

    if (/price|pricing|cost|how much|budget|quote|package/.test(question)) {
      reply = 'Service prices are published only after the service-specific rates and package details are confirmed. Tell us what you need through the contact form and we will prepare a written quote.'
    } else if (/service|what do you|what can you|offer|help with/.test(question)) {
      reply = 'Eva Tech Studio works on websites, web applications, mobile experiences, custom software, AI chatbots, trading-system engineering, and workflow automation. Tell us what you are trying to make possible and we can suggest a practical next step.'
    } else if (/bagma|food|order|ticket|car.?wash|booking|admin dashboard/.test(question)) {
      reply = 'Bagmaa is a responsive ordering and booking web app with customer accounts, order history and tracking, food and ticket purchasing, car-wash bookings, and an admin dashboard for customers, products, categories, packages, add-ons, orders, sales, bookings, and content. Its backend uses Supabase.'
    } else if (contactIntentPattern.test(question)) {
      reply = 'Use the contact form to send a message or request a 20-minute call. We will reply with the next steps.'
    } else if (/thank/.test(question)) {
      reply = 'You are welcome. Send another question any time, or use the contact form if you would like to discuss a project.'
    } else {
      reply = 'I can help with our services, pricing, and project questions. Try asking about a service or package, or send a message through the contact form.'
    }

    if (resend && contactIntentPattern.test(question)) {
      const html = `<p><strong>Website chat request</strong></p><p><strong>From:</strong> ${email ? escapeHtml(email) : 'Anonymous'}</p><p><strong>Received:</strong> ${escapeHtml(timestamp)}</p><p>${escapeHtml(String(message))}</p>`
      await resend.emails.send({
        from: FROM_EMAIL,
        to: getEnquiryRecipients('chat'),
        subject: 'Website chat request',
        html,
        reply_to: email || undefined
      }).catch((mailError) => console.error('[CHAT] Resend send error', mailError))
    }

    return NextResponse.json({ success: true, reply })
  } catch (error: any) {
    console.error('[CHAT] Error handling message', error)
    return NextResponse.json({ success: false, error: 'Unable to process message' }, { status: 500 })
  }
}

function escapeHtml(text: string) {
  return String(text)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;')
}
