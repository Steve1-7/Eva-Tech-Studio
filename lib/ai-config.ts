/**
 * Shared AI configuration and utilities for Eve-Tech-Studio
 * Centralizes model names, error handling, and common functions
 */

import { GoogleGenerativeAI } from '@google/generative-ai'

// Valid Gemini model - using gemini-3-flash-preview
// DO NOT use deprecated suffixes like "-latest" as they cause 404 errors
export const GEMINI_MODEL = 'gemini-3-flash-preview'

// Alternative models if needed:
// export const GEMINI_MODEL_PRO = 'gemini-1.5-pro'
// export const GEMINI_MODEL_FLASH_2 = 'gemini-2.0-flash-exp'

// Generation config defaults
export const DEFAULT_GENERATION_CONFIG = {
  temperature: 0.7,
  maxOutputTokens: 2048,
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

  if (!process.env.GOOGLE_GENERATIVE_AI_API_KEY) {
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
 * Initialize Gemini AI with proper configuration
 */
export function initializeGeminiAI(): GoogleGenerativeAI | null {
  const apiKey = process.env.GOOGLE_GENERATIVE_AI_API_KEY

  if (!apiKey) {
    console.error('[AI-CONFIG] GOOGLE_GENERATIVE_AI_API_KEY not configured')
    return null
  }

  try {
    return new GoogleGenerativeAI(apiKey)
  } catch (error) {
    console.error('[AI-CONFIG] Failed to initialize Gemini AI:', error)
    return null
  }
}

/**
 * Check if API key is configured
 */
export function isAIConfigured(): boolean {
  return !!process.env.GOOGLE_GENERATIVE_AI_API_KEY
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
