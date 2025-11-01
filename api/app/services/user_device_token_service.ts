import { inject } from '@adonisjs/core'
import { HttpContext } from '@adonisjs/core/http'
import UserDeviceToken from '#models/user_device_token'
import { errorHandler } from '#helper/error_handler'

@inject()
export default class UserDeviceTokenService {
  constructor(private ctx: HttpContext) {}

  async registerUserDeviceToken() {
    const data = this.ctx.request.all()
    const currentUser = this.ctx.auth.user
    // Add validation

    if (!currentUser) {
      errorHandler('User not found')
    }

    const userDeviceToken = await UserDeviceToken.updateOrCreate(
      { userId: currentUser?.id, deviceToken: data.deviceToken },
      {
        userId: currentUser?.id,
        deviceToken: data.deviceToken,
        platform: data.platform,
      }
    )

    return { data: userDeviceToken }
  }

  async getDeviceRegistrationTokensByUserId(userId: number) {
    try {
      if (!userId) {
        return errorHandler('User not found')
      }

      const tokens = await UserDeviceToken.query()
        .where('user_id', userId)
        .andWhere('is_active', true)
        .distinct('deviceToken')
        .select('deviceToken')

      // Map the results to an array of tokens
      return Array.from(new Set(tokens.map((token) => token.deviceToken)))
    } catch (error) {
      console.error('Error fetching device tokens:', error)
      return []
    }
  }
}
