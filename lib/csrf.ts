/**
 * CSRF Protection Utility
 * Provides CSRF token generation and validation
 */

const CSRF_TOKEN_LENGTH = 32
const CSRF_TOKEN_NAME = 'csrf-token'
const CSRF_HEADER_NAME = 'x-csrf-token'

/**
 * Generate a cryptographically secure CSRF token
 */
export function generateCSRFToken(): string {
  const bytes = new Uint8Array(CSRF_TOKEN_LENGTH)

  // Prefer Web Crypto API (available in edge runtimes and modern Node)
  if (typeof globalThis?.crypto?.getRandomValues === 'function') {
    globalThis.crypto.getRandomValues(bytes)
  } else {
    // Fallback to Node's crypto when available (server runtime)
    try {
      // Use require dynamically to avoid bundler resolving in edge runtimes
      // eslint-disable-next-line @typescript-eslint/no-var-requires
      const nodeCrypto = require('crypto')
      const buf = nodeCrypto.randomBytes(CSRF_TOKEN_LENGTH)
      for (let i = 0; i < CSRF_TOKEN_LENGTH; i++) bytes[i] = buf[i]
    } catch {
      // Last-resort fallback (not cryptographically secure)
      for (let i = 0; i < CSRF_TOKEN_LENGTH; i++) bytes[i] = Math.floor(Math.random() * 256)
    }
  }

  return Array.from(bytes).map(b => b.toString(16).padStart(2, '0')).join('')
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

  // Use a constant-time comparison to prevent timing attacks
  try {
    const a = providedToken
    const b = storedToken

    // Normalize lengths and hex format
    if (a.length !== b.length) return false

    // Convert hex string to bytes
    const len = a.length / 2
    const aBytes = new Uint8Array(len)
    const bBytes = new Uint8Array(len)

    for (let i = 0; i < len; i++) {
      aBytes[i] = parseInt(a.substr(i * 2, 2), 16) || 0
      bBytes[i] = parseInt(b.substr(i * 2, 2), 16) || 0
    }

    let diff = 0
    for (let i = 0; i < len; i++) {
      diff |= aBytes[i] ^ bBytes[i]
    }

    return diff === 0
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
