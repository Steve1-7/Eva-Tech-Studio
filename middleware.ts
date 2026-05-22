import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { generateCSRFToken, needsCSRFProtection, extractCSRFToken, validateCSRFToken } from '@/lib/csrf'

/**
 * Security Headers Middleware
 * Adds comprehensive security headers to all responses
 */
export function middleware(request: NextRequest) {
  const response = NextResponse.next()
  const pathname = request.nextUrl.pathname

  // ════════════════════════════════════════════════════════════
  // CONTENT SECURITY POLICY
  // ════════════════════════════════════════════════════════════
  const cspHeader = [
    // Default: only allow same-origin
    "default-src 'self'",
    // Scripts: same-origin + inline for Next.js + trusted CDNs + Elfsight
    "script-src 'self' 'unsafe-inline' 'unsafe-eval' https://cdn.jsdelivr.net https://unpkg.com https://elfsightcdn.com https://static.elfsight.com https://apps.elfsight.com https://universe-static.elfsightcdn.com",
    // Styles: same-origin + inline + Elfsight widget
    "style-src 'self' 'unsafe-inline' https://elfsightcdn.com https://static.elfsight.com https://apps.elfsight.com https://universe-static.elfsightcdn.com",
    // Images: any source (CDN images)
    "img-src 'self' data: https: blob:",
    // Fonts: same-origin + Google Fonts + Elfsight
    "font-src 'self' data: https://fonts.gstatic.com https://elfsightcdn.com https://static.elfsight.com",
    // Connect: APIs we use + Elfsight Google Reviews widget (incl. nested service hosts)
    "connect-src 'self' https://*.supabase.co https://api.google.com https://generativelanguage.googleapis.com https://www.google-analytics.com https://*.elfsight.com https://*.elfsightcdn.com https://elfsightcdn.com https://static.elfsight.com https://apps.elfsight.com https://core.service.elfsight.com https://service-reviews.elfsight.com https://storage.elfsight.com https://universe-static.elfsightcdn.com https://widget-data.service.elfsight.com",
    // Embedded widget iframes
    "frame-src 'self' https://*.elfsight.com https://*.elfsightcdn.com https://apps.elfsight.com https://www.google.com",
    // Frames: none (prevent clickjacking)
    "frame-ancestors 'none'",
    // Form actions
    "form-action 'self'",
    // Base URI
    "base-uri 'self'"
  ].join('; ')

  response.headers.set('Content-Security-Policy', cspHeader)

  // ════════════════════════════════════════════════════════════
  // CLICKJACKING PROTECTION
  // ════════════════════════════════════════════════════════════
  response.headers.set('X-Frame-Options', 'DENY')

  // ════════════════════════════════════════════════════════════
  // XSS PROTECTION
  // ════════════════════════════════════════════════════════════
  response.headers.set('X-XSS-Protection', '1; mode=block')
  response.headers.set('X-Content-Type-Options', 'nosniff')

  // ════════════════════════════════════════════════════════════
  // REFERRER POLICY
  // ════════════════════════════════════════════════════════════
  // Don't send referrer to cross-origin requests
  response.headers.set('Referrer-Policy', 'strict-origin-when-cross-origin')

  // ════════════════════════════════════════════════════════════
  // PERMISSIONS POLICY (Formerly Feature Policy)
  // ════════════════════════════════════════════════════════════
  // Disable dangerous features by default
  const permissionsPolicy = [
    'geolocation=()',
    'microphone=()',
    'camera=()',
    'payment=()',
    'usb=()',
    'magnetometer=()',
    'gyroscope=()',
    'accelerometer=()'
  ].join(', ')
  response.headers.set('Permissions-Policy', permissionsPolicy)

  // ════════════════════════════════════════════════════════════
  // HTTPS ENFORCEMENT
  // ════════════════════════════════════════════════════════════
  response.headers.set('Strict-Transport-Security', 'max-age=31536000; includeSubDomains')

  // ════════════════════════════════════════════════════════════
  // CSRF TOKEN HANDLING
  // ════════════════════════════════════════════════════════════
  // Generate and set CSRF token for forms
  if (!request.cookies.has('csrf-token')) {
    const token = generateCSRFToken()
    response.cookies.set('csrf-token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 3600 * 24 // 24 hours
    })
  }

  return response
}

/**
 * Configure which routes the middleware applies to
 * Exclude static files, images, etc.
 */
export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api/auth (auth endpoints)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     */
    '/((?!_next/static|_next/image|favicon.ico|.*\\.svg$).*)'
  ]
}
