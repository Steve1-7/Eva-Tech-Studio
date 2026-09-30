import { NextRequest, NextResponse } from 'next/server'
import { Resend } from 'resend'
import { defaultPricingPlans } from '@/lib/pricing'
import { supabaseAdmin } from '@/lib/supabase'

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

    const question = String(message).toLowerCase()
    let reply: string

    if (/price|pricing|cost|how much|budget|quote|package/.test(question)) {
      let data: { name: string; price: number }[] | null = null
      try {
        const result = await supabaseAdmin
          .from('pricing_plans')
          .select('name,price')
          .eq('billing_period', 'monthly')
          .order('sort_order', { ascending: true })
        data = result.data
      } catch (error) {
        console.warn('[CHAT] Unable to load pricing; using defaults', error)
      }
      const plans = data?.length ? data : defaultPricingPlans.filter(plan => plan.billing_period === 'monthly')
      const formattedPlans = plans.map((plan: { name: string; price: number }) => `${plan.name}: R${Number(plan.price).toLocaleString('en-ZA')}/month`).join('; ')
      reply = `Our current monthly plans are ${formattedPlans}. Website builds and other one-time projects are scoped separately. Message us on WhatsApp for a tailored recommendation.`
    } else if (/service|what do you|what can you|offer|help with/.test(question)) {
      reply = 'Eva-Tech-Studio helps with social media marketing, paid advertising, website and e-commerce development, SEO, branding, and business automation. Tell me what you are trying to achieve and I can point you to the right next step.'
    } else if (/bagma|food|order|ticket|car.?wash|booking|admin dashboard/.test(question)) {
      reply = 'Bagmaa is a responsive ordering and booking web app with customer accounts, order history and tracking, food and ticket purchasing, car-wash bookings, and an admin dashboard for customers, products, categories, packages, add-ons, orders, sales, bookings, and content. Its backend uses Supabase.'
    } else if (/human|person|call|meeting|talk|contact|whatsapp|support/.test(question)) {
      reply = 'You can speak directly with our team on WhatsApp at +27 67 628 3210. Use the button below to start a chat.'
    } else if (/thank/.test(question)) {
      reply = 'You are welcome. Send another question any time, or message our team on WhatsApp at +27 67 628 3210.'
    } else {
      reply = 'I can help with our services, pricing, and project questions. Try asking about a service or package, or message our team directly on WhatsApp at +27 67 628 3210.'
    }

    if (resend && /human|person|call|meeting|talk|contact|whatsapp|support/.test(question)) {
      const html = `<p><strong>Website chat request</strong></p><p><strong>From:</strong> ${email ? escapeHtml(email) : 'Anonymous'}</p><p><strong>Received:</strong> ${escapeHtml(timestamp)}</p><p>${escapeHtml(String(message))}</p>`
      await resend.emails.send({
        from: FROM_EMAIL,
        to: RECIPIENT_EMAILS,
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
