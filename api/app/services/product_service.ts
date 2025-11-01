import { inject } from '@adonisjs/core'
import { HttpContext } from '@adonisjs/core/http'
import Product from '#models/product'
import { errorHandler } from '#helper/error_handler'
import { commonParamsIdValidator } from '#validators/common'

@inject()
export default class ProductService {
  constructor(protected ctx: HttpContext) {}

  /**
   * Create a product. Accepts optional `branches` array where each item is { id, stock?, price? }
   */
  async create() {
    try {
      const data = this.ctx.request.all()

      // create base product
      const product = await Product.create({
        name: data.name,
        description: data.description,
        sku: data.sku,
        price: data.price,
        currency: data.currency,
        categoryId: data.categoryId || data.category,
        stock: data.stock ?? 0,
        unit: data.unit,
        imageId: data.imageId,
        organisationId: data.organisationId,
        isActive: data.isActive ?? true,
        isDeleted: false,
      })

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

      await product.merge(data).save()

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
