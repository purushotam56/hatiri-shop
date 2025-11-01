import { HttpContext } from '@adonisjs/core/http'
import AdminUser from '#models/admin_user'
import Organisation from '#models/organisation'
import Branch from '#models/branch'
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

      const { name, currency = 'INR', organisationUniqueCode, addressLine1, addressLine2, postalCode, blockBuildingNo } = request.only([
        'name',
        'currency',
        'organisationUniqueCode',
        'addressLine1',
        'addressLine2',
        'postalCode',
        'blockBuildingNo',
      ])

      // Validate required fields
      if (!name || !organisationUniqueCode) {
        return response.badRequest({
          message: 'Name and organisationUniqueCode are required',
        })
      }

      // Check if org code already exists
      const existingOrg = await Organisation.findBy('organisationUniqueCode', organisationUniqueCode)
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
      organisation.postalCode = postalCode || ''
      organisation.blockBuildingNo = blockBuildingNo || ''
      organisation.organisationRoleType = 'builder' as any
      await organisation.save()

      // Create default branch for this organization
      const defaultBranch = new Branch()
      defaultBranch.organisationId = organisation.id
      defaultBranch.name = `${name} - Main Branch`
      defaultBranch.type = 'apartment' as any
      defaultBranch.address = addressLine1 || ''
      defaultBranch.blockBuildingNo = blockBuildingNo || ''
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
      return errorHandler(error || 'Failed to create organization', { request, response } as HttpContext)
    }
  }

  /**
   * Get all organizations (Public - for browsing stores)
   */
  async listOrganisations({ response, auth }: HttpContext) {
    try {
      // Try to get user if authenticated, but allow public access
      let isAdmin = false
      try {
        await auth.getUserOrFail()
        isAdmin = true
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
      const { name, currency, addressLine1, addressLine2, postalCode, blockBuildingNo } = request.only([
        'name',
        'currency',
        'addressLine1',
        'addressLine2',
        'postalCode',
        'blockBuildingNo',
      ])

      if (name) organisation.name = name
      if (currency) organisation.currency = currency
      if (addressLine1) organisation.addressLine1 = addressLine1
      if (addressLine2) organisation.addressLine2 = addressLine2
      if (postalCode) organisation.postalCode = postalCode
      if (blockBuildingNo) organisation.blockBuildingNo = blockBuildingNo

      await organisation.save()

      return response.ok({
        message: 'Organization updated successfully',
        organisation,
      })
    } catch (error) {
      return errorHandler(error || 'Failed to update organization', { request, response } as HttpContext)
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
}
