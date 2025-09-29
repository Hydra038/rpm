// Multi-currency stub for future support
export const currencies = ['GBP', 'USD', 'EUR', 'AUD', 'JPY', 'CNY'];
export function formatCurrency(amount: number, currency: string = 'GBP') {
  return new Intl.NumberFormat('en-GB', { style: 'currency', currency }).format(amount);
}
