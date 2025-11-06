import type { HttpContext } from '@adonisjs/core/http'
import ProductCategory from '#models/product_category'

export default class ProductCategoryController {
  /**
   * Get all product categories
   */
  async index({ response }: HttpContext) {
    try {
      const categories = await ProductCategory.query()
        .where('isActive', true)
        .orderBy('name', 'asc')
      return response.ok({
        message: 'Categories fetched successfully',
        data: categories,
      })
    } catch (error) {
      return response.internalServerError({
        message: error.message || 'Failed to fetch categories',
      })
    }
  }

  /**
   * Get categories for a specific organisation
   */
  async getByOrganisation({ params, response }: HttpContext) {
    try {
      const organisationId = params.organisationId

      const categories = await ProductCategory.query()
        .where('organisationId', organisationId)
        .where('isActive', true)
        .orderBy('name', 'asc')

      return response.ok({
        message: 'Categories fetched successfully',
        data: categories,
      })
    } catch (error) {
      return response.internalServerError({
        message: error.message || 'Failed to fetch categories',
      })
    }
  }

  /**
   * Get a single category
   */
  async show({ params, response }: HttpContext) {
    try {
      const category = await ProductCategory.findOrFail(params.id)
      return response.ok({
        message: 'Category fetched successfully',
        data: category,
      })
    } catch (error) {
      return response.notFound({
        message: 'Category not found',
      })
    }
  }

  /**
   * Create a new category
   */
  async store({ request, response }: HttpContext) {
    try {
      const { name, slug, description } = request.only(['name', 'slug', 'description'])

      const category = await ProductCategory.create({
        name,
        slug,
        description,
        isActive: true,
      })

      return response.created({
        message: 'Category created successfully',
        data: category,
      })
    } catch (error) {
      return response.badRequest({
        message: error.message || 'Failed to create category',
      })
    }
  }

  /**
   * Update a category
   */
  async update({ params, request, response }: HttpContext) {
    try {
      const category = await ProductCategory.findOrFail(params.id)
      const { name, slug, description, isActive } = request.only([
        'name',
        'slug',
        'description',
        'isActive',
      ])

      category.merge({
        name,
        slug,
        description,
        isActive: isActive !== undefined ? isActive : category.isActive,
      })

      await category.save()

      return response.ok({
        message: 'Category updated successfully',
        data: category,
      })
    } catch (error) {
      return response.internalServerError({
        message: error.message || 'Failed to update category',
      })
    }
  }

  /**
   * Delete a category
   */
  async destroy({ params, response }: HttpContext) {
    try {
      const category = await ProductCategory.findOrFail(params.id)
      await category.delete()

      return response.ok({
        message: 'Category deleted successfully',
      })
    } catch (error) {
      return response.internalServerError({
        message: error.message || 'Failed to delete category',
      })
    }
  }
}
