/**
 * Optional Upstash-backed rate limiter helper.
 * Falls back to returning null if Upstash is not configured or the package is unavailable.
 */
import type { Redis } from '@upstash/redis'

let redisClient: Redis | null = null

function getRedis() {
  if (redisClient) return redisClient
  try {
    const { Redis: RedisLib } = require('@upstash/redis')
    const url = process.env.UPSTASH_REDIS_REST_URL
    const token = process.env.UPSTASH_REDIS_REST_TOKEN
    if (!url || !token) return null
    redisClient = new RedisLib({ url, token })
    return redisClient
  } catch (err) {
    console.warn('[Upstash] @upstash/redis not installed or failed to initialize:', err?.message || err)
    return null
  }
}

export async function upstashRateLimit(key: string, windowSeconds: number, maxRequests: number) {
  const redis = getRedis()
  if (!redis) return null
  try {
    const storeKey = `ratelimit:${key}`
    const current = await redis.incr(storeKey)
    if (current === 1) {
      await redis.expire(storeKey, windowSeconds)
    }
    const ttl = await redis.ttl(storeKey)
    const allowed = current <= maxRequests
    const remaining = Math.max(0, maxRequests - current)
    const resetTime = Date.now() + (ttl || windowSeconds) * 1000
    return { allowed, remaining, resetTime }
  } catch (err) {
    console.warn('[Upstash] Rate limit check failed:', err?.message || err)
    return null
  }
}
