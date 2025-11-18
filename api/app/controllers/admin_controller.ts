import { HttpContext } from '@adonisjs/core/http'
import AdminUser from '#models/admin_user'
import Organisation from '#models/organisation'
import Branch from '#models/branch'
import User from '#models/user'
import Order from '#models/order'
import Product from '#models/product'
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
        state,
        postalCode,
        country,
      } = request.only([
        'name',
        'currency',
        'organisationUniqueCode',
        'addressLine1',
        'addressLine2',
        'city',
        'state',
        'postalCode',
        'country',
      ])

      // Validate required fields
      if (!name || !organisationUniqueCode) {
        return response.badRequest({
          message: 'Name and organisationUniqueCode are required',
        })
      }

      // Check if org code already exists
      const existingOrg = await Organisation.findBy(
        'organisationUniqueCode',
        organisationUniqueCode
      )
      if (existingOrg) {
        return response.conflict({
          message: 'Organization code already exists',
        })
      }

      // Create organization
      const organisation = new Organisation()
      organisation.name = name
      organisation.currency = currency
      organisation.organisationUniqueCode = organisationUniqueCode
      organisation.addressLine1 = addressLine1 || ''
      organisation.addressLine2 = addressLine2 || ''
      organisation.city = city || ''
      organisation.state = state || ''
      organisation.postalCode = postalCode || ''
      organisation.country = country || ''
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
        .select('id', 'name', 'organisationUniqueCode', 'currency', 'createdAt', 'updatedAt')
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
      const { name, currency, addressLine1, addressLine2, city, state, postalCode, country } =
        request.only([
          'name',
          'currency',
          'addressLine1',
          'addressLine2',
          'city',
          'state',
          'postalCode',
          'country',
        ])

      if (name) organisation.name = name
      if (currency) organisation.currency = currency
      if (addressLine1) organisation.addressLine1 = addressLine1
      if (addressLine2) organisation.addressLine2 = addressLine2
      if (city) organisation.city = city
      if (state) organisation.state = state
      if (postalCode) organisation.postalCode = postalCode
      if (country) organisation.country = country

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
}
