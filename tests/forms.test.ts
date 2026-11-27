import { afterEach, describe, expect, it, vi } from 'vitest'
import { submitPackageInquiry } from '../lib/forms'

afterEach(() => {
  vi.unstubAllGlobals()
})

describe('package inquiry submission', () => {
  it('routes package and consultation details through the contact endpoint', async () => {
    const fetchMock = vi.fn().mockResolvedValue({
      ok: true,
      json: async () => ({ success: true }),
    })
    vi.stubGlobal('fetch', fetchMock)

    await submitPackageInquiry({
      fullName: 'Riley Test',
      companyName: 'Routing Test Studio',
      email: 'riley@example.com',
      phone: '+27 11 555 0199',
      selectedPackage: 'Web App Development',
      projectGoals: 'Build a customer portal.',
      budgetRange: 'R15,000–R30,000',
      additionalNotes: 'Automated routing verification.',
    })

    expect(fetchMock).toHaveBeenCalledTimes(1)
    expect(fetchMock.mock.calls[0]?.[0]).toBe('/api/contact')
    const request = JSON.parse(String(fetchMock.mock.calls[0]?.[1]?.body))
    expect(request).toMatchObject({
      firstName: 'Riley',
      lastName: 'Test',
      email: 'riley@example.com',
      phone: '+27 11 555 0199',
      service: 'Web App Development',
      budget: 'R15,000–R30,000',
    })
    expect(request.message).toContain('Company: Routing Test Studio')
    expect(request.message).toContain('Goals: Build a customer portal.')
    expect(request.message).toContain('Notes: Automated routing verification.')
  })
})
