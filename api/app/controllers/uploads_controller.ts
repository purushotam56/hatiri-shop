// import type { HttpContext } from '@adonisjs/core/http'

import UploadService from '#services/upload_service'
import { inject } from '@adonisjs/core'

@inject()
export default class UploadsController {
  constructor(protected uploadservice: UploadService) {}
  async store() {
    return this.uploadservice.create()
  }

  async show() {
    return this.uploadservice.findOneById()
  }
}
