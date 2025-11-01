import { inject } from '@adonisjs/core'
import { HttpContext } from '@adonisjs/core/http'
import Branch from '#models/branch'
import {
  createBranchUserRoleValidator,
  createBranchUserValidator,
  createBranchValidator,
  updateBranchValidator,
} from '#validators/branch'
import User from '#models/user'
import PermissionsResolverService from '#services/permissions_resolver_service'
import { RoleAccessLevel, RoleKeys } from '#types/role'
import { PermissionKeys } from '#types/permissions'
import { errorHandler } from '#helper/error_handler'
import Role from '#models/role'
import BranchUser from '#models/branch_user'
import SMSService from './sms_service.js'
import { commonParamsIdValidator } from '#validators/common'
import Policy from '#models/policy'
import Permission from '#models/permission'

@inject()
export default class BranchService {
  permissionsResolverService: PermissionsResolverService
  smsService: SMSService
  constructor(protected ctx: HttpContext) {
    this.permissionsResolverService = new PermissionsResolverService(ctx)
    this.smsService = new SMSService()
  }

  async create() {
    try {
      const data = this.ctx.request.all()
      const createData = await createBranchValidator.validate(data)
      const documents = createData.legacyDocuments
      delete createData.legacyDocuments

      // const { user, accessLevels, permissions } =
      //   await this.permissionsResolverService.permissionResolver(
      //     [RoleAccessLevel.system, RoleAccessLevel.organisation, RoleAccessLevel.branch],
      //     [PermissionKeys.branch_create, PermissionKeys.branch_create_all],
      //     {
      //       organisation_id : createData.organisationId
      //     }
      //   )
      //   return {user}
      // if(accessLevels.)
      // if (this.ctx.auth.use('adminapi').isAuthenticated) {
      //   const branchs = await Branch.query().preload('branchTower')
      //   return { data: branchs }
      // }

      const branch = await Branch.create({
        address: createData.address,
        name: createData.name,
        maintenanceServiceType: createData.maintenanceServiceType,
        imageId: createData.imageId || 1,
        organisationId: createData.organisationId,
        numBasementLevels: createData.numBasementLevels,
        type: createData.type,
      })

      if (documents) {
        await branch.related('legacyDocuments').sync(documents)
      }

      // await this.masterConfigService.syncMasterConfigForBranch(branch)
      return { data: branch }
    } catch (e) {
      return errorHandler(e, this.ctx)
    }
  }

  async findAll() {
    const { isSytemAdmin, userAccess } = await this.permissionsResolverService.permissionResolver(
      [
        RoleAccessLevel.system,
        RoleAccessLevel.organisation,
        RoleAccessLevel.branch,
        RoleAccessLevel.property,
      ],
      [PermissionKeys.branch_view],
      {}
    )
    const { search } = this.ctx.request.qs()

    let branchsQuery = Branch.query()
      .preload('image')
      .preload('organisation')
      .if(search, (q) => q.whereILike('name', `%${search}%`))

    if (isSytemAdmin) {
      const branchs = await branchsQuery
      return { data: branchs }
    }

    branchsQuery = branchsQuery.andWhere((qr) => {
      if (userAccess?.branch?.length > 0) {
        qr = qr.orWhereIn('id', userAccess?.branch)
      }

      if (userAccess?.organisation?.length > 0) {
        qr = qr.orWhereHas('organisation', (orgQuery) =>
          orgQuery.whereIn('id', userAccess?.organisation)
        )
      }
    })

    const branchs = await branchsQuery

    return {
      data: branchs.map((branch) => {
        return {
          ...branch.serialize(),
        }
      }),
    }
  }

  async findAllByOrganisation() {
    const organisationId = this.ctx.request.param('organisationId')
    const branchs = await Branch.query()
      .preload('image')
      .preload('organisation')
      .where('organisationId', organisationId)

    return {
      data: branchs.map((branch) => {
        return {
          ...branch.serialize(),
        }
      }),
    }
  }

  async findOne() {}

  async findOneById() {
    const id = this.ctx.request.param('id')
    await commonParamsIdValidator.validate({ id })
    const branch = await Branch.query()
      .where('id', id)
      .preload('image')
      .preload('legacyDocuments')
      .preload('user', (usrQuery) =>
        usrQuery.preload('branch_role', (roleQuery) => roleQuery.where('branch_id', id))
      )
      .preload('organisation')
      .firstOrFail()

    const branchUser = await BranchUser.query()
      .preload('User', (userQuery) =>
        userQuery.preload('branch_role', (roleQuery) => roleQuery.where('branch_id', branch.id))
      )
      .where('branch_id', branch.id)

    return {
      ...branch.toJSON(),
      user: branchUser.map((prj) => ({
        ...prj.User.toJSON(),
      })),
    }
  }

  async updateOne() {
    try {
      const id = this.ctx.params.id
      const data = this.ctx.request.all()
      const updateData = await updateBranchValidator.validate(data)
      const documents = updateData.legacyDocuments
      delete updateData.legacyDocuments
      const branch = await Branch.findOrFail(id)
      await branch.merge(updateData).save()
      if (documents) {
        branch.related('legacyDocuments').sync(documents)
      }
      return branch
    } catch (e) {
      return errorHandler(e, this.ctx)
    }
  }

  async deleteOne() {}

  async createBranchUser() {
    try {
      const body = this.ctx.request.body()
      const params = this.ctx.request.params()
      const branch = await Branch.findOrFail(params.branchId)
      const createData = await createBranchUserValidator.validate(body)
      const role = await Role.query().where('id', body.roleId).preload('permissions')
      if (role[0].roleKey === RoleKeys.branch_sub_contractor && !createData.tradeCodeIds) {
        throw new Error('Trade Codes Are Required For Subcontractor Role')
      }
      await createBranchUserRoleValidator.validate(role)
      let user
      if (createData?.id) {
        user = await User.query().where('id', createData.id).first()
      }

      if (!user?.id && createData?.email && createData?.mobile) {
        user = await User.query()
          .where('email', createData.email)
          .orWhere('mobile', createData.mobile)
          .first()
      }

      if (!user?.id) {
        const createDataUser = {
          fullName: createData.fullName,
          email: createData.email,
          password: createData.password,
          mobile: createData.mobile,
        }
        user = await User.create(createDataUser)
      }

      const policy = await Policy.create({
        policyName: `${user.fullName}'s policy for ${branch.name}`,
      })

      const permissions = role[0].permissions.map((prm) => prm.id)

      if (
        createData.appAccess &&
        !role[0].permissions.some((s) => s.permissionKey === PermissionKeys.app_access)
      ) {
        const appPermission = await Permission.findByOrFail(
          'permissionKey',
          PermissionKeys.app_access
        )
        permissions.push(appPermission?.id)
      }

      if (
        createData.webAccess &&
        !role[0].permissions.some((s) => s.permissionKey === PermissionKeys.web_access)
      ) {
        const appPermission = await Permission.findByOrFail(
          'permissionKey',
          PermissionKeys.web_access
        )
        permissions.push(appPermission?.id)
      }

      await policy.related('permissions').sync(permissions)

      await branch.related('user').sync(
        {
          [user.id]: {
            is_admin: true,
            role_id: createData.roleId,
            policy_id: policy.id,
          },
        },
        false
      )

      this.smsService.sendCredentialsMobile(
        {
          mobile: user.mobile,
          email: user.email,
          name: user.fullName as string,
        },
        role[0]?.roleKey === RoleKeys.branch_strata ? 'owner' : 'auditor'
      )

      const branch1 = await Branch.query()
        .where('id', branch.id)
        .preload('user', (userQuery) =>
          userQuery.preload('branch_role', (roleQuery) => roleQuery.where('branch_id', branch.id))
        )
        .firstOrFail()

      return { data: branch1 }
    } catch (e) {
      return errorHandler(e, this.ctx)
    }
  }

  async findBranchUserWithTradeCode() {
    const params = this.ctx.request.params()
    let { tradeCodeIds } = this.ctx.request.qs()
    const branch = await Branch.findOrFail(params.branchId)

    let branchUserQuery = BranchUser.query()
      .preload('User', (userQuery) =>
        userQuery.preload('branch_role', (roleQuery) => roleQuery.where('branch_id', branch.id))
      )
      .where('branch_id', branch.id)

    if (tradeCodeIds && Number.isInteger(Number(tradeCodeIds))) {
      tradeCodeIds = [tradeCodeIds]
    }

    const branchUser = await branchUserQuery

    return branchUser.map((prj) => ({
      ...prj.User.toJSON(),
    }))
  }
}
