import { inject } from '@adonisjs/core'
import BranchService from '#services/branch_service'

@inject()
export default class BranchsController {
  constructor(protected branchService: BranchService) {}
  async index() {
    return this.branchService.findAll()
  }

  async findAllByOrganisation() {
    return this.branchService.findAllByOrganisation()
  }

  async store() {
    return this.branchService.create()
  }

  async show() {
    return this.branchService.findOneById()
  }

  async update() {
    return this.branchService.updateOne()
  }

  async destroy() {
    return this.branchService.deleteOne()
  }

  async createBranchUser() {
    return this.branchService.createBranchUser()
  }

  async findBranchUserWithTradeCode() {
    return this.branchService.findBranchUserWithTradeCode()
  }
}
