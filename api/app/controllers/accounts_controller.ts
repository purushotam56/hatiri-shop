import { inject } from '@adonisjs/core'
import UserDeviceTokenService from '#services/user_device_token_service'

@inject()
export default class AccountsController {
  constructor(protected userDeviceTokenServiceUse: UserDeviceTokenService) {}

  registerUserDeviceToken() {
    return this.userDeviceTokenServiceUse.registerUserDeviceToken()
  }
}
