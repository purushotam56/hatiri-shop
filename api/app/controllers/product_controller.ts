import type { HttpContext } from '@adonisjs/core/http'
import { inject } from '@adonisjs/core'
import fs from 'node:fs'
import ProductService from '#services/product_service'
import Product from '#models/product'
import ProductGroup from '#models/product_group'
import Organisation from '#models/organisation'
import Upload from '#models/upload'
import ProductImage from '#models/product_image'
import { calculateTax, calculateTotalWithTax } from '#helper/tax_helper'
import { normalizeFileName } from '#helper/upload_helper'
import StorageService from '#services/storage_service'
import { areUnitsCompatible } from '#types/unit'

@inject()
export default class ProductController {
  constructor(protected productService: ProductService) {}

  /**
   * Create a new product (single or variant)
   * POST /products
   *
   * Body:
   * - Single product: name, description, sku, price, stock, unit, categoryId, organisationId, details, bannerImage, productImages
   * - Variant product: name, description, sku, stock (groupStock), unit, categoryId, organisationId, details,
   *                    stockMergeType, bannerImage, productImages, variants array
   */
  async store({ request, response, auth }: HttpContext) {
    try {
      const user = await auth.authenticate()

      const name = request.input('name')
      const description = request.input('description')
      const sku = request.input('sku')
      const categoryId = request.input('categoryId')
      const organisationId = request.input('organisationId')
      const details = request.input('details')
      const bannerImage = request.file('bannerImage')
      const productImages = request.files('productImages')

      // Parse productGroup prefixed fields
      const productGroupBaseStock = request.input('productGroupBaseStock')
      const productGroupUnit = request.input('productGroupUnit')
      const productGroupStockMergeType = request.input('productGroupStockMergeType') || 'merged'

      // For single product, use productGroup fields; for variants, use productGroup fields
      const stock = productGroupBaseStock
      const unit = productGroupUnit
      const stockMergeType = productGroupStockMergeType

      // Check if this is a variant product
      const isVariant = !!request.input('variants[0][label]')

      if (!name || !sku || !categoryId || !organisationId) {
        return response.badRequest({
          message: 'Name, SKU, category, and organisationId are required',
        })
      }

      // Verify user is authorized for this organisation
      const org = await Organisation.query()
        .where('id', organisationId)
        .preload('user', (q) => q.where('user_id', user.id))
        .first()

      if (!org || org.user.length === 0) {
        return response.forbidden({
          message: 'Not authorized to create products for this organisation',
        })
      }

      if (!stock && stock !== 0 && stockMergeType === 'merged') {
        return response.badRequest({
          message: 'Stock is required and must be a valid number',
        })
      }

      if (!unit && stockMergeType === 'merged') {
        return response.badRequest({
          message: 'Unit is required',
        })
      }

      // SINGLE PRODUCT
      if (!isVariant) {
        const result = await this.productService.create()
        if (result.error) {
          return response.status(result.status || 400).json(result)
        }
        return response.status(201).json({
          message: 'Product created successfully',
          data: result.data,
        })
      }

      // VARIANT PRODUCT - Use same logic as SellerController.createProductWithVariants
      // Parse variants from request
      const variantsData = []
      let index = 0
      while (request.input(`variants[${index}][label]`)) {
        const stockInput = request.input(`variants[${index}][stock]`)
        variantsData.push({
          label: request.input(`variants[${index}][label]`),
          skuSuffix: request.input(`variants[${index}][skuSuffix]`),
          price: Number.parseFloat(request.input(`variants[${index}][price]`)),
          quantity: Number.parseFloat(request.input(`variants[${index}][quantity]`)),
          unit: request.input(`variants[${index}][unit]`),
          stock: stockInput ? Number.parseInt(stockInput) : 0,
          isDiscountActive: request.input(`variants[${index}][isDiscountActive]`) === 'true',
          discountType: request.input(`variants[${index}][discountType]`),
          discountValue: request.input(`variants[${index}][discountValue]`),
          // Independent mode: asset flags and values
          description: request.input(`variants[${index}][description]`),
          useSameDescription: request.input(`variants[${index}][useSameDescription]`) === 'true',
          details: request.input(`variants[${index}][details]`),
          useSameDetails: request.input(`variants[${index}][useSameDetails]`) === 'true',
          bannerImage: request.file(`variants[${index}][bannerImage]`),
          useSameBannerImage:
            index > 0 && request.input(`variants[${index}][useSameBannerImage]`) === 'true',
          images: request.files(`variants[${index}][images]`) || [],
          useSameImages: index > 0 && request.input(`variants[${index}][useSameImages]`) === 'true',
        })
        index++
      }

      if (variantsData.length < 2) {
        return response.badRequest({
          message: 'At least two variants are required',
        })
      }

      // Validate unit compatibility
      // const unitCompatibility: { [key: string]: string[] } = {
      //   kg: ['kg', 'gm', 'mg'],
      //   liter: ['liter', 'ml'],
      //   dozen: ['dozen', 'piece'],
      //   piece: ['piece'],
      // }

      const incompatibleVariant = !areUnitsCompatible(variantsData[0].unit, variantsData[1].unit)

      if (incompatibleVariant) {
        return response.badRequest({
          message: `Variant unit "${variantsData[0].unit}" is not compatible with group unit "${variantsData[1].unit}".`,
        })
      }

      // Get organization code for S3 paths
      const orgCode = org.organisationUniqueCode
      const storageService = new StorageService()

      let sharedBannerImageId: number | null = null
      if (bannerImage) {
        const fileName = normalizeFileName(bannerImage.clientName)
        const fileBuffer = fs.readFileSync(bannerImage.tmpPath!)
        const mimeType =
          bannerImage?.headers?.['content-type'] || bannerImage.type + '/' + bannerImage.extname

        await storageService.uploadFile(
          fileBuffer,
          fileName,
          mimeType as string,
          orgCode,
          'products'
        )
        const bannerImagePath = `${orgCode}/products/${fileName}`
        const sharedBannerUpload = await Upload.create({
          name: fileName,
          mimeType: mimeType as string,
          size: fileBuffer.length,
          key: bannerImagePath,
          urlPrefix: '',
          driver: 's3',
        })
        sharedBannerImageId = sharedBannerUpload.id
      }

      const sharedImageIds: number[] = []
      if (productImages && productImages.length > 0) {
        for (const image of productImages) {
          const fileName = normalizeFileName(image.clientName)
          const fileBuffer = fs.readFileSync(image.tmpPath!)
          const mimeType = image?.headers?.['content-type'] || image.type + '/' + image.extname

          await storageService.uploadFile(
            fileBuffer,
            fileName,
            mimeType as string,
            orgCode,
            'products'
          )
          const imagePath = `${orgCode}/products/${fileName}`
          const sharedImageUpload = await Upload.create({
            name: fileName,
            mimeType: mimeType as string,
            size: fileBuffer.length,
            key: imagePath,
            urlPrefix: '',
            driver: 's3',
          })
          sharedImageIds.push(sharedImageUpload.id)
        }
      }

      // Create ProductGroup record first
      const productGroup = await ProductGroup.create({
        organisationId: Number(organisationId),
        name: name,
        description: description || null,
        baseSku: sku,
        baseStock: stockMergeType === 'merged' ? Number.parseInt(stock) : 0,
        unit: unit,
        stockMergeType: stockMergeType as 'merged' | 'independent',
      })

      let mainVariantBannerImageId: number | null = null
      let mainVariantImageIds: number[] = []

      // Create all variants
      const createdVariants = []
      let variantIndex = 0
      for (const variant of variantsData) {
        let variantBannerImageId: number | null = null
        let variantImageIds: number[] = []

        // Handle variant-specific banner image (independent mode only)
        if (
          stockMergeType === 'independent' &&
          variant.bannerImage &&
          (!variant.useSameBannerImage || variantIndex === 0)
        ) {
          const imgFileName = normalizeFileName(variant.bannerImage.clientName)
          const imgBuffer = fs.readFileSync(variant.bannerImage.tmpPath!)
          const imgMimeType =
            variant.bannerImage?.headers?.['content-type'] ||
            variant.bannerImage.type + '/' + variant.bannerImage.extname

          await storageService.uploadFile(
            imgBuffer,
            imgFileName,
            imgMimeType as string,
            orgCode,
            'products'
          )

          const imgUploadPath = `${orgCode}/products/${imgFileName}`
          const imgUploadRecord = await Upload.create({
            name: imgFileName,
            mimeType: imgMimeType as string,
            size: imgBuffer.length,
            key: imgUploadPath,
            urlPrefix: '',
            driver: 's3',
          })

          variantBannerImageId = imgUploadRecord.id

          if (variantIndex === 0) {
            mainVariantBannerImageId = imgUploadRecord.id
          }
        }

        // Handle variant-specific product images
        if (
          stockMergeType === 'independent' &&
          variant.images &&
          variant.images.length > 0 &&
          (!variant.useSameImages || variantIndex === 0)
        ) {
          // Independent mode with custom images
          for (const image of variant.images) {
            const imgFileName = normalizeFileName(image.clientName)
            const imgBuffer = fs.readFileSync(image.tmpPath!)
            const imgMimeType = image?.headers?.['content-type'] || image.type + '/' + image.extname

            await storageService.uploadFile(
              imgBuffer,
              imgFileName,
              imgMimeType as string,
              orgCode,
              'products'
            )

            const imgUploadPath = `${orgCode}/products/${imgFileName}`
            const imgUploadRecord = await Upload.create({
              name: imgFileName,
              mimeType: imgMimeType as string,
              size: imgBuffer.length,
              key: imgUploadPath,
              urlPrefix: '',
              driver: 's3',
            })
            variantImageIds.push(imgUploadRecord.id)
            if (variantIndex === 0) {
              mainVariantImageIds.push(imgUploadRecord.id)
            }
          }
        } else if (stockMergeType === 'merged' && variant.images && variant.images.length > 0) {
          // Merged mode: All variant images go as product images (banner is shared)
          for (const image of variant.images) {
            const imgFileName = normalizeFileName(image.clientName)
            const imgBuffer = fs.readFileSync(image.tmpPath!)
            const imgMimeType = image?.headers?.['content-type'] || image.type + '/' + image.extname

            await storageService.uploadFile(
              imgBuffer,
              imgFileName,
              imgMimeType as string,
              orgCode,
              'products'
            )

            const imgUploadPath = `${orgCode}/products/${imgFileName}`
            const imgUploadRecord = await Upload.create({
              name: imgFileName,
              mimeType: imgMimeType as string,
              size: imgBuffer.length,
              key: imgUploadPath,
              urlPrefix: '',
              driver: 's3',
            })
            variantImageIds.push(imgUploadRecord.id)
          }
        }

        if (!variantBannerImageId) {
          variantBannerImageId = sharedBannerImageId || mainVariantBannerImageId
        }

        // If merged mode or independent mode with useSameImages=true, add shared product images
        if (
          (sharedImageIds.length > 0 && stockMergeType === 'merged') ||
          (stockMergeType === 'independent' && variant.useSameImages)
        ) {
          if (stockMergeType === 'merged') {
            variantImageIds.push(...sharedImageIds)
          } else {
            variantImageIds.push(...mainVariantImageIds)
          }
        }

        // Create the product variant
        const product = await Product.create({
          name: `${name} - ${variant.label}`,
          description,
          sku: `${org.organisationUniqueCode}-${sku}${variant.skuSuffix}`,
          price: variant.price,
          stock: stockMergeType === 'independent' ? variant.stock : 0,
          unit: variant.unit,
          categoryId: Number.parseInt(categoryId),
          organisationId: Number(organisationId),
          productGroupId: productGroup.id,
          stockMergeType: stockMergeType as 'merged' | 'independent',
          bannerImageId: variantBannerImageId,
          taxRate: 0,
          taxType: 'inclusive',
          currency: 'INR',
          quantity: Math.round(Number(variant.quantity) || 1),
          details: details,
          isActive: true,
          isDeleted: false,
          discountType: variant.isDiscountActive ? variant.discountType : null,
          discountPercentage:
            variant.isDiscountActive && variant.discountType === 'percentage'
              ? Number.parseFloat(variant.discountValue)
              : null,
          isDiscountActive: variant.isDiscountActive,
        })

        // Associate product images
        if (variantImageIds.length > 0) {
          for (const [sortOrder, variantImageId] of variantImageIds.entries()) {
            await ProductImage.create({
              productId: product.id,
              uploadId: variantImageId,
              sortOrder: sortOrder,
              isActive: true,
            })
          }
        }

        createdVariants.push(product)
      }

      return response.created({
        message: 'Product variants created successfully',
        data: {
          productGroup: {
            id: productGroup.id,
            organisationId: productGroup.organisationId,
            name: productGroup.name,
            description: productGroup.description,
            baseSku: productGroup.baseSku,
            baseStock: productGroup.baseStock,
            unit: productGroup.unit,
            stockMergeType: productGroup.stockMergeType,
            createdAt: productGroup.createdAt,
            updatedAt: productGroup.updatedAt,
          },
          variants: createdVariants,
        },
      })
    } catch (error) {
      console.error('Product creation error:', error)
      return response.internalServerError({
        message: error.message || 'Failed to create product',
      })
    }
  }

  /**
   * Get all products with filters
   * Optimized single-pass query with minimal memory overhead
   *
   * Query parameters:
   * - organisationId: Filter by organisation
   * - categoryId: Filter by category
   * - search: Search by name or description
   * - type: 'single' | 'variant' | undefined
   * - page: Page number (default: 1)
   * - limit: Items per page (default: 20)
   */
  async index({ request, response }: HttpContext) {
    try {
      const page = request.input('page', 1)
      const limit = request.input('limit', 20)
      const organisationId = request.input('organisationId')
      const categoryId = request.input('categoryId')
      const search = request.input('search')
      const type = request.input('type')

      // Build the query for distinct products
      let countQuery = Product.query()
        .select('id', 'productGroupId', 'organisationId', 'sku')
        .distinct('productGroupId')

      if (organisationId) {
        countQuery = countQuery.where('organisationId', organisationId)
      }

      if (categoryId) {
        countQuery = countQuery.where('categoryId', categoryId)
      }

      if (type === 'single') {
        countQuery = countQuery.whereNull('productGroupId')
      } else if (type === 'variant') {
        countQuery = countQuery.whereNotNull('productGroupId')
      }

      if (search) {
        countQuery = countQuery
          .where('name', 'ilike', `%${search}%`)
          .orWhere('description', 'ilike', `%${search}%`)
      }

      // Get all distinct products (we need full count for pagination)
      const distinctProducts = await countQuery

      // Build in-memory index: groupKey -> productId
      const groupIndex = new Map<string | number, number>()
      const groups: Array<{ key: string | number; id: number; isSingle: boolean }> = []

      for (const product of distinctProducts) {
        const key = product.productGroupId || `sku_${product.sku}`
        const isSingle = !product.productGroupId

        if (!groupIndex.has(key)) {
          groupIndex.set(key, product.id)
          groups.push({ key, id: product.id, isSingle })
        }
      }

      // Apply type filter
      let filtered = groups

      // Apply pagination
      const total = filtered.length
      const lastPage = Math.ceil(total / limit)
      const startIndex = (page - 1) * limit
      const paginatedGroups = filtered.slice(startIndex, startIndex + limit)
      const paginatedIds = paginatedGroups.map((g) => g.id)

      // Separate variant and single product IDs
      const variantProductIds = paginatedIds.filter((id) => {
        const group = paginatedGroups.find((g) => g.id === id)
        return group && !group.isSingle
      })
      const singleProductIds = paginatedIds.filter((id) => {
        const group = paginatedGroups.find((g) => g.id === id)
        return group && group.isSingle
      })

      // Fetch variant products with their variants preloaded
      let variantProducts: any[] = []
      if (variantProductIds.length > 0) {
        variantProducts = await Product.query()
          .whereIn('id', variantProductIds)
          .preload('bannerImage')
          .preload('images', (imagesQuery) => {
            imagesQuery.preload('upload').orderBy('sortOrder', 'asc')
          })
          .preload('category')
          .preload('productGroup')
          .preload('variants', (variantsQuery) => {
            variantsQuery
              .preload('bannerImage')
              .preload('images', (imagesQuery) => {
                imagesQuery.preload('upload').orderBy('sortOrder', 'asc')
              })
              .orderBy('price', 'asc')
          })
      }

      // Fetch single products without trying to preload variants
      let singleProducts: any[] = []
      if (singleProductIds.length > 0) {
        singleProducts = await Product.query()
          .whereIn('id', singleProductIds)
          .preload('bannerImage')
          .preload('images', (imagesQuery) => {
            imagesQuery.preload('upload').orderBy('sortOrder', 'asc')
          })
          .preload('category')
      }

      // Combine and sort back to original order
      const allProducts = [...variantProducts, ...singleProducts]
      const productIndex = new Map(allProducts.map((p) => [p.id, p]))
      const sortedProducts = paginatedIds.map((id) => productIndex.get(id)!)

      // Format response with preloaded variants and serialize image URLs
      const formattedProducts = sortedProducts.map((baseProduct) => {
        // For variant products: use preloaded variants
        // For single products: variants array will be empty from preload, so use the base product
        const variants =
          baseProduct.productGroupId && baseProduct.variants && baseProduct.variants.length > 0
            ? baseProduct.variants
            : [baseProduct]

        // Serialize banner image with URL if available
        const bannerImageData = baseProduct.bannerImage
          ? {
              id: baseProduct.bannerImage.id,
              name: baseProduct.bannerImage.name,
              key: baseProduct.bannerImage.key,
              url: baseProduct.bannerImage.url,
            }
          : null

        // Serialize all images with their upload URLs
        const imagesData =
          baseProduct.images?.map((img: any) => ({
            id: img.id,
            productId: img.productId,
            uploadId: img.uploadId,
            sortOrder: img.sortOrder,
            isActive: img.isActive,
            upload: img.upload
              ? {
                  id: img.upload.id,
                  name: img.upload.name,
                  key: img.upload.key,
                  url: img.upload.url, // This will include the computed url from Upload model
                }
              : null,
          })) || []

        // Get the first image URL as main image (for backwards compatibility)
        const imageUrl = imagesData.length > 0 ? imagesData[0].upload?.url : null

        // Format the response
        return {
          id: baseProduct.id,
          name: baseProduct.name,
          description: baseProduct.description,
          price: baseProduct.price,
          currency: baseProduct.currency,
          categoryId: baseProduct.categoryId,
          category: baseProduct.category,
          imageUrl: imageUrl,
          bannerImage: bannerImageData,
          images: imagesData,
          organisationId: baseProduct.organisationId,
          isActive: baseProduct.isActive,
          productGroupId: baseProduct.productGroupId,
          productGroup: baseProduct.productGroup,
          quantity: baseProduct.quantity,
          unit: baseProduct.unit,
          taxRate: baseProduct.taxRate,
          taxType: baseProduct.taxType,
          createdAt: baseProduct.createdAt,
          updatedAt: baseProduct.updatedAt,
          stock:
            baseProduct.productGroup?.stockMergeType === 'merged'
              ? baseProduct.productGroup?.baseStock
              : baseProduct.stock,
          stockUnit:
            baseProduct.productGroup?.stockMergeType === 'merged'
              ? baseProduct.productGroup?.unit
              : baseProduct.unit,

          variants: variants.map((v: Product) => {
            // Extract quantity number from unit (e.g., "1kg" -> "1")
            let quantityFromUnit = ''
            const quantityMatch = v.unit?.match(/^(\d+)/)
            if (quantityMatch) {
              quantityFromUnit = quantityMatch[1]
            }

            const taxAmount = calculateTax(v.price, v.taxRate, v.taxType)
            const priceWithTax = calculateTotalWithTax(v.price, v.taxRate, v.taxType)

            // Serialize variant banner image
            const variantBannerImageData = v.bannerImage
              ? {
                  id: v.bannerImage.id,
                  name: v.bannerImage.name,
                  key: v.bannerImage.key,
                  url: v.bannerImage.url,
                }
              : null

            const variantImagesData =
              v.images?.map((img: any) => ({
                id: img.id,
                productId: img.productId,
                uploadId: img.uploadId,
                sortOrder: img.sortOrder,
                isActive: img.isActive,
                upload: img.upload
                  ? {
                      id: img.upload.id,
                      name: img.upload.name,
                      key: img.upload.key,
                      url: img.upload.url,
                    }
                  : null,
              })) || []

            const variantImageUrl =
              variantImagesData.length > 0 ? variantImagesData[0].upload?.url : null

            return {
              id: v.id,
              sku: v.sku,
              price: v.price,
              quantity: v.quantity,
              quantityFromUnit: quantityFromUnit,
              unit: v.unit,
              taxRate: v.taxRate,
              taxType: v.taxType,
              taxAmount,
              priceWithTax,
              imageUrl: variantImageUrl,
              bannerImage: variantBannerImageData,
              images: variantImagesData,
              name: v.name,
              productGroup: baseProduct.productGroup,
              stock:
                baseProduct.productGroup?.stockMergeType === 'merged'
                  ? baseProduct.productGroup?.baseStock
                  : v.stock,
              stockUnit:
                baseProduct.productGroup?.stockMergeType === 'merged'
                  ? baseProduct.productGroup?.unit
                  : v.unit,
            }
          }),
        }
      })

      return response.ok({
        message: 'Products fetched successfully',
        data: {
          meta: {
            total,
            per_page: limit,
            current_page: page,
            last_page: lastPage,
            from: startIndex + 1,
            to: Math.min(startIndex + limit, total),
          },
          data: formattedProducts,
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
      const product = await Product.query()
        .where('id', params.id)
        .preload('bannerImage')
        .preload('images', (imagesQuery) => {
          imagesQuery.preload('upload').orderBy('sortOrder', 'asc')
        })
        .preload('category')
        .preload('organisation', (orgq) => orgq.preload('image'))
        .firstOrFail()

      // Load variants only if product is part of a group
      let productGroup = null
      if (product.productGroupId) {
        await product.load('variants', (variantsQuery) => {
          variantsQuery
            .where('organisationId', product.organisationId)
            .preload('bannerImage')
            .preload('images', (imagesQuery) => {
              imagesQuery.preload('upload').orderBy('sortOrder', 'asc')
            })
            .orderBy('price', 'asc')
        })

        // Also load the product group to get baseSku and other group info
        productGroup = await ProductGroup.query()
          .where('id', product.productGroupId)
          .select('id', 'baseSku', 'baseStock', 'unit', 'stockMergeType')
          .first()
      }

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
            'discountType',
            'discountPercentage',
            'isDiscountActive',
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
                'discountType',
                'discountPercentage',
                'isDiscountActive',
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
            },
          },
        },
      })

      return response.ok({
        message: 'Product fetched successfully',
        product: {
          ...productData,
          variants: productData?.variants?.map((v: Product) => ({
            ...v,
            stock:
              productGroup?.stockMergeType === 'merged'
                ? productGroup?.baseStock
                : productData.stock,
            stockUnit:
              productGroup?.stockMergeType === 'merged' ? productGroup?.unit : productData.unit,
          })),
          taxAmount,
          priceWithTax,
          // Include product group info for variants
          productGroup: productGroup
            ? {
                id: productGroup.id,
                baseSku: productGroup.baseSku,
                baseStock: productGroup.baseStock,
                unit: productGroup.unit,
                stockMergeType: productGroup.stockMergeType,
              }
            : null,
          stock:
            productGroup?.stockMergeType === 'merged' ? productGroup?.baseStock : productData.stock,
        },
      })
    } catch (error) {
      return response.notFound({
        message: 'Product not found',
      })
    }
  }

  /**
   * Update a product - supports all product types
   * PUT /products/:id
   *
   * Supports:
   * 1. Simple products (single product)
   * 2. Shared inventory variants (all variants same images)
   * 3. Independent inventory variants (each variant own images)
   */
  async update({ params, request, response }: HttpContext) {
    try {
      const productId = params.id

      if (!productId) {
        return response.badRequest({ message: 'Product ID is required' })
      }

      // Get the product to check if it's simple or variant
      const product = await Product.findOrFail(productId)

      await product.load('productGroup')

      // If product is part of a group, it's a variant product - handle as group update
      if (product.productGroupId) {
        return await this.updateVariantProduct(product, request, response)
      } else {
        // Simple product update
        return await this.updateSimpleProduct(product, request, response)
      }
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
   * Update a simple product (no variants)
   */
  private async updateSimpleProduct(product: Product, request: any, response: any) {
    try {
      const {
        name,
        description,
        price,
        stock,
        unit,
        categoryId,
        details,
        discountType,
        discountPercentage,
        isDiscountActive,
      } = request.only([
        'name',
        'description',
        'price',
        'stock',
        'unit',
        'categoryId',
        'details',
        'discountType',
        'discountPercentage',
        'isDiscountActive',
      ])

      // Update basic fields
      if (name) product.name = name
      if (description !== undefined) product.description = description
      if (price) product.price = Number.parseFloat(price)
      if (stock !== undefined) product.stock = Number.parseInt(stock)
      if (unit) product.unit = unit
      if (categoryId) product.categoryId = Number.parseInt(categoryId)
      if (details !== undefined) product.details = details
      if (discountType) product.discountType = discountType
      if (discountPercentage) product.discountPercentage = Number.parseFloat(discountPercentage)
      if (isDiscountActive !== undefined)
        product.isDiscountActive = isDiscountActive === true || isDiscountActive === 'true'

      await product.save()

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
      return response.internalServerError({
        message: error.message || 'Failed to update simple product',
      })
    }
  }

  /**
   * Update variant products (shared or independent inventory)
   */
  private async updateVariantProduct(baseProduct: Product, request: any, response: any) {
    try {
      const groupId = baseProduct.productGroupId
      const stockMergeType = request.input('stockMergeType') || 'merged'

      if (!groupId) {
        return response.badRequest({
          message: 'Invalid product group',
        })
      }

      // Get all variants in this group
      const variants = await Product.query()
        .where('productGroupId', groupId!)
        .where('organisationId', baseProduct.organisationId)

      if (variants.length === 0) {
        return response.notFound({
          message: 'Product group not found',
        })
      }

      // Update common fields for all variants
      const { name, description, categoryId, details } = request.only([
        'name',
        'description',
        'categoryId',
        'details',
      ])

      // return
      // Use productGroup prefixed fields for stock and unit
      const groupStock = request.input('productGroupBaseStock') || request.input('stock')
      const groupUnit = request.input('productGroupUnit') || request.input('unit')
      const groupStockMergeType = request.input('productGroupStockMergeType') || stockMergeType

      // Parse updated variants data
      const updatedVariantsData = []
      let index = 0
      while (request.input(`variants[${index}][id]`)) {
        updatedVariantsData.push({
          id: Number.parseInt(request.input(`variants[${index}][id]`)),
          label: request.input(`variants[${index}][label]`),
          skuSuffix: request.input(`variants[${index}][skuSuffix]`),
          price: Number.parseFloat(request.input(`variants[${index}][price]`)),
          quantity: Number.parseFloat(request.input(`variants[${index}][quantity]`)),
          unit: request.input(`variants[${index}][unit]`),
          stock: request.input(`variants[${index}][stock]`),
          isDiscountActive: request.input(`variants[${index}][isDiscountActive]`) === 'true',
          discountType: request.input(`variants[${index}][discountType]`),
          discountValue: request.input(`variants[${index}][discountValue]`),
        })
        index++
      }

      const storageService = new StorageService()
      const org = await Organisation.findOrFail(baseProduct.organisationId)
      const orgCode = org.organisationUniqueCode

      // Handle shared inventory image updates
      if (groupStockMergeType === 'merged') {
        // Update shared banner image if provided
        const bannerImage = request.file('bannerImage')
        if (bannerImage) {
          const fileName = normalizeFileName(bannerImage.clientName)
          const fileBuffer = fs.readFileSync(bannerImage.tmpPath!)
          const mimeType =
            bannerImage?.headers?.['content-type'] || bannerImage.type + '/' + bannerImage.extname

          await storageService.uploadFile(
            fileBuffer,
            fileName,
            mimeType as string,
            orgCode,
            'products'
          )

          const uploadPath = `${orgCode}/products/${fileName}`
          let uploadRecord = await Upload.query().where('key', uploadPath).first()

          if (!uploadRecord) {
            uploadRecord = await Upload.create({
              name: fileName,
              mimeType: mimeType as string,
              size: fileBuffer.length,
              key: uploadPath,
              urlPrefix: '',
              driver: 's3',
            })
          }

          // Update all variants with same banner image
          for (const variant of variants) {
            variant.bannerImageId = uploadRecord.id
            // await variant.save()
          }
        }

        // Update shared product images if provided
        const productImages = request.files('productImages')
        if (productImages && productImages.length > 0) {
          const sharedImageIds = []

          for (const image of productImages) {
            const fileName = normalizeFileName(image.clientName)
            const fileBuffer = fs.readFileSync(image.tmpPath!)
            const mimeType = image?.headers?.['content-type'] || image.type + '/' + image.extname

            await storageService.uploadFile(
              fileBuffer,
              fileName,
              mimeType as string,
              orgCode,
              'products'
            )

            const imagePath = `${orgCode}/products/${fileName}`
            let uploadRecord = await Upload.query().where('key', imagePath).first()

            if (!uploadRecord) {
              uploadRecord = await Upload.create({
                name: fileName,
                mimeType: mimeType as string,
                size: fileBuffer.length,
                key: imagePath,
                urlPrefix: '',
                driver: 's3',
              })
            }
            sharedImageIds.push(uploadRecord.id)
          }

          // Update product images for all variants
          for (const variant of variants) {
            // Delete old images
            await ProductImage.query().where('productId', variant.id).delete()

            // Add new images
            for (const [sortOrder, uploadId] of sharedImageIds.entries()) {
              await ProductImage.create({
                productId: variant.id,
                uploadId: uploadId,
                sortOrder: sortOrder,
                isActive: true,
              })
            }
          }
        }
      }

      // Update each variant
      for (const [index1, variantData] of updatedVariantsData.entries()) {
        const variant = variants.find((v) => v.id === variantData.id)
        if (!variant) continue

        variant.description = description || variant.description
        variant.categoryId = categoryId ? Number.parseInt(categoryId) : variant.categoryId
        variant.details = details !== undefined ? details : variant.details
        variant.price = variantData.price
        variant.quantity = Math.round(variantData.quantity)
        variant.unit = variantData.unit

        // Stock handling
        if (groupStockMergeType === 'independent' && variantData.stock) {
          variant.stock = Number.parseInt(variantData.stock)
        } else if (groupStockMergeType === 'merged') {
          variant.stock = 0
        }

        // Discount handling
        variant.discountType = variantData.isDiscountActive ? variantData.discountType : null
        variant.discountPercentage =
          variantData.isDiscountActive && variantData.discountType === 'percentage'
            ? Number.parseFloat(variantData.discountValue)
            : null
        variant.isDiscountActive = variantData.isDiscountActive

        // Handle independent mode variant-specific images
        if (groupStockMergeType === 'independent') {
          // Process variant banner image
          const variantBannerImage = request.file(`variants[${index1}][bannerImage]`)
          if (variantBannerImage) {
            const fileName = normalizeFileName(variantBannerImage.clientName)
            const fileBuffer = fs.readFileSync(variantBannerImage.tmpPath!)
            const mimeType =
              variantBannerImage?.headers?.['content-type'] ||
              variantBannerImage.type + '/' + variantBannerImage.extname

            await storageService.uploadFile(
              fileBuffer,
              fileName,
              mimeType as string,
              orgCode,
              'products'
            )

            const uploadPath = `${orgCode}/products/${fileName}`
            let uploadRecord = await Upload.query().where('key', uploadPath).first()

            if (!uploadRecord) {
              uploadRecord = await Upload.create({
                name: fileName,
                mimeType: mimeType as string,
                size: fileBuffer.length,
                key: uploadPath,
                urlPrefix: '',
                driver: 's3',
              })
            }

            variant.bannerImageId = uploadRecord.id
          }

          // Process variant product images
          const variantImages = request.files(`variants[${index}][images]`)
          if (variantImages && variantImages.length > 0) {
            const variantImageIds = []

            for (const image of variantImages) {
              const fileName = normalizeFileName(image.clientName)
              const fileBuffer = fs.readFileSync(image.tmpPath!)
              const mimeType = image?.headers?.['content-type'] || image.type + '/' + image.extname

              await storageService.uploadFile(
                fileBuffer,
                fileName,
                mimeType as string,
                orgCode,
                'products'
              )

              const imagePath = `${orgCode}/products/${fileName}`
              let uploadRecord = await Upload.query().where('key', imagePath).first()

              if (!uploadRecord) {
                uploadRecord = await Upload.create({
                  name: fileName,
                  mimeType: mimeType as string,
                  size: fileBuffer.length,
                  key: imagePath,
                  urlPrefix: '',
                  driver: 's3',
                })
              }
              variantImageIds.push(uploadRecord.id)
            }

            // Delete old product images and add new ones
            await ProductImage.query().where('productId', variant.id).delete()

            for (const [sortOrder, uploadId] of variantImageIds.entries()) {
              await ProductImage.create({
                productId: variant.id,
                uploadId: uploadId,
                sortOrder: sortOrder,
                isActive: true,
              })
            }
          }
        }

        await variant.save()
      }

      // Update ProductGroup with stock, unit, and stockMergeType
      const productGroup = await ProductGroup.findOrFail(groupId!)
      if (name) productGroup.name = name
      if (description !== undefined) productGroup.description = description || null
      if (groupUnit) productGroup.unit = groupUnit
      if (groupStockMergeType === 'merged' && groupStock) {
        productGroup.baseStock = Number.parseInt(groupStock)
      } else if (groupStockMergeType === 'independent') {
        productGroup.baseStock = 0
      }
      productGroup.stockMergeType = groupStockMergeType as 'merged' | 'independent'
      await productGroup.save()

      return response.ok({
        message: 'Product variants updated successfully',
        groupId: groupId!,
      })
    } catch (error) {
      return response.internalServerError({
        message: error.message || 'Failed to update variant product',
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

  /**
   * Get single product with all variants and details
   * GET /api/products/detail/:id
   *
   * Returns:
   * - Simple product: just the product details
   * - Variant product: product with all variants grouped
   */
  async getProduct({ params, response }: HttpContext) {
    try {
      const productId = params.id

      if (!productId) {
        return response.badRequest({ message: 'Product ID is required' })
      }

      const product = await Product.query()
        .where('id', productId)
        .preload('bannerImage')
        .preload('category')
        .preload('organisation')
        .preload('images', (q) => q.preload('upload').orderBy('sortOrder', 'asc'))
        .preload('productGroup')
        .firstOrFail()

      // If product is part of a group, fetch all variants (INCLUDING the current product)
      let variants: Product[] = []
      if (product.productGroupId) {
        variants = await Product.query()
          .where('productGroupId', product.productGroupId)
          .where('organisationId', product.organisationId)
          .preload('bannerImage')
          .orderBy('price', 'asc')
      }

      const taxAmount = calculateTax(product.price, product.taxRate, product.taxType)
      const priceWithTax = calculateTotalWithTax(product.price, product.taxRate, product.taxType)

      return response.ok({
        message: 'Product fetched successfully',
        data: {
          id: product.id,
          name: product.name,
          description: product.description,
          sku: product.sku,
          price: product.price,
          currency: product.currency,
          categoryId: product.categoryId,
          category: product.category,
          stock: product.stock,
          quantity: product.quantity,
          unit: product.unit,
          bannerImageId: product.bannerImageId,
          bannerImage: product.bannerImage,
          images: product.images,
          details: product.details,
          taxRate: product.taxRate,
          taxType: product.taxType,
          taxAmount,
          priceWithTax,
          isActive: product.isActive,
          organisationId: product.organisationId,
          organisation: product.organisation,
          productGroupId: product.productGroupId,
          productGroup: product.productGroup,
          createdAt: product.createdAt,
          updatedAt: product.updatedAt,
          // Variants if this is a grouped product
          ...(variants.length > 0 && {
            variants: variants.map((v) => ({
              id: v.id,
              sku: v.sku,
              name: v.name,
              quantity: v.quantity,
              unit: v.unit,
              price: v.price,
              currency: v.currency,
              stock: v.stock,
              bannerImage: v.bannerImage,
            })),
          }),
        },
      })
    } catch (error) {
      if (error.code === 'E_ROW_NOT_FOUND') {
        return response.notFound({
          message: 'Product not found',
        })
      }
      console.error('Get product error:', error)
      return response.internalServerError({
        message: error.message || 'Failed to fetch product',
      })
    }
  }
}
