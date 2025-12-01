import { inject } from '@adonisjs/core'
import { HttpContext } from '@adonisjs/core/http'
import fs from 'node:fs'
import StorageService from './storage_service.js'
import Upload from '#models/upload'
import Organisation from '#models/organisation'
import { errorHandler } from '#helper/error_handler'
import { commonParamsIdValidator } from '#validators/common'
import { normalizeFileName } from '#helper/upload_helper'

@inject()
export default class UploadService {
  storageService
  constructor(protected ctx: HttpContext) {
    this.storageService = new StorageService()
  }

  async create() {
    try {
      const files = this.ctx.request.files('files')
      const finalUrls = []

      // Get organization code if provided (for org info images)
      let orgCode = 'default'
      const organisationId =
        this.ctx.request.input('organisationId') || this.ctx.params?.organisationId
      const imageType = this.ctx.request.input('imageType') || 'products' // 'products' or 'info'

      if (organisationId) {
        try {
          const org = await Organisation.findOrFail(organisationId)
          orgCode = org.organisationUniqueCode
        } catch (e) {
          console.warn(`Organisation not found: ${organisationId}`)
        }
      }

      for (let file of files) {
        const fileBuffer = fs.readFileSync(file.tmpPath!)
        const fileName = normalizeFileName(file.clientName)
        const mimeType = file?.headers?.['content-type'] || file.type + '/' + file.extname

        const uploadResult = await this.storageService.uploadFile(
          fileBuffer,
          fileName,
          mimeType as string,
          orgCode,
          imageType
        )

        const key = `${orgCode}/${imageType}/${fileName}`
        const res = await Upload.create({
          name: file.clientName,
          key,
          mimeType,
          size: file.size,
          driver: uploadResult.driver,
        })
        finalUrls.push(res)
      }

      return finalUrls
    } catch (e) {
      return errorHandler(e, this.ctx)
    }
  }

  async findOneById() {
    const id = this.ctx.request.param('id')
    await commonParamsIdValidator.validate({ id })
    const fileDetail = await Upload.query().where('id', id).firstOrFail()
    return fileDetail
  }
}
