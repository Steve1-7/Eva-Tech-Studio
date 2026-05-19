import { describe, it, expect } from 'vitest'
import { getSessionFromRequest } from '../lib/auth'

function makeReq(cookieHeader: string | null) {
  return {
    headers: {
      get: (k: string) => (k.toLowerCase() === 'cookie' ? cookieHeader : null)
    }
  } as any
}

describe('getSessionFromRequest', () => {
  it('returns null when no cookie header', () => {
    const token = getSessionFromRequest(makeReq(null))
    expect(token).toBeNull()
  })

  it('parses admin_session cookie correctly', () => {
    const cookie = 'other=abc; admin_session=token123%3D%3D; foo=bar'
    const token = getSessionFromRequest(makeReq(cookie))
    expect(token).toBe('token123==')
  })

  it('handles cookie values with = characters', () => {
    const cookie = 'admin_session=part1%3Dpart2%3Dpart3; something=else'
    const token = getSessionFromRequest(makeReq(cookie))
    expect(token).toBe('part1=part2=part3')
  })
})
