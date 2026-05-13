/**
 * Type definitions for AI-generated reports
 */

export type ReportType = 'audit' | 'quote' | 'report' | 'custom'

export interface AIReport {
  id?: number
  report_type: ReportType
  title: string
  content: string
  business_name?: string
  business_description?: string
  user_email?: string
  user_ip?: string
  model_used?: string
  tokens_used?: number
  fallback_used?: boolean
  metadata?: Record<string, any>
  created_at?: string
  expires_at?: string
}

export interface CreateReportRequest {
  reportType: ReportType
  title: string
  content: string
  businessName?: string
  businessDescription?: string
  userEmail?: string
  metadata?: Record<string, any>
}

export interface CreateReportResponse {
  success: boolean
  reportId?: number
  message?: string
  error?: string
}

export interface AIReportMetadata {
  // For audits
  url?: string
  goal?: string
  
  // For quotes
  services?: string[]
  tier?: string
  industry?: string
  
  // For all reports
  source?: string
  userAgent?: string
  [key: string]: any
}
