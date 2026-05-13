/**
 * CSRF Protection Utility
 * Provides CSRF token generation and validation
 */

import crypto from 'crypto'

const CSRF_TOKEN_LENGTH = 32
const CSRF_TOKEN_NAME = 'csrf-token'
const CSRF_HEADER_NAME = 'x-csrf-token'

/**
 * Generate a cryptographically secure CSRF token
 */
export function generateCSRFToken(): string {
  return crypto.randomBytes(CSRF_TOKEN_LENGTH).toString('hex')
}

/**
 * Validate CSRF token
 * Compares provided token with stored token
 */
export function validateCSRFToken(
  providedToken: string | null | undefined,
  storedToken: string | null | undefined
): boolean {
  if (!providedToken || !storedToken) {
    return false
  }

  // Use timing-safe comparison to prevent timing attacks
  try {
    return crypto.timingSafeEqual(
      Buffer.from(providedToken),
      Buffer.from(storedToken)
    )
  } catch {
    return false
  }
}

/**
 * Extract CSRF token from request
 * Checks header first (for AJAX/API), then body
 */
export function extractCSRFToken(
  headers: Record<string, string | string[] | undefined>,
  body?: any
): string | null {
  // Check header first (preferred for APIs)
  const headerToken = headers[CSRF_HEADER_NAME]
  if (headerToken && typeof headerToken === 'string') {
    return headerToken
  }

  // Check request body
  if (body?.csrfToken && typeof body.csrfToken === 'string') {
    return body.csrfToken
  }

  return null
}

/**
 * Methods that should be protected with CSRF
 */
export const CSRF_PROTECTED_METHODS = ['POST', 'PUT', 'DELETE', 'PATCH']

/**
 * Safe routes that don't need CSRF protection
 * (e.g., public APIs, read-only endpoints)
 */
export const CSRF_SAFE_ROUTES = [
  '/api/ai-audit', // These generate content, not modify state
  '/api/ai-quote',
  '/api/blog', // GET requests are safe
  '/api/blog/[id]'
]

/**
 * Check if route needs CSRF protection
 */
export function needsCSRFProtection(
  method: string,
  pathname: string
): boolean {
  if (!CSRF_PROTECTED_METHODS.includes(method)) {
    return false
  }

  // Check if route is in safe list
  for (const safeRoute of CSRF_SAFE_ROUTES) {
    if (pathname === safeRoute || pathname.match(safeRoute)) {
      return false
    }
  }

  return true
}

/**
 * CSRF token payload for responses
 */
export interface CSRFTokenPayload {
  token: string
  headerName: string
  paramName: string
}

/**
 * Get CSRF token payload for frontend
 */
export function getCSRFTokenPayload(): CSRFTokenPayload {
  return {
    token: generateCSRFToken(),
    headerName: CSRF_HEADER_NAME,
    paramName: 'csrfToken'
  }
}
