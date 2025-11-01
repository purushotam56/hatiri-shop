import { inject } from '@adonisjs/core'
import { HttpContext } from '@adonisjs/core/http'
import fs from 'node:fs'
import S3Service from './s3_service.js'
import Upload from '#models/upload'
import { errorHandler } from '#helper/error_handler'
import { commonParamsIdValidator } from '#validators/common'
import { normalizeFileName } from '#helper/upload_helper'

@inject()
export default class UploadService {
  s3service
  constructor(protected ctx: HttpContext) {
    this.s3service = new S3Service()
  }

  async create() {
    try {
      const files = this.ctx.request.files('files')
      const finalUrls = []

      for (let file of files) {
        const fileBuffer = fs.readFileSync(file.tmpPath!)

        const key = 'images/' + normalizeFileName(file.clientName)

        const mimeType = file?.headers?.['content-type'] || file.type + '/' + file.extname
        await this.s3service.uploadFile(fileBuffer, key, mimeType as string)

        const res = await Upload.create({
          name: file.clientName,
          key,
          mimeType,
          size: file.size,
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
