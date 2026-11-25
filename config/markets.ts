export const markets = [
  { code: 'ZAR', name: 'South African Rand', symbol: 'R' },
  { code: 'USD', name: 'US Dollar', symbol: '$' },
  { code: 'GBP', name: 'British Pound', symbol: '£' },
  { code: 'EUR', name: 'Euro', symbol: '€' },
  { code: 'AUD', name: 'Australian Dollar', symbol: 'A$' },
] as const

export type MarketCurrencyCode = (typeof markets)[number]['code']
export const defaultMarketCurrency: MarketCurrencyCode = 'ZAR'
