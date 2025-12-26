import { HttpContext } from '@adonisjs/core/http'
import { DateTime } from 'luxon'
import fs from 'node:fs'
import User from '#models/user'
import Organisation from '#models/organisation'
import Order from '#models/order'
import Product from '#models/product'
import ProductCategory from '#models/product_category'
import PlatformSetting from '#models/platform_setting'
import Upload from '#models/upload'
import { errorHandler } from '#helper/error_handler'
import { normalizeFileName } from '#helper/upload_helper'
import StorageService from '#services/storage_service'
import StockService, { type OrderStatusType } from '#services/stock_service'
import analyticsService, {
  type PageViewEvent,
  type UserEventData,
} from '#services/analytics_service'
import OrganisationPage from '#models/organisation_page'

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
   * Register as seller - creates a new organization
   */
  async registerSeller({ request, response }: HttpContext) {
    try {
      const {
        email,
        password,
        fullName,
        mobile,
        organisationName,
        organisationCode,
        businessType,
        city,
        country,
      } = request.only([
        'email',
        'password',
        'fullName',
        'mobile',
        'organisationName',
        'organisationCode',
        'businessType',
        'city',
        'country',
      ])

      // Validate required fields
      if (!email || !password || !organisationCode || !organisationName) {
        return response.badRequest({
          message: 'Email, password, organisation name, and code are required',
        })
      }

      // Check if user already exists
      const existingUser = await User.findBy('email', email)
      if (existingUser) {
        return response.conflict({
          message: 'User with this email already exists',
        })
      }

      // Check if organization code already exists (convert to lowercase)
      const lowercaseCode = organisationCode.toLowerCase().trim()
      const existingOrg = await Organisation.findBy('organisationUniqueCode', lowercaseCode)
      if (existingOrg) {
        return response.conflict({
          message: 'Organization code already exists',
        })
      }

      // Get platform settings to calculate trial end date
      let settings = await PlatformSetting.query().first()
      if (!settings) {
        settings = new PlatformSetting()
        settings.freeTrialDays = 14
        await settings.save()
      }

      // Create organization with trial end date
      const organisation = new Organisation()
      organisation.name = organisationName
      organisation.organisationUniqueCode = lowercaseCode
      organisation.currency = 'INR'
      organisation.city = city || ''
      organisation.stateCode = ''
      organisation.postalCode = ''
      organisation.countryCode = country || ''
      organisation.addressLine1 = businessType ? `Business Type: ${businessType}` : ''
      organisation.addressLine2 = ''
      organisation.status = 'trial'
      organisation.trialEndDate = DateTime.now().plus({ days: settings.freeTrialDays })
      await organisation.save()

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
          is_admin: true,
          role_id: null,
        },
      })

      return response.created({
        message: 'Seller registered successfully',
        user: {
          id: user.id,
          email: user.email,
          fullName: user.fullName,
          organisationId: organisation.id,
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
        .select('id', 'name', 'organisationUniqueCode', 'status', 'trialEndDate')
        .preload('user', (q) => q.where('user_id', user.id))
        .whereHas('user', (q) => q.where('user_id', user.id))

      if (organisations.length === 0) {
        return response.forbidden({
          message: 'You are not authorized as a seller',
        })
      }

      // Filter organizations by status - only allow active and valid trial organizations
      const validOrganisations = organisations.filter((org) => {
        if (org.status === 'disabled') {
          return false
        }

        // Check if trial has expired
        if (org.status === 'trial' && org.trialEndDate) {
          const trialEndDate = DateTime.isDateTime(org.trialEndDate)
            ? org.trialEndDate
            : DateTime.fromISO(org.trialEndDate as any)
          if (DateTime.now() > trialEndDate) {
            return false
          }
        }

        return true
      })

      if (validOrganisations.length === 0) {
        return response.forbidden({
          message: 'Your trial has expired or your stores are disabled. Please contact support.',
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
        stores: validOrganisations.map((org) => ({
          id: org.id,
          name: org.name,
          code: org.organisationUniqueCode,
          status: org.status,
          trialEndDate: org.trialEndDate,
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
   * Get organization by unique code (for public store display)
   */
  async getOrganisationByCode({ params, response }: HttpContext) {
    try {
      const code = params.code

      if (!code) {
        return response.badRequest({
          message: 'Organization code is required',
        })
      }

      const organisation = await Organisation.query()
        .where('organisationUniqueCode', code.toLowerCase().trim())
        .preload('image')
        .first()

      if (!organisation) {
        return response.notFound({
          message: 'Store not found',
        })
      }

      // Check organization status
      if (organisation.status === 'disabled') {
        return response.badRequest({
          message: 'Store is temporarily unavailable',
        })
      }

      // Check if trial has expired
      if (organisation.status === 'trial' && organisation.trialEndDate) {
        if (DateTime.now() > organisation.trialEndDate) {
          return response.badRequest({
            message: 'Store trial period has expired',
          })
        }
      }

      const orgData: any = {
        id: organisation.id,
        name: organisation.name,
        organisationUniqueCode: organisation.organisationUniqueCode,
        currency: organisation.currency,
        dateFormat: organisation.dateFormat,
        status: organisation.status,
        trialEndDate: organisation.trialEndDate,
        whatsappNumber: organisation.whatsappNumber,
        whatsappEnabled: organisation.whatsappEnabled,
        priceVisibility: organisation.priceVisibility || 'visible',
      }

      // Add the image with URL if it exists
      if (organisation.image) {
        orgData.image = {
          id: organisation.image.id,
          url: organisation.image.url,
          name: organisation.image.name,
        }
      } else {
        orgData.image = null
      }

      return response.ok({
        organisation: orgData,
      })
    } catch (error) {
      return errorHandler(error || 'Failed to fetch organization', { response } as any)
    }
  }

  /**
   * Get public page content (about/contact) by organisation code
   * No authentication required for public store pages
   */
  async getPublicPageContent({ params, response }: HttpContext) {
    try {
      const { code, pageType } = params

      if (!code) {
        return response.badRequest({
          message: 'Organization code is required',
        })
      }

      if (!pageType || !['about', 'contact'].includes(pageType)) {
        return response.badRequest({
          message: 'Invalid page type. Must be "about" or "contact"',
        })
      }

      // Find organisation by code
      const organisation = await Organisation.query()
        .where('organisationUniqueCode', code.toLowerCase().trim())
        .first()

      if (!organisation) {
        return response.notFound({
          message: 'Store not found',
        })
      }

      // Check organization status
      if (organisation.status === 'disabled') {
        return response.badRequest({
          message: 'Store is temporarily unavailable',
        })
      }

      // Check if trial has expired
      if (organisation.status === 'trial' && organisation.trialEndDate) {
        if (DateTime.now() > organisation.trialEndDate) {
          return response.badRequest({
            message: 'Store trial period has expired',
          })
        }
      }

      // Fetch page content
      const page = await OrganisationPage.query()
        .where('organisationId', organisation.id)
        .where('pageType', pageType)
        .first()

      if (!page) {
        // Return empty content if page doesn't exist
        if (pageType === 'about') {
          return response.ok({
            pageType: 'about',
            content: '',
          })
        } else {
          return response.ok({
            pageType: 'contact',
            address: '',
            additionalInfo: '',
          })
        }
      }

      if (pageType === 'about') {
        return response.ok({
          pageType: 'about',
          content: page.content || '',
        })
      } else {
        return response.ok({
          pageType: 'contact',
          address: page.address || '',
          additionalInfo: page.additionalInfo || '',
        })
      }
    } catch (error) {
      return errorHandler(error || 'Failed to fetch page content', { response } as any)
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

      // Verify seller belongs to this organization and preload image
      const org = await Organisation.query()
        .where('id', organisationId)
        .preload('user', (q) => q.where('user_id', user.id))
        .preload('image')
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
        organisation: {
          id: org.id,
          name: org.name,
          organisationUniqueCode: org.organisationUniqueCode,
          image: org.image,
          whatsappNumber: org.whatsappNumber,
          whatsappEnabled: org.whatsappEnabled,
          priceVisibility: org.priceVisibility || 'visible',
        },
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

      const validStatuses: OrderStatusType[] = [
        'pending',
        'confirmed',
        'preparing',
        'ready',
        'out_for_delivery',
        'delivered',
        'cancelled',
      ]
      if (!validStatuses.includes(status as OrderStatusType)) {
        return response.badRequest({
          message: 'Invalid status. Must be one of: ' + validStatuses.join(', '),
        })
      }

      const previousStatus = order.status as OrderStatusType
      const newStatus = status as OrderStatusType

      // Validate status transition
      const validation = StockService.validateStatusTransition(previousStatus, newStatus)
      if (!validation.valid) {
        return response.badRequest({ message: validation.error })
      }

      // Adjust stock based on status change using StockService
      const stockAdjustments = await StockService.adjustStockForStatusChange(
        order,
        previousStatus,
        newStatus
      )

      order.status = newStatus
      await order.save()

      return response.ok({
        message: 'Order status updated successfully',
        order,
        stockAdjustments:
          stockAdjustments.length > 0
            ? stockAdjustments.map((adj) => ({
                productId: adj.productId,
                previousStock: adj.previousStock,
                newStock: adj.newStock,
                quantity: adj.quantity,
              }))
            : undefined,
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

  /**
   * Get product groups with variants for seller
   */
  async getProductGroups({ params, request, response, auth }: HttpContext) {
    try {
      const user = await auth.getUserOrFail()
      const organisationId = params.id
      const { page = 1, limit = 20, search, type } = request.qs()

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

      // Get all products for this organization with category and images
      let query = Product.query()
        .where('organisationId', organisationId)
        .preload('category')
        .preload('images', (imagesQuery) => {
          imagesQuery.preload('upload').orderBy('sortOrder', 'asc')
        })
        .preload('orderItems')

      if (search) {
        query = query
          .where('name', 'ilike', `%${search}%`)
          .orWhere('description', 'ilike', `%${search}%`)
      }

      const allProducts = await query.exec()

      // Group products by productGroupId
      const grouped: { [key: number]: any[] } = {}
      const standaloneProducts: any[] = []

      allProducts.forEach((product) => {
        const sold = product.orderItems.reduce((sum: number, item: any) => sum + item.quantity, 0)

        // Parse images from options JSON if available
        let baseImages: string[] = []

        const productData = {
          id: product.id,
          name: product.name,
          sku: product.sku,
          stock: product.stock,
          price: product.price,
          unit: product.unit,
          isActive: product.isActive,
          sold: sold,
          images: baseImages,
          isDiscountActive: product.isDiscountActive,
          discountPercentage: product.discountPercentage,
          discountType: product.discountType,
        }

        if (product.productGroupId) {
          if (!grouped[product.productGroupId]) {
            grouped[product.productGroupId] = []
          }
          grouped[product.productGroupId].push(productData)
        } else {
          standaloneProducts.push(productData)
        }
      })

      // Format product groups to match frontend expectations
      const productGroups = Object.entries(grouped).map(([groupId, variants]) => {
        const totalStock = variants[0].stock // All variants in group share same stock
        const totalSold = variants.reduce((sum, v) => sum + v.sold, 0)

        return {
          productGroupId: Number(groupId),
          baseName: variants[0].name.replace(/\s+(1kg|2kg|5kg|piece|dozen|liter|-.*?)$/i, ''), // Extract base name
          categoryName: variants[0].category?.name,
          variants: variants.sort((a, b) => a.price - b.price),
          totalStock,
          totalSold,
          baseImages: variants[0].images,
        }
      })

      // Add standalone products as single-variant groups
      standaloneProducts.forEach((product) => {
        productGroups.push({
          productGroupId: product.id,
          baseName: product.name,
          categoryName: product.category?.name,
          variants: [product],
          totalStock: product.stock,
          totalSold: product.sold,
          baseImages: product.images,
        })
      })

      // Filter by type if specified
      let filteredGroups = productGroups
      if (type === 'single') {
        // Only groups with single variant
        filteredGroups = productGroups.filter((group) => group.variants.length === 1)
      } else if (type === 'variant') {
        // Only groups with multiple variants
        filteredGroups = productGroups.filter((group) => group.variants.length > 1)
      }

      // Paginate product groups
      const start = (page - 1) * limit
      const end = start + limit
      const paginatedGroups = filteredGroups.slice(start, end)

      return response.ok({
        productGroups: paginatedGroups,
        pagination: {
          total: filteredGroups.length,
          perPage: limit,
          currentPage: page,
          lastPage: Math.ceil(filteredGroups.length / limit),
        },
      })
    } catch (error) {
      return errorHandler(error || 'Failed to fetch product groups', { response } as any)
    }
  }

  /**
   * Get product group detail with all variants
   */
  async getProductGroupDetail({ params, response, auth }: HttpContext) {
    try {
      const user = await auth.getUserOrFail()
      const organisationId = params.id
      const groupId = params.groupId

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

      // Get all products in this group
      const variants = await Product.query()
        .where('productGroupId', groupId)
        .where('organisationId', organisationId)
        .preload('category')
        .preload('orderItems')

      if (variants.length === 0) {
        return response.notFound({
          message: 'Product group not found',
        })
      }

      // Format variants data
      const formattedVariants = variants.map((product) => ({
        id: product.id,
        name: product.name,
        sku: product.sku,
        price: product.price,
        stock: product.stock,
        unit: product.unit,
        quantity: product.quantity,
        isActive: product.isActive,
        isDiscountActive: product.isDiscountActive,
        discountPercentage: product.discountPercentage,
        discountType: product.discountType,
      }))

      // Get group info from first variant
      const baseVariant = variants[0]
      const totalStock = baseVariant.stock
      const totalSold = variants.reduce((sum, v) => {
        const sold = v.orderItems.reduce((itemSum: number, item: any) => itemSum + item.quantity, 0)
        return sum + sold
      }, 0)

      return response.ok({
        productGroup: {
          groupId: groupId,
          name: baseVariant.name.replace(/\s+(1kg|2kg|5kg|500gm|piece|dozen|liter|-.*?)$/i, ''),
          description: baseVariant.description,
          categoryId: baseVariant.categoryId,
          categoryName: baseVariant.category?.name,
          details: baseVariant.details,
          stock: totalStock,
          unit: baseVariant.unit,
          totalSold,
          variants: formattedVariants,
        },
      })
    } catch (error) {
      return errorHandler(error || 'Failed to fetch product group', { response } as any)
    }
  }

  /**
   * Update seller store settings (WhatsApp, store name, logo, price visibility)
   */
  async updateSellerStore({ request, response, auth }: HttpContext) {
    try {
      const user = await auth.authenticate()
      const organisationId = request.param('id')

      // Verify user is authorized for this organization
      const org = await Organisation.query()
        .where('id', organisationId)
        .preload('user', (q) => q.where('user_id', user.id))
        .preload('image')
        .first()

      if (!org || org.user.length === 0) {
        return response.forbidden({
          message: 'Not authorized',
        })
      }

      const { whatsappNumber, whatsappEnabled, name, priceVisibility } = request.only([
        'whatsappNumber',
        'whatsappEnabled',
        'name',
        'priceVisibility',
      ])

      // Validate WhatsApp number format if provided
      if (whatsappNumber && !/^\+?[1-9]\d{1,14}$/.test(whatsappNumber.replace(/[^\d+]/g, ''))) {
        return response.badRequest({
          message: 'Invalid WhatsApp number format',
        })
      }

      // Update store name if provided
      if (name !== undefined && name !== null) {
        org.name = name
      }

      // Update organization settings
      if (whatsappNumber !== undefined) {
        org.whatsappNumber = whatsappNumber || null
      }
      if (whatsappEnabled !== undefined) {
        org.whatsappEnabled = whatsappEnabled === true || whatsappEnabled === 'true'
      }
      if (priceVisibility !== undefined) {
        const validOptions = ['hidden', 'login_only', 'visible']
        if (validOptions.includes(priceVisibility)) {
          org.priceVisibility = priceVisibility
        }
      }

      // Handle logo upload if file is provided
      let logoFile = request.file('logo')
      if (logoFile) {
        const fileBuffer = fs.readFileSync(logoFile.tmpPath!)
        const fileName = normalizeFileName(logoFile.clientName)
        const mimeType =
          logoFile?.headers?.['content-type'] || logoFile.type + '/' + logoFile.extname

        const storageService = new StorageService()
        const uploadResult = await storageService.uploadFile(
          fileBuffer,
          fileName,
          mimeType as string,
          org.organisationUniqueCode,
          'images'
        )

        // Generate full key path with organization code
        const key = `${org.organisationUniqueCode}/images/${fileName}`

        // Create or update upload record
        let upload: Upload
        if (org.imageId) {
          // Update existing upload
          upload = (await Upload.find(org.imageId))!
          upload.name = logoFile.clientName
          upload.key = key
          upload.mimeType = mimeType
          upload.size = logoFile.size
          upload.driver = uploadResult.driver
          await upload.save()
        } else {
          // Create new upload
          upload = await Upload.create({
            name: logoFile.clientName,
            key,
            mimeType,
            size: logoFile.size,
            driver: uploadResult.driver,
          })
        }

        org.imageId = upload.id
      }

      await org.save()

      // Reload image relation after save if logo was uploaded
      if (logoFile) {
        await org.load('image')
      }

      return response.ok({
        message: 'Store settings updated successfully',
        store: {
          id: org.id,
          name: org.name,
          image: org.image,
          whatsappNumber: org.whatsappNumber,
          whatsappEnabled: org.whatsappEnabled,
          priceVisibility: org.priceVisibility || 'visible',
        },
      })
    } catch (error) {
      return errorHandler(error || 'Failed to update store settings', { response } as any)
    }
  }

  /**
   * Get categories for a seller's store
   */
  async getCategories({ params, response, auth }: HttpContext) {
    try {
      const user = await auth.getUserOrFail()
      const organisationId = params.organisationId

      // Verify seller belongs to this organization
      const org = await Organisation.query()
        .where('id', organisationId)
        .preload('user', (q) => q.where('user_id', user.id))
        .first()

      if (!org || org.user.length === 0) {
        return response.forbidden({
          message: 'You do not have access to this organisation',
        })
      }

      const categories = await ProductCategory.query()
        .where('organisationId', organisationId)
        .where('isActive', true)
        .orderBy('name', 'asc')

      return response.ok({
        message: 'Categories fetched successfully',
        categories,
      })
    } catch (error) {
      return errorHandler(error || 'Failed to fetch categories', { response } as any)
    }
  }

  /**
   * Create a new category for seller's store
   */
  async createCategory({ params, request, response, auth }: HttpContext) {
    try {
      const user = await auth.getUserOrFail()
      const organisationId = params.organisationId
      const { name, emoji, description } = request.only(['name', 'emoji', 'description'])

      if (!name) {
        return response.badRequest({
          message: 'Category name is required',
        })
      }

      // Verify seller belongs to this organization
      const org = await Organisation.query()
        .where('id', organisationId)
        .preload('user', (q) => q.where('user_id', user.id))
        .first()

      if (!org || org.user.length === 0) {
        return response.forbidden({
          message: 'You do not have access to this organisation',
        })
      }

      // Create slug from name
      const slug = name
        .toLowerCase()
        .replace(/\s+/g, '-')
        .replace(/[^\w-]/g, '')

      const category = await ProductCategory.create({
        organisationId,
        name,
        slug,
        emoji: emoji || null,
        description: description || '',
        isActive: true,
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
   * Update a category
   */
  async updateCategory({ params, request, response, auth }: HttpContext) {
    try {
      const user = await auth.getUserOrFail()
      const { organisationId, categoryId } = params
      const { name, emoji, description } = request.only(['name', 'emoji', 'description'])

      // Verify seller belongs to this organization
      const org = await Organisation.query()
        .where('id', organisationId)
        .preload('user', (q) => q.where('user_id', user.id))
        .first()

      if (!org || org.user.length === 0) {
        return response.forbidden({
          message: 'You do not have access to this organisation',
        })
      }

      const category = await ProductCategory.query()
        .where('id', categoryId)
        .where('organisationId', organisationId)
        .firstOrFail()

      if (name) {
        category.name = name
        category.slug = name
          .toLowerCase()
          .replace(/\s+/g, '-')
          .replace(/[^\w-]/g, '')
      }

      if (emoji !== undefined) {
        category.emoji = emoji
      }

      if (description !== undefined) {
        category.description = description
      }

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
   * Delete a category
   */
  async deleteCategory({ params, response, auth }: HttpContext) {
    try {
      const user = await auth.getUserOrFail()
      const { organisationId, categoryId } = params

      // Verify seller belongs to this organization
      const org = await Organisation.query()
        .where('id', organisationId)
        .preload('user', (q) => q.where('user_id', user.id))
        .first()

      if (!org || org.user.length === 0) {
        return response.forbidden({
          message: 'You do not have access to this organisation',
        })
      }

      const category = await ProductCategory.query()
        .where('id', categoryId)
        .where('organisationId', organisationId)
        .firstOrFail()

      // Check if category has products
      const productCount = await category.related('products').query().count('* as count')

      if (productCount[0].$extras.count > 0) {
        return response.badRequest({
          message:
            'Cannot delete category with existing products. Please move or delete products first.',
        })
      }

      await category.delete()

      return response.ok({
        message: 'Category deleted successfully',
      })
    } catch (error) {
      return errorHandler(error || 'Failed to delete category', { response } as any)
    }
  }

  /**
   * Get about page content
   */
  async getAboutPage({ params, response, auth }: HttpContext) {
    try {
      await auth.getUserOrFail()

      const organisationId = params.id
      const page = await OrganisationPage.query()
        .where('organisationId', organisationId)
        .where('pageType', 'about')
        .first()

      if (!page) {
        return response.ok({
          content: '',
        })
      }

      return response.ok({
        content: page.content || '',
      })
    } catch (error) {
      return errorHandler(error || 'Failed to fetch about page', { response } as any)
    }
  }

  /**
   * Save about page content
   */
  async saveAboutPage({ params, request, response, auth }: HttpContext) {
    try {
      await auth.getUserOrFail()

      const organisationId = params.id
      const { content } = request.only(['content'])

      if (!content) {
        return response.badRequest({
          message: 'Content is required',
        })
      }

      let page = await OrganisationPage.query()
        .where('organisationId', organisationId)
        .where('pageType', 'about')
        .first()

      if (!page) {
        page = new OrganisationPage()
        page.organisationId = organisationId
        page.pageType = 'about'
      }

      page.content = content
      await page.save()

      return response.ok({
        message: 'About page updated successfully',
        page,
      })
    } catch (error) {
      return errorHandler(error || 'Failed to save about page', { response } as any)
    }
  }

  /**
   * Get contact page content
   */
  async getContactPage({ params, response, auth }: HttpContext) {
    try {
      await auth.getUserOrFail()

      const organisationId = params.id
      const page = await OrganisationPage.query()
        .where('organisationId', organisationId)
        .where('pageType', 'contact')
        .first()

      if (!page) {
        return response.ok({
          address: '',
          additionalInfo: '',
        })
      }

      return response.ok({
        address: page.address || '',
        additionalInfo: page.additionalInfo || '',
      })
    } catch (error) {
      return errorHandler(error || 'Failed to fetch contact page', { response } as any)
    }
  }

  /**
   * Save contact page content
   */
  async saveContactPage({ params, request, response, auth }: HttpContext) {
    try {
      await auth.getUserOrFail()

      const organisationId = params.id
      const { address, additionalInfo } = request.only(['address', 'additionalInfo'])

      if (!address) {
        return response.badRequest({
          message: 'Address is required',
        })
      }

      let page = await OrganisationPage.query()
        .where('organisationId', organisationId)
        .where('pageType', 'contact')
        .first()

      if (!page) {
        page = new OrganisationPage()
        page.organisationId = organisationId
        page.pageType = 'contact'
      }

      page.address = address
      page.additionalInfo = additionalInfo || null
      await page.save()

      return response.ok({
        message: 'Contact page updated successfully',
        page,
      })
    } catch (error) {
      return errorHandler(error || 'Failed to save contact page', { response } as any)
    }
  }

  /**
   * Track a page view
   */
  async trackPageView({ params, request, response }: HttpContext) {
    try {
      const organisationId = params.id
      const { pageType, sessionId, userAgent, ipAddress, referer, viewDuration, userId } =
        request.only([
          'pageType',
          'sessionId',
          'userAgent',
          'ipAddress',
          'referer',
          'viewDuration',
          'userId',
        ])

      if (!pageType || !['about', 'contact'].includes(pageType)) {
        return response.badRequest({
          message: 'Invalid page type. Must be "about" or "contact"',
        })
      }

      if (!sessionId) {
        return response.badRequest({
          message: 'Session ID is required',
        })
      }

      const pageView: PageViewEvent = {
        organisationId,
        pageType,
        sessionId,
        userAgent,
        ipAddress,
        referer,
        viewDuration,
        userId,
        timestamp: new Date(),
      }

      await analyticsService.insertPageView(pageView)

      return response.ok({
        message: 'Page view tracked successfully',
      })
    } catch (error) {
      return errorHandler(error || 'Failed to track page view', { response } as any)
    }
  }

  /**
   * Track a user event
   */
  async trackUserEvent({ params, request, response }: HttpContext) {
    try {
      const organisationId = params.id
      const { eventType, sessionId, userAgent, ipAddress, userId, pageType, metadata } =
        request.only([
          'eventType',
          'sessionId',
          'userAgent',
          'ipAddress',
          'userId',
          'pageType',
          'metadata',
        ])

      if (!eventType) {
        return response.badRequest({
          message: 'Event type is required',
        })
      }

      if (!sessionId) {
        return response.badRequest({
          message: 'Session ID is required',
        })
      }

      const userEvent: UserEventData = {
        organisationId,
        eventType,
        sessionId,
        userAgent,
        ipAddress,
        userId,
        pageType,
        metadata,
        timestamp: new Date(),
      }

      await analyticsService.insertUserEvent(userEvent)

      return response.ok({
        message: 'User event tracked successfully',
      })
    } catch (error) {
      return errorHandler(error || 'Failed to track user event', { response } as any)
    }
  }

  /**
   * Get page view statistics
   */
  async getPageViewStats({ params, request, response, auth }: HttpContext) {
    try {
      await auth.getUserOrFail()

      const organisationId = params.id
      const pageType = request.input('pageType', 'about')

      if (!['about', 'contact'].includes(pageType)) {
        return response.badRequest({
          message: 'Invalid page type. Must be "about" or "contact"',
        })
      }

      const stats = await analyticsService.getPageViewStats(organisationId, pageType)
      const topReferers = await analyticsService.getTopReferers(organisationId, pageType)

      return response.ok({
        stats,
        topReferers,
      })
    } catch (error) {
      return errorHandler(error || 'Failed to fetch page view stats', { response } as any)
    }
  }

  /**
   * Get event statistics
   */
  async getEventStats({ params, request, response, auth }: HttpContext) {
    try {
      await auth.getUserOrFail()

      const organisationId = params.id
      const eventType = request.input('eventType', null)

      const stats = await analyticsService.getEventStats(organisationId, eventType)

      return response.ok({
        stats,
      })
    } catch (error) {
      return errorHandler(error || 'Failed to fetch event stats', { response } as any)
    }
  }

  /**
   * Get seller about page
   */
  async getSellerAboutPage({ params, response, auth }: HttpContext) {
    try {
      const user = await auth.getUserOrFail()
      const organisationId = params.id

      // Verify ownership
      const organisation = await Organisation.findOrFail(organisationId)
      const userInOrg = await organisation.related('user').query().where('user_id', user.id).first()

      if (!userInOrg) {
        return response.forbidden({ message: 'Not authorized to access this organisation' })
      }

      // Fetch or create about page
      let aboutPage = await OrganisationPage.query()
        .where('organisation_id', organisationId)
        .where('page_type', 'about')
        .first()

      if (!aboutPage) {
        aboutPage = new OrganisationPage()
        aboutPage.organisationId = organisationId
        aboutPage.pageType = 'about'
        aboutPage.content = ''
        aboutPage.address = ''
        aboutPage.additionalInfo = ''
      }

      return response.ok({
        page: {
          organisationId: aboutPage.organisationId,
          pageType: aboutPage.pageType,
          content: aboutPage.content,
          address: aboutPage.address,
          additionalInfo: aboutPage.additionalInfo,
        },
      })
    } catch (error) {
      return errorHandler(error || 'Failed to fetch about page', { response } as any)
    }
  }

  /**
   * Save seller about page
   */
  async saveSellerAboutPage({ params, request, response, auth }: HttpContext) {
    try {
      const user = await auth.getUserOrFail()
      const organisationId = params.id
      const { content, address, additionalInfo } = request.all()

      // Verify ownership
      const organisation = await Organisation.findOrFail(organisationId)
      const userInOrg = await organisation.related('user').query().where('user_id', user.id).first()

      if (!userInOrg) {
        return response.forbidden({ message: 'Not authorized to access this organisation' })
      }

      // Fetch or create about page
      let aboutPage = await OrganisationPage.query()
        .where('organisation_id', organisationId)
        .where('page_type', 'about')
        .first()

      if (!aboutPage) {
        aboutPage = new OrganisationPage()
        aboutPage.organisationId = organisationId
        aboutPage.pageType = 'about'
      }

      aboutPage.content = content || ''
      aboutPage.address = address || ''
      aboutPage.additionalInfo = additionalInfo || ''
      await aboutPage.save()

      return response.ok({
        message: 'About page saved successfully',
        page: aboutPage,
      })
    } catch (error) {
      return errorHandler(error || 'Failed to save about page', { response } as any)
    }
  }

  /**
   * Get seller contact page
   */
  async getSellerContactPage({ params, response, auth }: HttpContext) {
    try {
      const user = await auth.getUserOrFail()
      const organisationId = params.id

      // Verify ownership
      const organisation = await Organisation.findOrFail(organisationId)
      const userInOrg = await organisation.related('user').query().where('user_id', user.id).first()

      if (!userInOrg) {
        return response.forbidden({ message: 'Not authorized to access this organisation' })
      }

      // Fetch or create contact page
      let contactPage = await OrganisationPage.query()
        .where('organisation_id', organisationId)
        .where('page_type', 'contact')
        .first()

      if (!contactPage) {
        contactPage = new OrganisationPage()
        contactPage.organisationId = organisationId
        contactPage.pageType = 'contact'
        contactPage.content = ''
        contactPage.address = ''
        contactPage.additionalInfo = ''
      }

      return response.ok({
        page: {
          organisationId: contactPage.organisationId,
          pageType: contactPage.pageType,
          content: contactPage.content,
          address: contactPage.address,
          additionalInfo: contactPage.additionalInfo,
        },
      })
    } catch (error) {
      return errorHandler(error || 'Failed to fetch contact page', { response } as any)
    }
  }

  /**
   * Save seller contact page
   */
  async saveSellerContactPage({ params, request, response, auth }: HttpContext) {
    try {
      const user = await auth.getUserOrFail()
      const organisationId = params.id
      const { content, address, additionalInfo } = request.all()

      // Verify ownership
      const organisation = await Organisation.findOrFail(organisationId)
      const userInOrg = await organisation.related('user').query().where('user_id', user.id).first()

      if (!userInOrg) {
        return response.forbidden({ message: 'Not authorized to access this organisation' })
      }

      // Fetch or create contact page
      let contactPage = await OrganisationPage.query()
        .where('organisation_id', organisationId)
        .where('page_type', 'contact')
        .first()

      if (!contactPage) {
        contactPage = new OrganisationPage()
        contactPage.organisationId = organisationId
        contactPage.pageType = 'contact'
      }

      contactPage.content = content || ''
      contactPage.address = address || ''
      contactPage.additionalInfo = additionalInfo || ''
      await contactPage.save()

      return response.ok({
        message: 'Contact page saved successfully',
        page: contactPage,
      })
    } catch (error) {
      return errorHandler(error || 'Failed to save contact page', { response } as any)
    }
  }

  /**
   * Get current seller user info - validate token
   */
  async me({ auth, response }: HttpContext) {
    try {
      const user = auth.use('api').user
      if (!user) {
        return response.unauthorized({
          error: 'Unauthorized',
          message: 'Invalid or expired token',
        })
      }

      // Fetch all organizations where this user is a member
      const organisations = await Organisation.query()
        .select('id', 'name', 'organisationUniqueCode', 'status', 'trialEndDate')
        .whereHas('user', (q) => q.where('user_id', user.id))

      // Filter organizations by status - only allow active and valid trial organizations
      const validOrganisations = organisations.filter((org) => {
        if (org.status === 'disabled') {
          return false
        }

        // Check if trial has expired
        if (org.status === 'trial' && org.trialEndDate) {
          const trialEndDate = DateTime.isDateTime(org.trialEndDate)
            ? org.trialEndDate
            : DateTime.fromISO(org.trialEndDate as any)
          if (DateTime.now() > trialEndDate) {
            return false
          }
        }

        return true
      })

      if (validOrganisations.length === 0) {
        return response.forbidden({
          error: 'No valid organizations',
          message: 'Your trial has expired or your stores are disabled',
        })
      }

      return response.ok({
        data: {
          id: user.id,
          email: user.email,
          fullName: user.fullName,
          mobile: user.mobile,
        },
        stores: validOrganisations.map((org) => ({
          id: org.id,
          name: org.name,
          code: org.organisationUniqueCode,
          currency: org.currency,
          dateFormat: org.dateFormat,
        })),
      })
    } catch (error) {
      return errorHandler(error || 'Failed to fetch user info', { response } as any)
    }
  }
}
