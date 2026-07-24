import { NextRequest, NextResponse } from 'next/server'
import { callGemini, QUOTE_GENERATION_CONFIG, addAIWatermark, logAIOperation, classifyAIError, getAIErrorMessage } from '@/lib/ai-config'
import { supabaseAdmin } from '@/lib/supabase'
import { aiConsultantLimiter, checkRateLimit } from '@/lib/rate-limit'
import { upstashRateLimit } from '@/lib/upstashRateLimit'

interface ConsultantRequest {
  businessName?: string
  industry?: string
  website?: string
  projectGoals?: string
  targetAudience?: string
  competitors?: string
  requiredFeatures?: string
  budgetRange?: string
  ownerId?: string
}

export async function POST(request: NextRequest) {
  const start = Date.now()
  try {
    // Rate limiting per IP — prefer Upstash (distributed) when configured
    const clientIp = request.ip || request.headers.get('x-forwarded-for') || 'anonymous'
    let rlResult = null
    if (process.env.UPSTASH_REDIS_REST_URL && process.env.UPSTASH_REDIS_REST_TOKEN) {
      try {
        rlResult = await upstashRateLimit(`ai_consultant:${clientIp}`, 3600, 5)
      } catch (e) {
        rlResult = null
      }
    }

    if (!rlResult) {
      const rl = checkRateLimit(aiConsultantLimiter, clientIp)
      rlResult = { allowed: rl.allowed, remaining: rl.remaining, resetTime: rl.resetTime }
    }

    if (!rlResult.allowed) {
      return NextResponse.json({ success: false, message: 'Rate limit exceeded. Try again later.' }, { status: 429 })
    }
    if (!process.env.AI_GATEWAY_API_KEY) {
      return NextResponse.json({ success: false, message: 'AI service not configured' }, { status: 503 })
    }

    const body: ConsultantRequest = await request.json()

    // Basic validation
    if (!body.businessName || body.businessName.trim() === '') {
      return NextResponse.json({ success: false, message: 'Business name is required' }, { status: 400 })
    }

    logAIOperation('ai-project-consultant', 'start', { business: body.businessName })

    // Prompt instructing the model to return a JSON object with specific sections
    const prompt = `You are an expert digital agency consultant. Given the input fields below, produce a JSON object with keys: projectSummary, investmentBreakdown, recommendedPackage, estimatedTimeline, projectComplexity, and leadCTAs. Each key should contain detailed but concise text or structured lists where appropriate.

Input:
BusinessName: ${body.businessName || ''}
Industry: ${body.industry || ''}
Website: ${body.website || ''}
ProjectGoals: ${body.projectGoals || ''}
TargetAudience: ${body.targetAudience || ''}
Competitors: ${body.competitors || ''}
RequiredFeatures: ${body.requiredFeatures || ''}
BudgetRange: ${body.budgetRange || ''}

Return valid JSON only. Keep text professional, numbered where helpful, and use South African Rand where pricing is relevant.`

    const aiText = await callGemini(prompt, undefined, { ...QUOTE_GENERATION_CONFIG, maxOutputTokens: 4096 })
    const aiTextWatermarked = addAIWatermark(aiText)

    // Try to parse JSON from model output
    let parsed: any = null
    try {
      // Some models may include surrounding text; extract first { ... }
      const jsonStart = aiTextWatermarked.indexOf('{')
      const jsonString = jsonStart >= 0 ? aiTextWatermarked.slice(jsonStart) : aiTextWatermarked
      parsed = JSON.parse(jsonString)
    } catch (err) {
      // If parsing fails, store the raw text as fallback
      parsed = { raw: aiTextWatermarked }
    }

    // Persist request and AI response for learning (use admin client)
    try {
      await supabaseAdmin.from('ai_consultant_requests').insert({
        business_name: body.businessName || null,
        industry: body.industry || null,
        website: body.website || null,
        project_goals: body.projectGoals || null,
        target_audience: body.targetAudience || null,
        competitors: body.competitors || null,
        required_features: body.requiredFeatures || null,
        budget_range: body.budgetRange || null,
        ai_response: parsed,
        owner_id: body.ownerId || null
      })
      // Log analytics event
      await supabaseAdmin.from('analytics_events').insert({
        event_type: 'ai_consultant_generated',
        properties: {
          businessName: body.businessName || null,
          industry: body.industry || null,
          budgetRange: body.budgetRange || null,
          rawResponseLength: aiTextWatermarked.length
        },
        ip: clientIp,
        user_agent: request.headers.get('user-agent') || null
      })
    } catch (dbErr) {
      console.error('[AI-CONSULTANT] DB insert failed:', dbErr)
    }

    const duration = Date.now() - start
    logAIOperation('ai-project-consultant', 'success', { duration })

    return NextResponse.json({ success: true, result: parsed })
  } catch (err: any) {
    const duration = Date.now() - start
    const errorType = classifyAIError(err)
    logAIOperation('ai-project-consultant', 'error', { error: err?.message, type: errorType, duration })

    const message = getAIErrorMessage(errorType)
    return NextResponse.json({ success: false, message }, { status: 500 })
  }
}
