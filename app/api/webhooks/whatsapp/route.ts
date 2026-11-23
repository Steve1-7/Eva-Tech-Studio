import { NextRequest, NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabase'
import { verifyWhatsAppSignature } from '@/lib/jobAutomation'

export const runtime = 'nodejs'

function hasServiceRole(): boolean {
  return Boolean(process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.SUPABASE_SERVICE_KEY)
}

export async function GET(request: NextRequest) {
  const params = request.nextUrl.searchParams
  const verifyToken = process.env.WHATSAPP_VERIFY_TOKEN
  if (
    params.get('hub.mode') !== 'subscribe' ||
    !verifyToken ||
    params.get('hub.verify_token') !== verifyToken
  ) {
    return new NextResponse('Forbidden', { status: 403 })
  }

  return new NextResponse(params.get('hub.challenge') || '', { status: 200 })
}

export async function POST(request: NextRequest) {
  const appSecret = process.env.WHATSAPP_APP_SECRET
  if (!appSecret || !hasServiceRole()) {
    return NextResponse.json({ error: 'WhatsApp webhook is not configured.' }, { status: 503 })
  }

  const rawBody = await request.text()
  if (!verifyWhatsAppSignature(rawBody, request.headers.get('x-hub-signature-256'), appSecret)) {
    return NextResponse.json({ error: 'Invalid webhook signature.' }, { status: 401 })
  }

  let payload: any
  try {
    payload = JSON.parse(rawBody)
  } catch {
    return NextResponse.json({ error: 'Malformed JSON payload.' }, { status: 400 })
  }

  if (payload.object !== 'whatsapp_business_account' || !Array.isArray(payload.entry)) {
    return NextResponse.json({ error: 'Unsupported webhook event.' }, { status: 400 })
  }

  try {
    for (const entry of payload.entry) {
      for (const change of entry.changes || []) {
        const value = change.value || {}

        for (const status of value.statuses || []) {
          if (status.id && ['sent', 'delivered', 'read', 'failed'].includes(status.status)) {
            const { error } = await supabaseAdmin
              .from('distribution_logs')
              .update({
                status: status.status === 'sent' ? 'accepted' : status.status,
                updated_at: new Date().toISOString(),
                error_message: status.errors?.[0]?.title || null,
              })
              .eq('provider_message_id', status.id)
            if (error) throw error
          }
        }

        for (const message of value.messages || []) {
          if (!message.id || !message.from) continue
          const text = typeof message.text?.body === 'string'
            ? message.text.body.slice(0, 20_000)
            : `[Unsupported WhatsApp message type: ${String(message.type || 'unknown').slice(0, 40)}]`
          const command = text.trim().toUpperCase()

          if (command === 'START') {
            const { error } = await supabaseAdmin.from('subscribers').upsert({
              phone_number: message.from,
              consent_status: 'active',
              consented_at: new Date().toISOString(),
              unsubscribed_at: null,
              updated_at: new Date().toISOString(),
            }, { onConflict: 'phone_number' })
            if (error) throw error
            continue
          }

          if (command === 'STOP' || command === 'UNSUBSCRIBE') {
            const { error } = await supabaseAdmin
              .from('subscribers')
              .update({
                consent_status: 'unsubscribed',
                unsubscribed_at: new Date().toISOString(),
                updated_at: new Date().toISOString(),
              })
              .eq('phone_number', message.from)
            if (error) throw error
            continue
          }

          const { error: submissionError } = await supabaseAdmin.rpc('record_whatsapp_submission', {
            p_provider_event_id: message.id,
            p_sender_id: message.from,
            p_raw_content: text,
          })
          if (submissionError) throw submissionError
        }
      }
    }
  } catch (error) {
    console.error('[WHATSAPP] Webhook persistence failed', error)
    return NextResponse.json({ error: 'Unable to persist webhook event.' }, { status: 500 })
  }

  return NextResponse.json({ received: true })
}
