import { NextRequest, NextResponse } from 'next/server'
import { generatePDF, formatTextForPDF } from '@/lib/pdf-export'

interface PDFExportRequest {
  title: string
  content: string
  filename?: string
  contentType?: 'audit' | 'quote' | 'report' | 'custom'
}

interface PDFExportResponse {
  success: boolean
  message?: string
  error?: string
  filename?: string
}

/**
 * POST /api/export-pdf
 * Generate and return PDF file for AI-generated content
 * 
 * Request body:
 * - title: string - PDF document title
 * - content: string - Plain text or HTML content to export
 * - filename: string (optional) - Custom filename for download
 * - contentType: string (optional) - Type of content (audit, quote, report, custom)
 */
export async function POST(request: NextRequest): Promise<NextResponse> {
  const startTime = Date.now()

  try {
    // Parse request body
    let body: PDFExportRequest
    try {
      body = await request.json()
    } catch {
      return NextResponse.json(
        { success: false, error: 'Invalid JSON in request body' },
        { status: 400 }
      )
    }

    // Validate required fields
    const { title, content, filename, contentType = 'custom' } = body

    if (!title || typeof title !== 'string' || title.trim().length === 0) {
      return NextResponse.json(
        { success: false, error: 'Title is required and must be a non-empty string' },
        { status: 400 }
      )
    }

    if (!content || typeof content !== 'string' || content.trim().length === 0) {
      return NextResponse.json(
        { success: false, error: 'Content is required and must be a non-empty string' },
        { status: 400 }
      )
    }

    // Generate filename if not provided
    const timestamp = new Date().toISOString().split('T')[0]
    const finalFilename =
      filename ||
      `eva-tech-${contentType}-${timestamp}.pdf`

    console.log('[PDF-EXPORT] Generating PDF:', {
      title: title.substring(0, 50),
      contentLength: content.length,
      contentType,
      filename: finalFilename
    })

    // Format content for PDF (remove HTML tags, clean formatting)
    const formattedContent = formatTextForPDF(content)

    // Generate PDF using the utility
    const pdf = await generatePDF({
      title,
      content: formattedContent,
      filename: finalFilename,
      includeLogo: true,
      includeTimestamp: true
    })

    // Get PDF as bytes
    const pdfBuffer = Buffer.from(pdf.output('arraybuffer'))

    console.log('[PDF-EXPORT] PDF generated successfully:', {
      size: pdfBuffer.length,
      duration: `${Date.now() - startTime}ms`
    })

    // Return PDF as downloadable file
    const response = new NextResponse(pdfBuffer, {
      status: 200,
      headers: {
        'Content-Type': 'application/pdf',
        'Content-Disposition': `attachment; filename="${finalFilename}"`,
        'Content-Length': pdfBuffer.length.toString(),
        'Cache-Control': 'no-store, no-cache, must-revalidate, proxy-revalidate',
        'Pragma': 'no-cache',
        'Expires': '0'
      }
    })

    return response
  } catch (error) {
    console.error('[PDF-EXPORT] Error generating PDF:', error)

    const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred'

    return NextResponse.json(
      {
        success: false,
        error: `Failed to generate PDF: ${errorMessage}`
      },
      { status: 500 }
    )
  }
}

/**
 * OPTIONS /api/export-pdf
 * CORS preflight request handler
 */
export async function OPTIONS(): Promise<NextResponse> {
  return NextResponse.json({}, {
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'POST, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type'
    }
  })
}
