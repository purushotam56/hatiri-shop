import { ORGANISATION_USER, BRANCH_USER } from '#database/constants/table_names'
import { errorHandler } from '#helper/error_handler'
import Role from '#models/role'
import User from '#models/user'
import { LevelPiority, RoleAccessLevel, RoleKeys } from '#types/role'
import {
  changeUserPasswordValidator,
  createManyUserValidator,
  createUserValidator,
  updateUserProfileValidator,
} from '#validators/user'
import { inject } from '@adonisjs/core'
import { HttpContext } from '@adonisjs/core/http'
import PermissionsResolverService from './permissions_resolver_service.js'
import Organisation from '#models/organisation'
import AdminUser from '#models/admin_user'
import { commonParamsIdValidator } from '#validators/common'
import MailService from './mail_service.js'
import _ from 'lodash'
import BranchUser from '#models/branch_user'
import { PermissionKeys } from '#types/permissions'
import OrganisationUser from '#models/organisation_user'

@inject()
export default class UserService {
  permissionsResolverService: PermissionsResolverService
  mailService: MailService
  constructor(private ctx: HttpContext) {
    this.permissionsResolverService = new PermissionsResolverService(ctx)
    this.mailService = new MailService()
  }

  async getLoggedInUserRole({
    organisationId,
    branchId,
    includeSystemRole = false,
    levelPiority = LevelPiority.branchOrg,
  }: {
    organisationId?: number
    branchId?: number
    propertyId?: number
    propertyRoleByBranch?: boolean
    includeSystemRole?: boolean
    levelPiority?: RoleAccessLevel[]
  }) {
    const { isSytemAdmin, user, isMobile, permissions, role } =
      await this.permissionsResolverService.permissionResolver('*', '*', {
        organisationId,
        branchId,
        levelPiority,
      })

    if (isSytemAdmin) {
      if (includeSystemRole) {
        const { systemRole, systemUser } = await this.getSystemUserRole()
        return {
          user: systemUser,
          role: systemRole as Role,
          isSytemAdmin,
          isMobile,
          permissions: permissions ?? [],
        }
      }
      throw new Error('System Admin cannot perform this action')
    }

    return {
      user,
      role,
      isSytemAdmin,
      isMobile,
      permissions: permissions ?? [],
    }
  }

  async getSystemUserRole() {
    const systemUser = await User.query().where('email', 'system@propry.tech').firstOrFail()

    const systemRole = await Role.query().where('roleKey', RoleKeys.system).firstOrFail()

    return {
      systemUser,
      systemRole,
    }
  }

  async create(reqData: User) {
    try {
      const createData = await createUserValidator.validate(reqData)
      const user = await User.create(createData)
      return { data: user }
    } catch (e) {
      return errorHandler(e, this.ctx)
    }
  }

  async createMany(reqData: User[]) {
    try {
      const createData = await createManyUserValidator.validate(reqData)
      const users = await User.createMany(createData)
      return { data: users }
    } catch (e) {
      return errorHandler(e, this.ctx)
    }
  }

  async findAll() {
    try {
      const { roleKey } = this.ctx.request.qs()
      let userQuery = User.query()
      if (roleKey) {
        const role = await Role.query().where('roleKey', roleKey).firstOrFail()
        if ((role.roleAccessLevel as RoleAccessLevel) === RoleAccessLevel.organisation) {
          userQuery = userQuery.whereHas('organisation_role', (orgQuery) =>
            orgQuery.where(ORGANISATION_USER + '.role_id', role.id)
          )
        }
        if ((role.roleAccessLevel as RoleAccessLevel) === RoleAccessLevel.branch) {
          userQuery = userQuery.whereHas('branch_role', (orgQuery) =>
            orgQuery.where(BRANCH_USER + '.role_id', role.id)
          )
        }
      }
      const users = await userQuery
      return { data: users }
    } catch (e) {
      return errorHandler(e, this.ctx)
    }
  }

  async findAllByOrganisation() {
    try {
      const { roleKey, branchId, propertyId } = this.ctx.request.qs()
      const params = this.ctx.request.params()
      const users = await this.getUserByOrganisation(params.organisationId, roleKey, {
        branchId,
        propertyId,
      })
      return { data: users }
    } catch (e) {
      return errorHandler(e, this.ctx)
    }
  }

  async getUserByOrganisation(
    organisationId: number,
    _roleKey?: RoleKeys,
    options?: {
      branchId?: number
      propertyId?: number
    }
  ) {
    try {
      const organisation = await Organisation.findOrFail(organisationId)
      let organisationUsers: any = []
      let branchUsers: any = []
      const showOrganisation = !options?.propertyId
      const showBranch = !options?.propertyId

      if (showOrganisation) {
        const organisationRoles = await OrganisationUser.query()
          .preload('role')
          .preload('User')
          .preload('policy', (pq) =>
            pq.preload('permissions', (prq) =>
              prq.whereIn('permissionKey', [PermissionKeys.web_access, PermissionKeys.app_access])
            )
          )
          .where('organisation_id', organisation.id)

        organisationUsers = organisationRoles.map((r) => ({
          ...r.User.toJSON(),
          fullName: r.User.fullName,
          resourceType: `Organisation`,
          branch: 'All',
          property: 'All',
          role: r.role.toJSON(),
          roleName: r.role.roleName,
          webAccess: r.policy?.permissions.some(
            (p) => p.permissionKey === PermissionKeys.web_access
          ),
          appAccess: r.policy?.permissions.some(
            (p) => p.permissionKey === PermissionKeys.app_access
          ),
        }))
      }

      if (showBranch) {
        const branchRoles = await BranchUser.query()
          .preload('role')
          .preload('User')
          .preload('policy', (pq) =>
            pq.preload('permissions', (prq) =>
              prq.whereIn('permissionKey', [PermissionKeys.web_access, PermissionKeys.app_access])
            )
          )
          .preload('branch')
          .whereHas('branch', (pq) => pq.where('organisationId', organisation.id))
          .if(options?.branchId, (rq) => rq.where('branch_id', Number(options?.branchId) as number))

        branchUsers = branchRoles.map((r) => ({
          ...r.User.toJSON(),
          fullName: r.User.fullName,
          resourceType: `Branch`,
          branch: r.branch.name,
          property: 'All',
          role: r.role.toJSON(),
          roleName: r.role.roleName,
          webAccess: r.policy?.permissions.some(
            (p) => p.permissionKey === PermissionKeys.web_access
          ),
          appAccess: r.policy?.permissions.some(
            (p) => p.permissionKey === PermissionKeys.app_access
          ),
        }))
      }

      const users = [...organisationUsers, ...branchUsers]
      return users.sort((a, b) => (a.fullName || '').localeCompare(b.fullName || ''))
    } catch (e) {
      return errorHandler(e, this.ctx)
    }
  }

  async getBranchUsers(branchId: number, roleKey: RoleKeys) {
    try {
      let userQuery = User.query().andWhere((usrq) =>
        usrq.orWhereHas('branch', (prq) => prq.where('branch_id', branchId))
      )
      // if (roleKey) {
      const role = await Role.query().where('roleKey', roleKey).firstOrFail()
      if ((role.roleAccessLevel as RoleAccessLevel) === RoleAccessLevel.branch) {
        userQuery = userQuery.whereHas('branch_role', (branchQuery) =>
          branchQuery.where(BRANCH_USER + '.role_id', role.id)
        )
      }

      // }
      const users = await userQuery
      return { userBranch: users, role: role }
    } catch (e) {
      return errorHandler(e)
    }
  }

  async updateUserProfile() {
    const loggedInUser = await this.ctx.auth.getUserOrFail()
    const isSytemAdmin: boolean = (await this.ctx.auth.use('adminapi').isAuthenticated) ?? false
    const isAdminUser = this.ctx.route?.pattern.includes('/admin')
    const { confirmPassword } = this.ctx.request.all()
    const id = this.ctx.request.param('id')
    let updateProfile
    try {
      await commonParamsIdValidator.validate({ id })
      if (!isSytemAdmin) {
        if (loggedInUser.id !== Number(id)) throw new Error('Do not have sufficient permission!!!')
      }
      if (isAdminUser) {
        updateProfile = await AdminUser.findByOrFail('id', id)
      } else {
        updateProfile = await User.findByOrFail('id', id)
      }

      if (confirmPassword) {
        const validator = changeUserPasswordValidator(isSytemAdmin)
        const validateProfile = await this.ctx.request.validateUsing(validator)
        if (!isSytemAdmin) {
          if (isAdminUser) {
            await AdminUser.verifyCredentials(
              updateProfile.email,
              validateProfile.currentPassword as string
            )
          } else {
            await User.verifyCredentials(
              updateProfile.email,
              validateProfile.currentPassword as string
            )
          }
        }

        updateProfile.password = validateProfile.newPassword
        await updateProfile.save()
        await this.mailService.sendSuccessfulChangePasswordEmail({
          email: updateProfile.email,
          fullName: updateProfile.fullName as string,
        })
      } else {
        const validateProfile = await this.ctx.request.validateUsing(updateUserProfileValidator)
        updateProfile.merge(validateProfile)
        await updateProfile.save()
      }
      return { data: updateProfile }
    } catch (e) {
      return errorHandler(e, this.ctx)
    }
  }
}
