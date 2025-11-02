/**
 * Test file demonstrating the quantity and taxation functionality
 * This shows how to use the new fields in the Product module
 */

import { calculateTax, calculateTotalWithTax } from '#helper/tax_helper'

// Example 1: Percentage-based tax (default)
console.log('=== Example 1: Percentage Tax (10%) ===')
const price1 = 100
const taxRate1 = 10
const taxType1 = 'percentage'

const taxAmount1 = calculateTax(price1, taxRate1, taxType1)
const priceWithTax1 = calculateTotalWithTax(price1, taxRate1, taxType1)

console.log(`Price: $${price1}`)
console.log(`Tax Rate: ${taxRate1}%`)
console.log(`Tax Amount: $${taxAmount1.toFixed(2)}`)
console.log(`Total with Tax: $${priceWithTax1.toFixed(2)}`)
console.log()

// Example 2: Fixed amount tax
console.log('=== Example 2: Fixed Tax ($5 flat) ===')
const price2 = 100
const taxRate2 = 5
const taxType2 = 'fixed'

const taxAmount2 = calculateTax(price2, taxRate2, taxType2)
const priceWithTax2 = calculateTotalWithTax(price2, taxRate2, taxType2)

console.log(`Price: $${price2}`)
console.log(`Tax Amount: $${taxRate2}`)
console.log(`Tax Amount Applied: $${taxAmount2.toFixed(2)}`)
console.log(`Total with Tax: $${priceWithTax2.toFixed(2)}`)
console.log()

// Example 3: Compound tax
console.log('=== Example 3: Compound Tax (15%) ===')
const price3 = 100
const taxRate3 = 15
const taxType3 = 'compound'

const taxAmount3 = calculateTax(price3, taxRate3, taxType3)
const priceWithTax3 = calculateTotalWithTax(price3, taxRate3, taxType3)

console.log(`Price: $${price3}`)
console.log(`Tax Rate: ${taxRate3}%`)
console.log(`Tax Amount: $${taxAmount3.toFixed(2)}`)
console.log(`Total with Tax: $${priceWithTax3.toFixed(2)}`)
console.log()

// Example 4: Product API Response Format
console.log('=== Example 4: Product API Response ===')
const productResponse = {
  id: 1,
  name: 'Laptop',
  description: 'High-performance laptop',
  price: 1200,
  quantity: 50,
  stock: 50,
  unit: '1pc',
  sku: 'LAPTOP-001',
  taxRate: 12,
  taxType: 'percentage',
  currency: 'USD',
  isActive: true,
  // Computed fields from API
  taxAmount: 144,
  priceWithTax: 1344,
}

console.log('API Response includes:')
console.log(JSON.stringify(productResponse, null, 2))
console.log()

// Example 5: Variant with quantity and tax
console.log('=== Example 5: Product Variant with Quantity & Tax ===')
const variant = {
  id: 1,
  sku: 'SHIRT-001-SIZE-M',
  price: 50,
  stock: 100,
  quantity: 1, // Database field: quantity per package
  quantityFromUnit: '1', // Extracted from unit field
  unit: '1pc',
  taxRate: 5,
  taxType: 'percentage',
  taxAmount: 2.5,
  priceWithTax: 52.5,
}

console.log('Variant response includes:')
console.log(JSON.stringify(variant, null, 2))
