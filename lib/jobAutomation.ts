import { createHash, createHmac, timingSafeEqual } from 'node:crypto'

export interface ExtractedJobFields {
  title?: string
  company?: string
  location?: string
  jobType?: string
  salary?: string
  description?: string
  applyUrl?: string
  sourceUrl?: string
  deadline?: string
  category?: string
  remote?: boolean
}

export function isSafeHttpsUrl(value: string): boolean {
  try {
    const url = new URL(value)
    const host = url.hostname.toLowerCase().replace(/^\[|\]$/g, '')
    return url.protocol === 'https:'
      && !url.username
      && !url.password
      && host.includes('.')
      && !host.endsWith('.local')
      && !host.endsWith('.localhost')
      && !host.endsWith('.internal')
      && host !== 'localhost'
      && !/^\d{1,3}(?:\.\d{1,3}){3}$/.test(host)
      && !host.includes(':')
  } catch {
    return false
  }
}

export function isValidDateOnly(value: string): boolean {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(value)) return false
  const date = new Date(`${value}T00:00:00.000Z`)
  return !Number.isNaN(date.getTime()) && date.toISOString().slice(0, 10) === value
}

const fieldLabels: Record<string, keyof ExtractedJobFields> = {
  title: 'title',
  position: 'title',
  company: 'company',
  employer: 'company',
  location: 'location',
  type: 'jobType',
  'employment type': 'jobType',
  salary: 'salary',
  description: 'description',
  responsibilities: 'description',
  'application url': 'applyUrl',
  'apply url': 'applyUrl',
  'application link': 'applyUrl',
  'source url': 'sourceUrl',
  deadline: 'deadline',
  'closing date': 'deadline',
  category: 'category',
  remote: 'remote',
}

export function extractJobFields(message: string): ExtractedJobFields {
  const fields: ExtractedJobFields = {}

  for (const line of message.split(/\r?\n/)) {
    const match = line.match(/^\s*([a-z ]+)\s*:\s*(.*?)\s*$/i)
    if (!match) continue

    const key = fieldLabels[match[1].toLowerCase().trim()]
    const value = match[2].trim()
    if (!key || !value) continue

    if (key === 'remote') {
      if (/^(yes|true|remote)$/i.test(value)) fields.remote = true
      else if (/^(no|false|onsite|on-site)$/i.test(value)) fields.remote = false
      continue
    }

    fields[key] = value
  }

  return fields
}

export function validateJobFields(fields: ExtractedJobFields, now = new Date()): string[] {
  const errors: string[] = []
  if (!fields.title?.trim()) errors.push('Job title is required.')
  if (!fields.company?.trim()) errors.push('Company is required.')
  if (!fields.description?.trim()) errors.push('Job description is required.')
  if (!fields.applyUrl?.trim()) errors.push('Application URL is required.')
  if (fields.title && fields.title.length > 200) errors.push('Job title must be 200 characters or fewer.')
  if (fields.company && fields.company.length > 200) errors.push('Company name must be 200 characters or fewer.')
  if (fields.description && fields.description.length > 20_000) errors.push('Job description must be 20,000 characters or fewer.')
  if (fields.applyUrl && fields.applyUrl.length > 2048) errors.push('Application URL must be 2,048 characters or fewer.')
  if (fields.sourceUrl && fields.sourceUrl.length > 2048) errors.push('Source URL must be 2,048 characters or fewer.')

  for (const [label, value] of [['Application URL', fields.applyUrl], ['Source URL', fields.sourceUrl]] as const) {
    if (!value) continue
    if (!isSafeHttpsUrl(value)) errors.push(`${label} must be a safe public HTTPS URL.`)
  }

  if (fields.deadline) {
    const deadline = new Date(`${fields.deadline}T23:59:59.999Z`)
    if (!isValidDateOnly(fields.deadline)) {
      errors.push('Deadline must be a valid calendar date in YYYY-MM-DD format.')
    } else if (deadline < now) {
      errors.push('The application deadline has passed.')
    }
  }

  const suspicious = /\b(application fee|processing fee|pay to apply|send (?:your )?(?:password|otp|one[- ]time code)|(?:request|send|share|provide|upload) (?:your )?(?:passport|national id|identity card|bank details|bank account|social security number))\b/i
  if (suspicious.test([fields.title, fields.description, fields.applyUrl].filter(Boolean).join('\n'))) {
    errors.push('Potentially suspicious payment or credential request; manual review is required.')
  }

  return errors
}

export function createJobSlug(title: string, company: string, suffix: string): string {
  const base = `${title}-${company}`
    .normalize('NFKD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '')
    .slice(0, 100)

  return `${base || 'job'}-${suffix.toLowerCase().replace(/[^a-z0-9]/g, '').slice(0, 8)}`
}

export function hashJobContent(fields: ExtractedJobFields): string {
  const normalized = [
    fields.title,
    fields.company,
    fields.description,
    fields.applyUrl,
  ].map(value => value?.trim().toLowerCase().replace(/\s+/g, ''))

  return createHash('sha256').update(normalized.join('|')).digest('hex')
}

export function verifyWhatsAppSignature(rawBody: string, signature: string | null, appSecret: string): boolean {
  if (!signature || !/^sha256=[a-f0-9]{64}$/i.test(signature) || !appSecret) return false
  const expected = `sha256=${createHmac('sha256', appSecret).update(rawBody).digest('hex')}`
  const actualBuffer = Buffer.from(signature)
  const expectedBuffer = Buffer.from(expected)
  return actualBuffer.length === expectedBuffer.length && timingSafeEqual(actualBuffer, expectedBuffer)
}

export function formatJobAnnouncement(job: {
  title: string
  company: string
  location?: string | null
  jobType?: string | null
  deadline?: string | null
  publicUrl: string
  sourceUrl?: string | null
}): string {
  const lines = [
    'EVA-TECH-STUDIO | NEW JOB OPPORTUNITY',
    '',
    `Position: ${job.title}`,
    `Company: ${job.company}`,
  ]
  if (job.location) lines.push(`Location: ${job.location}`)
  if (job.jobType) lines.push(`Employment Type: ${job.jobType}`)
  if (job.deadline) lines.push(`Closing Date: ${job.deadline}`)
  lines.push('', 'View full requirements and apply:', job.publicUrl)
  if (job.sourceUrl) lines.push('', `Source: ${job.sourceUrl}`)
  return lines.join('\n')
}
