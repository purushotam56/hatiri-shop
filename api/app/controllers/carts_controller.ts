import { HttpContext } from '@adonisjs/core/http'
import Cart from '#models/cart'
import { errorHandler } from '#helper/error_handler'

export default class CartsController {
  async index({ auth, response }: HttpContext) {
    try {
      const user = await auth.getUserOrFail()
      const cartItems = await Cart.query().where('user_id', user.id)
      
      const total = cartItems.reduce((sum, item) => sum + (item.price * item.quantity), 0)
      
      return response.ok({ items: cartItems, total })
    } catch (error) {
      return errorHandler(error, { auth, response } as HttpContext)
    }
  }

  async store({ auth, request, response }: HttpContext) {
    try {
      const user = await auth.getUserOrFail()
      const data = request.only(['productId', 'variantId', 'name', 'price', 'quantity', 'currency', 'unit'])

      // Check if item already exists in cart
      const existing = await Cart.query()
        .where('user_id', user.id)
        .where('variant_id', data.variantId)
        .first()

      if (existing) {
        existing.quantity += data.quantity
        await existing.save()
        return response.ok({ item: existing })
      }

      const cartItem = await Cart.create({
        userId: user.id,
        ...data,
      })

      return response.created({ item: cartItem })
    } catch (error) {
      return errorHandler(error, { auth, response } as HttpContext)
    }
  }

  async update({ auth, params, request, response }: HttpContext) {
    try {
      const user = await auth.getUserOrFail()
      const cartItem = await Cart.query()
        .where('id', params.id)
        .where('user_id', user.id)
        .firstOrFail()

      const { quantity } = request.only(['quantity'])

      if (quantity <= 0) {
        await cartItem.delete()
        return response.ok({ message: 'Item removed from cart' })
      }

      cartItem.quantity = quantity
      await cartItem.save()

      return response.ok({ item: cartItem })
    } catch (error) {
      return errorHandler(error, { auth, response } as HttpContext)
    }
  }

  async destroy({ auth, params, response }: HttpContext) {
    try {
      const user = await auth.getUserOrFail()
      const cartItem = await Cart.query()
        .where('id', params.id)
        .where('user_id', user.id)
        .firstOrFail()

      await cartItem.delete()

      return response.ok({ message: 'Item removed from cart' })
    } catch (error) {
      return errorHandler(error, { auth, response } as HttpContext)
    }
  }

  async clear({ auth, response }: HttpContext) {
    try {
      const user = await auth.getUserOrFail()
      await Cart.query().where('user_id', user.id).delete()

      return response.ok({ message: 'Cart cleared successfully' })
    } catch (error) {
      return errorHandler(error, { auth, response } as HttpContext)
    }
  }
}
