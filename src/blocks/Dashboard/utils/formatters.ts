export function formatCurrency(value: number | undefined): string {
  if (value === undefined) return '€0,00'
  return new Intl.NumberFormat('de-DE', { 
    style: 'currency', 
    currency: 'EUR',
    minimumFractionDigits: 2
  }).format(value)
}

export function formatPercent(value: number | undefined): string {
  if (value === undefined || isNaN(value)) return '0.0%'
  return `${(value * 100).toFixed(1)}%`
}

export function formatNumber(value: number | undefined): string {
  if (value === undefined) return '0'
  return new Intl.NumberFormat('de-DE').format(value)
}

export function calculatePercentage(value: number | undefined, total: number | undefined): number {
  if (!value || !total || total === 0) return 0
  return value / total
}
