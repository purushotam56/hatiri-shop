import { HttpContext } from '@adonisjs/core/http'
import User from '#models/user'
import Organisation from '#models/organisation'
import Order from '#models/order'
import Product from '#models/product'
import { errorHandler } from '#helper/error_handler'

// Helper function to filter orders by seller organisation
function filterOrdersByOrganisation(orders: any[], organisationId: number): any[] {
  return orders.filter((order) => {
    if (!order.items || !Array.isArray(order.items) || order.items.length === 0) {
      return false
    }
    return order.items.some((item: any) => {
      return item && item.product && item.product.organisationId === organisationId
    })
  })
}

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
   * Seller login - returns user and list of stores they belong to
   */
  async sellerLogin({ request, response }: HttpContext) {
    try {
      const { email, password } = request.only(['email', 'password'])

      // Verify credentials
      const user = await User.verifyCredentials(email, password)

      // Fetch all organizations where this user is a member
      const organisations = await Organisation.query()
        .select('id', 'name', 'organisationUniqueCode')
        .preload('user', (q) => q.where('user_id', user.id))
        .whereHas('user', (q) => q.where('user_id', user.id))

      if (organisations.length === 0) {
        return response.forbidden({
          message: 'You are not authorized as a seller',
        })
      }

      // Create a temporary token for store selection
      const token = await User.accessTokens.create(user, ['seller'])

      return response.ok({
        message: 'Login successful',
        token: token.value!.release(),
        user: {
          id: user.id,
          email: user.email,
          fullName: user.fullName,
          mobile: user.mobile,
        },
        stores: organisations.map((org) => ({
          id: org.id,
          name: org.name,
          code: org.organisationUniqueCode,
        })),
      })
    } catch (error) {
      return errorHandler(error || 'Invalid credentials', { request, response } as HttpContext)
    }
  }

  /**
   * Get seller's stores
   */
  async getSellerStores({ response, auth }: HttpContext) {
    try {
      const user = (await auth.getUserOrFail()) as any

      const organisations = await Organisation.query()
        .select('id', 'name', 'organisationUniqueCode', 'currency', 'dateFormat')
        .preload('user', (q) => q.where('user_id', user.id))
        .whereHas('user', (q) => q.where('user_id', user.id))

      return response.ok({
        stores: organisations,
      })
    } catch (error) {
      return errorHandler(error || 'Failed to fetch stores', { response } as any)
    }
  }

  /**
   * Select store and get updated token
   */
  async selectStore({ request, response, auth }: HttpContext) {
    try {
      const user = (await auth.getUserOrFail()) as any
      const { storeId } = request.only(['storeId'])

      if (!storeId) {
        return response.badRequest({
          message: 'Store ID is required',
        })
      }

      // Verify user belongs to this organization
      const organisation = await Organisation.query()
        .where('id', storeId)
        .preload('user', (q) => q.where('user_id', user.id))
        .first()

      if (!organisation || organisation.user.length === 0) {
        return response.forbidden({
          message: 'You are not authorized for this store',
        })
      }

      // Create new token with store ID
      const newToken = await User.accessTokens.create(user as User, ['seller', String(storeId)])

      return response.ok({
        message: 'Store selected successfully',
        token: newToken.value!.release(),
        store: {
          id: organisation.id,
          name: organisation.name,
          code: organisation.organisationUniqueCode,
          currency: organisation.currency,
          dateFormat: organisation.dateFormat,
        },
      })
    } catch (error) {
      return errorHandler(error || 'Failed to select store', { request, response } as HttpContext)
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

      // Fetch all orders with preloaded items
      const allOrders = await Order.query().preload('items')

      // For each order, load products in items
      const ordersWithProducts = await Promise.all(
        allOrders.map(async (order) => {
          if (order.items && order.items.length > 0) {
            // Load products for all items
            await Promise.all(order.items.map((item) => item.load('product')))
          }
          return order
        })
      )

      // Filter orders that belong to this seller's organisation
      const sellerOrders = filterOrdersByOrganisation(ordersWithProducts, Number(organisationId))

      // Calculate stats
      const totalOrders = sellerOrders.length
      const pendingOrders = sellerOrders.filter((o) => o.status === 'pending').length
      const completedOrders = sellerOrders.filter((o) => o.status === 'delivered').length
      const totalRevenue = sellerOrders
        .filter((o) => o.status === 'delivered')
        .reduce((sum, o) => sum + (o.totalAmount || 0), 0)
      const averageOrderValue = totalOrders > 0 ? totalRevenue / totalOrders : 0
      const totalCustomers = new Set(sellerOrders.map((o) => o.customerId)).size

      const recentOrders = sellerOrders
        .sort((a, b) => b.createdAt.toMillis() - a.createdAt.toMillis())
        .slice(0, 5)
        .map((order) => ({
          id: order.id,
          orderNumber: order.orderNumber,
          status: order.status,
          totalAmount: order.totalAmount,
          customerName: order.customerName,
          createdAt: order.createdAt,
        }))

      return response.ok({
        stats: {
          totalOrders,
          pendingOrders,
          completedOrders,
          totalRevenue,
          averageOrderValue,
          totalCustomers,
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

      // Fetch all orders with preloaded items
      const allOrders = await Order.query().preload('items')

      // For each order, load products in items
      const ordersWithProducts = await Promise.all(
        allOrders.map(async (order) => {
          if (order.items && order.items.length > 0) {
            // Load products for all items
            await Promise.all(order.items.map((item) => item.load('product')))
          }
          return order
        })
      )

      // Filter orders for this seller
      let sellerOrders = filterOrdersByOrganisation(ordersWithProducts, Number(organisationId))

      if (status) {
        sellerOrders = sellerOrders.filter((order) => order.status === status)
      }

      // Sort by creation date descending
      sellerOrders.sort((a, b) => b.createdAt.toMillis() - a.createdAt.toMillis())

      // Paginate
      const total = sellerOrders.length
      const skip = (page - 1) * limit
      const paginatedOrders = sellerOrders.slice(skip, skip + limit)
      const lastPage = Math.ceil(total / limit) || 1

      return response.ok({
        orders: paginatedOrders,
        pagination: {
          total,
          perPage: limit,
          currentPage: page,
          lastPage,
        },
        hasMore: page < lastPage,
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

      // Get order with preloaded items and products
      const order = await Order.query()
        .where('id', orderId)
        .preload('items', (q) => {
          q.preload('product')
        })
        .preload('customer')
        .preload('address')
        .first()

      if (!order) {
        return response.notFound({
          message: 'Order not found',
        })
      }

      // Verify this seller owns items in this order
      const hasSellerItems = order.items.some((item: any) => {
        if (!item.product) return false
        return item.product.organisationId === Number(organisationId)
      })
      if (!hasSellerItems) {
        return response.forbidden({
          message: 'Not authorized to view this order',
        })
      }

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

      // Get order with preloaded items and products
      const order = await Order.query()
        .where('id', orderId)
        .preload('items', (q) => {
          q.preload('product')
        })
        .preload('customer')
        .preload('address')
        .first()

      if (!order) {
        return response.notFound({
          message: 'Order not found',
        })
      }

      // Verify seller owns items in this order
      const hasSellerItems = order.items.some((item: any) => {
        if (!item.product) return false
        return item.product.organisationId === Number(organisationId)
      })
      if (!hasSellerItems) {
        return response.forbidden({
          message: 'Not authorized to update this order',
        })
      }

      const validStatuses = [
        'pending',
        'confirmed',
        'preparing',
        'ready',
        'out_for_delivery',
        'delivered',
        'cancelled',
      ]
      if (!validStatuses.includes(status)) {
        return response.badRequest({
          message: 'Invalid status',
        })
      }

      // If order is being marked as delivered, decrease stock for all items
      if (status === 'delivered' && order.status !== 'delivered') {
        for (const item of order.items) {
          if (item.product) {
            // Decrease stock by the quantity ordered
            item.product.stock = Math.max(0, item.product.stock - item.quantity)
            await item.product.save()
          }
        }
      }

      // If order is being cancelled (and was previously delivered), restore stock
      if (status === 'cancelled' && order.status === 'delivered') {
        for (const item of order.items) {
          if (item.product) {
            // Restore stock by the quantity ordered
            item.product.stock = item.product.stock + item.quantity
            await item.product.save()
          }
        }
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
   * Get customers list for seller's organization (only customers with orders)
   */
  async getCustomers({ params, response, auth }: HttpContext) {
    try {
      const user = await auth.getUserOrFail()
      const organisationId = params.id

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

      // Get all orders with items for this seller
      const allOrders = await Order.query().preload('items')

      // For each order, load products in items
      const ordersWithProducts = await Promise.all(
        allOrders.map(async (order) => {
          if (order.items && order.items.length > 0) {
            await Promise.all(order.items.map((item) => item.load('product')))
          }
          return order
        })
      )

      // Filter for orders that have items from this seller
      const sellerOrders = filterOrdersByOrganisation(ordersWithProducts, Number(organisationId))

      // Get unique customers from these orders with order count and last order date
      const customerMap = new Map<number, any>()
      sellerOrders.forEach((order) => {
        if (!customerMap.has(order.customerId)) {
          customerMap.set(order.customerId, {
            customerId: order.customerId,
            customerName: order.customerName,
            customerPhone: order.customerPhone,
            orderCount: 0,
            totalSpent: 0,
            lastOrderDate: order.createdAt,
          })
        }
        const customer = customerMap.get(order.customerId)!
        customer.orderCount += 1
        customer.totalSpent += order.totalAmount || 0
        if (order.createdAt.toMillis() > customer.lastOrderDate.toMillis()) {
          customer.lastOrderDate = order.createdAt
        }
      })

      // Convert to array and sort by last order date
      const customers = Array.from(customerMap.values())
        .map((customer) => ({
          ...customer,
          totalSpent: Number(customer.totalSpent),
          lastOrderDate: customer.lastOrderDate.toString(),
        }))
        .sort((a, b) => new Date(b.lastOrderDate).getTime() - new Date(a.lastOrderDate).getTime())

      return response.ok({
        customers,
        pagination: {
          total: customers.length,
          perPage: customers.length,
          currentPage: 1,
          lastPage: 1,
        },
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

      // Get customer orders with preloaded items
      const allOrders = await Order.query().where('customerId', customerId).preload('items')

      // For each order, load products in items
      const ordersWithProducts = await Promise.all(
        allOrders.map(async (order) => {
          if (order.items && order.items.length > 0) {
            // Load products for all items
            await Promise.all(order.items.map((item) => item.load('product')))
          }
          return order
        })
      )

      // Filter for orders that have items from this seller
      const sellerOrders = filterOrdersByOrganisation(ordersWithProducts, Number(organisationId))

      // Sort by creation date descending
      sellerOrders.sort((a, b) => b.createdAt.toMillis() - a.createdAt.toMillis())

      return response.ok({
        orders: sellerOrders,
      })
    } catch (error) {
      return errorHandler(error || 'Failed to fetch customer orders', { response } as any)
    }
  }

  /**
   * Get all products for seller's organization
   */
  async getProducts({ params, request, response, auth }: HttpContext) {
    try {
      const user = await auth.getUserOrFail()
      const organisationId = params.id
      const { page = 1, limit = 20, search } = request.qs()

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

      // Fetch products for this seller's organisation
      let query = Product.query().where('organisationId', organisationId)

      if (search) {
        query = query
          .where('name', 'ilike', `%${search}%`)
          .orWhere('description', 'ilike', `%${search}%`)
          .orWhere('sku', 'ilike', `%${search}%`)
      }

      // Get paginated results
      const products = await query.paginate(page, limit)

      // Preload order items to calculate sold quantity
      const productsWithItems = await Promise.all(
        products.all().map(async (product) => {
          await product.load('orderItems')
          const sold = product.orderItems.reduce((sum: number, item: any) => sum + item.quantity, 0)
          return {
            id: product.id,
            name: product.name,
            sku: product.sku,
            stock: product.stock,
            price: product.price,
            isActive: product.isActive,
            sold: sold,
          }
        })
      )

      return response.ok({
        products: productsWithItems,
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
