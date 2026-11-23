import { createHmac } from 'node:crypto'
import { describe, expect, it } from 'vitest'
import {
  createJobSlug,
  extractJobFields,
  formatJobAnnouncement,
  hashJobContent,
  isSafeHttpsUrl,
  isValidDateOnly,
  validateJobFields,
  verifyWhatsAppSignature,
} from '../lib/jobAutomation'

describe('extractJobFields', () => {
  it('extracts only explicitly labelled values and normalizes remote status', () => {
    expect(extractJobFields([
      'Position: Product Designer',
      'Employer: Example Co',
      'Employment Type: Full-time',
      'Application URL: https://example.com/apply',
      'Closing Date: 2027-06-30',
      'Remote: yes',
      'Invented field: should not be extracted',
    ].join('\n'))).toEqual({
      title: 'Product Designer',
      company: 'Example Co',
      jobType: 'Full-time',
      applyUrl: 'https://example.com/apply',
      deadline: '2027-06-30',
      remote: true,
    })
  })
})

describe('validateJobFields', () => {
  const now = new Date('2026-10-16T10:00:00.000Z')
  const validJob = {
    title: 'Engineer',
    company: 'Example Co',
    description: 'Build reliable software.',
    applyUrl: 'https://example.com/jobs/1',
    deadline: '2026-10-17',
  }

  it('accepts a complete job with a future deadline', () => {
    expect(validateJobFields(validJob, now)).toEqual([])
  })

  it('rejects non-public URLs and impossible calendar dates', () => {
    expect(isSafeHttpsUrl('https://localhost/apply')).toBe(false)
    expect(isSafeHttpsUrl('https://192.168.0.1/apply')).toBe(false)
    expect(isSafeHttpsUrl('https://jobs.example.com/apply')).toBe(true)
    expect(isValidDateOnly('2024-02-29')).toBe(true)
    expect(isValidDateOnly('2026-02-30')).toBe(false)
  })

  it('rejects missing fields, non-HTTPS URLs, invalid dates, and suspicious content', () => {
    expect(validateJobFields({
      ...validJob,
      description: '',
      applyUrl: 'http://example.com/apply',
      deadline: '2026-02-30',
      title: 'Pay an application fee to apply',
    }, now)).toEqual(expect.arrayContaining([
      'Job description is required.',
      'Application URL must be a safe public HTTPS URL.',
      'Deadline must be a valid calendar date in YYYY-MM-DD format.',
      'Potentially suspicious payment or credential request; manual review is required.',
    ]))
  })
})

describe('job helpers', () => {
  it('creates stable readable slugs with a unique suffix', () => {
    expect(createJobSlug('Senior Engineer', 'Example Co', 'a1b2c3d4-0000'))
      .toBe('senior-engineer-example-co-a1b2c3d4')
  })

  it('hashes normalized job content consistently', () => {
    const fields = { title: ' Engineer ', company: 'EXAMPLE', description: 'Build it', applyUrl: 'https://example.com' }
    expect(hashJobContent(fields)).toBe(hashJobContent({
      title: 'engineer', company: 'example', description: 'Build it', applyUrl: 'https://example.com',
    }))
  })

  it('formats announcements without unknown fields', () => {
    expect(formatJobAnnouncement({
      title: 'Engineer',
      company: 'Example',
      publicUrl: 'https://eva.example/careers/engineer',
    })).toBe([
      'EVA-TECH-STUDIO | NEW JOB OPPORTUNITY',
      '',
      'Position: Engineer',
      'Company: Example',
      '',
      'View full requirements and apply:',
      'https://eva.example/careers/engineer',
    ].join('\n'))
  })
})

describe('verifyWhatsAppSignature', () => {
  it('accepts a valid SHA-256 signature and rejects modified or missing signatures', () => {
    const body = '{"object":"whatsapp_business_account"}'
    const secret = 'test-app-secret'
    const signature = `sha256=${createHmac('sha256', secret).update(body).digest('hex')}`

    expect(verifyWhatsAppSignature(body, signature, secret)).toBe(true)
    expect(verifyWhatsAppSignature(`${body} `, signature, secret)).toBe(false)
    expect(verifyWhatsAppSignature(body, null, secret)).toBe(false)
  })
})
