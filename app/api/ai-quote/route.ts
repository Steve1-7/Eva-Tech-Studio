import { NextRequest, NextResponse } from 'next/server'
import { google } from '@ai-sdk/google'
import { generateText } from 'ai'

export async function POST(request: NextRequest) {
  try {
    // Check API key
    if (!process.env.GOOGLE_GENERATIVE_AI_API_KEY) {
      console.error('GOOGLE_GENERATIVE_AI_API_KEY not set')
      return NextResponse.json({ error: 'AI service not configured' }, { status: 500 })
    }

    const { services, tier, businessName, industry, description } = await request.json()

    if (!services?.length || !tier) {
      return NextResponse.json({ error: 'Services and tier are required' }, { status: 400 })
    }

    console.log('Generating quote for:', { services, tier, businessName })

    const serviceNames = services.join(', ')
    const tierName = tier.charAt(0).toUpperCase() + tier.slice(1)

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

Be specific about what's included in each service. Provide realistic pricing based on the tier (Starter = base pricing, Growth = 1.5×, Enterprise = 2.5×).`

    const { text } = await generateText({
      model: google('gemini-1.5-flash'),
      prompt,
    })

    return NextResponse.json({ result: text })
  } catch (error) {
    console.error('AI Quote API error:', error)
    return NextResponse.json(
      { error: 'Unable to generate quote. Please try again or contact us directly.' },
      { status: 500 }
    )
  }
}
