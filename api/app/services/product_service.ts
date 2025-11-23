import { inject } from '@adonisjs/core'
import { HttpContext } from '@adonisjs/core/http'
import Product from '#models/product'
import ProductImage from '#models/product_image'
import Upload from '#models/upload'
import Organisation from '#models/organisation'
import { errorHandler } from '#helper/error_handler'
import { commonParamsIdValidator } from '#validators/common'
import fs from 'node:fs'
import StorageService from './storage_service.js'
import { normalizeFileName } from '#helper/upload_helper'

@inject()
export default class ProductService {
  storageService
  constructor(protected ctx: HttpContext) {
    this.storageService = new StorageService()
  }

  /**
   * Create a product. Accepts optional `branches` array where each item is { id, stock?, price? }
   */
  async create() {
    try {
      const data = this.ctx.request.all()
      let bannerImageId = data.imageId

      // Get organization code for S3 path
      let orgCode = 'default'
      const organisationId = data.organisationId || this.ctx.params?.organisationId
      if (organisationId) {
        try {
          const org = await Organisation.findOrFail(organisationId)
          orgCode = org.organisationUniqueCode
        } catch (e) {
          console.warn(`Organisation not found: ${organisationId}`)
        }
      }

      // Handle banner image upload
      const bannerImage = this.ctx.request.file('bannerImage')
      if (bannerImage) {
        const fileBuffer = fs.readFileSync(bannerImage.tmpPath!)
        const fileName = normalizeFileName(bannerImage.clientName)
        const mimeType =
          bannerImage?.headers?.['content-type'] || bannerImage.type + '/' + bannerImage.extname

        const uploadResult = await this.storageService.uploadFile(
          fileBuffer,
          fileName,
          mimeType as string,
          orgCode,
          'products'
        )

        const key = `${orgCode}/products/${fileName}`
        const upload = await Upload.create({
          name: bannerImage.clientName,
          key,
          mimeType,
          size: bannerImage.size,
          driver: uploadResult.driver,
        })

        bannerImageId = upload.id
      }

      // Parse options if provided
      let options = null
      if (data.options) {
        try {
          options = typeof data.options === 'string' ? JSON.parse(data.options) : data.options
        } catch (e) {
          options = data.options
        }
      }

      // create base product
      const product = await Product.create({
        name: data.name,
        description: data.description,
        sku: data.sku,
        price: data.price,
        currency: data.currency,
        categoryId: data.categoryId || data.category,
        stock: data.stock ?? 0,
        quantity: data.quantity ?? 0,
        unit: data.unit,
        imageId: data.imageId,
        bannerImageId: bannerImageId,
        details: data.details,
        options: options ? JSON.stringify(options) : null,
        productGroupId: data.productGroupId || null,
        organisationId: data.organisationId,
        taxRate: data.taxRate ?? 0,
        taxType: data.taxType ?? 'percentage',
        isActive: data.isActive ?? true,
        isDeleted: false,
        // Discount fields
        discountType: data.discountType || null,
        discountPercentage: data.discountType === 'percentage' ? parseFloat(data.discountValue) : null,
        isDiscountActive: data.isDiscountActive === 'true' || data.isDiscountActive === true,
      })

      // Handle multiple product images upload
      const productImages = this.ctx.request.files('productImages')
      if (productImages && productImages.length > 0) {
        for (const [i, file] of productImages.entries()) {
          const fileBuffer = fs.readFileSync(file.tmpPath!)
          const fileName = normalizeFileName(file.clientName)
          const mimeType = file?.headers?.['content-type'] || file.type + '/' + file.extname

          const uploadResult = await this.storageService.uploadFile(
            fileBuffer,
            fileName,
            mimeType as string,
            orgCode,
            'products'
          )

          const key = `${orgCode}/products/${fileName}`
          const upload = await Upload.create({
            name: file.clientName,
            key,
            mimeType,
            size: file.size,
            driver: uploadResult.driver,
          })

          await ProductImage.create({
            productId: product.id,
            uploadId: upload.id,
            sortOrder: i,
            isActive: true,
          })
        }
      }

      // if branches provided, sync pivot with optional per-branch stock/price
      if (data.branches && Array.isArray(data.branches) && data.branches.length > 0) {
        const mapping: Record<number, any> = {}
        for (const br of data.branches) {
          const branchId = br.id || br.branchId || br.projectId
          if (!branchId) continue
          mapping[branchId] = {
            stock: br.stock ?? product.stock,
            price: br.price ?? product.price,
          }
        }

        if (Object.keys(mapping).length > 0) {
          await product.related('branches').sync(mapping, false)
        }
      }

      return { data: product }
    } catch (e) {
      return errorHandler(e, this.ctx)
    }
  }

  /** Update an existing product */
  async updateOne() {
    try {
      const id = this.ctx.params.id
      await commonParamsIdValidator.validate({ id })
      const data = this.ctx.request.all()
      const product = await Product.findOrFail(id)

      // Get organization code for S3 path
      let orgCode = 'default'
      const orgId = data.organisationId ?? product.organisationId ?? this.ctx.params?.organisationId
      if (orgId) {
        try {
          const org = await Organisation.findOrFail(orgId)
          orgCode = org.organisationUniqueCode
        } catch (e) {
          console.warn(`Organisation not found: ${orgId}`)
        }
      }

      let bannerImageId = data.bannerImageId ?? product.bannerImageId

      // Handle banner image upload
      const bannerImage = this.ctx.request.file('bannerImage')
      if (bannerImage) {
        const fileBuffer = fs.readFileSync(bannerImage.tmpPath!)
        const fileName = normalizeFileName(bannerImage.clientName)
        const mimeType =
          bannerImage?.headers?.['content-type'] || bannerImage.type + '/' + bannerImage.extname

        const uploadResult = await this.storageService.uploadFile(
          fileBuffer,
          fileName,
          mimeType as string,
          orgCode,
          'products'
        )

        const key = `${orgCode}/products/${fileName}`
        const upload = await Upload.create({
          name: bannerImage.clientName,
          key,
          mimeType,
          size: bannerImage.size,
          driver: uploadResult.driver,
        })

        bannerImageId = upload.id
      }

      // Parse options if provided
      let options = product.options
      if (data.options !== undefined) {
        try {
          options = typeof data.options === 'string' ? JSON.parse(data.options) : data.options
          options = options ? JSON.stringify(options) : null
        } catch (e) {
          options = data.options ? JSON.stringify(data.options) : null
        }
      }

      // Prepare update data with defaults for optional fields
      const updateData: any = {
        name: data.name ?? product.name,
        description: data.description ?? product.description,
        sku: data.sku ?? product.sku,
        price: data.price ?? product.price,
        currency: data.currency ?? product.currency,
        categoryId: data.categoryId ?? product.categoryId,
        stock: data.stock !== undefined ? data.stock : product.stock,
        quantity: data.quantity !== undefined ? data.quantity : product.quantity,
        unit: data.unit ?? product.unit,
        imageId: data.imageId ?? product.imageId,
        bannerImageId: bannerImageId,
        details: data.details ?? product.details,
        options: options,
        productGroupId:
          data.productGroupId !== undefined ? data.productGroupId : product.productGroupId,
        organisationId: data.organisationId ?? product.organisationId,
        taxRate: data.taxRate !== undefined ? data.taxRate : product.taxRate,
        taxType: data.taxType ?? product.taxType,
        isActive: data.isActive !== undefined ? data.isActive : product.isActive,
        isDeleted: data.isDeleted !== undefined ? data.isDeleted : product.isDeleted,
      }

      await product.merge(updateData).save()

      // Handle multiple product images upload
      const productImages = this.ctx.request.files('productImages')
      if (productImages && productImages.length > 0) {
        // Get current max sort order
        const existingImages = await ProductImage.query()
          .where('productId', product.id)
          .orderBy('sortOrder', 'desc')

        let maxSortOrder = existingImages.length > 0 ? existingImages[0].sortOrder : -1

        for (const file of productImages) {
          const fileBuffer = fs.readFileSync(file.tmpPath!)
          const fileName = normalizeFileName(file.clientName)
          const mimeType = file?.headers?.['content-type'] || file.type + '/' + file.extname

          const uploadResult = await this.storageService.uploadFile(
            fileBuffer,
            fileName,
            mimeType as string,
            orgCode,
            'products'
          )

          const key = `${orgCode}/products/${fileName}`
          const upload = await Upload.create({
            name: file.clientName,
            key,
            mimeType,
            size: file.size,
            driver: uploadResult.driver,
          })

          maxSortOrder++
          await ProductImage.create({
            productId: product.id,
            uploadId: upload.id,
            sortOrder: maxSortOrder,
            isActive: true,
          })
        }
      }

      // update branch pivot if provided (same shape as create)
      if (data.branches && Array.isArray(data.branches)) {
        const mapping: Record<number, any> = {}
        for (const br of data.branches) {
          const branchId = br.id || br.branchId || br.projectId
          if (!branchId) continue
          mapping[branchId] = {
            stock: br.stock ?? product.stock,
            price: br.price ?? product.price,
          }
        }

        if (Object.keys(mapping).length > 0) {
          await product.related('branches').sync(mapping, false)
        }
      }

      return { data: product }
    } catch (e) {
      return errorHandler(e, this.ctx)
    }
  }

  /** Hide a product (set isActive = false) */
  async hideOne() {
    try {
      const id = this.ctx.params.id
      await commonParamsIdValidator.validate({ id })
      const product = await Product.findOrFail(id)
      product.isActive = false
      await product.save()
      return { data: product }
    } catch (e) {
      return errorHandler(e, this.ctx)
    }
  }

  /** Show a product (set isActive = true) */
  async showOne() {
    try {
      const id = this.ctx.params.id
      await commonParamsIdValidator.validate({ id })
      const product = await Product.findOrFail(id)
      product.isActive = true
      await product.save()
      return { data: product }
    } catch (e) {
      return errorHandler(e, this.ctx)
    }
  }

  /** Deleting products is not allowed in this application */
  async deleteOne() {
    try {
      throw new Error('Deleting products is not allowed. Use hide/show to deactivate products.')
    } catch (e) {
      return errorHandler(e, this.ctx)
    }
  }
}
