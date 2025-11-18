/**
 * Test script to demonstrate stock management functionality
 * 
 * This script shows how stock updates work when order status changes:
 * 1. pending → confirmed: Decreases stock
 * 2. confirmed → cancelled: Restores stock
 * 3. Validates status transitions
 * 4. Prevents negative stock
 */

import Product from '#models/product'
import Order from '#models/order'
import OrderItem from '#models/order_item'
import User from '#models/user'
import Address from '#models/address'
import StockService from '#services/stock_service'

async function testStockManagement() {
  console.log('🧪 Testing Stock Management\n')

  try {
    // 1. Get a test product
    const product = await Product.query().where('stock', '>', 0).first()
    if (!product) {
      console.log('❌ No products with stock found')
      return
    }

    const initialStock = product.stock
    console.log(`📦 Product: ${product.name}`)
    console.log(`   Initial Stock: ${initialStock}\n`)

    // 2. Create a test order
    const user = await User.first()
    if (!user) {
      console.log('❌ No users found')
      return
    }

    const address = await Address.query().where('user_id', user.id).first()
    if (!address) {
      console.log('❌ No addresses found for user')
      return
    }

    const testQuantity = 2

    const order = await Order.create({
      orderNumber: `TEST-${Date.now()}`,
      customerId: user.id,
      addressId: address.id,
      deliveryAddress: `${address.street}, ${address.city}`,
      customerName: address.fullName,
      customerPhone: address.phoneNumber,
      totalAmount: product.price * testQuantity,
      taxAmount: 0,
      deliveryAmount: 0,
      subtotal: product.price * testQuantity,
      status: 'pending',
      notes: 'Test order for stock management',
    })

    await OrderItem.create({
      orderId: order.id,
      productId: product.id,
      variantId: null,
      name: product.name,
      price: product.price,
      quantity: testQuantity,
      currency: 'INR',
      unit: '',
    })

    console.log(`✅ Created test order: ${order.orderNumber}`)
    console.log(`   Status: ${order.status}`)
    console.log(`   Quantity: ${testQuantity}\n`)

    // 3. Test: Change status to 'confirmed' (should decrease stock)
    console.log('📉 Test 1: Changing status to "confirmed"...')
    const adjustments1 = await StockService.adjustStockForStatusChange(
      order,
      'pending',
      'confirmed'
    )

    order.status = 'confirmed'
    await order.save()

    await product.refresh()
    const stockAfterConfirm = product.stock

    console.log(`   Stock adjustments:`)
    adjustments1.forEach((adj) => {
      console.log(`     Product ${adj.productId}: ${adj.previousStock} → ${adj.newStock}`)
    })
    console.log(`   Expected: ${initialStock - testQuantity}`)
    console.log(`   Actual: ${stockAfterConfirm}`)
    console.log(
      `   ✅ ${stockAfterConfirm === initialStock - testQuantity ? 'PASS' : 'FAIL'}\n`
    )

    // 4. Test: Change status to 'cancelled' (should restore stock)
    console.log('📈 Test 2: Changing status to "cancelled"...')
    const adjustments2 = await StockService.adjustStockForStatusChange(
      order,
      'confirmed',
      'cancelled'
    )

    order.status = 'cancelled'
    await order.save()

    await product.refresh()
    const stockAfterCancel = product.stock

    console.log(`   Stock adjustments:`)
    adjustments2.forEach((adj) => {
      console.log(`     Product ${adj.productId}: ${adj.previousStock} → ${adj.newStock}`)
    })
    console.log(`   Expected: ${initialStock}`)
    console.log(`   Actual: ${stockAfterCancel}`)
    console.log(`   ✅ ${stockAfterCancel === initialStock ? 'PASS' : 'FAIL'}\n`)

    // 5. Test: Validate status transitions
    console.log('🔒 Test 3: Validating status transitions...')
    const validation1 = StockService.validateStatusTransition('pending', 'confirmed')
    console.log(`   pending → confirmed: ${validation1.valid ? '✅ Valid' : '❌ Invalid'}`)

    const validation2 = StockService.validateStatusTransition('pending', 'delivered')
    console.log(
      `   pending → delivered: ${validation2.valid ? '✅ Valid' : '❌ Invalid'} (${validation2.error})`
    )

    const validation3 = StockService.validateStatusTransition('delivered', 'pending')
    console.log(
      `   delivered → pending: ${validation3.valid ? '✅ Valid' : '❌ Invalid'} (${validation3.error})\n`
    )

    // 6. Test: Prevent negative stock
    console.log('⚠️  Test 4: Testing negative stock prevention...')
    const lowStockProduct = await Product.query().where('stock', '>=', 0).first()

    if (lowStockProduct) {
      // Set stock to 1
      lowStockProduct.stock = 1
      await lowStockProduct.save()

      const testOrder = await Order.create({
        orderNumber: `TEST-NEG-${Date.now()}`,
        customerId: user.id,
        addressId: address.id,
        deliveryAddress: `${address.street}, ${address.city}`,
        customerName: address.fullName,
        customerPhone: address.phoneNumber,
        totalAmount: lowStockProduct.price * 5,
        taxAmount: 0,
        deliveryAmount: 0,
        subtotal: lowStockProduct.price * 5,
        status: 'pending',
        notes: 'Test negative stock',
      })

      await OrderItem.create({
        orderId: testOrder.id,
        productId: lowStockProduct.id,
        variantId: null,
        name: lowStockProduct.name,
        price: lowStockProduct.price,
        quantity: 5, // Request more than available
        currency: 'INR',
        unit: '',
      })

      try {
        await StockService.adjustStockForStatusChange(testOrder, 'pending', 'confirmed')
        console.log('   ❌ FAIL: Should have thrown insufficient stock error')
      } catch (error) {
        console.log(`   ✅ PASS: Correctly prevented negative stock`)
        console.log(`   Error: ${error.message}`)
      }

      // Cleanup
      await testOrder.delete()
      lowStockProduct.stock = initialStock
      await lowStockProduct.save()
    }

    // Cleanup test order
    await order.delete()

    console.log('\n✨ All tests completed!')
  } catch (error) {
    console.error('❌ Test failed:', error.message)
    console.error(error)
  }
}

// Run if executed directly
if (import.meta.url === `file://${process.argv[1]}`) {
  testStockManagement()
    .then(() => process.exit(0))
    .catch((error) => {
      console.error(error)
      process.exit(1)
    })
}

export default testStockManagement
