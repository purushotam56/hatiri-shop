import { HttpContext } from '@adonisjs/core/http'
import Address from '#models/address'
import { errorHandler } from '#helper/error_handler'

export default class AddressesController {
  async index({ auth, response }: HttpContext) {
    try {
      const user = await auth.getUserOrFail()
      const addresses = await Address.query().where('user_id', user.id)
      return response.ok({ addresses })
    } catch (error) {
      return errorHandler(error, { auth, response } as HttpContext)
    }
  }

  async store({ auth, request, response }: HttpContext) {
    try {
      const user = await auth.getUserOrFail()
      const data = request.only(['label', 'fullName', 'phoneNumber', 'street', 'city', 'state', 'pincode', 'isDefault'])

      // If marking as default, unmark others
      if (data.isDefault) {
        await Address.query().where('user_id', user.id).update({ isDefault: false })
      }

      const address = await Address.create({
        userId: user.id,
        ...data,
      })

      return response.created({ address })
    } catch (error) {
      return errorHandler(error, { auth, response } as HttpContext)
    }
  }

  async show({ auth, params, response }: HttpContext) {
    try {
      const user = await auth.getUserOrFail()
      const address = await Address.query()
        .where('id', params.id)
        .where('user_id', user.id)
        .firstOrFail()

      return response.ok({ address })
    } catch (error) {
      return errorHandler(error, { auth, response } as HttpContext)
    }
  }

  async update({ auth, params, request, response }: HttpContext) {
    try {
      const user = await auth.getUserOrFail()
      const address = await Address.query()
        .where('id', params.id)
        .where('user_id', user.id)
        .firstOrFail()

      const data = request.only(['label', 'fullName', 'phoneNumber', 'street', 'city', 'state', 'pincode', 'isDefault'])

      // If marking as default, unmark others
      if (data.isDefault && !address.isDefault) {
        await Address.query().where('user_id', user.id).update({ isDefault: false })
      }

      address.merge(data)
      await address.save()

      return response.ok({ address })
    } catch (error) {
      return errorHandler(error, { auth, response } as HttpContext)
    }
  }

  async destroy({ auth, params, response }: HttpContext) {
    try {
      const user = await auth.getUserOrFail()
      const address = await Address.query()
        .where('id', params.id)
        .where('user_id', user.id)
        .firstOrFail()

      await address.delete()

      return response.ok({ message: 'Address deleted successfully' })
    } catch (error) {
      return errorHandler(error, { auth, response } as HttpContext)
    }
  }
}
