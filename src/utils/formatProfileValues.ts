import { budgetOptions, sponsorshipTypes } from '../constants/brandFormOptions'
import { eventTypeOptions } from '../constants/organizerFormOptions'

/**
 * Formats a sponsorship type value to its display label
 * @param value - The raw sponsorship type value (e.g., "financial_sponsorship")
 * @returns The formatted label (e.g., "Financial Sponsorship")
 */
export function formatSponsorshipType(value: string): string {
  const option = sponsorshipTypes.find((type) => type.id === value)
  return option ? option.label : formatUnderscoredValue(value)
}

/**
 * Formats a budget range value to its display label
 * @param value - The raw budget value (e.g., "under_10000")
 * @returns The formatted label (e.g., "Under 10,000 SEK")
 */
export function formatBudgetRange(value: string): string {
  const option = budgetOptions.find((budget) => budget.value === value)
  return option ? option.label : formatUnderscoredValue(value)
}

/**
 * Formats an event type value to its display label
 * @param value - The raw event type value (e.g., "trade_show")
 * @returns The formatted label (e.g., "Trade Show")
 */
export function formatEventType(value: string): string {
  const option = eventTypeOptions.find((type) => type.value === value)
  return option ? option.label : formatUnderscoredValue(value)
}

/**
 * Generic function to format underscored values to title case
 * @param value - A string with underscores (e.g., "in_kind_goods")
 * @returns A title-cased string with spaces (e.g., "In Kind Goods")
 */
export function formatUnderscoredValue(value: string): string {
  return value
    .split('_')
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ')
}

/**
 * Formats an array of values using the appropriate formatter
 * @param values - Array of raw values
 * @param formatter - Function to format each value
 * @returns Array of formatted labels
 */
export function formatValues(
  values: string[],
  formatter: (value: string) => string
): string[] {
  return values.map(formatter)
}
