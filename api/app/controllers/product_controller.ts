import type { HttpContext } from '@adonisjs/core/http'
import { inject } from '@adonisjs/core'
import ProductService from '#services/product_service'
import Product from '#models/product'
import { calculateTax, calculateTotalWithTax } from '#helper/tax_helper'

@inject()
export default class ProductController {
  constructor(protected productService: ProductService) {}

  /**
   * Create a new product
   */
  async store({ response }: HttpContext) {
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
        .preload('image')
        .preload('bannerImage')
        .preload('images', (imagesQuery) => {
          imagesQuery.preload('upload').orderBy('sortOrder', 'asc')
        })
        .preload('category')

      if (organisationId) {
        query = query.where('organisationId', organisationId)
      }

      if (categoryId) {
        query = query.where('categoryId', categoryId)
      }

      if (search) {
        query = query
          .where('name', 'ilike', `%${search}%`)
          .orWhere('description', 'ilike', `%${search}%`)
      }

      const products = await query.paginate(page, limit)

      // Group products by productGroupId or base SKU (fallback)
      const grouped: { [key: string]: Product[] } = {}
      products.all().forEach((product: Product) => {
        let groupKey: string

        if (product.productGroupId) {
          // Use productGroupId if available
          groupKey = `group_${product.productGroupId}`
        } else {
          // Fallback to SKU-based grouping
          const skuParts = product.sku?.split('-') || []
          groupKey = skuParts.slice(0, -1).join('-') || product.sku || product.name
        }

        if (!grouped[groupKey]) {
          grouped[groupKey] = []
        }
        grouped[groupKey].push(product)
      })

      // Format grouped products
      const groupedProducts = Object.values(grouped).map((variants) => ({
        id: variants[0].id,
        name: variants[0].name,
        description: variants[0].description,
        price: variants[0].price,
        currency: variants[0].currency,
        categoryId: variants[0].categoryId,
        category: variants[0].category,
        imageUrl: variants[0].imageUrl,
        imageId: variants[0].imageId,
        image: variants[0].image,
        bannerImage: variants[0].bannerImage,
        images: variants[0].images,
        organisationId: variants[0].organisationId,
        isActive: variants[0].isActive,
        options: variants[0].options,
        productGroupId: variants[0].productGroupId,
        unit: variants[0].unit,
        stock: variants[0].stock,
        taxRate: variants[0].taxRate,
        taxType: variants[0].taxType,
        createdAt: variants[0].createdAt,
        updatedAt: variants[0].updatedAt,
        variants: variants.map((v) => {
          // Extract quantity number from unit (e.g., "1kg" -> "1")
          let quantityFromUnit = ''
          const quantityMatch = v.unit?.match(/^(\d+)/)
          if (quantityMatch) {
            quantityFromUnit = quantityMatch[1]
          }

          const taxAmount = calculateTax(v.price, v.taxRate, v.taxType)
          const priceWithTax = calculateTotalWithTax(v.price, v.taxRate, v.taxType)

          return {
            id: v.id,
            sku: v.sku,
            price: v.price,
            stock: v.stock,
            quantity: v.quantity,
            quantityFromUnit: quantityFromUnit,
            unit: v.unit,
            taxRate: v.taxRate,
            taxType: v.taxType,
            taxAmount,
            priceWithTax,
            options: v.options,
          }
        }),
      }))

      return response.ok({
        message: 'Products fetched successfully',
        data: {
          meta: products.getMeta(),
          data: groupedProducts,
        },
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
      const productD = await Product.query().where('id', params.id).firstOrFail()
      const product = await Product.query()
        .where('id', productD.id)
        .preload('image')
        .preload('bannerImage')
        .preload('images', (imagesQuery) => {
          imagesQuery.preload('upload').orderBy('sortOrder', 'asc')
        })
        .preload('category')
        .preload('organisation')
        .preload('variants', (variantsQuery) => {
          variantsQuery
            .where('organisationId',productD.organisationId)
            .preload('image')
            .preload('bannerImage')
            .preload('images', (imagesQuery) => {
              imagesQuery.preload('upload').orderBy('sortOrder', 'asc')
            })
        })
        .firstOrFail()

      const taxAmount = calculateTax(product.price, product.taxRate, product.taxType)
      const priceWithTax = calculateTotalWithTax(product.price, product.taxRate, product.taxType)

      // Serialize with computed properties
      const productData = product.serialize({
        fields: {
          pick: [
            'id',
            'name',
            'description',
            'sku',
            'price',
            'currency',
            'categoryId',
            'stock',
            'quantity',
            'unit',
            'options',
            'productGroupId',
            'taxRate',
            'taxType',
            'details',
            'bannerImageId',
            'imageId',
            'isActive',
            'organisationId',
            'createdAt',
            'updatedAt',
          ],
        },
        relations: {
          image: {
            fields: {
              pick: ['id', 'name', 'key', 'url'],
            },
          },
          bannerImage: {
            fields: {
              pick: ['id', 'name', 'key', 'url'],
            },
          },
          images: {
            fields: {
              pick: ['id', 'productId', 'uploadId', 'sortOrder', 'isActive'],
            },
            relations: {
              upload: {
                fields: {
                  pick: ['id', 'name', 'key', 'url'],
                },
              },
            },
          },
          category: {
            fields: {
              pick: ['id', 'name', 'emoji'],
            },
          },
          organisation: {
            fields: {
              pick: ['id', 'name', 'organisationUniqueCode'],
            },
          },
          variants: {
            fields: {
              pick: [
                'id',
                'name',
                'sku',
                'price',
                'stock',
                'unit',
                'options',
                'productGroupId',
                'bannerImageId',
                'imageId',
              ],
            },
            relations: {
              image: {
                fields: {
                  pick: ['id', 'name', 'key', 'url'],
                },
              },
              bannerImage: {
                fields: {
                  pick: ['id', 'name', 'key', 'url'],
                },
              },
              images: {
                fields: {
                  pick: ['id', 'productId', 'uploadId', 'sortOrder', 'isActive'],
                },
                relations: {
                  upload: {
                    fields: {
                      pick: ['id', 'name', 'key', 'url'],
                    },
                  },
                },
              },
            },
          },
        },
      })

      return response.ok({
        message: 'Product fetched successfully',
        product: {
          ...productData,
          taxAmount,
          priceWithTax,
        },
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
  async update({ response }: HttpContext) {
    try {
      const result = await this.productService.updateOne()
      if (result.error) {
        return response.status(result.status || 400).json(result)
      }

      const product = result.data
      const taxAmount = calculateTax(product.price, product.taxRate, product.taxType)
      const priceWithTax = calculateTotalWithTax(product.price, product.taxRate, product.taxType)

      return response.ok({
        message: 'Product updated successfully',
        product: {
          ...product.toJSON(),
          taxAmount,
          priceWithTax,
        },
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
