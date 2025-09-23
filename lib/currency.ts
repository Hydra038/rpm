// Multi-currency stub for future support
export const currencies = ['USD', 'EUR', 'GBP', 'AUD', 'JPY', 'CNY'];
export function formatCurrency(amount: number, currency: string = 'USD') {
  return new Intl.NumberFormat('en-US', { style: 'currency', currency }).format(amount);
}
