import { HttpContext } from '@adonisjs/core/http'
import User from '#models/user'
import Organisation from '#models/organisation'
import Order from '#models/order'
import { errorHandler } from '#helper/error_handler'

export default class SellerController {
  /**
   * Register as seller for an organization
   */
  async registerSeller({ request, response }: HttpContext) {
    try {
      const { email, password, fullName, mobile, organisationCode } = request.only([
        'email',
        'password',
        'fullName',
        'mobile',
        'organisationCode',
      ])

      // Validate required fields
      if (!email || !password || !organisationCode) {
        return response.badRequest({
          message: 'Email, password, and organisationCode are required',
        })
      }

      // Check if user already exists
      const existingUser = await User.findBy('email', email)
      if (existingUser) {
        return response.conflict({
          message: 'User with this email already exists',
        })
      }

      // Find organization
      const organisation = await Organisation.findBy('organisationUniqueCode', organisationCode)
      if (!organisation) {
        return response.notFound({
          message: 'Organization not found',
        })
      }

      // Create user
      const user = new User()
      user.email = email
      user.password = password
      user.fullName = fullName || email.split('@')[0]
      user.mobile = mobile || ''
      await user.save()

      // Link user to organization
      await organisation.related('user').attach({
        [user.id]: {
          is_admin: false,
          role_id: null,
        },
      })

      return response.created({
        message: 'Seller registered successfully',
        user: {
          id: user.id,
          email: user.email,
          fullName: user.fullName,
        },
      })
    } catch (error) {
      return errorHandler(error || 'Registration failed', { request, response } as HttpContext)
    }
  }

  /**
   * Seller login
   */
  async sellerLogin({ request, response }: HttpContext) {
    try {
      const { email, password, organisationCode } = request.only(['email', 'password', 'organisationCode'])

      if (!organisationCode) {
        return response.badRequest({
          message: 'Organization code is required',
        })
      }

      // Verify credentials
      const user = await User.verifyCredentials(email, password)

      // Find organization
      const organisation = await Organisation.findBy('organisationUniqueCode', organisationCode)
      if (!organisation) {
        return response.notFound({
          message: 'Organization not found',
        })
      }

      // Check if user is associated with organization
      const orgUser = await organisation.related('user').query().where('user_id', user.id).first()
      if (!orgUser) {
        return response.forbidden({
          message: 'You are not authorized for this organization',
        })
      }

      // Create token
      const token = await User.accessTokens.create(user, ['seller', String(organisation.id)])

      return response.ok({
        message: 'Login successful',
        token: token.value!.release(),
        user: {
          id: user.id,
          email: user.email,
          fullName: user.fullName,
        },
        organisation: {
          id: organisation.id,
          name: organisation.name,
          code: organisation.organisationUniqueCode,
        },
      })
    } catch (error) {
      return errorHandler(error || 'Invalid credentials', { request, response } as HttpContext)
    }
  }

  /**
   * Get seller dashboard stats
   */
  async getDashboard({ params, response, auth }: HttpContext) {
    try {
      const user = await auth.getUserOrFail()
      const organisationId = params.id

      // Verify seller belongs to this organization
      const org = await Organisation.query()
        .where('id', organisationId)
        .preload('user', (q) => q.where('user_id', user.id))
        .first()

      if (!org || org.user.length === 0) {
        return response.forbidden({
          message: 'Not authorized',
        })
      }

      // Get stats
      const totalOrders = await Order.query().where('organisation_id', organisationId).count('* as count').first()
      const pendingOrders = await Order.query().where('organisation_id', organisationId).where('status', 'pending').count('* as count').first()
      const completedOrders = await Order.query().where('organisation_id', organisationId).where('status', 'delivered').count('* as count').first()
      const totalRevenue = await Order.query()
        .where('organisation_id', organisationId)
        .where('status', 'delivered')
        .sum('total_amount as sum')
        .first()
      const averageOrderValue = await Order.query()
        .where('organisation_id', organisationId)
        .avg('total_amount as avg')
        .first()
      const totalCustomers = await Order.query()
        .where('organisation_id', organisationId)
        .countDistinct('customer_id as count')
        .first()

      const recentOrders = await Order.query()
        .where('organisation_id', organisationId)
        .orderBy('createdAt', 'desc')
        .limit(5)

      return response.ok({
        stats: {
          totalOrders: (totalOrders?.$extras.count as number) || 0,
          pendingOrders: (pendingOrders?.$extras.count as number) || 0,
          completedOrders: (completedOrders?.$extras.count as number) || 0,
          totalRevenue: parseFloat((totalRevenue?.$extras.sum || 0).toString()),
          averageOrderValue: parseFloat((averageOrderValue?.$extras.avg || 0).toString()),
          totalCustomers: (totalCustomers?.$extras.count as number) || 0,
        },
        recentOrders,
      })
    } catch (error) {
      return errorHandler(error || 'Failed to fetch dashboard', { response } as any)
    }
  }

  /**
   * Get all orders for seller's organization
   */
  async getOrders({ params, request, response, auth }: HttpContext) {
    try {
      const user = await auth.getUserOrFail()
      const organisationId = params.id
      const { status, page = 1, limit = 20 } = request.qs()

      // Verify authorization
      const org = await Organisation.query()
        .where('id', organisationId)
        .preload('user', (q) => q.where('user_id', user.id))
        .first()

      if (!org || org.user.length === 0) {
        return response.forbidden({
          message: 'Not authorized',
        })
      }

      // Build query
      let query = Order.query().where('organisation_id', organisationId)
      if (status) {
        query = query.where('status', status)
      }

      const orders = await query
        .orderBy('createdAt', 'desc')
        .paginate(page, limit)

      return response.ok({
        orders: orders.all(),
        pagination: {
          total: orders.total,
          perPage: orders.perPage,
          currentPage: orders.currentPage,
          lastPage: orders.lastPage,
        },
        hasMore: orders.currentPage < orders.lastPage,
      })
    } catch (error) {
      return errorHandler(error || 'Failed to fetch orders', { response } as any)
    }
  }

  /**
   * Get single order details
   */
  async getOrderDetail({ params, response, auth }: HttpContext) {
    try {
      const user = await auth.getUserOrFail()
      const { id: organisationId, orderId } = params

      // Verify authorization
      const org = await Organisation.query()
        .where('id', organisationId)
        .preload('user', (q) => q.where('user_id', user.id))
        .first()

      if (!org || org.user.length === 0) {
        return response.forbidden({
          message: 'Not authorized',
        })
      }

      // Get order
      const order = await Order.query()
        .where('id', orderId)
        .where('organisation_id', organisationId)
        .firstOrFail()

      return response.ok({
        order,
      })
    } catch (error) {
      return errorHandler(error || 'Order not found', { response } as any)
    }
  }

  /**
   * Update order status
   */
  async updateOrderStatus({ params, request, response, auth }: HttpContext) {
    try {
      const user = await auth.getUserOrFail()
      const { id: organisationId, orderId } = params
      const { status } = request.only(['status'])

      // Verify authorization
      const org = await Organisation.query()
        .where('id', organisationId)
        .preload('user', (q) => q.where('user_id', user.id))
        .first()

      if (!org || org.user.length === 0) {
        return response.forbidden({
          message: 'Not authorized',
        })
      }

      // Get and update order
      const order = await Order.query()
        .where('id', orderId)
        .where('organisation_id', organisationId)
        .firstOrFail()

      const validStatuses = ['pending', 'confirmed', 'preparing', 'ready', 'out_for_delivery', 'delivered', 'cancelled']
      if (!validStatuses.includes(status)) {
        return response.badRequest({
          message: 'Invalid status',
        })
      }

      order.status = status
      await order.save()

      return response.ok({
        message: 'Order status updated successfully',
        order,
      })
    } catch (error) {
      return errorHandler(error || 'Failed to update order', { request, response } as HttpContext)
    }
  }

  /**
   * Get customers list for seller's organization
   */
  async getCustomers({ params, request, response, auth }: HttpContext) {
    try {
      const user = await auth.getUserOrFail()
      const organisationId = params.id
      const { page = 1, limit = 20 } = request.qs()

      // Verify authorization
      const org = await Organisation.query()
        .where('id', organisationId)
        .preload('user', (q) => q.where('user_id', user.id))
        .first()

      if (!org || org.user.length === 0) {
        return response.forbidden({
          message: 'Not authorized',
        })
      }

      // Get customers with their orders
      const customers = await User.query()
        .select('id', 'email', 'fullName', 'mobile', 'createdAt')
        .orderBy('createdAt', 'desc')
        .paginate(page, limit)

      return response.ok({
        customers: customers.all(),
        pagination: {
          total: customers.total,
          perPage: customers.perPage,
          currentPage: customers.currentPage,
          lastPage: customers.lastPage,
        },
        hasMore: customers.currentPage < customers.lastPage,
      })
    } catch (error) {
      return errorHandler(error || 'Failed to fetch customers', { response } as any)
    }
  }

  /**
   * Get customer order history
   */
  async getCustomerOrders({ params, response, auth }: HttpContext) {
    try {
      const user = await auth.getUserOrFail()
      const { id: organisationId, customerId } = params

      // Verify authorization
      const org = await Organisation.query()
        .where('id', organisationId)
        .preload('user', (q) => q.where('user_id', user.id))
        .first()

      if (!org || org.user.length === 0) {
        return response.forbidden({
          message: 'Not authorized',
        })
      }

      // Get customer orders
      const orders = await Order.query()
        .where('organisation_id', organisationId)
        .where('customer_id', customerId)
        .orderBy('createdAt', 'desc')

      return response.ok({
        orders,
      })
    } catch (error) {
      return errorHandler(error || 'Failed to fetch customer orders', { response } as any)
    }
  }
}
