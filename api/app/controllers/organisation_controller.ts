import { inject } from '@adonisjs/core'
import OrganisationService from '#services/organisation_service'

@inject()
export default class OrganisationController {
  constructor(protected organisationService: OrganisationService) {}

  async index() {
    return this.organisationService.findAll()
  }

  async store() {
    return this.organisationService.create()
  }

  async show() {
    return this.organisationService.findOne()
  }

  async update() {
    return this.organisationService.updateOne()
  }

  async destroy() {
    return this.organisationService.deleteOne()
  }

  async createOrganisationUser() {
    return this.organisationService.createOrganisationUser()
  }
}
