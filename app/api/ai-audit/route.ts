import { NextRequest, NextResponse } from 'next/server'
import { google } from '@ai-sdk/google'
import { generateText } from 'ai'

export async function POST(request: NextRequest) {
  try {
    const { url, biz, goal } = await request.json()

    if (!biz?.trim()) {
      return NextResponse.json({ error: 'Business description is required' }, { status: 400 })
    }

    const prompt = `You are a senior digital growth strategist at Eve-Tech-Studio. Write concise, expert growth audits. Format with emoji section headers. Be specific and action-oriented. Under 350 words.

Write a growth audit for:
Website: ${url || 'Not provided'}
Business: ${biz}
Goal: ${goal || 'Increase revenue'}

Sections:
🔍 CURRENT GAPS
🚀 TOP 3 GROWTH OPPORTUNITIES
📊 QUICK WINS (next 30 days)
💡 LONG-TERM STRATEGY
⚡ EVE-TECH-STUDIO RECOMMENDATION`

    const { text } = await generateText({
      model: google('gemini-1.5-flash'),
      prompt,
    })

    return NextResponse.json({ result: text })
  } catch (error) {
    console.error('AI Audit API error:', error)
    return NextResponse.json(
      { error: 'Unable to generate audit. Please try again or contact us directly.' },
      { status: 500 }
    )
  }
}
