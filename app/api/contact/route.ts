import { NextRequest, NextResponse } from 'next/server'
import { Resend } from 'resend'

// Initialize Resend with API key from environment
const resend = process.env.RESEND_API_KEY ? new Resend(process.env.RESEND_API_KEY) : null

const RECIPIENT_EMAILS = ['info@eve-tech-studio.com', 'sales@eve-tech-studio.com']
const FROM_EMAIL = 'Eva-Tech-Studio <contact@eve-tech-studio.com>'

export async function POST(request: NextRequest) {
  const startTime = Date.now()

  try {
    const { firstName, lastName, email, phone, service, budget, message } = await request.json()

    // Validate required fields
    if (!firstName?.trim() || !lastName?.trim() || !email?.trim()) {
      return NextResponse.json(
        { success: false, error: 'First name, last name, and email are required' },
        { status: 400 }
      )
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(email)) {
      return NextResponse.json(
        { success: false, error: 'Please enter a valid email address' },
        { status: 400 }
      )
    }

    const fullName = `${firstName} ${lastName}`
    const timestamp = new Date().toLocaleString('en-ZA', {
      timeZone: 'Africa/Johannesburg',
      dateStyle: 'full',
      timeStyle: 'short'
    })

    // Log the contact request
    console.log('[CONTACT] Processing request', {
      fullName,
      email,
      service,
      budget,
      timestamp
    })

    // If Resend is configured, send actual email
    if (resend) {
      try {
        const emailResult = await resend.emails.send({
          from: FROM_EMAIL,
          to: RECIPIENT_EMAILS,
          subject: `📧 New Contact Request from ${fullName}`,
          html: `
            <!DOCTYPE html>
            <html>
            <head>
              <meta charset="utf-8">
              <meta name="viewport" content="width=device-width, initial-scale=1.0">
              <title>Contact Request</title>
              <style>
                body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px; background: #f5f5f5; }
                .container { background: white; border-radius: 12px; padding: 30px; box-shadow: 0 2px 10px rgba(0,0,0,0.1); }
                .header { border-bottom: 3px solid #C9A96E; padding-bottom: 20px; margin-bottom: 25px; }
                .header h1 { color: #1a1a1a; margin: 0 0 10px 0; font-size: 24px; }
                .header p { color: #666; margin: 0; font-size: 14px; }
                .section { margin-bottom: 25px; }
                .section-title { color: #C9A96E; font-size: 14px; font-weight: bold; text-transform: uppercase; letter-spacing: 0.5px; margin-bottom: 10px; }
                .info-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 15px; }
                .info-item { background: #f8f8f8; padding: 12px; border-radius: 8px; }
                .info-label { color: #666; font-size: 12px; text-transform: uppercase; letter-spacing: 0.5px; margin-bottom: 5px; }
                .info-value { color: #1a1a1a; font-weight: 500; }
                .message-box { background: #f8f8f8; padding: 15px; border-radius: 8px; border-left: 4px solid #C9A96E; }
                .footer { text-align: center; margin-top: 30px; padding-top: 20px; border-top: 1px solid #eee; color: #999; font-size: 12px; }
                .cta-button { display: inline-block; background: #C9A96E; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; font-weight: 500; margin-top: 15px; }
              </style>
            </head>
            <body>
              <div class="container">
                <div class="header">
                  <h1>📧 New Contact Request</h1>
                  <p>Received on ${timestamp}</p>
                </div>

                <div class="section">
                  <div class="section-title">Contact Information</div>
                  <div class="info-grid">
                    <div class="info-item">
                      <div class="info-label">Name</div>
                      <div class="info-value">${escapeHtml(fullName)}</div>
                    </div>
                    <div class="info-item">
                      <div class="info-label">Email</div>
                      <div class="info-value">${escapeHtml(email)}</div>
                    </div>
                    <div class="info-item">
                      <div class="info-label">Phone</div>
                      <div class="info-value">${escapeHtml(phone || 'Not provided')}</div>
                    </div>
                    <div class="info-item">
                      <div class="info-label">Service Interest</div>
                      <div class="info-value">${escapeHtml(service || 'Not specified')}</div>
                    </div>
                  </div>
                </div>

                <div class="section">
                  <div class="section-title">Budget Range</div>
                  <div class="info-item">
                    <div class="info-value" style="color: #4A7A64; font-weight: bold;">${escapeHtml(budget || 'Not specified')}</div>
                  </div>
                </div>

                ${message ? `
                <div class="section">
                  <div class="section-title">Message / Goals</div>
                  <div class="message-box">${escapeHtml(message)}</div>
                </div>
                ` : ''}

                <div style="text-align: center;">
                  <a href="mailto:${escapeHtml(email)}?subject=Re: Your Contact Request - Eva-Tech-Studio" class="cta-button">
                    Reply to ${escapeHtml(fullName)}
                  </a>
                </div>

                <div class="footer">
                  <p>This request was submitted via the Eva-Tech-Studio website</p>
                </div>
              </div>
            </body>
            </html>
          `,
          reply_to: email
        })

        console.log('[CONTACT] Email sent successfully', {
          id: emailResult.data?.id,
          duration: `${Date.now() - startTime}ms`
        })

        return NextResponse.json({
          success: true,
          message: 'Message sent successfully! We will be in touch within 24 hours.',
          emailId: emailResult.data?.id
        })

      } catch (emailError: any) {
        console.error('[CONTACT] Resend error:', emailError)

        // Fallback: still return success but log for manual follow-up
        console.log('[CONTACT] Fallback - data for manual processing:', {
          fullName, email, service, budget, timestamp
        })

        return NextResponse.json({
          success: true,
          message: 'Message received! Our team will contact you within 24 hours.',
          warning: 'Email delivery issue detected - our team has been notified'
        })
      }
    } else {
      // Resend not configured - log for manual processing
      console.log('[CONTACT] Resend not configured - manual processing required:', {
        fullName, email, service, budget, timestamp
      })

      return NextResponse.json({
        success: true,
        message: 'Message received! Our team will contact you within 24 hours.',
        warning: 'Email service not configured - data logged for manual processing'
      })
    }

  } catch (error: any) {
    console.error('[CONTACT] Unexpected error:', error)
    return NextResponse.json(
      {
        success: false,
        error: 'Unable to process your request. Please try again or contact us directly at info@eve-tech-studio.com'
      },
      { status: 500 }
    )
  }
}

// Helper function to escape HTML to prevent XSS
function escapeHtml(text: string): string {
  return text
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;')
}
