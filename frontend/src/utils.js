export function formatINR(value) {
  if (value === undefined || value === null || isNaN(value)) return '₹0.00'
  const formatter = new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    minimumFractionDigits: 2,
  })
  return formatter.format(value)
}
