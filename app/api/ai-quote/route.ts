import { NextRequest, NextResponse } from 'next/server'
import {
  callGemini,
  QUOTE_GENERATION_CONFIG,
  classifyAIError,
  getAIErrorMessage,
  logAIOperation,
  addAIWatermark
} from '@/lib/ai-config'

interface QuoteRequest {
  services: string[] | string
  tier: string
  businessName?: string
  industry?: string
  description?: string
}

interface QuoteResponse {
  success: boolean
  result?: string
  message?: string
  fallback?: boolean
}

/**
 * Generate a fallback quote when AI service is unavailable
 */
function generateFallbackQuote(services: string[], tier: string, businessName: string, industry: string): string {
  const serviceNames = Array.isArray(services) ? services.join(', ') : services
  const tierName = tier.charAt(0).toUpperCase() + tier.slice(1)

  const tierPricing: Record<string, { monthly: number; annual: number }> = {
    starter: { monthly: 7500, annual: 76500 },
    growth: { monthly: 15000, annual: 153000 },
    enterprise: { monthly: 35000, annual: 357000 }
  }

  const pricing = tierPricing[tier.toLowerCase()] || tierPricing.growth

  return `📋 QUOTE SUMMARY

Thank you for your interest in our services, ${businessName || 'Valued Client'}!

We've prepared a ${tierName} package quote for ${serviceNames} services tailored for your ${industry || 'business'} needs.

🎯 SCOPE OF WORK

This package includes professional digital marketing services covering:
• ${serviceNames}
• Dedicated account management
• Monthly reporting and analytics
• Strategy optimization and adjustments

📅 TIMELINE & MILESTONES

• Week 1: Strategy development and kickoff
• Week 2-3: Implementation phase
• Week 4: First performance review
• Ongoing: Monthly optimization cycles

💰 PRICING BREAKDOWN

Monthly: R${pricing.monthly.toLocaleString()}
Annual (15% discount): R${pricing.annual.toLocaleString()}

📈 EXPECTED OUTCOMES & KPIs

• Increased online visibility and brand awareness
• Improved lead generation and conversion rates
• Measurable ROI with detailed monthly reporting
• Scalable growth aligned with your business goals

⚡ TERMS & CONDITIONS

• 12-month minimum commitment for optimal results
• Monthly payment due at start of each cycle
• 30-day notice required for cancellation
• All work is proprietary and confidential

Ready to proceed? Contact us to finalize your ${tierName} package and start your growth journey!`
}

/**
 * Validate request input
 */
function validateInput(body: QuoteRequest): { valid: boolean; error?: string } {
  if (!body.services ||
      (Array.isArray(body.services) && body.services.length === 0) ||
      (typeof body.services === 'string' && body.services.trim() === '')) {
    return { valid: false, error: 'At least one service is required' }
  }

  if (!body.tier || typeof body.tier !== 'string' || body.tier.trim() === '') {
    return { valid: false, error: 'Package tier is required' }
  }

  const validTiers = ['starter', 'growth', 'enterprise']
  if (!validTiers.includes(body.tier.toLowerCase())) {
    return { valid: false, error: 'Invalid tier. Must be starter, growth, or enterprise' }
  }

  return { valid: true }
}

export async function POST(request: NextRequest): Promise<NextResponse<QuoteResponse>> {
  const startTime = Date.now()

  try {
    // Check API key
    if (!process.env.GOOGLE_GENERATIVE_AI_API_KEY) {
      logAIOperation('ai-quote', 'error', { reason: 'API_KEY_MISSING' })
      return NextResponse.json(
        { success: false, message: 'AI service not configured' },
        { status: 503 }
      )
    }

    // Parse and validate request body
    let body: QuoteRequest
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

    const {
      services,
      tier,
      businessName = '',
      industry = '',
      description = ''
    } = body

    const serviceNames = Array.isArray(services) ? services.join(', ') : services
    const tierName = tier.charAt(0).toUpperCase() + tier.slice(1)

    logAIOperation('ai-quote', 'start', {
      tier,
      services: serviceNames,
      business: businessName || 'none'
    })

    const prompt = `You are a senior pricing strategist at Eve-Tech-Studio. Generate professional, detailed quotes for digital marketing services. Be specific about deliverables, timelines, and expected outcomes. Format with clear sections. Use South African Rand (R) currency.

Generate a detailed quote for:

Business: ${businessName || 'Not provided'}
Industry: ${industry || 'Not provided'}
Description: ${description || 'Not provided'}
Selected Services: ${serviceNames}
Package Tier: ${tierName}

Format the quote with these sections:
📋 QUOTE SUMMARY
🎯 SCOPE OF WORK (detailed deliverables for each service)
📅 TIMELINE & MILESTONES
💰 PRICING BREAKDOWN (monthly and annual with 15% annual discount)
📈 EXPECTED OUTCOMES & KPIs
⚡ TERMS & CONDITIONS

Be specific about what's included in each service. Provide realistic pricing based on the tier (Starter = base pricing ~R7,500/mo, Growth = 1.5× ~R15,000/mo, Enterprise = 2.5× ~R35,000/mo).`

    const text = await callGemini(prompt, undefined, QUOTE_GENERATION_CONFIG)
    const textWithWatermark = addAIWatermark(text)

    const duration = Date.now() - startTime
    logAIOperation('ai-quote', 'success', {
      duration: `${duration}ms`,
      resultLength: textWithWatermark.length
    })

    return NextResponse.json({
      success: true,
      result: textWithWatermark
    })

  } catch (error: any) {
    const duration = Date.now() - startTime

    // Classify and log error
    const errorType = classifyAIError(error)
    logAIOperation('ai-quote', 'error', {
      type: errorType,
      message: error?.message,
      duration: `${duration}ms`
    })

    // If it's a recoverable AI error, return fallback response
    if (errorType === 'model_not_found' || errorType === 'rate_limit') {
      try {
        const body = await request.clone().json()
        const services = body.services || []
        const tier = body.tier || 'growth'
        const businessName = body.businessName || ''
        const industry = body.industry || ''

        const fallbackResult = generateFallbackQuote(services, tier, businessName, industry)

        logAIOperation('ai-quote', 'fallback', { reason: errorType })

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
