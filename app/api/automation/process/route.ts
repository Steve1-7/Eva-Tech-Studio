import { NextRequest, NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabase'
import {
  createJobSlug,
  extractJobFields,
  hashJobContent,
  validateJobFields,
} from '@/lib/jobAutomation'
import type { ExtractedJobFields } from '@/lib/jobAutomation'

export const runtime = 'nodejs'
export const maxDuration = 60

function isAuthorized(request: NextRequest): boolean {
  const secret = process.env.AUTOMATION_WORKER_SECRET
  return Boolean(secret && request.headers.get('authorization') === `Bearer ${secret}`)
}

function hasServiceRole(): boolean {
  return Boolean(process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.SUPABASE_SERVICE_KEY)
}

function templateParameters(job: any, publicUrl: string) {
  return [
    job.title,
    job.company,
    job.location || (job.remote ? 'Remote' : 'Not specified'),
    job.job_type || 'Not specified',
    job.deadline || 'Not specified',
    publicUrl,
  ].map(text => ({ type: 'text', text: String(text) }))
}

async function processSubmission(event: any) {
  const submissionId = event.payload?.submission_id
  if (!submissionId) throw new Error('Submission event is missing submission_id.')

  const { data: submission, error } = await supabaseAdmin
    .from('job_submissions')
    .select('id,raw_content,status')
    .eq('id', submissionId)
    .single()
  if (error) throw error
  if (submission.status !== 'received') return

  const fields = extractJobFields(submission.raw_content)
  const errors = validateJobFields(fields)
  const { error: updateError } = await supabaseAdmin
    .from('job_submissions')
    .update({
      extracted_fields: fields,
      validation_errors: errors,
      status: 'review',
      processed_at: new Date().toISOString(),
    })
    .eq('id', submissionId)
  if (updateError) throw updateError
}

async function processDistribution(event: any): Promise<{ hasMore: boolean; nextCursor?: number }> {
  const jobId = event.payload?.job_id
  if (!jobId) throw new Error('Job event is missing job_id.')

  const { data: job, error: jobError } = await supabaseAdmin
    .from('jobs')
    .select('*')
    .eq('id', jobId)
    .eq('status', 'published')
    .single()
  if (jobError) throw jobError

  const { data: subscribers, error: subscribersError } = await supabaseAdmin
    .from('subscribers')
    .select('id,phone_number')
    .eq('consent_status', 'active')
    .gt('id', Number(event.payload?.subscriber_after_id || 0))
    .order('id', { ascending: true })
    .limit(3)
  if (subscribersError) throw subscribersError
  if (!subscribers?.length) return { hasMore: false }

  const token = process.env.WHATSAPP_ACCESS_TOKEN
  const phoneId = process.env.WHATSAPP_PHONE_NUMBER_ID
  const templateName = process.env.WHATSAPP_TEMPLATE_NAME
  const templateLanguage = process.env.WHATSAPP_TEMPLATE_LANGUAGE || 'en'
  const apiVersion = process.env.WHATSAPP_API_VERSION
  const baseUrl = process.env.NEXT_PUBLIC_APP_URL
  if (process.env.WHATSAPP_SEND_ENABLED !== 'true') {
    throw new Error('WhatsApp sending is disabled. Set WHATSAPP_SEND_ENABLED=true only after configuring an approved template.')
  }
  if (!token || !phoneId || !templateName || !apiVersion || !baseUrl) {
    throw new Error('WhatsApp template distribution is missing required server configuration.')
  }
  if (!/^v\d+\.\d+$/.test(apiVersion)) throw new Error('WHATSAPP_API_VERSION must look like vXX.Y.')

  const publicUrl = `${baseUrl.replace(/\/$/, '')}/careers/${encodeURIComponent(job.slug)}`
  for (const subscriber of subscribers) {
    const { data: existing, error: existingError } = await supabaseAdmin
      .from('distribution_logs')
      .select('id,status,attempt_count')
      .eq('event_id', event.id)
      .eq('subscriber_id', subscriber.id)
      .maybeSingle()
    if (existingError) throw existingError
    if (existing && ['accepted', 'delivered', 'read', 'pending'].includes(existing.status)) continue

    const log = {
      event_id: event.id,
      job_id: job.id,
      subscriber_id: subscriber.id,
      destination: subscriber.phone_number,
      status: 'pending',
      attempt_count: (existing?.attempt_count || 0) + 1,
      error_message: null,
      updated_at: new Date().toISOString(),
    }
    const { data: logRow, error: logError } = existing
      ? await supabaseAdmin.from('distribution_logs').update(log).eq('id', existing.id).select('id').single()
      : await supabaseAdmin.from('distribution_logs').insert(log).select('id').single()
    if (logError) throw logError

    let response: Response
    try {
      response = await fetch(`https://graph.facebook.com/${apiVersion}/${phoneId}/messages`, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          messaging_product: 'whatsapp',
          recipient_type: 'individual',
          to: subscriber.phone_number,
          type: 'template',
          template: {
            name: templateName,
            language: { code: templateLanguage },
            components: [{
              type: 'body',
              parameters: templateParameters(job, publicUrl),
            }],
          },
        }),
        signal: AbortSignal.timeout(15_000),
      })
    } catch (error) {
      const message = 'Provider response was not received; delivery outcome is uncertain and is not automatically resent.'
      const { error: logUpdateError } = await supabaseAdmin.from('distribution_logs').update({
        status: 'pending',
        error_message: message,
        updated_at: new Date().toISOString(),
      }).eq('id', logRow.id)
      if (logUpdateError) throw logUpdateError
      throw error
    }
    const result = await response.json().catch(() => ({}))
    if (!response.ok) {
      const message = String(result.error?.message || `WhatsApp API returned ${response.status}`).slice(0, 1000)
      await supabaseAdmin.from('distribution_logs').update({
        status: 'failed',
        error_message: message,
        updated_at: new Date().toISOString(),
      }).eq('id', logRow.id)
      throw new Error(message)
    }

    const providerMessageId = result.messages?.[0]?.id
    if (!providerMessageId) throw new Error('WhatsApp accepted the request without returning a message ID.')
    const { error: updateError } = await supabaseAdmin.from('distribution_logs').update({
      status: 'accepted',
      provider_message_id: providerMessageId,
      updated_at: new Date().toISOString(),
    }).eq('id', logRow.id)
    if (updateError) throw updateError
  }

  return {
    hasMore: subscribers.length === 3,
    nextCursor: subscribers[subscribers.length - 1]?.id,
  }
}

export async function POST(request: NextRequest) {
  if (!isAuthorized(request)) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  if (!hasServiceRole()) return NextResponse.json({ error: 'Automation worker is not configured.' }, { status: 503 })

  const { data: events, error } = await supabaseAdmin.rpc('claim_automation_events', {
    p_limit: 1,
  })
  if (error) {
    console.error('[AUTOMATION] Could not claim events', error)
    return NextResponse.json({ error: 'Unable to claim automation events.' }, { status: 500 })
  }

  const results: Array<{ id: number; status: string }> = []
  for (const event of events || []) {
    try {
      if (event.event_type === 'submission_received') await processSubmission(event)
      else if (event.event_type === 'job_published') {
        const progress = await processDistribution(event)
        if (progress.hasMore) {
          const { error: progressError } = await supabaseAdmin.from('automation_events')
            .update({
              status: 'pending',
              payload: { ...event.payload, subscriber_after_id: progress.nextCursor },
              available_at: new Date().toISOString(),
              locked_at: null,
            })
            .eq('id', event.id)
          if (progressError) throw progressError
          results.push({ id: event.id, status: 'pending' })
          continue
        }
      }
      else throw new Error(`Unsupported event type: ${event.event_type}`)

      const { error: completeError } = await supabaseAdmin.from('automation_events')
        .update({ status: 'done', completed_at: new Date().toISOString(), locked_at: null })
        .eq('id', event.id)
      if (completeError) throw completeError
      results.push({ id: event.id, status: 'done' })
    } catch (error) {
      const message = (error instanceof Error ? error.message : 'Unknown processing error').slice(0, 1000)
      const baseDelaySeconds = Math.min(3600, 30 * (2 ** Math.min(event.attempts || 1, 7)))
      const delaySeconds = Math.round(baseDelaySeconds * (0.8 + Math.random() * 0.4))
      const { error: updateError } = await supabaseAdmin.from('automation_events').update({
        status: event.attempts >= 8 ? 'dead' : 'failed',
        last_error: message,
        locked_at: null,
        available_at: new Date(Date.now() + delaySeconds * 1000).toISOString(),
      }).eq('id', event.id)
      if (updateError) console.error('[AUTOMATION] Failed to record event failure', updateError)
      results.push({ id: event.id, status: 'failed' })
    }
  }

  const { data: expiredJobs, error: expiryError } = await supabaseAdmin
    .from('jobs')
    .update({ status: 'expired', updated_at: new Date().toISOString() })
    .eq('status', 'published')
    .lt('deadline', new Date().toISOString().slice(0, 10))
    .select('id')
  if (expiryError) {
    console.error('[AUTOMATION] Job expiry update failed', expiryError)
    return NextResponse.json({ error: 'Automation ran but could not expire old jobs.' }, { status: 500 })
  }

  return NextResponse.json({ claimed: results.length, expired: expiredJobs?.length || 0, results })
}
