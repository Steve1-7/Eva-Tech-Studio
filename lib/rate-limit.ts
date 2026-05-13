/**
 * Rate Limiting Utility
 * Provides in-memory rate limiting for development and API endpoints
 * For production, consider using Upstash Redis for distributed rate limiting
 */

interface RateLimitConfig {
  windowMs: number // Time window in milliseconds
  maxRequests: number // Max requests per window
}

interface RateLimitEntry {
  count: number
  resetTime: number
}

class RateLimiter {
  private store: Map<string, RateLimitEntry> = new Map()
  private windowMs: number
  private maxRequests: number
  private cleanupInterval: NodeJS.Timeout

  constructor(config: RateLimitConfig = { windowMs: 60000, maxRequests: 10 }) {
    this.windowMs = config.windowMs
    this.maxRequests = config.maxRequests

    // Clean up expired entries every minute
    this.cleanupInterval = setInterval(() => this.cleanup(), 60000)
  }

  /**
   * Check if a key has exceeded rate limit
   * Returns true if request is allowed, false if rate limited
   */
  isAllowed(key: string): boolean {
    const now = Date.now()
    const entry = this.store.get(key)

    // No entry or window expired
    if (!entry || now > entry.resetTime) {
      this.store.set(key, {
        count: 1,
        resetTime: now + this.windowMs
      })
      return true
    }

    // Check if limit exceeded
    if (entry.count >= this.maxRequests) {
      return false
    }

    // Increment counter
    entry.count++
    return true
  }

  /**
   * Get remaining requests for a key
   */
  getRemaining(key: string): number {
    const entry = this.store.get(key)
    if (!entry || Date.now() > entry.resetTime) {
      return this.maxRequests
    }
    return Math.max(0, this.maxRequests - entry.count)
  }

  /**
   * Get reset time for a key
   */
  getResetTime(key: string): number {
    const entry = this.store.get(key)
    return entry?.resetTime || Date.now() + this.windowMs
  }

  /**
   * Clean up expired entries
   */
  private cleanup(): void {
    const now = Date.now()
    for (const [key, entry] of this.store.entries()) {
      if (now > entry.resetTime) {
        this.store.delete(key)
      }
    }
  }

  /**
   * Destroy the limiter and cleanup interval
   */
  destroy(): void {
    clearInterval(this.cleanupInterval)
    this.store.clear()
  }
}

// Export singleton instances for different endpoints
export const aiAuditLimiter = new RateLimiter({
  windowMs: 3600000, // 1 hour
  maxRequests: 5 // 5 audits per hour per IP
})

export const aiQuoteLimiter = new RateLimiter({
  windowMs: 3600000, // 1 hour
  maxRequests: 5 // 5 quotes per hour per IP
})

export const pdfExportLimiter = new RateLimiter({
  windowMs: 300000, // 5 minutes
  maxRequests: 10 // 10 exports per 5 minutes per IP
})

export const contactFormLimiter = new RateLimiter({
  windowMs: 3600000, // 1 hour
  maxRequests: 3 // 3 contact forms per hour per IP
})

/**
 * Express/Next.js compatible rate limit check
 */
export function checkRateLimit(
  limiter: RateLimiter,
  key: string
): { allowed: boolean; remaining: number; resetTime: number } {
  return {
    allowed: limiter.isAllowed(key),
    remaining: limiter.getRemaining(key),
    resetTime: limiter.getResetTime(key)
  }
}
