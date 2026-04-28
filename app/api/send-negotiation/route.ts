import { NextRequest, NextResponse } from 'next/server'

export async function POST(request: NextRequest) {
  try {
    const { name, email, budget, timeline, message, quoteResult, services, tier, businessName } = await request.json()

    if (!name?.trim() || !email?.trim() || !budget?.trim()) {
      return NextResponse.json({ error: 'Name, email, and budget are required' }, { status: 400 })
    }

    // Log the negotiation request (in production, send via email service like Resend/SendGrid)
    console.log('=== NEGOTIATION REQUEST ===')
    console.log('To: stevezuluu@gmail.com')
    console.log('From:', email)
    console.log('Name:', name)
    console.log('Business:', businessName)
    console.log('Budget:', budget)
    console.log('Timeline:', timeline)
    console.log('Services:', services.join(', '))
    console.log('Tier:', tier)
    console.log('Message:', message)
    console.log('Generated Quote:', quoteResult)
    console.log('============================')

    // In production, you would use an email service like:
    // - Resend (https://resend.com)
    // - SendGrid
    // - Nodemailer with SMTP
    // 
    // Example with Resend:
    // await resend.emails.send({
    //   from: 'quotes@eve-tech-studio.com',
    //   to: 'stevezuluu@gmail.com',
    //   subject: `Negotiation Request from ${businessName} - ${name}`,
    //   html: `...email content...`
    // })

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Send negotiation error:', error)
    return NextResponse.json(
      { error: 'Unable to send negotiation request. Please try again or contact us directly at stevezuluu@gmail.com' },
      { status: 500 }
    )
  }
}
