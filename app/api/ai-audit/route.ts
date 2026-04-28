import { NextRequest, NextResponse } from 'next/server'
import {
  callGemini,
  classifyAIError,
  getAIErrorMessage,
  logAIOperation
} from '@/lib/ai-config'

interface AuditRequest {
  url?: string
  biz?: string
  goal?: string
}

interface AuditResponse {
  success: boolean
  result?: string
  message?: string
  fallback?: boolean
}

/**
 * Generate a fallback audit when AI service is unavailable
 */
function generateFallbackAudit(url: string, biz: string, goal: string): string {
  return `🔍 CURRENT GAPS
• Limited visibility into ${biz.toLowerCase().includes('website') ? 'website' : 'digital'} performance metrics
• Potential underutilization of SEO and content marketing opportunities
• Need for streamlined conversion pathways

🚀 TOP 3 GROWTH OPPORTUNITIES
• Implement data-driven SEO strategy to capture high-intent traffic
• Develop automated email nurture sequences for lead conversion
• Optimize user experience for higher conversion rates

📊 QUICK WINS (next 30 days)
• Audit and fix critical technical SEO issues
• Set up conversion tracking and analytics dashboard
• Launch targeted Google Ads campaign for immediate visibility

💡 LONG-TERM STRATEGY
• Build comprehensive content marketing engine
• Implement marketing automation across all touchpoints
• Develop strategic partnership and referral programs

⚡ EVE-TECH-STUDIO RECOMMENDATION
Book a full strategy session to receive a detailed, AI-powered audit with specific recommendations tailored to your business. Our team combines AI insights with 10+ years of digital growth expertise.`
}

/**
 * Validate request input
 */
function validateInput(body: AuditRequest): { valid: boolean; error?: string } {
  if (!body.biz || typeof body.biz !== 'string' || body.biz.trim().length < 5) {
    return { valid: false, error: 'Business description is required (min 5 characters)' }
  }

  if (body.url && typeof body.url !== 'string') {
    return { valid: false, error: 'Invalid URL format' }
  }

  if (body.goal && typeof body.goal !== 'string') {
    return { valid: false, error: 'Invalid goal format' }
  }

  return { valid: true }
}

export async function POST(request: NextRequest): Promise<NextResponse<AuditResponse>> {
  const startTime = Date.now()

  try {
    // Check API key
    if (!process.env.GOOGLE_GENERATIVE_AI_API_KEY) {
      logAIOperation('ai-audit', 'error', { reason: 'API_KEY_MISSING' })
      return NextResponse.json(
        { success: false, message: 'AI service not configured' },
        { status: 503 }
      )
    }

    // Parse and validate request body
    let body: AuditRequest
    try {
      body = await request.json()
    } catch {
      return NextResponse.json(
        { success: false, message: 'Invalid JSON in request body' },
        { status: 400 }
      )
    }

    const validation = validateInput(body)
    if (!validation.valid) {
      return NextResponse.json(
        { success: false, message: validation.error },
        { status: 400 }
      )
    }

    const { url = '', biz = '', goal = 'Increase revenue and grow the business' } = body

    logAIOperation('ai-audit', 'start', {
      url: url || 'none',
      bizPreview: biz.substring(0, 40),
      goalPreview: goal.substring(0, 30)
    })

    const prompt = `You are a senior digital growth strategist at Eve-Tech-Studio. Write concise, expert growth audits. Format with emoji section headers. Be specific and action-oriented. Under 350 words.

Write a growth audit for:
Website: ${url || 'Not provided'}
Business: ${biz}
Goal: ${goal}

Sections:
🔍 CURRENT GAPS
🚀 TOP 3 GROWTH OPPORTUNITIES
📊 QUICK WINS (next 30 days)
💡 LONG-TERM STRATEGY
⚡ EVE-TECH-STUDIO RECOMMENDATION`

    const text = await callGemini(prompt)

    const duration = Date.now() - startTime
    logAIOperation('ai-audit', 'success', {
      duration: `${duration}ms`,
      resultLength: text.length
    })

    return NextResponse.json({
      success: true,
      result: text
    })

  } catch (error: any) {
    const duration = Date.now() - startTime

    // Classify and log error
    const errorType = classifyAIError(error)
    logAIOperation('ai-audit', 'error', {
      type: errorType,
      message: error?.message,
      duration: `${duration}ms`
    })

    // If it's a recoverable AI error, return fallback response
    if (errorType === 'model_not_found' || errorType === 'rate_limit') {
      try {
        const body = await request.clone().json()
        const fallbackResult = generateFallbackAudit(body.url || '', body.biz || '', body.goal || '')

        logAIOperation('ai-audit', 'fallback', { reason: errorType })

        return NextResponse.json({
          success: true,
          result: fallbackResult,
          fallback: true
        })
      } catch {
        // If we can't parse body for fallback, return error
      }
    }

    // Return structured error response
    let errorMessage = getAIErrorMessage(errorType)

    return NextResponse.json(
      { success: false, message: errorMessage },
      { status: 500 }
    )
  }
}
