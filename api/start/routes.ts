/*
|--------------------------------------------------------------------------
| Routes file
|--------------------------------------------------------------------------
|
| The routes file is used for defining the HTTP routes.
|
*/

import router from '@adonisjs/core/services/router'
import { middleware } from './kernel.js'
const OrganisationController = () => import('#controllers/organisation_controller')
const BranchsController = () => import('#controllers/branch_controller')
const AccountsController = () => import('#controllers/accounts_controller')
const UsersController = () => import('#controllers/users_controller')
const AuthController = () => import('#controllers/auth_controller')
const UploadsController = () => import('#controllers/uploads_controller')
const GlobalConfigsController = () => import('#controllers/global_configs_controller')
const AdminController = () => import('#controllers/admin_controller')
const SellerController = () => import('#controllers/seller_controller')
const ProductController = () => import('#controllers/product_controller')
const ProductCategoryController = () => import('#controllers/product_category_controller')
const AddressesController = () => import('#controllers/addresses_controller')
const CartsController = () => import('#controllers/carts_controller')
const OrdersController = () => import('#controllers/orders_controller')
const AnalyticsController = () => import('#controllers/analytics_controller')

// Serve uploaded files (for local storage)
import app from '@adonisjs/core/services/app'
import env from '#start/env'

if (env.get('STORAGE_DRIVER') === 'local') {
  router.get('/uploads/*', async ({ request, response }) => {
    const filePath = request.param('*').join('/')
    const uploadDir = env.get('STORAGE_LOCAL_PATH') || 'uploads'
    const fullPath = app.makePath(uploadDir, filePath)

    return response.download(fullPath)
  })
}

router
  .group(() => {
    router
      .group(() => {
        router.get('/countries', [GlobalConfigsController, 'countries'])
        router.get('/state/:countryCode', [GlobalConfigsController, 'stateFromCountry'])
        router.get('/managed_countries', [GlobalConfigsController, 'managedCountryState'])
        router.get('/config', [GlobalConfigsController, 'configs'])
      })
      .prefix('/public')

    router
      .resource('organisation', OrganisationController)
      .apiOnly()
      .use(['destroy', 'store'], middleware.auth({ guards: ['adminapi'] }))
      .use(['show', 'index', 'update'], middleware.auth({ guards: ['adminapi', 'api'] }))

    router
      .resource('admin/organisation', OrganisationController)
      .apiOnly()
      .use(['destroy', 'store'], middleware.auth({ guards: ['adminapi'] }))
      .use(['show', 'index', 'update'], middleware.auth({ guards: ['adminapi', 'api'] }))

    // .use('*', middleware.headerUtility({
    //   organisationRequired: true
    // }))

    // router.get('invitation/update-invitee/:id', [InvitationUsersController, 'update'])
    // .use(middleware.auth({ guards: ['adminapi', 'api'] }))

    router
      .post('organisation/:organisationId/user', [OrganisationController, 'createOrganisationUser'])
      .use(middleware.auth({ guards: ['adminapi', 'api'] }))

    router
      .get('organisation/:organisationId/branchs', [BranchsController, 'findAllByOrganisation'])
      .use(middleware.auth({ guards: ['adminapi', 'api'] }))

    router
      .get('organisation/:organisationId/users', [UsersController, 'findAllByOrganisation'])
      .use(middleware.auth({ guards: ['adminapi', 'api'] }))

    router
      .resource('branchs', BranchsController)
      .apiOnly()
      .use('*', middleware.auth({ guards: ['adminapi', 'api'] }))
    router
      .post('branch/:branchId/user', [BranchsController, 'createBranchUser'])
      .use(middleware.auth({ guards: ['adminapi', 'api'] }))
    router
      .get('branch/:branchId/users-with-tradecode', [
        BranchsController,
        'findBranchUserWithTradeCode',
      ])
      .use(middleware.auth({ guards: ['adminapi', 'api'] }))

    router.post('login', [AuthController, 'login'])
    router.post('register', [AuthController, 'register'])
    router
      .post('organisation_login', [AuthController, 'selectOrganisationRole'])
      .use(middleware.auth({ guards: ['adminapi', 'api'] }))
    router
      .get('check_session', [AuthController, 'validateToken'])
      .use(middleware.auth({ guards: ['adminapi', 'api'] }))
    // Customer session check endpoint
    router
      .get('customer/session', [AuthController, 'checkCustomerSession'])
      .use(middleware.auth({ guards: ['api'] }))
    router.post('login_otp', [AuthController, 'sendLoginOtp'])
    router.post('login_otp_verify', [AuthController, 'verifyLoginOtp'])
    router
      .post('logout', [AuthController, 'logout'])
      .use(middleware.auth({ guards: ['adminapi', 'api'] }))
    router.post('forgot_password', [AuthController, 'forgotPassword'])
    router.post('admin/forgot_password', [AuthController, 'forgotPassword'])
    router.post('reset_password', [AuthController, 'resetPassword'])
    router.post('decrypt_token', [AuthController, 'decryptToken'])
    router
      .resource('upload', UploadsController)
      .except(['update', 'destroy', 'index', 'edit'])
      .use('*', middleware.auth({ guards: ['adminapi', 'api'] }))

    router.get('/global_config', [GlobalConfigsController, 'globalConfigList'])
    router
      .get('/config', [GlobalConfigsController, 'privateConfigs'])
      .use(middleware.auth({ guards: ['adminapi', 'api'] }))

    router
      .resource('users', UsersController)
      .apiOnly()
      .use('update', middleware.auth({ guards: ['api', 'adminapi'] }))
      .use(['destroy', 'index', 'show', 'store'], middleware.auth({ guards: ['adminapi'] }))

    router
      .put('admin/:id', [UsersController, 'update'])
      .use(middleware.auth({ guards: ['adminapi'] }))

    router
      .post('account/register-device-token', [AccountsController, 'registerUserDeviceToken'])
      .use(middleware.auth({ guards: ['adminapi', 'api'] }))

    // Admin routes
    router
      .group(() => {
        router.post('/login', [AdminController, 'adminLogin'])
        router
          .get('/stats', [AdminController, 'getStats'])
          .use(middleware.auth({ guards: ['adminapi'] }))
        router
          .get('/organisations', [AdminController, 'listOrganisations'])
          .use(middleware.auth({ guards: ['adminapi'] }))
        router
          .post('/organisations', [AdminController, 'createOrganisation'])
          .use(middleware.auth({ guards: ['adminapi'] }))
        router
          .get('/organisations/:id', [AdminController, 'getOrganisation'])
          .use(middleware.auth({ guards: ['adminapi'] }))
        router
          .put('/organisations/:id', [AdminController, 'updateOrganisation'])
          .use(middleware.auth({ guards: ['adminapi'] }))
        router
          .delete('/organisations/:id', [AdminController, 'deleteOrganisation'])
          .use(middleware.auth({ guards: ['adminapi'] }))

        // Organization categories management
        router
          .get('/organisations/:organisationId/categories', [
            AdminController,
            'getOrganisationCategories',
          ])
          .use(middleware.auth({ guards: ['adminapi'] }))
        router
          .post('/organisations/:organisationId/categories', [
            AdminController,
            'createOrganisationCategory',
          ])
          .use(middleware.auth({ guards: ['adminapi'] }))
        router
          .put('/organisations/:organisationId/categories/:categoryId', [
            AdminController,
            'updateOrganisationCategory',
          ])
          .use(middleware.auth({ guards: ['adminapi'] }))
        router
          .delete('/organisations/:organisationId/categories/:categoryId', [
            AdminController,
            'deleteOrganisationCategory',
          ])
          .use(middleware.auth({ guards: ['adminapi'] }))

        // Full organization details update
        router
          .patch('/organisations/:id/full-update', [AdminController, 'updateFullOrganisation'])
          .use(middleware.auth({ guards: ['adminapi'] }))

        // Master seller token
        router
          .post('/organisations/:organisationId/master-seller-token', [
            AdminController,
            'getMasterSellerToken',
          ])
          .use(middleware.auth({ guards: ['adminapi'] }))

        router
          .get('/sellers', [AdminController, 'getSellers'])
          .use(middleware.auth({ guards: ['adminapi'] }))
        router
          .get('/orders', [AdminController, 'getOrders'])
          .use(middleware.auth({ guards: ['adminapi'] }))
        router
          .get('/products', [AdminController, 'getProducts'])
          .use(middleware.auth({ guards: ['adminapi'] }))
        router
          .get('/settings', [AdminController, 'getSettings'])
          .use(middleware.auth({ guards: ['adminapi'] }))
        router
          .put('/settings', [AdminController, 'updateSettings'])
          .use(middleware.auth({ guards: ['adminapi'] }))
      })
      .prefix('/admin')

    // Public organisations endpoint - for browsing stores
    router.get('/organisations', [AdminController, 'listOrganisations'])

    // Get organisation by unique code - for public store display
    router.get('/organisation/by_code/:code', [SellerController, 'getOrganisationByCode'])

    // Get public page content (about/contact) by organisation code - for storefront pages
    router.get('/organisation/:code/page/:pageType', [SellerController, 'getPublicPageContent'])

    // Seller routes
    router
      .group(() => {
        router.post('/register', [SellerController, 'registerSeller'])
        router.post('/login', [SellerController, 'sellerLogin'])
        router.get('/me', [SellerController, 'me']).use(middleware.auth({ guards: ['api'] }))
        router
          .get('/stores', [SellerController, 'getSellerStores'])
          .use(middleware.auth({ guards: ['api'] }))
        router
          .post('/select-store', [SellerController, 'selectStore'])
          .use(middleware.auth({ guards: ['api'] }))
        router
          .get('/:id/dashboard', [SellerController, 'getDashboard'])
          .use(middleware.auth({ guards: ['api'] }))
        router
          .get('/:id/orders', [SellerController, 'getOrders'])
          .use(middleware.auth({ guards: ['api'] }))
        router
          .get('/:id/orders/:orderId', [SellerController, 'getOrderDetail'])
          .use(middleware.auth({ guards: ['api'] }))
        router
          .patch('/:id/orders/:orderId/status', [SellerController, 'updateOrderStatus'])
          .use(middleware.auth({ guards: ['api'] }))
        router
          .get('/:id/customers', [SellerController, 'getCustomers'])
          .use(middleware.auth({ guards: ['api'] }))
        router
          .get('/:id/customers/:customerId/orders', [SellerController, 'getCustomerOrders'])
          .use(middleware.auth({ guards: ['api'] }))
        router
          .get('/:id/products', [SellerController, 'getProducts'])
          .use(middleware.auth({ guards: ['api'] }))
        router
          .get('/:id/product-groups', [SellerController, 'getProductGroups'])
          .use(middleware.auth({ guards: ['api'] }))
        router
          .get('/:id/product-groups/:groupId', [SellerController, 'getProductGroupDetail'])
          .use(middleware.auth({ guards: ['api'] }))
        router
          .put('/:id/store', [SellerController, 'updateSellerStore'])
          .use(middleware.auth({ guards: ['api'] }))

        // Pages management for sellers
        router
          .get('/:id/pages/about', [SellerController, 'getAboutPage'])
          .use(middleware.auth({ guards: ['api'] }))
        router
          .post('/:id/pages/about', [SellerController, 'saveAboutPage'])
          .use(middleware.auth({ guards: ['api'] }))
        router
          .get('/:id/pages/contact', [SellerController, 'getContactPage'])
          .use(middleware.auth({ guards: ['api'] }))
        router
          .post('/:id/pages/contact', [SellerController, 'saveContactPage'])
          .use(middleware.auth({ guards: ['api'] }))

        // Analytics tracking endpoints (public - no auth required for tracking)
        router.post('/:id/analytics/track-page-view', [AnalyticsController, 'trackPageView'])
        router.post('/:id/analytics/track-event', [AnalyticsController, 'trackUserEvent'])

        // Analytics stats endpoints (protected - auth required)
        router
          .get('/:id/analytics/page-views', [AnalyticsController, 'getPageViewStats'])
          .use(middleware.auth({ guards: ['api'] }))
        router
          .get('/:id/analytics/events', [AnalyticsController, 'getEventStats'])
          .use(middleware.auth({ guards: ['api'] }))

        // Category management for sellers
        router
          .get('/:organisationId/categories', [SellerController, 'getCategories'])
          .use(middleware.auth({ guards: ['api'] }))
        router
          .post('/:organisationId/categories', [SellerController, 'createCategory'])
          .use(middleware.auth({ guards: ['api'] }))
        router
          .put('/:organisationId/categories/:categoryId', [SellerController, 'updateCategory'])
          .use(middleware.auth({ guards: ['api'] }))
        router
          .delete('/:organisationId/categories/:categoryId', [SellerController, 'deleteCategory'])
          .use(middleware.auth({ guards: ['api'] }))
      })
      .prefix('/seller')

    // Product routes - public browsing, authenticated create/edit/delete
    router
      .resource('products', ProductController)
      .apiOnly()
      .use(['store', 'update', 'destroy'], middleware.auth({ guards: ['api', 'adminapi'] }))

    // Get single product with all variants and details
    router.get('products/detail/:id', [ProductController, 'getProduct'])

    // Product Category routes - public read, authenticated create/edit/delete
    router
      .resource('categories', ProductCategoryController)
      .apiOnly()
      .use(['store', 'update', 'destroy'], middleware.auth({ guards: ['api', 'adminapi'] }))

    // Get categories for a specific organisation
    router.get('organisation/:organisationId/categories', [
      ProductCategoryController,
      'getByOrganisation',
    ])

    // Address routes - authenticated only
    router
      .resource('addresses', AddressesController)
      .apiOnly()
      .use(['store', 'update', 'destroy', 'show', 'index'], middleware.auth({ guards: ['api'] }))

    // Cart routes - authenticated only
    router
      .group(() => {
        router.get('/', [CartsController, 'index'])
        router.post('/', [CartsController, 'store'])
        router.patch('/:id', [CartsController, 'update'])
        router.delete('/:id', [CartsController, 'destroy'])
        router.delete('/', [CartsController, 'clear'])
      })
      .prefix('/cart')
      .middleware(middleware.auth({ guards: ['api'] }))

    // Order routes - authenticated only
    router
      .group(() => {
        router.get('/', [OrdersController, 'index'])
        router.post('/', [OrdersController, 'store'])
        router.get('/:id', [OrdersController, 'show'])
        router.get('/:id/invoice', [OrdersController, 'downloadInvoice'])
        router.patch('/:id/status', [OrdersController, 'updateStatus'])
      })
      .prefix('/orders')
      .middleware(middleware.auth({ guards: ['api'] }))
  })
  .prefix('/api')

router.get('/', async ({ view }) => {
  return view.render('welcome')
})
