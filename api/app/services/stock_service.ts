import Order from '#models/order'
import Product from '#models/product'
import db from '@adonisjs/lucid/services/db'

export type OrderStatusType =
  | 'pending'
  | 'confirmed'
  | 'preparing'
  | 'ready'
  | 'out_for_delivery'
  | 'delivered'
  | 'cancelled'

interface StockAdjustment {
  productId: number
  quantity: number
  previousStock: number
  newStock: number
}

export default class StockService {
  /**
   * Adjust stock when order status changes
   * - confirmed: Decrease stock (reserve items)
   * - cancelled: Restore stock (release items)
   * - delivered: No change (already deducted at confirmed)
   */
  static async adjustStockForStatusChange(
    order: Order,
    previousStatus: OrderStatusType,
    newStatus: OrderStatusType
  ): Promise<StockAdjustment[]> {
    const adjustments: StockAdjustment[] = []

    // Determine if we need to adjust stock
    const shouldDeductStock = previousStatus === 'pending' && newStatus === 'confirmed'
    const shouldRestoreStock =
      (previousStatus === 'confirmed' ||
        previousStatus === 'preparing' ||
        previousStatus === 'ready' ||
        previousStatus === 'out_for_delivery') &&
      newStatus === 'cancelled'

    if (!shouldDeductStock && !shouldRestoreStock) {
      return adjustments // No stock change needed
    }

    // Load order items with product
    await order.load('items', (query) => {
      query.preload('product')
    })

    // Use transaction for atomic stock updates
    const trx = await db.transaction()

    try {
      for (const item of order.items || []) {
        const productId = item.variantId || item.productId
        const quantity = Number(item.quantity)

        // Get the product with row lock
        const product = await Product.query({ client: trx })
          .where('id', productId)
          .forUpdate()
          .firstOrFail()

        const previousStock = product.stock
        let newStock = previousStock

        if (shouldDeductStock) {
          // Decrease stock (confirmed order)
          newStock = previousStock - quantity

          // Prevent negative stock
          if (newStock < 0) {
            await trx.rollback()
            throw new Error(
              `Insufficient stock for product ${product.name}. Available: ${previousStock}, Requested: ${quantity}`
            )
          }
        } else if (shouldRestoreStock) {
          // Increase stock (cancelled order)
          newStock = previousStock + quantity
        }

        // Update stock
        product.stock = newStock
        await product.save()

        adjustments.push({
          productId: product.id,
          quantity,
          previousStock,
          newStock,
        })
      }

      await trx.commit()
      return adjustments
    } catch (error) {
      await trx.rollback()
      throw error
    }
  }

  /**
   * Validate if status transition is allowed
   */
  static validateStatusTransition(
    currentStatus: OrderStatusType,
    newStatus: OrderStatusType
  ): { valid: boolean; error?: string } {
    // Define allowed transitions
    const transitions: Record<OrderStatusType, OrderStatusType[]> = {
      pending: ['confirmed', 'cancelled'],
      confirmed: ['preparing', 'cancelled'],
      preparing: ['ready', 'cancelled'],
      ready: ['out_for_delivery', 'cancelled'],
      out_for_delivery: ['delivered', 'cancelled'],
      delivered: [], // Final state
      cancelled: [], // Final state
    }

    // Check if same status
    if (currentStatus === newStatus) {
      return { valid: false, error: 'Order already has this status' }
    }

    // Check if transition is allowed
    const allowedTransitions = transitions[currentStatus]
    if (!allowedTransitions.includes(newStatus)) {
      return {
        valid: false,
        error: `Cannot change status from ${currentStatus} to ${newStatus}`,
      }
    }

    return { valid: true }
  }

  /**
   * Get current stock for a product (or variant)
   */
  static async getStock(productId: number): Promise<number> {
    const product = await Product.findOrFail(productId)
    return product.stock
  }

  /**
   * Check if stock is available for a product
   */
  static async isStockAvailable(productId: number, quantity: number): Promise<boolean> {
    const stock = await this.getStock(productId)
    return stock >= quantity
  }
}
