import { NextRequest, NextResponse } from 'next/server'
import { Resend } from 'resend'

const resend = process.env.RESEND_API_KEY ? new Resend(process.env.RESEND_API_KEY) : null

const RECIPIENT_EMAILS = [
  'info@eva-tech-studio.com',
  'support@eva-tech-studio.com'
]
const FROM_EMAIL = 'Eva-Tech-Studio <contact@eva-tech-studio.com>'

export async function POST(request: NextRequest) {
  try {
    const { message, email } = await request.json()

    if (!message || !(String(message).trim().length > 0)) {
      return NextResponse.json({ success: false, error: 'Message is required' }, { status: 400 })
    }

    const timestamp = new Date().toLocaleString('en-ZA', { timeZone: 'Africa/Johannesburg' })

    console.log('[CHAT] Received message', { email: email || 'anonymous', timestamp, excerpt: String(message).slice(0, 120) })

    if (resend) {
      try {
        const html = `
          <div style="font-family: system-ui, -apple-system, Roboto, 'Segoe UI', sans-serif; color:#111;">
            <h2>💬 Quick Chat Message</h2>
            <p><strong>From:</strong> ${email ? escapeHtml(email) : 'Anonymous'}</p>
            <p><strong>Received:</strong> ${escapeHtml(timestamp)}</p>
            <hr />
            <div style="white-space:pre-wrap;margin-top:12px;">${escapeHtml(String(message))}</div>
          </div>
        `

        await resend.emails.send({
          from: FROM_EMAIL,
          to: RECIPIENT_EMAILS,
          subject: `💬 Quick Chat${email ? ' — ' + email : ''}`,
          html,
          reply_to: email || undefined
        })

        return NextResponse.json({ success: true, message: 'Message received. Our team will review and respond if required.' })
      } catch (err: any) {
        console.error('[CHAT] Resend send error', err)
        // Still respond success so user flow isn't blocked
        return NextResponse.json({ success: true, message: 'Message received (email delivery failed), team will review.' })
      }
    }

    // If no email service, log and return success
    console.log('[CHAT] No email service configured — logged for manual follow-up')
    return NextResponse.json({ success: true, message: 'Message received. Our team will review and respond if required.' })
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
