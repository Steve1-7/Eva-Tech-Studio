export const DEFAULT_BUDGET_CURRENCY = 'ZAR' as const

export const BUDGET_OPTIONS_BY_CURRENCY = {
  ZAR: ['Under R5,000', 'R5,000–R15,000', 'R15,000–R30,000', 'R30,000+', 'Not sure yet'],
} as const

export type BudgetCurrency = keyof typeof BUDGET_OPTIONS_BY_CURRENCY

export function getBudgetOptionsForCurrency(currency: string): readonly string[] {
  if (currency in BUDGET_OPTIONS_BY_CURRENCY) {
    return BUDGET_OPTIONS_BY_CURRENCY[currency as BudgetCurrency]
  }

  return BUDGET_OPTIONS_BY_CURRENCY[DEFAULT_BUDGET_CURRENCY]
}
