# Production Deployment Security Guide

## Overview
This guide ensures Eva-Tech Studio's authentication, API security, and infrastructure are production-ready.

---

## 🔴 CRITICAL - Fix Before Production

### 1. Fix Broken Session Validation
**File:** `/lib/auth.ts`  
**Issue:** The synchronous `validateSession()` function is non-functional

**Current Code (BROKEN):**
```typescript
export function validateSession(token: string): boolean {
  supabase
    .from('admin_sessions')
    .select('*')
    .eq('token', token)
    .gt('expires_at', new Date().toISOString())
    .single()
    .then(({ data: session, error }) => {
      if (error || !session) return false
      return session.email.toLowerCase() === AUTHORIZED_EMAIL.toLowerCase()
    })
  
  // This always returns true immediately, before the Promise resolves!
  return true
}
```

**Fix:** Use `validateSessionAsync()` instead everywhere in the codebase.

**Action Items:**
- [ ] Verify all session validation calls use `validateSessionAsync()`
- [ ] Remove the broken `validateSession()` function or mark it as deprecated
- [ ] Add JSDoc warnings

---

### 2. Move Hard-coded Email to Environment Variable

**File:** `/lib/auth.ts`

**Current Code (INSECURE):**
```typescript
const AUTHORIZED_EMAIL = 'stevezuluu@gmail.com'
```

**Fix:**
```typescript
const AUTHORIZED_EMAIL = process.env.AUTHORIZED_EMAIL || 'admin@evatechstudio.com'

if (!AUTHORIZED_EMAIL) {
  throw new Error('AUTHORIZED_EMAIL environment variable is not set')
}
```

**Action Items:**
- [ ] Update `.env.local` with `AUTHORIZED_EMAIL=your-email@example.com`
- [ ] Update `/lib/auth.ts`
- [ ] Add validation on application startup

---

### 3. Enable Secure Cookies for Production

**File:** `/app/api/auth/login/route.ts`

**Current Code (INSECURE for production):**
```typescript
cookieStore.set({
  name: 'admin_session',
  value: token,
  httpOnly: true,
  secure: false,  // ❌ NOT SECURE FOR PRODUCTION
  sameSite: 'lax',
  path: '/',
  maxAge: 24 * 60 * 60
})
```

**Fix:**
```typescript
const isProduction = process.env.NODE_ENV === 'production'

cookieStore.set({
  name: 'admin_session',
  value: token,
  httpOnly: true,
  secure: isProduction,  // ✅ Secure in production
  sameSite: 'strict',     // ✅ Stricter for production
  path: '/',
  maxAge: 24 * 60 * 60
})
```

**Action Items:**
- [ ] Update `/app/api/auth/login/route.ts`
- [ ] Set `NODE_ENV=production` in production environment
- [ ] Test cookies with DevTools in both dev and prod

---

### 4. Validate All Environment Variables on Startup

**Create:** `/lib/env-validation.ts`

```typescript
/**
 * Validate that all required environment variables are set
 * Call this during application startup (in middleware or layout)
 */
export function validateEnvironment() {
  const required = [
    'NEXT_PUBLIC_SUPABASE_URL',
    'NEXT_PUBLIC_SUPABASE_ANON_KEY',
    'GOOGLE_GENERATIVE_AI_API_KEY',
    'AUTHORIZED_EMAIL'
  ]

  const optional = [
    'RESEND_API_KEY',
    'SENTRY_DSN'
  ]

  const missing: string[] = []

  for (const key of required) {
    if (!process.env[key]) {
      missing.push(key)
    }
  }

  if (missing.length > 0) {
    const message = `Missing required environment variables: ${missing.join(', ')}`
    console.error(`[ENV] ${message}`)
    
    if (process.env.NODE_ENV === 'production') {
      throw new Error(message)
    }
  }

  // Log optional variables status
  for (const key of optional) {
    if (!process.env[key]) {
      console.warn(`[ENV] Optional variable not set: ${key}`)
    }
  }
}

// Export version for importing
export const env = {
  supabaseUrl: process.env.NEXT_PUBLIC_SUPABASE_URL!,
  supabaseKey: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
  googleApiKey: process.env.GOOGLE_GENERATIVE_AI_API_KEY!,
  authorizedEmail: process.env.AUTHORIZED_EMAIL!,
  resendKey: process.env.RESEND_API_KEY,
  isProduction: process.env.NODE_ENV === 'production',
  appUrl: process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'
}
```

**Action Items:**
- [ ] Create the file above
- [ ] Call `validateEnvironment()` in `app/layout.tsx`
- [ ] Test with missing variables

---

## 🟡 HIGH PRIORITY - Implement in Next Sprint

### 5. Add Rate Limiting

**Why:** Prevent abuse of AI generation endpoints

**Option A: Using Upstash Redis (Recommended)**

```typescript
import { Ratelimit } from '@upstash/ratelimit'
import { Redis } from '@upstash/redis'

const redis = new Redis({
  url: process.env.UPSTASH_REDIS_REST_URL!,
  token: process.env.UPSTASH_REDIS_REST_TOKEN!,
})

const ratelimit = new Ratelimit({
  redis: Redis.fromEnv(),
  limiter: Ratelimit.slidingWindow(10, '1 h'), // 10 requests per hour
})

// In your API route:
export async function POST(request: NextRequest) {
  const ip = request.ip || 'anonymous'
  const { success, pending, retryAfter } = await ratelimit.limit(ip)

  if (!success) {
    return NextResponse.json(
      { error: 'Rate limit exceeded' },
      { status: 429, headers: { 'Retry-After': retryAfter } }
    )
  }

  // ... rest of your logic
}
```

**Action Items:**
- [ ] Sign up for Upstash Redis (free tier available)
- [ ] Add `@upstash/ratelimit` to dependencies
- [ ] Implement rate limiting on `/api/ai-audit` and `/api/ai-quote`
- [ ] Add rate limiting to `/api/export-pdf`

---

### 6. Add CSRF Protection

**Using Next.js Native CSRF Token:**

```typescript
// lib/csrf.ts
import { cookies } from 'next/headers'
import crypto from 'crypto'

export async function generateCSRFToken(): Promise<string> {
  const cookieStore = await cookies()
  let token = cookieStore.get('csrf-token')?.value

  if (!token) {
    token = crypto.randomBytes(32).toString('hex')
    cookieStore.set('csrf-token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 3600 // 1 hour
    })
  }

  return token
}

export async function validateCSRFToken(token: string): Promise<boolean> {
  const cookieStore = await cookies()
  const storedToken = cookieStore.get('csrf-token')?.value

  if (!storedToken || !token || storedToken !== token) {
    return false
  }

  return true
}
```

**Usage in API Route:**
```typescript
export async function POST(request: NextRequest) {
  const { csrfToken, ...body } = await request.json()

  if (!await validateCSRFToken(csrfToken)) {
    return NextResponse.json(
      { error: 'CSRF token invalid' },
      { status: 403 }
    )
  }

  // ... rest of logic
}
```

**Action Items:**
- [ ] Create CSRF utility
- [ ] Include CSRF tokens in all POST requests
- [ ] Validate tokens in all state-changing endpoints

---

### 7. Configure Content Security Policy (CSP)

**File:** `next.config.js`

```javascript
/** @type {import('next').NextConfig} */
const nextConfig = {
  async headers() {
    return [
      {
        source: '/:path*',
        headers: [
          {
            key: 'Content-Security-Policy',
            value: [
              "default-src 'self'",
              "script-src 'self' 'unsafe-inline' https://cdn.jsdelivr.net",
              "style-src 'self' 'unsafe-inline'",
              "img-src 'self' data: https:",
              "font-src 'self'",
              "connect-src 'self' https://api.google.com https://supabase.co",
              "frame-ancestors 'none'"
            ].join('; ')
          }
        ]
      }
    ]
  }
}

module.exports = nextConfig
```

**Action Items:**
- [ ] Add CSP headers to `next.config.js`
- [ ] Test with browser DevTools Security tab
- [ ] Adjust policy based on actual resources

---

### 8. Add Security Headers

**File:** Create `middleware.ts`

```typescript
import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export function middleware(request: NextRequest) {
  const response = NextResponse.next()

  // Security headers
  response.headers.set('X-Content-Type-Options', 'nosniff')
  response.headers.set('X-Frame-Options', 'DENY')
  response.headers.set('X-XSS-Protection', '1; mode=block')
  response.headers.set('Referrer-Policy', 'strict-origin-when-cross-origin')
  response.headers.set('Permissions-Policy', 'geolocation=(), microphone=(), camera=()')

  return response
}

export const config = {
  matcher: ['/:path*']
}
```

**Action Items:**
- [ ] Create `middleware.ts`
- [ ] Test headers with curl or online tools

---

## 🟢 NICE TO HAVE - Future Enhancements

### 9. Add Request Signing for Webhooks

### 10. Implement Audit Logging

```typescript
// lib/audit-log.ts
interface AuditLog {
  timestamp: Date
  action: string
  user: string
  resource: string
  changes: Record<string, any>
  ipAddress: string
  userAgent: string
}

export async function logAuditEvent(log: AuditLog) {
  const { data, error } = await supabase
    .from('audit_logs')
    .insert(log)

  if (error) {
    console.error('[AUDIT] Failed to log:', error)
  }
}
```

---

## 🔍 Production Deployment Checklist

```markdown
### Before Deploying to Production

**Infrastructure:**
- [ ] Database backups configured
- [ ] CDN configured (if using Vercel, this is automatic)
- [ ] SSL certificate installed (HTTPS enforced)
- [ ] Monitoring and alerting set up (Sentry, LogRocket, etc.)

**Secrets Management:**
- [ ] All environment variables set in production
- [ ] No secrets in code or git history
- [ ] Rotate API keys periodically

**Security:**
- [ ] All critical fixes applied (above)
- [ ] Rate limiting configured
- [ ] CSRF protection implemented
- [ ] Security headers configured
- [ ] Third-party dependencies updated

**Testing:**
- [ ] End-to-end tests passing
- [ ] Security audit completed
- [ ] Load testing performed
- [ ] Fallback scenarios tested

**Monitoring:**
- [ ] Error tracking configured (Sentry)
- [ ] Performance monitoring enabled
- [ ] Real-time alerts set up
- [ ] Log aggregation configured

**Documentation:**
- [ ] README updated with deployment instructions
- [ ] API documentation complete
- [ ] Runbooks created for common issues
- [ ] Team trained on deployment process
```

---

## Testing Production Configuration Locally

### Simulate Production Environment

```bash
# Build and test production build
npm run build
npm run start

# Set environment to production for testing
NODE_ENV=production npm run dev
```

### Verify Security Headers

```bash
# Check security headers
curl -I https://your-domain.com

# Expected headers should include:
# X-Content-Type-Options: nosniff
# X-Frame-Options: DENY
# X-XSS-Protection: 1; mode=block
```

### Test Rate Limiting

```bash
# Simulate rapid requests
for i in {1..15}; do curl -X POST https://your-domain.com/api/ai-audit; done
```

---

## Resources

- [OWASP Security Best Practices](https://owasp.org/www-project-cheat-sheets/)
- [Next.js Security](https://nextjs.org/docs/advanced-features/security-headers)
- [Supabase Security](https://supabase.com/docs/guides/auth)
- [Rate Limiting - Upstash](https://upstash.com/docs/redis/features/ratelimiting)

---

**Last Updated:** May 13, 2026  
**Status:** ✅ Ready for Implementation
