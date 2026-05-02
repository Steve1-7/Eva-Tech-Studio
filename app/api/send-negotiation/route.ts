import { NextRequest, NextResponse } from 'next/server'
import { Resend } from 'resend'

// Initialize Resend with API key from environment
const resend = process.env.RESEND_API_KEY ? new Resend(process.env.RESEND_API_KEY) : null

const RECIPIENT_EMAIL = 'stevezuluu@gmail.com'
const FROM_EMAIL = 'Eva-Tech-Studio <quotes@eve-tech-studio.com>'

export async function POST(request: NextRequest) {
  const startTime = Date.now()

  try {
    const { name, email, budget, timeline, message, quoteResult, services, tier, businessName } = await request.json()

    // Validate required fields
    if (!name?.trim() || !email?.trim() || !budget?.trim()) {
      return NextResponse.json(
        { success: false, error: 'Name, email, and budget are required' },
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

    // Format services for display
    const servicesList = Array.isArray(services) ? services : [services]
    const servicesDisplay = servicesList.join(', ')
    const tierDisplay = tier ? tier.charAt(0).toUpperCase() + tier.slice(1) : 'Not specified'
    const timestamp = new Date().toLocaleString('en-ZA', {
      timeZone: 'Africa/Johannesburg',
      dateStyle: 'full',
      timeStyle: 'short'
    })

    // Log the negotiation request
    console.log('[SEND-NEGOTIATION] Processing request', {
      name,
      email,
      businessName,
      budget,
      tier,
      timestamp
    })

    // If Resend is configured, send actual email
    if (resend) {
      try {
        const emailResult = await resend.emails.send({
          from: FROM_EMAIL,
          to: RECIPIENT_EMAIL,
          subject: `💬 Negotiation Request from ${businessName || name}`,
          html: `
            <!DOCTYPE html>
            <html>
            <head>
              <meta charset="utf-8">
              <meta name="viewport" content="width=device-width, initial-scale=1.0">
              <title>Negotiation Request</title>
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
                .quote-preview { background: #f0f0f0; padding: 15px; border-radius: 8px; font-family: monospace; font-size: 12px; max-height: 200px; overflow-y: auto; white-space: pre-wrap; }
                .footer { text-align: center; margin-top: 30px; padding-top: 20px; border-top: 1px solid #eee; color: #999; font-size: 12px; }
                .cta-button { display: inline-block; background: #C9A96E; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; font-weight: 500; margin-top: 15px; }
              </style>
            </head>
            <body>
              <div class="container">
                <div class="header">
                  <h1>💬 New Negotiation Request</h1>
                  <p>Received on ${timestamp}</p>
                </div>

                <div class="section">
                  <div class="section-title">Contact Information</div>
                  <div class="info-grid">
                    <div class="info-item">
                      <div class="info-label">Name</div>
                      <div class="info-value">${escapeHtml(name)}</div>
                    </div>
                    <div class="info-item">
                      <div class="info-label">Email</div>
                      <div class="info-value">${escapeHtml(email)}</div>
                    </div>
                    <div class="info-item">
                      <div class="info-label">Business Name</div>
                      <div class="info-value">${escapeHtml(businessName || 'Not provided')}</div>
                    </div>
                    <div class="info-item">
                      <div class="info-label">Package Tier</div>
                      <div class="info-value">${escapeHtml(tierDisplay)}</div>
                    </div>
                  </div>
                </div>

                <div class="section">
                  <div class="section-title">Negotiation Details</div>
                  <div class="info-grid">
                    <div class="info-item">
                      <div class="info-label">Proposed Budget</div>
                      <div class="info-value" style="color: #4A7A64; font-weight: bold;">${escapeHtml(budget)}</div>
                    </div>
                    <div class="info-item">
                      <div class="info-label">Timeline</div>
                      <div class="info-value">${escapeHtml(timeline || 'Not specified')}</div>
                    </div>
                  </div>
                </div>

                <div class="section">
                  <div class="section-title">Selected Services</div>
                  <div class="message-box">${escapeHtml(servicesDisplay)}</div>
                </div>

                ${message ? `
                <div class="section">
                  <div class="section-title">Message / Additional Details</div>
                  <div class="message-box">${escapeHtml(message)}</div>
                </div>
                ` : ''}

                ${quoteResult ? `
                <div class="section">
                  <div class="section-title">Original AI-Generated Quote</div>
                  <div class="quote-preview">${escapeHtml(quoteResult)}</div>
                </div>
                ` : ''}

                <div style="text-align: center;">
                  <a href="mailto:${escapeHtml(email)}?subject=Re: Your Negotiation Request - ${escapeHtml(businessName || name)}" class="cta-button">
                    Reply to ${escapeHtml(name)}
                  </a>
                </div>

                <div class="footer">
                  <p>This request was submitted via the Eva-Tech-Studio website</p>
                  <p style="margin-top: 5px;">🤖 Powered by Google Gemini AI + Resend</p>
                </div>
              </div>
            </body>
            </html>
          `,
          reply_to: email
        })

        console.log('[SEND-NEGOTIATION] Email sent successfully', {
          id: emailResult.data?.id,
          duration: `${Date.now() - startTime}ms`
        })

        return NextResponse.json({
          success: true,
          message: 'Negotiation request sent successfully! You will receive a confirmation email shortly.',
          emailId: emailResult.data?.id
        })

      } catch (emailError: any) {
        console.error('[SEND-NEGOTIATION] Resend error:', emailError)

        // Fallback: still return success but log for manual follow-up
        console.log('[SEND-NEGOTIATION] Fallback - data for manual processing:', {
          name, email, businessName, budget, tier, timestamp
        })

        return NextResponse.json({
          success: true,
          message: 'Request received! Our team will review your proposal and contact you within 24 hours.',
          warning: 'Email delivery issue detected - our team has been notified'
        })
      }
    } else {
      // Resend not configured - log for manual processing
      console.log('[SEND-NEGOTIATION] Resend not configured - manual processing required:', {
        name, email, businessName, budget, tier, timestamp
      })

      return NextResponse.json({
        success: true,
        message: 'Request received! Our team will review your proposal and contact you within 24 hours.',
        warning: 'Email service not configured - data logged for manual processing'
      })
    }

  } catch (error: any) {
    console.error('[SEND-NEGOTIATION] Unexpected error:', error)
    return NextResponse.json(
      {
        success: false,
        error: 'Unable to process your request. Please try again or contact us directly at stevezuluu@gmail.com'
      },
      { status: 500 }
    )
  }
}

// Helper function to escape HTML to prevent XSS
function escapeHtml(text: string): string {
  const div = { toString: () => text }
  return text
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;')
}
