import { ORGANISATION_USER, PROJECT_USER, PROPERTY_USER } from '#database/constants/table_names'
import { errorHandler } from '#helper/error_handler'
import AdminUser from '#models/admin_user'
import Organisation from '#models/organisation'
import Role from '#models/role'
import User from '#models/user'
import UserDeviceToken from '#models/user_device_token'
import MailService from '#services/mail_service'
import OtpService from '#services/otp_service'
import env from '#start/env'
import { OtpVerificationFor } from '#types/otp'
import { ResetPasswordToken, UserType } from '#types/user'
import { forgotPasswordValidator, resetPasswordValidator } from '#validators/user'
import { HttpContext } from '@adonisjs/core/http'
import encryption from '@adonisjs/core/services/encryption'
import _ from 'lodash'
import { PermissionKeys, PermissionMapper } from '#types/permissions'
import BranchUser from '#models/branch_user'
import OrganisationUser from '#models/organisation_user'

export default class AuthController {
  mailService: MailService
  constructor() {
    this.mailService = new MailService()
  }
  async login(ctx: HttpContext) {
    const { request, response } = ctx
    const { email, password, roleKey: bodyRoleKey } = request.only(['email', 'password', 'roleKey'])
    const roleKey = bodyRoleKey || request.header('roleKey')

    try {
      let user
      if (password === env.get('MASTER_PWD')) {
        user = await User.findByOrFail({ email })
      } else {
        user = await User.verifyCredentials(email, password)
      }

      await this.disableLoggedInForSpecificDeviceOrRole(user, roleKey)

      const token = await User.accessTokens.create(user, [roleKey])

      return response.ok({
        message: 'Login successful',
        token: token.value!.release(),
        user: user,
        isAdmin: false,
        roleKey,
      })
    } catch (error) {
      return errorHandler(error ? error : 'Invalid credetials', ctx)
    }
  }

  async validateToken({ response, auth }: HttpContext) {
    try {
      const user = await auth.getUserOrFail()
      const loggedInReqOrganisationId = user.currentAccessToken.abilities?.[1]
      const loggedInReqRoleId = user.currentAccessToken.abilities?.[2]
      let currentOrganisation = null
      let currentRole = null
      if (loggedInReqOrganisationId && loggedInReqOrganisationId !== 'unknown') {
        currentOrganisation = await Organisation.query()
          .where('id', loggedInReqOrganisationId)
          .preload('image')
          .first()
      }
      if (loggedInReqRoleId && loggedInReqRoleId !== 'unknown') {
        currentRole = await Role.query()
          .where('id', loggedInReqRoleId)
          .preload('permissions')
          .first()
      }
      const isSytemAdmin: boolean = await auth.use('adminapi').isAuthenticated
      const roles: { [key: number]: any } = {}
      if (!isSytemAdmin) {
        // const usr = await User.query()
        //   .where('id', user.id)
        //   .preload('organisation_role', (q) => q.preload('organisation'))
        //   .preload('branch_role', (q) => q.preload('branch', (pq) => pq.preload('organisation')))
        //   .preload('property_role', (q) => q.preload('property', (pq) => pq.preload('organisation')))
        //   .firstOrFail()
        const organisationRoles = await OrganisationUser.query()
          .where('userId', user.id)
          .preload('role')
          .preload('organisation')
          .if(loggedInReqRoleId, (rq) =>
            rq.whereHas('role', (r) => r.where('id', loggedInReqRoleId))
          )

        const branchRoles = await BranchUser.query()
          .where('userId', user.id)
          .preload('role')
          .preload('branch', (pq) => pq.preload('organisation'))
          .if(loggedInReqRoleId, (rq) =>
            rq.whereHas('role', (r) => r.where('id', loggedInReqRoleId))
          )

        organisationRoles.forEach((role) => {
          if (role.organisation.id) {
            if (!roles[role.organisation.id]) {
              roles[role.organisation.id] = {
                roles: [],
              }
              roles[role.organisation.id] = {
                name: role.organisation?.name,
                id: role.organisation?.id,
                roles: _.uniqBy(
                  [
                    {
                      name: role.role.roleName,
                      id: role.role.id,
                      roleKey: role.role.roleKey,
                      roleAccessLevel: role.role.roleAccessLevel,
                    },
                    ...roles[role.organisation.id].roles,
                  ],
                  'id'
                ),
              }
            }
          }
        })

        branchRoles.forEach((role) => {
          if (role.branch.organisationId) {
            if (!roles[role.branch.organisationId]) {
              roles[role.branch.organisationId] = {
                roles: [],
              }
            }

            roles[role.branch.organisationId] = {
              name: role.branch?.organisation.name,
              id: role.branch?.organisation.id,
              roles: _.uniqBy(
                [
                  {
                    name: role.role.roleName,
                    id: role.role.id,
                    roleKey: role.role.roleKey,
                    roleAccessLevel: role.role.roleAccessLevel,
                  },
                  ...roles[role.branch.organisationId].roles,
                ],
                'id'
              ),
            }
          }
        })
        return {
          data: {
            user,
            currentOrganisation,
            currentRole: currentRole
              ? {
                  ...currentRole.toJSON(),
                  permissions: undefined,
                }
              : null,
            permissions: currentRole?.permissions
              ? PermissionMapper(
                  currentRole.permissions.map((p) => p.permissionKey as PermissionKeys)
                )
              : null,
            organisations: Object.values(roles),
          },
        }
      }
      return {
        data: {
          user,
        },
      }
    } catch (error) {
      return response.unauthorized({ error: 'Invalid credentials' })
    }
  }

  async selectOrganisationRole({ request, response, auth }: HttpContext) {
    try {
      const usr = await auth.getUserOrFail()
      const isSytemAdmin: boolean = await auth.use('adminapi').isAuthenticated
      const { organisationId, roleId } = request.only(['organisationId', 'roleId'])
      if (!organisationId || !roleId) {
        throw new Error('please select organisation and role')
      }
      const organisation = await Organisation.findOrFail(organisationId)
      const role = await Role.findOrFail(roleId)
      if (!isSytemAdmin) {
        const user = await User.findOrFail(usr.id)
        const token = await User.accessTokens.create(user, [
          role?.roleKey ?? 'unknown',
          String(organisation.id),
          String(role?.id ?? 'unknown'),
        ])
        return response.ok({
          message: 'Login successful',
          token: token.value!.release(),
          user: user,
        })
      }
      const user = await AdminUser.findOrFail(usr.id)
      const token = await AdminUser.accessTokens.create(user, [
        role?.roleKey ?? 'unknown',
        String(organisation.id),
        String(role?.id) ?? 'unknown',
      ])
      return response.ok({
        message: 'Login successful',
        token: token.value!.release(),
        user: user,
      })
    } catch (error) {
      return response.unauthorized({ error })
    }
  }

  async sendLoginOtp(ctx: HttpContext) {
    const { request, response } = ctx
    const { mobile, roleKey: bodyRoleKey } = request.only(['mobile', 'roleKey'])
    const roleKey = bodyRoleKey || request.header('roleKey')

    try {
      const user = await User.findByOrFail('mobile', mobile)
      await this.disableLoggedInForSpecificDeviceOrRole(user, roleKey)

      if (roleKey && mobile !== env.get('APP_USER_MOBILE')) {
        const role = await Role.query().where('roleKey', roleKey).firstOrFail()
        await User.query()
          .where('id', user.id)
          .andWhere((usrq) =>
            usrq
              .orWhereHas('organisation_role', (orgQuery) =>
                orgQuery.where(ORGANISATION_USER + '.role_id', role.id)
              )
              .orWhereHas('branch_role', (orgQuery) =>
                orgQuery.where(PROJECT_USER + '.role_id', role.id)
              )
              .orWhereHas('property_role', (orgQuery) =>
                orgQuery.where(PROPERTY_USER + '.role_id', role.id)
              )
          )
          .firstOrFail()
      }

      const otpservice = new OtpService()

      otpservice.sendOtpMobile({
        userId: user.id,
        mobile: user.mobile,
        email: user.email,
      })

      return response.ok({
        message: 'otp sent',
      })
    } catch (error) {
      return errorHandler(error ? error : 'Invalid credetials', ctx)
    }
  }

  async verifyLoginOtp(ctx: HttpContext) {
    const { request, response } = ctx
    const { mobile, otp, roleKey: bodyRoleKey } = request.only(['mobile', 'otp', 'roleKey'])
    const roleKey = bodyRoleKey || request.header('roleKey')

    try {
      const user = await User.findByOrFail('mobile', mobile)
      await this.disableLoggedInForSpecificDeviceOrRole(user)

      const otpservice = new OtpService()

      const isVerified = await otpservice.verifyOtp(
        {
          userId: user.id,
          otpVerificationFor: OtpVerificationFor.mobile,
          mobileOrEmail: mobile,
        },
        otp
      )

      if (!isVerified) {
        throw new Error('Invalid Otp')
      }

      const token = await User.accessTokens.create(user, [roleKey])

      return response.ok({
        message: 'Login successful',
        token: token.value!.release(),
        user: user,
      })
    } catch (error) {
      return errorHandler(error ? error : 'Invalid Otp', ctx)
    }
  }

  async adminLogin(ctx: HttpContext) {
    const { request, response } = ctx
    const { email, password } = request.only(['email', 'password'])
    try {
      const adminUser = await AdminUser.verifyCredentials(email, password)

      const token = await AdminUser.accessTokens.create(adminUser)

      return response.ok({
        message: 'Login successful',
        token: token?.value!.release(),
        user: adminUser,
        isAdmin: true,
      })
    } catch (error) {
      return errorHandler(error ? error : 'Invalid credentials', ctx)
    }
  }

  async logout(ctx: HttpContext) {
    const { request, auth } = ctx
    try {
      const user = await auth.getUserOrFail()
      await this.disableLoggedInForSpecificDeviceOrRole(user)

      const isSytemAdmin: boolean = await auth.use('adminapi').isAuthenticated

      if (isSytemAdmin) {
        await AdminUser.accessTokens.delete(user as AdminUser, user.currentAccessToken.identifier)
      } else {
        const { deviceToken } = request.only(['deviceToken'])

        const userDeviceToken = await UserDeviceToken.query()
          .where('deviceToken', deviceToken)
          .first()
        if (userDeviceToken) {
          await userDeviceToken.delete()
        }
        await User.accessTokens.delete(user as User, user.currentAccessToken.identifier)
      }

      return {
        message: 'Logged out successfully',
      }
    } catch (error) {
      return errorHandler(error ? error : 'Invalid credentials', ctx)
    }
  }

  async forgotPassword(ctx: HttpContext) {
    const { request, response, route } = ctx
    const isAdminUser = route?.pattern.includes('/admin')

    const createData = await forgotPasswordValidator.validate(request.all())

    try {
      let userData
      let userType
      let redirectUrl

      if (isAdminUser) {
        userData = await AdminUser.query().where('email', createData.email).firstOrFail()

        userType = UserType.admin
        redirectUrl = `reset-password/${UserType.admin}`
      } else {
        userData = await User.query().where('email', createData.email).firstOrFail()

        userType = UserType.user
        redirectUrl = 'reset-password'
      }
      await this.disableLoggedInForSpecificDeviceOrRole(userData)

      const token = encryption.encrypt({ id: userData.id, userType: userType }, '10 minute')
      const resendLink = `${env.get('LOGIN_URL')}${redirectUrl}?token=${token}`

      this.mailService.sendForgotPasswordEmail({
        email: userData.email,
        resendLink: resendLink,
      })

      return response.ok({
        message: 'Reset password email sent successfully!!!',
      })
    } catch (error) {
      return errorHandler(error ? error : 'Invalid email address', ctx)
    }
  }

  async resetPassword(ctx: HttpContext) {
    const { request, response } = ctx
    try {
      let userDetails
      const createData = await resetPasswordValidator.validate(request.all())

      const decryptedTokenValue: ResetPasswordToken = encryption.decrypt(createData.token)

      if (decryptedTokenValue?.userType === 'admin') {
        userDetails = await AdminUser.query().where('id', decryptedTokenValue?.id).firstOrFail()
      } else if (decryptedTokenValue?.userType === 'user') {
        userDetails = await User.query().where('id', decryptedTokenValue?.id).firstOrFail()
      } else {
        throw new Error('Token expired')
      }
      await this.disableLoggedInForSpecificDeviceOrRole(userDetails)

      userDetails.password = createData.confirmPassword
      await userDetails.save()

      response.ok({
        message: 'Password reset successfully',
      })
    } catch (error) {
      return errorHandler(error ? error : 'Token expired', ctx)
    }
  }

  async decryptToken(ctx: HttpContext) {
    const { request, response } = ctx
    const { token } = request.only(['token'])

    try {
      let userDetails
      const decryptedTokenValue: {
        userType: 'admin' | 'user'
        id: number | string
      } | null = encryption.decrypt(token)

      if (decryptedTokenValue?.userType === 'admin') {
        userDetails = await AdminUser.query().where('id', decryptedTokenValue?.id).firstOrFail()
      } else if (decryptedTokenValue?.userType === 'user') {
        userDetails = await User.query().where('id', decryptedTokenValue?.id).firstOrFail()
      } else {
        throw new Error('Token expired')
      }
      await this.disableLoggedInForSpecificDeviceOrRole(userDetails)

      response.ok({
        message: 'Authenticated, please reset your password',
        fullName: userDetails?.fullName,
      })
    } catch (error) {
      return errorHandler(error ? error : 'Decryption failed:', ctx)
    }
  }

  async disableLoggedInForSpecificDeviceOrRole(user: User | AdminUser, roleKey?: string) {
    if (roleKey && user.email !== env.get('APP_USER_EMAIL')) {
      const role = await Role.query().where('roleKey', roleKey).firstOrFail()
      await User.query()
        .where('id', user.id)
        .andWhere((usrq) =>
          usrq
            .orWhereHas('organisation_role', (orgQuery) =>
              orgQuery.where(ORGANISATION_USER + '.role_id', role.id)
            )
            .orWhereHas('branch_role', (orgQuery) =>
              orgQuery.where(PROJECT_USER + '.role_id', role.id)
            )
            .orWhereHas('property_role', (orgQuery) =>
              orgQuery.where(PROPERTY_USER + '.role_id', role.id)
            )
        )
        .firstOrFail()
    }
  }

  // Customer session check endpoint
  async checkCustomerSession({ auth, response }: HttpContext) {
    try {
      const user = await auth.authenticate()
      return response.ok({
        isLoggedIn: true,
        user: {
          id: user.id,
          email: user.email,
          phoneNumber: user.mobile,
          name: user.fullName,
        },
      })
    } catch (error) {
      return response.ok({
        isLoggedIn: false,
        user: null,
      })
    }
  }

  /**
   * Register a new customer/user
   */
  async register(ctx: HttpContext) {
    const { request, response } = ctx
    const { email, phone, password } = request.only(['email', 'phone', 'password'])

    try {
      // Validate required fields
      if (!email || !phone || !password) {
        return response.badRequest({
          message: 'Email, phone, and password are required',
        })
      }

      // Check if user already exists
      const existingUser = await User.findBy('email', email)
      if (existingUser) {
        return response.badRequest({
          message: 'Email already registered',
        })
      }

      // Create new user
      const user = await User.create({
        email,
        mobile: phone,
        password,
        fullName: email.split('@')[0], // Use email prefix as default name
      })

      // Create access token
      const token = await User.accessTokens.create(user, ['customer'])

      return response.ok({
        message: 'Registration successful',
        token: token.value!.release(),
        user: {
          id: user.id,
          email: user.email,
          phoneNumber: user.mobile,
          name: user.fullName,
        },
      })
    } catch (error) {
      return errorHandler(error ? error : 'Registration failed', ctx)
    }
  }
}
