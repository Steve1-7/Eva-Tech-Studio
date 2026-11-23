import { describe, expect, it } from 'vitest'
import { discountedPrice, formatRand } from '../lib/pricing'

describe('launch pricing', () => {
  it('applies the forty-percent reduction and rounds to the nearest fifty rand', () => {
    expect(discountedPrice(5000)).toBe(3000)
    expect(discountedPrice(4250)).toBe(2550)
    expect(discountedPrice(2250)).toBe(1350)
  })

  it('formats the South African rand values used in price labels', () => {
    expect(formatRand(10500)).toBe('R10 500')
  })

  it('supports a per-plan launch discount', () => {
    expect(discountedPrice(5000, 25)).toBe(3750)
  })
})
