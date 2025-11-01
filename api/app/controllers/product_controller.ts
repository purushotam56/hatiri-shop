import type { HttpContext } from '@adonisjs/core/http'
import { inject } from '@adonisjs/core'
import ProductService from '#services/product_service'
import Product from '#models/product'

@inject()
export default class ProductController {
  constructor(protected productService: ProductService) {}

  /**
   * Create a new product
   */
  async store({ request, response }: HttpContext) {
    const result = await this.productService.create()
    if (result.error) {
      return response.status(result.status || 400).json(result)
    }
    return response.status(201).json({
      message: 'Product created successfully',
      product: result.data,
    })
  }

  /**
   * Get all products with filters
   */
  async index({ request, response }: HttpContext) {
    try {
      const page = request.input('page', 1)
      const limit = request.input('limit', 20)
      const organisationId = request.input('organisationId')
      const categoryId = request.input('categoryId')
      const search = request.input('search')

      let query = Product.query()

      if (organisationId) {
        query = query.where('organisationId', organisationId)
      }

      if (categoryId) {
        query = query.where('categoryId', categoryId)
      }

      if (search) {
        query = query.where('name', 'ilike', `%${search}%`).orWhere('description', 'ilike', `%${search}%`)
      }

      const products = await query.paginate(page, limit)
      return response.ok({
        message: 'Products fetched successfully',
        data: products,
      })
    } catch (error) {
      return response.internalServerError({
        message: error.message || 'Failed to fetch products',
      })
    }
  }

  /**
   * Get a single product
   */
  async show({ params, response }: HttpContext) {
    try {
      const product = await Product.findOrFail(params.id)
      return response.ok({
        message: 'Product fetched successfully',
        product,
      })
    } catch (error) {
      return response.notFound({
        message: 'Product not found',
      })
    }
  }

  /**
   * Update a product
   */
  async update({ params, request, response }: HttpContext) {
    try {
      const product = await Product.findOrFail(params.id)
      const data = request.all()

      await product.merge(data).save()

      return response.ok({
        message: 'Product updated successfully',
        product,
      })
    } catch (error) {
      if (error.code === 'E_ROW_NOT_FOUND') {
        return response.notFound({
          message: 'Product not found',
        })
      }
      return response.internalServerError({
        message: error.message || 'Failed to update product',
      })
    }
  }

  /**
   * Delete a product
   */
  async destroy({ params, response }: HttpContext) {
    try {
      const product = await Product.findOrFail(params.id)
      await product.delete()

      return response.ok({
        message: 'Product deleted successfully',
      })
    } catch (error) {
      if (error.code === 'E_ROW_NOT_FOUND') {
        return response.notFound({
          message: 'Product not found',
        })
      }
      return response.internalServerError({
        message: error.message || 'Failed to delete product',
      })
    }
  }
}
