import { HttpContext } from '@adonisjs/core/http'
import AdminUser from '#models/admin_user'
import Organisation from '#models/organisation'
import Branch from '#models/branch'
import User from '#models/user'
import Order from '#models/order'
import Product from '#models/product'
import PlatformSetting from '#models/platform_setting'
import { errorHandler } from '#helper/error_handler'

export default class AdminController {
  /**
   * Admin login
   */
  async adminLogin({ request, response }: HttpContext) {
    try {
      const { email, password } = request.only(['email', 'password'])

      const admin = await AdminUser.verifyCredentials(email, password)
      const token = await AdminUser.accessTokens.create(admin)

      return response.ok({
        message: 'Admin login successful',
        token: token.value!.release(),
        admin: {
          id: admin.id,
          email: admin.email,
          fullName: admin.fullName,
        },
      })
    } catch (error) {
      return errorHandler(error || 'Invalid credentials', { request, response } as HttpContext)
    }
  }

  /**
   * Admin validates token
   */
  async validateToken({ auth, response }: HttpContext) {
    try {
      const admin = await auth.getUserOrFail()
      return response.ok({
        admin: {
          id: admin.id,
          email: admin.email,
          fullName: admin.fullName,
        },
      })
    } catch (error) {
      return errorHandler('Unauthorized', { response } as any)
    }
  }

  /**
   * Create new organization (Admin only)
   */
  async createOrganisation({ request, response, auth }: HttpContext) {
    try {
      // Verify admin is authenticated
      await auth.getUserOrFail()

      const {
        name,
        currency = 'INR',
        organisationUniqueCode,
        addressLine1,
        addressLine2,
        city,
        stateCode,
        postalCode,
        countryCode,
      } = request.only([
        'name',
        'currency',
        'organisationUniqueCode',
        'addressLine1',
        'addressLine2',
        'city',
        'stateCode',
        'postalCode',
        'countryCode',
      ])

      // Validate required fields
      if (!name || !organisationUniqueCode) {
        return response.badRequest({
          message: 'Name and organisationUniqueCode are required',
        })
      }

      // Check if org code already exists (convert to lowercase)
      const lowercaseCode = organisationUniqueCode.toLowerCase().trim()
      const existingOrg = await Organisation.findBy('organisationUniqueCode', lowercaseCode)
      if (existingOrg) {
        return response.conflict({
          message: 'Organization code already exists',
        })
      }

      // Create organization
      const organisation = new Organisation()
      organisation.name = name
      organisation.currency = currency
      organisation.organisationUniqueCode = lowercaseCode
      organisation.addressLine1 = addressLine1 || ''
      organisation.addressLine2 = addressLine2 || ''
      organisation.city = city || ''
      organisation.stateCode = stateCode || ''
      organisation.postalCode = postalCode || ''
      organisation.countryCode = countryCode || ''
      organisation.organisationRoleType = 'builder' as any
      await organisation.save()

      // Create default branch for this organization
      const defaultBranch = new Branch()
      defaultBranch.organisationId = organisation.id
      defaultBranch.name = `${name} - Main Branch`
      defaultBranch.type = 'apartment' as any
      defaultBranch.address = addressLine1 || ''
      defaultBranch.blockBuildingNo = ''
      await defaultBranch.save()

      return response.created({
        message: 'Organization created successfully',
        organisation: {
          id: organisation.id,
          name: organisation.name,
          code: organisation.organisationUniqueCode,
          defaultBranchId: defaultBranch.id,
        },
      })
    } catch (error) {
      return errorHandler(error || 'Failed to create organization', {
        request,
        response,
      } as HttpContext)
    }
  }

  /**
   * Get all organizations (Public - for browsing stores)
   */
  async listOrganisations({ response, auth }: HttpContext) {
    try {
      // Try to get user if authenticated, but allow public access
      try {
        await auth.getUserOrFail()
      } catch (e) {
        // User not authenticated, but that's ok for public browsing
      }

      const organisations = await Organisation.query()
        .select(
          'id',
          'name',
          'organisationUniqueCode',
          'currency',
          'createdAt',
          'updatedAt',
          'status',
          'trialEndDate',
          'whatsappNumber',
          'whatsappEnabled'
        )
        .orderBy('createdAt', 'desc')

      return response.ok({
        organisations,
      })
    } catch (error) {
      return errorHandler(error || 'Failed to fetch organizations', { response } as any)
    }
  }

  /**
   * Get organization details (Admin only)
   */
  async getOrganisation({ params, response, auth }: HttpContext) {
    try {
      await auth.getUserOrFail()

      const organisation = await Organisation.query()
        .where('id', params.id)
        .preload('branch')
        .preload('image')
        .firstOrFail()

      return response.ok({
        organisation,
      })
    } catch (error) {
      return errorHandler(error || 'Organization not found', { response } as any)
    }
  }

  /**
   * Update organization (Admin only)
   */
  async updateOrganisation({ params, request, response, auth }: HttpContext) {
    try {
      await auth.getUserOrFail()

      const organisation = await Organisation.findOrFail(params.id)
      const {
        name,
        currency,
        addressLine1,
        addressLine2,
        city,
        stateCode,
        postalCode,
        countryCode,
        status,
      } = request.only([
        'name',
        'currency',
        'addressLine1',
        'addressLine2',
        'city',
        'stateCode',
        'postalCode',
        'countryCode',
        'status',
      ])

      if (name) organisation.name = name
      if (currency) organisation.currency = currency
      if (addressLine1) organisation.addressLine1 = addressLine1
      if (addressLine2) organisation.addressLine2 = addressLine2
      if (city) organisation.city = city
      if (stateCode) organisation.stateCode = stateCode
      if (postalCode) organisation.postalCode = postalCode
      if (countryCode) organisation.countryCode = countryCode
      if (status) {
        if (!['active', 'disabled', 'trial'].includes(status)) {
          return response.badRequest({
            message: 'Invalid status. Must be active, disabled, or trial',
          })
        }
        organisation.status = status
      }

      await organisation.save()

      return response.ok({
        message: 'Organization updated successfully',
        organisation,
      })
    } catch (error) {
      return errorHandler(error || 'Failed to update organization', {
        request,
        response,
      } as HttpContext)
    }
  }

  /**
   * Delete organization (Admin only)
   */
  async deleteOrganisation({ params, response, auth }: HttpContext) {
    try {
      await auth.getUserOrFail()

      const organisation = await Organisation.findOrFail(params.id)
      await organisation.delete()

      return response.ok({
        message: 'Organization deleted successfully',
      })
    } catch (error) {
      return errorHandler(error || 'Failed to delete organization', { response } as any)
    }
  }

  /**
   * Get admin dashboard statistics (Admin only)
   */
  async getStats({ response, auth }: HttpContext) {
    try {
      await auth.getUserOrFail()

      // Get counts for all entities
      const totalOrganizations = (await Organisation.query().count('* as total').first()) as any
      const totalSellers = (await User.query()
        .whereHas('organisation', (query: any) => {
          query.where('is_admin', false)
        })
        .count('* as total')
        .first()) as any

      const totalOrders = (await Order.query().count('* as total').first()) as any
      const pendingOrders = (await Order.query()
        .where('status', 'pending')
        .count('* as total')
        .first()) as any
      const deliveredOrders = (await Order.query()
        .where('status', 'delivered')
        .count('* as total')
        .first()) as any

      // Calculate total revenue from delivered orders using reduce (like seller does)
      const deliveredOrdersData = await Order.query().where('status', 'delivered')
      const totalRevenue = deliveredOrdersData.reduce(
        (sum: number, order: any) => sum + (order.totalAmount || 0),
        0
      )

      return response.ok({
        stats: {
          totalOrganizations: totalOrganizations?.$extras?.total || 0,
          totalSellers: totalSellers?.$extras?.total || 0,
          totalOrders: totalOrders?.$extras?.total || 0,
          totalRevenue: totalRevenue,
          pendingOrders: pendingOrders?.$extras?.total || 0,
          deliveredOrders: deliveredOrders?.$extras?.total || 0,
        },
      })
    } catch (error) {
      return errorHandler(error || 'Failed to fetch stats', { response } as any)
    }
  }

  /**
   * Get all sellers (Admin only)
   */
  async getSellers({ response, auth }: HttpContext) {
    try {
      await auth.getUserOrFail()

      // Get all users who have seller relationships with organizations
      const sellers = await User.query()
        .whereHas('organisation', (query: any) => {
          query.where('is_admin', false)
        })
        .select('id', 'email', 'fullName', 'mobile', 'createdAt')
        .orderBy('createdAt', 'desc')

      return response.ok({
        sellers,
      })
    } catch (error) {
      return errorHandler(error || 'Failed to fetch sellers', { response } as any)
    }
  }

  /**
   * Get all orders (Admin only)
   */
  async getOrders({ response, auth, request }: HttpContext) {
    try {
      await auth.getUserOrFail()
      const { page = 1, limit = 20 } = request.qs()

      const orders = await Order.query()
        .preload('customer')
        .preload('items', (q) => {
          q.preload('product')
        })
        .paginate(page, limit)

      return response.ok({
        orders: orders.all(),
        pagination: {
          total: orders.total,
          perPage: orders.perPage,
          currentPage: orders.currentPage,
          lastPage: orders.lastPage,
        },
      })
    } catch (error) {
      return errorHandler(error || 'Failed to fetch orders', { response } as any)
    }
  }

  /**
   * Get all products (Admin only)
   */
  async getProducts({ response, auth, request }: HttpContext) {
    try {
      await auth.getUserOrFail()
      const { page = 1, limit = 20, search } = request.qs()

      let query = Product.query()

      if (search) {
        query = query.where('name', 'ilike', `%${search}%`).orWhere('sku', 'ilike', `%${search}%`)
      }

      const products = await query.paginate(page, limit)

      return response.ok({
        products: products.all(),
        pagination: {
          total: products.total,
          perPage: products.perPage,
          currentPage: products.currentPage,
          lastPage: products.lastPage,
        },
      })
    } catch (error) {
      return errorHandler(error || 'Failed to fetch products', { response } as any)
    }
  }

  /**
   * Get platform settings (Admin only)
   */
  async getSettings({ response, auth }: HttpContext) {
    try {
      await auth.getUserOrFail()

      let settings = await PlatformSetting.query().first()

      // If no settings exist, create default ones
      if (!settings) {
        settings = new PlatformSetting()
        settings.freeTrialDays = 14
        await settings.save()
      }

      return response.ok({
        settings: {
          id: settings.id,
          freeTrialDays: settings.freeTrialDays,
          minTrialDays: 1,
          maxTrialDays: 365,
        },
      })
    } catch (error) {
      return errorHandler(error || 'Failed to fetch settings', { response } as any)
    }
  }

  /**
   * Update platform settings (Admin only)
   */
  async updateSettings({ request, response, auth }: HttpContext) {
    try {
      await auth.getUserOrFail()

      const { freeTrialDays } = request.only(['freeTrialDays'])

      // Validate input
      if (freeTrialDays !== undefined) {
        const days = Number.parseInt(String(freeTrialDays), 10)
        if (Number.isNaN(days) || days < 1 || days > 365) {
          return response.badRequest({
            message: 'Free trial days must be between 1 and 365',
          })
        }
      }

      let settings = await PlatformSetting.query().first()

      // If no settings exist, create default ones
      if (!settings) {
        settings = new PlatformSetting()
      }

      if (freeTrialDays !== undefined) {
        settings.freeTrialDays = Number.parseInt(String(freeTrialDays), 10)
      }

      await settings.save()

      return response.ok({
        message: 'Settings updated successfully',
        settings: {
          id: settings.id,
          freeTrialDays: settings.freeTrialDays,
          minTrialDays: 1,
          maxTrialDays: 365,
        },
      })
    } catch (error) {
      return errorHandler(error || 'Failed to update settings', { response } as any)
    }
  }

  /**
   * Get organization categories (Admin only)
   */
  async getOrganisationCategories({ params, response, auth }: HttpContext) {
    try {
      await auth.getUserOrFail()

      const organisationId = params.organisationId

      // Verify organisation exists
      const org = await Organisation.findOrFail(organisationId)

      // Get categories for this organisation
      const ProductCategoryModule = await import('#models/product_category')
      const ProductCategory = ProductCategoryModule.default
      const categories = await ProductCategory.query()
        .where('organisationId', organisationId)
        .orderBy('createdAt', 'desc')

      return response.ok({
        organisation: {
          id: org.id,
          name: org.name,
          code: org.organisationUniqueCode,
        },
        categories,
      })
    } catch (error) {
      return errorHandler(error || 'Failed to fetch categories', { response } as any)
    }
  }

  /**
   * Create category for organization (Admin only)
   */
  async createOrganisationCategory({ params, request, response, auth }: HttpContext) {
    try {
      await auth.getUserOrFail()

      const organisationId = params.organisationId
      const { name, emoji } = request.only(['name', 'emoji'])

      if (!name) {
        return response.badRequest({
          message: 'Category name is required',
        })
      }

      // Verify organisation exists
      await Organisation.findOrFail(organisationId)

      const ProductCategoryModule = await import('#models/product_category')
      const ProductCategory = ProductCategoryModule.default
      const category = await ProductCategory.create({
        organisationId,
        name,
        emoji: emoji || '📦',
      })

      return response.created({
        message: 'Category created successfully',
        category,
      })
    } catch (error) {
      return errorHandler(error || 'Failed to create category', { response } as any)
    }
  }

  /**
   * Update organization category (Admin only)
   */
  async updateOrganisationCategory({ params, request, response, auth }: HttpContext) {
    try {
      await auth.getUserOrFail()

      const { organisationId, categoryId } = params
      const { name, emoji } = request.only(['name', 'emoji'])

      // Verify organisation exists
      await Organisation.findOrFail(organisationId)

      const ProductCategoryModule = await import('#models/product_category')
      const ProductCategory = ProductCategoryModule.default
      const category = await ProductCategory.query()
        .where('id', categoryId)
        .where('organisationId', organisationId)
        .firstOrFail()

      if (name) category.name = name
      if (emoji) category.emoji = emoji

      await category.save()

      return response.ok({
        message: 'Category updated successfully',
        category,
      })
    } catch (error) {
      return errorHandler(error || 'Failed to update category', { response } as any)
    }
  }

  /**
   * Delete organization category (Admin only)
   */
  async deleteOrganisationCategory({ params, response, auth }: HttpContext) {
    try {
      await auth.getUserOrFail()

      const { organisationId, categoryId } = params

      // Verify organisation exists
      await Organisation.findOrFail(organisationId)

      const ProductCategoryModule = await import('#models/product_category')
      const ProductCategory = ProductCategoryModule.default
      const category = await ProductCategory.query()
        .where('id', categoryId)
        .where('organisationId', organisationId)
        .firstOrFail()

      await category.delete()

      return response.ok({
        message: 'Category deleted successfully',
      })
    } catch (error) {
      return errorHandler(error || 'Failed to delete category', { response } as any)
    }
  }

  /**
   * Update full organization details (Admin only)
   */
  async updateFullOrganisation({ params, request, response, auth }: HttpContext) {
    try {
      await auth.getUserOrFail()

      const organisation = await Organisation.findOrFail(params.id)

      const {
        name,
        currency,
        dateFormat,
        addressLine1,
        addressLine2,
        city,
        stateCode,
        postalCode,
        countryCode,
        status,
        whatsappNumber,
        whatsappEnabled,
        priceVisibility,
      } = request.only([
        'name',
        'currency',
        'dateFormat',
        'addressLine1',
        'addressLine2',
        'city',
        'stateCode',
        'postalCode',
        'countryCode',
        'status',
        'whatsappNumber',
        'whatsappEnabled',
        'priceVisibility',
      ])

      // Update fields if provided
      if (name !== undefined) organisation.name = name
      if (currency !== undefined) organisation.currency = currency
      if (dateFormat !== undefined) organisation.dateFormat = dateFormat

      if (addressLine1 !== undefined) organisation.addressLine1 = addressLine1
      if (addressLine2 !== undefined) organisation.addressLine2 = addressLine2
      if (city !== undefined) organisation.city = city
      if (stateCode !== undefined) organisation.stateCode = stateCode
      if (postalCode !== undefined) organisation.postalCode = postalCode
      if (countryCode !== undefined) organisation.countryCode = countryCode

      // Validate status
      if (status !== undefined) {
        if (!['active', 'disabled', 'trial'].includes(status)) {
          return response.badRequest({
            message: 'Invalid status. Must be active, disabled, or trial',
          })
        }
        organisation.status = status
      }

      // Update WhatsApp settings
      if (whatsappNumber !== undefined) organisation.whatsappNumber = whatsappNumber || null
      if (whatsappEnabled !== undefined)
        organisation.whatsappEnabled = whatsappEnabled === true || whatsappEnabled === 'true'

      // Update price visibility
      if (priceVisibility !== undefined) {
        const validPriceOptions = ['hidden', 'login_only', 'visible']
        if (!validPriceOptions.includes(priceVisibility)) {
          return response.badRequest({
            message: 'Invalid priceVisibility. Must be hidden, login_only, or visible',
          })
        }
        organisation.priceVisibility = priceVisibility
      }

      await organisation.save()

      return response.ok({
        message: 'Organization updated successfully',
        organisation: {
          id: organisation.id,
          name: organisation.name,
          organisationUniqueCode: organisation.organisationUniqueCode,
          currency: organisation.currency,
          dateFormat: organisation.dateFormat,
          addressLine1: organisation.addressLine1,
          addressLine2: organisation.addressLine2,
          city: organisation.city,
          stateCode: organisation.stateCode,
          postalCode: organisation.postalCode,
          countryCode: organisation.countryCode,
          status: organisation.status,
          whatsappNumber: organisation.whatsappNumber,
          whatsappEnabled: organisation.whatsappEnabled,
          priceVisibility: organisation.priceVisibility,
          createdAt: organisation.createdAt,
          updatedAt: organisation.updatedAt,
        },
      })
    } catch (error) {
      return errorHandler(error || 'Failed to update organization', { response } as any)
    }
  }

  /**
   * Get master login token for seller organization (Admin only)
   * This allows admin to view the seller's store as if they were the seller
   */
  async getMasterSellerToken({ params, response, auth }: HttpContext) {
    try {
      await auth.getUserOrFail()
      const organisationId = params.organisationId

      // Verify organization exists
      const organisation = await Organisation.findOrFail(organisationId)

      // Create a special seller token for this organization
      // In production, you might want to log this action for audit purposes
      const UserModule = await import('#models/user')
      const UserModel = UserModule.default

      // Find or create a master seller user for this organization
      let sellerUser = await UserModel.query()
        .where('organisationId', organisationId)
        .where('userType', 'seller')
        .orderBy('createdAt', 'asc')
        .first()

      if (!sellerUser) {
        // If no seller user exists, we can create a temporary master token
        // or return an error. For now, let's return an error.
        return response.notFound({
          message: 'No seller account found for this organization',
        })
      }

      // Create access token for the seller user
      const token = await User.accessTokens.create(sellerUser)

      return response.ok({
        message: 'Master seller token generated',
        token: token.value!.release(),
        organisation: {
          id: organisation.id,
          name: organisation.name,
          organisationUniqueCode: organisation.organisationUniqueCode,
        },
        user: {
          id: sellerUser.id,
          email: sellerUser.email,
          fullName: sellerUser.fullName,
        },
      })
    } catch (error) {
      return errorHandler(error || 'Failed to generate master seller token', { response } as any)
    }
  }
}
