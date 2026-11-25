export const DEFAULT_BUDGET_CURRENCY = 'ZAR' as const
export const SUPPORTED_CURRENCIES = ['ZAR', 'USD', 'GBP', 'EUR', 'CAD', 'AUD', 'GHS', 'ZMW', 'BWP'] as const
export type BudgetCurrency = (typeof SUPPORTED_CURRENCIES)[number]

// Indicative reference conversions, manually refreshed. Commercial quotes are confirmed in writing.
export const RATES_UPDATED_AT = '2026-11-25'
export const ZAR_TO_CURRENCY_RATE: Record<BudgetCurrency, number> = {
  ZAR: 1,
  USD: 1 / 17.53,
  GBP: 1 / 22.98,
  EUR: 1 / 19.22,
  CAD: 1 / 12.27,
  AUD: 1 / 11.64,
  GHS: 1 / 1.47,
  ZMW: 1 / 0.84,
  BWP: 1 / 1.19,
}

const CURRENCY_LOCALES: Record<BudgetCurrency, string> = {
  ZAR: 'en-ZA',
  USD: 'en-US',
  GBP: 'en-GB',
  EUR: 'en-IE',
  CAD: 'en-CA',
  AUD: 'en-AU',
  GHS: 'en-GH',
  ZMW: 'en-ZM',
  BWP: 'en-BW',
}

export function isBudgetCurrency(value: string): value is BudgetCurrency {
  return SUPPORTED_CURRENCIES.includes(value as BudgetCurrency)
}

export function convertFromZar(amount: number, currency: BudgetCurrency): number {
  return amount * ZAR_TO_CURRENCY_RATE[currency]
}

export function formatCurrency(amount: number, currency: BudgetCurrency): string {
  return new Intl.NumberFormat(CURRENCY_LOCALES[currency], {
    style: 'currency',
    currency,
    maximumFractionDigits: 0,
  }).format(amount)
}

export function formatZarAsCurrency(amount: number, currency: BudgetCurrency): string {
  return formatCurrency(convertFromZar(amount, currency), currency)
}

export function getBudgetOptionsForCurrency(currency: string): readonly string[] {
  const safeCurrency = isBudgetCurrency(currency) ? currency : DEFAULT_BUDGET_CURRENCY
  const format = (zarAmount: number) => formatZarAsCurrency(zarAmount, safeCurrency)

  return [
    `Under ${format(5000)}`,
    `${format(5000)}–${format(15000)}`,
    `${format(15000)}–${format(30000)}`,
    `${format(30000)}+`,
    'Not sure yet',
  ]
}

export type MarketContactChannel = 'whatsapp' | 'booking'

export type MarketFaq = {
  question: string
  answer: string
}

export type MarketPaymentFlags = {
  cards: boolean
  bankTransfer: boolean
  mobileMoney: boolean
}

export type MarketConfig = {
  slug: string
  path: string
  name: string
  country: string
  locale: string
  language: 'en' | 'fr'
  timeZone: string
  currency: BudgetCurrency
  currencyOptions: readonly BudgetCurrency[]
  wave: 1 | 2 | 3
  enabled: boolean
  contactChannels: readonly MarketContactChannel[]
  paymentMethods: readonly string[]
  paymentMethodFlags: MarketPaymentFlags
  tradingBotsEnabled: boolean
  privacyLaw: string | null
  headline: string
  intro: string
  faqs: readonly MarketFaq[]
}

type MarketInput = Omit<MarketConfig, 'slug' | 'path' | 'faqs' | 'paymentMethodFlags'> & {
  paymentMethodFlags?: Partial<MarketPaymentFlags>
}

function defineMarket(slug: string, input: MarketInput): MarketConfig {
  const currencyName = input.currency
  const contactType = input.contactChannels.includes('booking') ? 'a 20-minute call' : 'the contact form'
  const paymentMethodFlags: MarketPaymentFlags = {
    cards: input.paymentMethods.includes('Cards'),
    bankTransfer: input.paymentMethods.includes('Bank transfer'),
    mobileMoney: false,
    ...input.paymentMethodFlags,
  }
  const paymentMethods = [
    ...(paymentMethodFlags.cards ? ['Cards'] : []),
    ...(paymentMethodFlags.bankTransfer ? ['Bank transfer'] : []),
    ...(paymentMethodFlags.mobileMoney ? ['Mobile money'] : []),
  ]

  return {
    ...input,
    paymentMethods,
    paymentMethodFlags,
    slug,
    path: `/${slug}`,
    faqs: input.language === 'fr'
      ? []
      : [
          {
            question: `Which currency is used for ${input.name} projects?`,
            answer: `The ${input.name} page defaults to ${currencyName}. Currency conversions are indicative; the final currency and price are confirmed in a written proposal.`,
          },
          {
            question: 'How do you start a project?',
            answer: 'We review your goals, users, scope, and dependencies before sending written recommendations and a proposal.',
          },
          {
            question: 'How can I discuss a project?',
            answer: `You can request ${contactType}. If a booking or WhatsApp link is not configured, use the contact form.`,
          },
          {
            question: 'Do you work across different time zones?',
            answer: 'Yes. Shared working time is calculated from the current IANA time-zone rules. Where overlap is small, we plan asynchronous reviews and suitable meeting times.',
          },
        ],
  }
}

export const MARKETS = {
  za: defineMarket('za', {
    name: 'South Africa', country: 'South Africa', locale: 'en-ZA', language: 'en', timeZone: 'Africa/Johannesburg',
    currency: 'ZAR', currencyOptions: ['ZAR'], wave: 1, enabled: true,
    contactChannels: ['whatsapp', 'booking'], paymentMethods: [], tradingBotsEnabled: true,
    // TODO(legal): Verify the POPIA wording before adding a public compliance statement.
    privacyLaw: null,
    headline: 'Website, app, and software development in South Africa',
    intro: 'Plan and build a digital product with a clear scope, an accountable engineering process, and a written proposal before work begins.',
  }),
  uk: defineMarket('uk', {
    name: 'United Kingdom', country: 'United Kingdom', locale: 'en-GB', language: 'en', timeZone: 'Europe/London',
    currency: 'GBP', currencyOptions: ['GBP', 'USD'], wave: 1, enabled: true,
    contactChannels: ['booking'], paymentMethods: ['Cards', 'Bank transfer'], tradingBotsEnabled: false,
    // TODO(legal): Verify the UK GDPR wording before adding a public compliance statement.
    privacyLaw: null,
    headline: 'Software and website development for UK teams',
    intro: 'Get help planning and building a website, application, or software workflow, with decisions and project scope documented before delivery.',
  }),
  us: defineMarket('us', {
    name: 'United States', country: 'United States', locale: 'en-US', language: 'en', timeZone: 'America/New_York',
    currency: 'USD', currencyOptions: ['USD'], wave: 1, enabled: true,
    contactChannels: ['booking'], paymentMethods: ['Cards', 'Bank transfer'], tradingBotsEnabled: false,
    // TODO(legal): Verify applicable CCPA and state-law wording before publishing compliance copy.
    privacyLaw: null,
    headline: 'Website and software development for US teams',
    intro: 'Turn a product or operations need into a scoped website, application, or integration, with assumptions and next steps made clear.',
  }),
  gh: defineMarket('gh', {
    name: 'Ghana', country: 'Ghana', locale: 'en-GH', language: 'en', timeZone: 'Africa/Accra',
    currency: 'GHS', currencyOptions: ['GHS', 'USD'], wave: 1, enabled: true,
    contactChannels: ['whatsapp'], paymentMethods: [], tradingBotsEnabled: true,
    // TODO(legal): Verify Ghana Data Protection Act 843 wording before adding a public compliance statement.
    privacyLaw: null,
    headline: 'Digital product engineering for Ghanaian teams',
    intro: 'Scope a website, application, or automation project around the people who will use it and the work it needs to support.',
  }),
  eu: defineMarket('eu', {
    name: 'Europe', country: 'Europe', locale: 'en-IE', language: 'en', timeZone: 'Europe/Dublin',
    currency: 'EUR', currencyOptions: ['EUR', 'GBP'], wave: 2, enabled: false,
    contactChannels: ['booking'], paymentMethods: ['Cards', 'Bank transfer'], tradingBotsEnabled: false,
    // TODO(legal): Verify GDPR wording for the target European jurisdictions before enabling this page.
    privacyLaw: null,
    headline: 'Software development for European teams',
    intro: 'Plan a digital product with a clear scope, reviewable milestones, and a written proposal before work begins.',
  }),
  ca: defineMarket('ca', {
    name: 'Canada', country: 'Canada', locale: 'en-CA', language: 'en', timeZone: 'America/Toronto',
    currency: 'CAD', currencyOptions: ['CAD', 'USD'], wave: 2, enabled: false,
    contactChannels: ['booking'], paymentMethods: ['Cards', 'Bank transfer'], tradingBotsEnabled: false,
    // TODO(legal): Verify PIPEDA and provincial privacy-law wording before enabling this page.
    privacyLaw: null,
    headline: 'Website and application development for Canadian teams',
    intro: 'Get technical help scoping a website, application, or integration around your business requirements.',
  }),
  au: defineMarket('au', {
    name: 'Australia', country: 'Australia', locale: 'en-AU', language: 'en', timeZone: 'Australia/Sydney',
    currency: 'AUD', currencyOptions: ['AUD', 'USD'], wave: 2, enabled: false,
    contactChannels: ['booking'], paymentMethods: ['Cards', 'Bank transfer'], tradingBotsEnabled: false,
    // TODO(legal): Verify Privacy Act 1988 wording before enabling this page.
    privacyLaw: null,
    headline: 'Software and web application development for Australian teams',
    intro: 'Clarify the users, workflows, and technical requirements for your next software project before committing to a build.',
  }),
  bw: defineMarket('bw', {
    name: 'Botswana', country: 'Botswana', locale: 'en-BW', language: 'en', timeZone: 'Africa/Gaborone',
    currency: 'BWP', currencyOptions: ['BWP', 'USD'], wave: 2, enabled: false,
    contactChannels: ['whatsapp', 'booking'], paymentMethods: [], tradingBotsEnabled: true,
    // TODO(legal): Verify Botswana Data Protection Act 2024 wording before enabling this page.
    privacyLaw: null,
    headline: 'Website and software development for Botswana teams',
    intro: 'Plan an application, website, or workflow around your team’s requirements and agree the scope in writing.',
  }),
  zm: defineMarket('zm', {
    name: 'Zambia', country: 'Zambia', locale: 'en-ZM', language: 'en', timeZone: 'Africa/Lusaka',
    currency: 'ZMW', currencyOptions: ['ZMW', 'USD'], wave: 3, enabled: false,
    contactChannels: ['whatsapp'], paymentMethods: [], tradingBotsEnabled: true,
    // TODO(legal): Verify Zambia Data Protection Act 2021 wording before enabling this page.
    privacyLaw: null,
    headline: 'Digital product engineering for Zambian teams',
    intro: 'Scope a website, application, or integration with clear deliverables and a written proposal.',
  }),
  zw: defineMarket('zw', {
    name: 'Zimbabwe', country: 'Zimbabwe', locale: 'en-ZW', language: 'en', timeZone: 'Africa/Harare',
    currency: 'USD', currencyOptions: ['USD'], wave: 3, enabled: false,
    contactChannels: ['whatsapp'], paymentMethods: [], tradingBotsEnabled: true,
    // TODO(legal): Verify Zimbabwe Data Protection Act 5 of 2021 wording before enabling this page.
    privacyLaw: null,
    headline: 'Website and software development for Zimbabwean teams',
    intro: 'Get a clear project scope and a practical next step for a website, application, or workflow.',
  }),
  bf: defineMarket('bf', {
    name: 'Burkina Faso', country: 'Burkina Faso', locale: 'fr-BF', language: 'fr', timeZone: 'Africa/Ouagadougou',
    currency: 'EUR', currencyOptions: ['EUR'], wave: 3, enabled: false,
    contactChannels: ['whatsapp'], paymentMethods: [], tradingBotsEnabled: true,
    // TODO(legal): Verify Burkina Faso data-protection law wording before enabling this page.
    privacyLaw: null,
    // TODO(translation): Replace these source notes and all page copy with approved native French text.
    headline: 'TODO(translation): Native French headline required before enablement.',
    intro: 'TODO(translation): Native French introduction required before enablement.',
  }),
} satisfies Record<string, MarketConfig>

export type MarketSlug = keyof typeof MARKETS
export const LIVE_MARKETS = Object.values(MARKETS).filter((market) => market.enabled)

const COUNTRY_TO_MARKET: Record<string, MarketSlug> = {
  ZA: 'za', GB: 'uk', US: 'us', GH: 'gh', IE: 'eu', CA: 'ca', AU: 'au',
  BW: 'bw', ZM: 'zm', ZW: 'zw', BF: 'bf',
}
const LOCALE_TO_MARKET: Record<string, MarketSlug> = {
  'en-za': 'za', 'en-gb': 'uk', 'en-us': 'us', 'en-gh': 'gh', 'en-ie': 'eu',
  'en-ca': 'ca', 'en-au': 'au', 'en-bw': 'bw', 'en-zm': 'zm', 'en-zw': 'zw', 'fr-bf': 'bf',
}

export function getMarketSuggestion(country: string | null, acceptLanguage: string | null): MarketSlug | null {
  const countryMarket = country ? COUNTRY_TO_MARKET[country.toUpperCase()] : undefined
  if (countryMarket && MARKETS[countryMarket].enabled) return countryMarket

  for (const locale of acceptLanguage?.split(',').map((item) => item.split(';')[0].trim().toLowerCase()) ?? []) {
    const market = LOCALE_TO_MARKET[locale]
    if (market && MARKETS[market].enabled) return market
  }

  return null
}
