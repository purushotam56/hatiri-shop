import { HttpContext } from '@adonisjs/core/http'
import Order from '#models/order'
import OrderItem from '#models/order_item'
import Cart from '#models/cart'
import Address from '#models/address'
import { errorHandler } from '#helper/error_handler'

export default class OrdersController {
  async store({ auth, request, response }: HttpContext) {
    try {
      const user = await auth.getUserOrFail()
      const { addressId, notes } = request.only(['addressId', 'notes'])

      // Get cart items
      const cartItems = await Cart.query().where('user_id', user.id)
      if (cartItems.length === 0) {
        return response.badRequest({ message: 'Cart is empty' })
      }

      // Get address
      const address = await Address.query()
        .where('id', addressId)
        .where('user_id', user.id)
        .firstOrFail()

      // Calculate totals
      const subtotal = cartItems.reduce((sum, item) => sum + (item.price * item.quantity), 0)
      const deliveryFee = 0 // Free delivery for now
      const total = subtotal + deliveryFee

      // Create order
      const order = await Order.create({
        orderNumber: `ORD-${Date.now()}-${Math.random().toString(36).substring(7)}`,
        customerId: user.id,
        addressId: address.id,
        deliveryAddress: `${address.street}, ${address.city}, ${address.state} ${address.pincode}`,
        customerName: address.fullName,
        customerPhone: address.phoneNumber,
        totalAmount: total,
        taxAmount: 0,
        deliveryAmount: deliveryFee,
        subtotal: subtotal,
        status: 'pending',
        notes: notes || '',
      })

      // Create order items
      await Promise.all(
        cartItems.map(item =>
          OrderItem.create({
            orderId: order.id,
            productId: item.productId,
            variantId: item.variantId,
            name: item.name,
            price: Number(item.price),
            quantity: Number(item.quantity),
            currency: item.currency || 'AED',
            unit: item.unit || '',
          })
        )
      )

      // Clear cart after order creation
      await Cart.query().where('user_id', user.id).delete()

      // Load items relationship before returning
      await order.load('items')

      return response.ok({ order })
    } catch (error) {
      return errorHandler(error, { auth, response } as HttpContext)
    }
  }

  async index({ auth, response }: HttpContext) {
    try {
      const user = await auth.getUserOrFail()
      const orders = await Order.query()
        .where('customerId', user.id)
        .preload('items')
        .orderBy('created_at', 'desc')

      return response.ok({ orders })
    } catch (error) {
      return errorHandler(error, { auth, response } as HttpContext)
    }
  }

  async show({ auth, params, response }: HttpContext) {
    try {
      const user = await auth.getUserOrFail()
      const order = await Order.query()
        .where('id', params.id)
        .where('customerId', user.id)
        .preload('items')
        .firstOrFail()

      return response.ok({ order })
    } catch (error) {
      return errorHandler(error, { auth, response } as HttpContext)
    }
  }
}
