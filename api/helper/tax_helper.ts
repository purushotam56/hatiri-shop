/**
 * Calculate tax amount based on tax rate and type
 */
export function calculateTax(
  amount: number,
  taxRate: number,
  taxType: string = 'percentage'
): number {
  if (taxRate <= 0) {
    return 0
  }

  switch (taxType) {
    case 'fixed':
      // Fixed amount tax
      return taxRate
    case 'compound':
      // Compound tax calculation (tax on tax)
      return amount * (1 + taxRate / 100) - amount
    case 'percentage':
    default:
      // Simple percentage tax
      return (amount * taxRate) / 100
  }
}

/**
 * Calculate total price including tax
 */
export function calculateTotalWithTax(
  amount: number,
  taxRate: number,
  taxType: string = 'percentage'
): number {
  return amount + calculateTax(amount, taxRate, taxType)
}

/**
 * Format product with tax calculations
 */
export function formatProductWithTax(product: any) {
  const taxAmount = calculateTax(product.price, product.taxRate, product.taxType)
  return {
    ...product,
    taxAmount,
    priceWithTax: calculateTotalWithTax(product.price, product.taxRate, product.taxType),
  }
}
