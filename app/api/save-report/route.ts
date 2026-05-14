import { NextRequest, NextResponse } from 'next/server'
import { supabase } from '@/lib/supabase'
import { checkRateLimit, contactFormLimiter } from '@/lib/rate-limit'
import { GEMINI_MODEL } from '@/lib/ai-config'
import type { AIReport, CreateReportRequest, CreateReportResponse } from '@/lib/types/ai-reports'

/**
 * POST /api/save-report
 * Save AI-generated reports (audits, quotes) to database for persistence
 * 
 * Request body:
 * - reportType: 'audit' | 'quote' | 'report' | 'custom'
 * - title: string - Report title
 * - content: string - Report content
 * - businessName: string (optional)
 * - businessDescription: string (optional)
 * - userEmail: string (optional)
 * - metadata: object (optional) - Additional data
 */
export async function POST(request: NextRequest): Promise<NextResponse<CreateReportResponse>> {
  const startTime = Date.now()

  try {
    // Get client IP for rate limiting and logging
    const clientIp = request.ip || request.headers.get('x-forwarded-for') || 'unknown'

    // Check rate limiting
    const rateLimitCheck = checkRateLimit(contactFormLimiter, clientIp)
    if (!rateLimitCheck.allowed) {
      return NextResponse.json(
        {
          success: false,
          error: `Rate limited. Please try again in ${Math.ceil((rateLimitCheck.resetTime - Date.now()) / 1000)} seconds`
        },
        {
          status: 429,
          headers: {
            'Retry-After': Math.ceil((rateLimitCheck.resetTime - Date.now()) / 1000).toString(),
            'X-RateLimit-Remaining': rateLimitCheck.remaining.toString()
          }
        }
      )
    }

    // Parse request body
    let body: CreateReportRequest
    try {
      body = await request.json()
    } catch {
      return NextResponse.json(
        { success: false, error: 'Invalid JSON in request body' },
        { status: 400 }
      )
    }

    // Validate required fields
    if (!body.reportType || typeof body.reportType !== 'string') {
      return NextResponse.json(
        { success: false, error: 'reportType is required' },
        { status: 400 }
      )
    }

    if (!body.title || typeof body.title !== 'string' || body.title.trim().length === 0) {
      return NextResponse.json(
        { success: false, error: 'title is required and must be non-empty' },
        { status: 400 }
      )
    }

    if (!body.content || typeof body.content !== 'string' || body.content.trim().length === 0) {
      return NextResponse.json(
        { success: false, error: 'content is required and must be non-empty' },
        { status: 400 }
      )
    }

    // Validate report type
    const validTypes = ['audit', 'quote', 'report', 'custom']
    if (!validTypes.includes(body.reportType)) {
      return NextResponse.json(
        { success: false, error: `reportType must be one of: ${validTypes.join(', ')}` },
        { status: 400 }
      )
    }

    console.log('[SAVE-REPORT] Processing report:', {
      type: body.reportType,
      title: body.title.substring(0, 50),
      contentLength: body.content.length,
      businessName: body.businessName,
      userEmail: body.userEmail,
      ip: clientIp
    })

    // Create report object
    const report: AIReport = {
      report_type: body.reportType as any,
      title: body.title,
      content: body.content,
      business_name: body.businessName,
      business_description: body.businessDescription,
      user_email: body.userEmail,
      user_ip: clientIp,
      model_used: GEMINI_MODEL || (process.env.GOOGLE_AI_MODEL || 'unknown'),
      fallback_used: false,
      metadata: body.metadata || {}
    }

    // Save to database
    const { data, error } = await supabase
      .from('ai_reports')
      .insert(report)
      .select('id')
      .single()

    if (error) {
      console.error('[SAVE-REPORT] Database error:', error)
      return NextResponse.json(
        {
          success: false,
          error: `Failed to save report: ${error.message}`
        },
        { status: 500 }
      )
    }

    const duration = Date.now() - startTime

    console.log('[SAVE-REPORT] Report saved successfully:', {
      reportId: data?.id,
      duration: `${duration}ms`,
      remaining: rateLimitCheck.remaining
    })

    return NextResponse.json(
      {
        success: true,
        reportId: data?.id,
        message: 'Report saved successfully'
      },
      {
        status: 201,
        headers: {
          'X-RateLimit-Remaining': rateLimitCheck.remaining.toString(),
          'X-RateLimit-ResetTime': new Date(rateLimitCheck.resetTime).toISOString()
        }
      }
    )
  } catch (error) {
    console.error('[SAVE-REPORT] Unexpected error:', error)

    return NextResponse.json(
      {
        success: false,
        error: 'An unexpected error occurred'
      },
      { status: 500 }
    )
  }
}

/**
 * GET /api/save-report?id=:reportId
 * Retrieve a saved report by ID
 */
export async function GET(request: NextRequest): Promise<NextResponse> {
  try {
    const { searchParams } = new URL(request.url)
    const reportId = searchParams.get('id')

    if (!reportId) {
      return NextResponse.json(
        { success: false, error: 'reportId is required' },
        { status: 400 }
      )
    }

    const { data, error } = await supabase
      .from('ai_reports')
      .select('*')
      .eq('id', reportId)
      .single()

    if (error) {
      console.error('[GET-REPORT] Database error:', error)
      return NextResponse.json(
        { success: false, error: 'Report not found' },
        { status: 404 }
      )
    }

    return NextResponse.json({
      success: true,
      report: data
    })
  } catch (error) {
    console.error('[GET-REPORT] Error:', error)
    return NextResponse.json(
      { success: false, error: 'An error occurred' },
      { status: 500 }
    )
  }
}

/**
 * OPTIONS /api/save-report
 * CORS preflight
 */
export async function OPTIONS(): Promise<NextResponse> {
  return NextResponse.json({}, {
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'POST, GET, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type'
    }
  })
}
