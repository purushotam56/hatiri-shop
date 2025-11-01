import { inject } from '@adonisjs/core'
import UserService from '#services/user_service'

@inject()
export default class UsersController {
  constructor(protected userService: UserService) {}
  async index() {
    return this.userService.findAll()
  }

  async findAllByOrganisation() {
    return this.userService.findAllByOrganisation()
  }

  async store() {}

  async show() {}

  async update() {
    return this.userService.updateUserProfile()
  }

  async destroy() {}

  async createBranchUser() {}
}
