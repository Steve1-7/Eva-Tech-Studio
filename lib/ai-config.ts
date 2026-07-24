/**
 * Shared AI configuration and utilities for Eva-Tech-Studio
 * Centralizes model names, error handling, and common functions
 */

import { generateText } from 'ai'

// Model priority list for automatic fallback
// Models are tried in order; if one fails, the next is attempted.
// Requests are routed through the Vercel AI Gateway (uses AI_GATEWAY_API_KEY),
// so models are referenced with `provider/model` strings.
// Allow override with env var GOOGLE_AI_MODEL (comma-separated) for flexibility.
const envModels = process.env.GOOGLE_AI_MODEL
  ? process.env.GOOGLE_AI_MODEL.split(',').map(s => s.trim()).filter(Boolean)
  : []

export const MODELS = (
  envModels.length > 0
    ? envModels
    : [
        'google/gemini-2.5-flash', // Fast, stable, production-ready
        'google/gemini-2.5-pro', // Secondary: higher-capacity fallback
      ]
)

// Legacy single model reference (kept for compatibility)
export const GEMINI_MODEL = MODELS[0]

// Generation config defaults
export const DEFAULT_GENERATION_CONFIG = {
  temperature: 0.7,
  maxOutputTokens: 2048,
}

// Request timeout in milliseconds
export const REQUEST_TIMEOUT = 30000

// Delay between model fallback attempts (exponential backoff base)
export const RETRY_DELAY_BASE = 1000

/**
 * Robust Gemini AI request handler with automatic model fallback
 * Tries each model in priority order with exponential backoff
 * @param prompt - The prompt text to send to the AI
 * @param apiKey - Optional API key (falls back to env var)
 * @param config - Optional generation config
 * @returns The AI response text
 * @throws Error if all models fail
 */
export async function callGemini(
  prompt: string,
  apiKey?: string,
  config: Partial<typeof DEFAULT_GENERATION_CONFIG> = {}
): Promise<string> {
  // Requests are routed through the Vercel AI Gateway, which authenticates via
  // the AI_GATEWAY_API_KEY environment variable. The optional apiKey argument is
  // kept for backwards compatibility but is no longer required.
  if (!apiKey && !process.env.AI_GATEWAY_API_KEY) {
    throw new Error('AI_GATEWAY_API_KEY is not set')
  }

  const generationConfig = { ...DEFAULT_GENERATION_CONFIG, ...config }

  let lastError: Error | null = null

  for (let i = 0; i < MODELS.length; i++) {
    const model = MODELS[i]
    const attemptDelay = i > 0 ? RETRY_DELAY_BASE * Math.pow(2, i - 1) : 0

    if (attemptDelay > 0) {
      console.log(`[AI-FALLBACK] Waiting ${attemptDelay}ms before trying model ${model}...`)
      await new Promise(resolve => setTimeout(resolve, attemptDelay))
    }

    try {
      console.log(`[AI-FALLBACK] Attempting model ${model} (${i + 1}/${MODELS.length})...`)

      const { text } = await generateText({
        model,
        prompt,
        temperature: generationConfig.temperature,
        maxOutputTokens: generationConfig.maxOutputTokens,
        timeout: REQUEST_TIMEOUT,
        ...(apiKey ? { headers: { Authorization: `Bearer ${apiKey}` } } : {}),
      })

      if (!text || text.trim().length === 0) {
        throw new Error('Empty response from model')
      }

      console.log(`[AI-FALLBACK] Success with model ${model}`)
      return text

    } catch (error: any) {
      lastError = error
      const errorMessage = error?.message || String(error)
      console.warn(`[AI-FALLBACK] Model ${model} failed:`, errorMessage)

      // Try the next model in the priority list; surface the error later if all fail.
      continue
    }
  }

  // All models failed
  throw new Error(
    `All Gemini models failed. Last error: ${lastError?.message || 'Unknown error'}`
  )
}

export const QUOTE_GENERATION_CONFIG = {
  temperature: 0.7,
  maxOutputTokens: 4096, // Longer content for quotes
}

/**
 * Error types for AI service
 */
export type AIErrorType = 'model_not_found' | 'rate_limit' | 'timeout' | 'unknown' | 'config_missing'

/**
 * Add subtle watermark to AI-generated content
 * @param content - The AI-generated text
 * @returns Content with watermark appended
 */
export function addAIWatermark(content: string): string {
  const watermark = '\n\n---\n*Powered by Eva-Tech-Studio*'
  return content.trim() + watermark
}

/**
 * Classify an AI error into a specific type
 */
export function classifyAIError(error: any): AIErrorType {
  const message = error?.message?.toLowerCase() || ''

  if (error?.status === 404 || message.includes('404') || message.includes('not found') || message.includes('model')) {
    return 'model_not_found'
  }

  if (error?.status === 429 || message.includes('429') || message.includes('rate limit') || message.includes('quota')) {
    return 'rate_limit'
  }

  if (message.includes('timeout') || message.includes('etimedout') || message.includes('econnreset')) {
    return 'timeout'
  }

  if (!process.env.AI_GATEWAY_API_KEY) {
    return 'config_missing'
  }

  return 'unknown'
}

/**
 * Get user-friendly error message for an AI error
 */
export function getAIErrorMessage(errorType: AIErrorType): string {
  const messages: Record<AIErrorType, string> = {
    model_not_found: 'AI configuration error. Our team has been notified.',
    rate_limit: 'AI service is temporarily busy. Please try again in a moment.',
    timeout: 'Request timed out. Please try again.',
    config_missing: 'AI service not configured. Please contact support.',
    unknown: 'Unable to process request. Please try again or contact us directly.',
  }

  return messages[errorType]
}

/**
 * Log AI operation with clean, structured format
 */
export function logAIOperation(
  endpoint: string,
  status: 'start' | 'success' | 'error' | 'fallback',
  details?: Record<string, any>
): void {
  const timestamp = new Date().toISOString()
  const prefix = `[${endpoint.toUpperCase()}]`

  switch (status) {
    case 'start':
      console.log(`${prefix} Starting | ${JSON.stringify(details || {})}`)
      break
    case 'success':
      console.log(`${prefix} Success | ${JSON.stringify(details || {})}`)
      break
    case 'error':
      console.error(`${prefix} Error | ${JSON.stringify(details || {})}`)
      break
    case 'fallback':
      console.log(`${prefix} Fallback | ${JSON.stringify(details || {})}`)
      break
  }
}

/**
 * Check if the AI Gateway is configured
 */
export function isAIConfigured(): boolean {
  return !!process.env.AI_GATEWAY_API_KEY
}

/**
 * Structured response types
 */
export interface AISuccessResponse<T = string> {
  success: true
  result: T
  fallback?: boolean
}

export interface AIErrorResponse {
  success: false
  message: string
}

export type AIResponse<T = string> = AISuccessResponse<T> | AIErrorResponse
