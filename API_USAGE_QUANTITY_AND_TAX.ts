/**
 * PRODUCT MODULE API USAGE GUIDE
 * 
 * This file contains examples of how to use the new quantity and taxation fields
 * in the product module. The functionality is fully integrated into the API.
 */

// ============================================================================
// 1. CREATE A PRODUCT WITH QUANTITY AND TAX
// ============================================================================
// POST /products
// Request body:
{
  "name": "Premium Widget",
  "description": "A high-quality widget",
  "sku": "WIDGET-001",
  "price": 150.00,
  "currency": "USD",
  "categoryId": 1,
  "stock": 100,
  "quantity": 100,           // NEW: Units available for sale
  "unit": "1pc",
  "imageId": 5,
  "organisationId": 1,
  "taxRate": 12.5,           // NEW: Tax rate (12.5%)
  "taxType": "percentage",   // NEW: 'percentage', 'fixed', or 'compound'
  "isActive": true,
  "branches": [
    {
      "id": 1,
      "stock": 50,
      "price": 145.00
    }
  ]
}

// Response:
{
  "message": "Product created successfully",
  "product": {
    "id": 1,
    "name": "Premium Widget",
    "description": "A high-quality widget",
    "sku": "WIDGET-001",
    "price": 150.00,
    "currency": "USD",
    "categoryId": 1,
    "stock": 100,
    "quantity": 100,
    "unit": "1pc",
    "imageId": 5,
    "organisationId": 1,
    "taxRate": 12.5,
    "taxType": "percentage",
    "isActive": true,
    "createdAt": "2025-11-02T10:00:00.000Z",
    "updatedAt": "2025-11-02T10:00:00.000Z"
  }
}

// ============================================================================
// 2. GET ALL PRODUCTS (LIST WITH PAGINATION)
// ============================================================================
// GET /products?page=1&limit=20
// 
// Response includes grouped variants with computed tax fields:
{
  "message": "Products fetched successfully",
  "data": {
    "meta": {
      "total": 50,
      "per_page": 20,
      "current_page": 1,
      "last_page": 3,
      "first_page": 1,
      "first_page_url": "/products?page=1",
      "last_page_url": "/products?page=3",
      "next_page_url": "/products?page=2",
      "prev_page_url": null
    },
    "data": [
      {
        "id": 1,
        "name": "Premium Widget",
        "description": "A high-quality widget",
        "price": 150.00,
        "currency": "USD",
        "categoryId": 1,
        "imageUrl": "...",
        "imageId": 5,
        "organisationId": 1,
        "isActive": true,
        "taxRate": 12.5,
        "taxType": "percentage",
        "createdAt": "2025-11-02T10:00:00.000Z",
        "updatedAt": "2025-11-02T10:00:00.000Z",
        "variants": [
          {
            "id": 1,
            "sku": "WIDGET-001",
            "price": 150.00,
            "stock": 100,
            "quantity": 100,
            "quantityFromUnit": "1",
            "unit": "1pc",
            "taxRate": 12.5,
            "taxType": "percentage",
            "taxAmount": 18.75,          // Computed: 150 * 12.5%
            "priceWithTax": 168.75,      // Computed: 150 + 18.75
            "options": null
          }
        ]
      }
    ]
  }
}

// ============================================================================
// 3. GET A SINGLE PRODUCT
// ============================================================================
// GET /products/1
//
// Response includes tax calculations:
{
  "message": "Product fetched successfully",
  "product": {
    "id": 1,
    "name": "Premium Widget",
    "description": "A high-quality widget",
    "sku": "WIDGET-001",
    "price": 150.00,
    "currency": "USD",
    "categoryId": 1,
    "stock": 100,
    "quantity": 100,
    "unit": "1pc",
    "imageUrl": "...",
    "imageId": 5,
    "organisationId": 1,
    "isActive": true,
    "taxRate": 12.5,
    "taxType": "percentage",
    "taxAmount": 18.75,              // Computed
    "priceWithTax": 168.75,          // Computed
    "createdAt": "2025-11-02T10:00:00.000Z",
    "updatedAt": "2025-11-02T10:00:00.000Z"
  }
}

// ============================================================================
// 4. UPDATE A PRODUCT
// ============================================================================
// PUT /products/1
// Request body (partial update):
{
  "quantity": 150,           // Update quantity
  "taxRate": 15,            // Update tax rate
  "price": 160.00           // Update price
}

// Response: Updated product with tax calculations recalculated

// ============================================================================
// 5. TAX TYPE OPTIONS
// ============================================================================
//
// The taxType field supports three options:
//
// a) "percentage" (default)
//    - Calculates tax as a percentage of the price
//    - Example: price=100, taxRate=10, result: tax=10
//
// b) "fixed"
//    - Fixed amount tax regardless of price
//    - Example: price=100, taxRate=5, result: tax=5
//
// c) "compound"
//    - Applies tax on top of tax (tax-on-tax calculation)
//    - Example: price=100, taxRate=15, result: tax=17.23 (rounded)

// ============================================================================
// 6. QUANTITY VS STOCK DIFFERENCE
// ============================================================================
//
// quantity: Number of units in each package/bundle (e.g., how many items per package)
// stock:    Total number of units available for sale
//
// Example: If you have a "12-pack" of items:
// - quantity = 12 (items per package)
// - stock = 500 (total packages available)
//
// When displaying variants:
// - quantity field: from database (items per package)
// - quantityFromUnit: extracted from unit string (e.g., "12" from "12pack")

// ============================================================================
// 7. DATABASE FIELDS ADDED
// ============================================================================
//
// New columns added to products table:
// - quantity (INTEGER, default 0): Units available per package
// - tax_rate (DECIMAL 5,2, default 0): Tax rate value
// - tax_type (VARCHAR, default 'percentage'): Type of tax calculation

// ============================================================================
// 8. HELPER FUNCTIONS
// ============================================================================
//
// Location: /helper/tax_helper.ts
//
// Available functions:
//
// calculateTax(amount, taxRate, taxType = 'percentage')
//   Returns the tax amount based on the parameters
//
// calculateTotalWithTax(amount, taxRate, taxType = 'percentage')
//   Returns the total price including tax
//
// formatProductWithTax(product)
//   Returns product object with taxAmount and priceWithTax computed
