import { inject } from '@adonisjs/core'
import { HttpContext } from '@adonisjs/core/http'
import {
  createOrganisationUserRoleValidator,
  createOrganisationUserValidator,
  createOrganisationValidator,
  updateOrganisationValidator,
} from '#validators/organisation'
import User from '#models/user'
import Role from '#models/role'
import { errorHandler } from '#helper/error_handler'
import SMSService from './sms_service.js'
import PermissionsResolverService from './permissions_resolver_service.js'
import { commonParamsIdValidator } from '#validators/common'
import MailService from './mail_service.js'

import { RoleKeys } from '#types/role'
import { PermissionKeys } from '#types/permissions'
import Policy from '#models/policy'
import _ from 'lodash'
import Permission from '#models/permission'
import Organisation from '#models/organisation'

@inject()
export default class OrganisationService {
  smsService: SMSService
  password = 'test@1234'
  permissionsResolverService: PermissionsResolverService
  mailService: MailService
  constructor(protected ctx: HttpContext) {
    this.smsService = new SMSService()
    this.permissionsResolverService = new PermissionsResolverService(ctx)
    this.mailService = new MailService()
  }

  async fetchOrganisation(organisationId: number) {
    const organisation = await Organisation.query()
      .where('id', organisationId)
      .preload('image')
      .preload('user', (userQuery) =>
        userQuery.preload('organisation_role', (orgQuery) =>
          orgQuery.where('organisation_id', organisationId)
        )
      )
      .firstOrFail()

    return organisation
  }

  async create() {
    try {
      const data = this.ctx.request.all()
      const createData = await createOrganisationValidator.validate(data)
      const createUsers = createData.users
      const userIds = createUsers?.filter((usr) => usr.id).map((usr) => usr.id as number)
      const existingUsers = await User.query()
        .whereIn('id', userIds)
        .orWhereIn(
          'email',
          createUsers?.map((usr) => usr.email as string)
        )
        .orWhereIn(
          'mobile',
          createUsers?.map((usr) => usr.mobile as string)
        )
      if (!userIds.every((usrId) => existingUsers.some((usr) => usr.id === usrId))) {
        throw new Error('Check provided existing user list, some of them are not exist')
      }
      // let roles
      // if (createUsers && createUsers?.length > 0) {
      //   const roleIds = createUsers?.filter((usr) => usr.roleId).map((usr) => usr.roleId as number)
      //   roles = await Role.query().whereIn('id', roleIds).preload('permissions')
      //   await createOrganisationUserRoleValidator.validate(roles)
      // }

      const organisationNameAlreadyExists = await Organisation.query()
        .whereILike('name', createData.name)
        .first()

      if (organisationNameAlreadyExists) {
        throw new Error(`Organisation ${createData.name} already exists.`)
      }

      const organisation = await Organisation.create({
        name: createData.name,
        currency: createData.currency,
        dateFormat: createData.dateFormat,
        imageId: createData.imageId,
        organisationUniqueCode: createData.organisationUniqueCode,
        addressLine1: createData.addressLine1,
        addressLine2: createData.addressLine2,
        city: createData.city || '',
        stateCode: createData.stateCode || '',
        postalCode: createData.postalCode,
        countryCode: createData.countryCode || '',
      })
      if (createUsers && createUsers?.length > 0) {
        const users = await User.createMany(
          createUsers
            .filter((usr) => !usr.id)
            .filter(
              (usr) =>
                !existingUsers.some(
                  (u) =>
                    u.email?.toLowerCase() === usr.email?.toLowerCase() || u.mobile === usr.mobile
                )
            )
            .map((usr) => ({
              fullName: usr.fullName,
              email: usr.email,
              mobile: usr.mobile,
              password: usr.password || this.password,
            }))
        )
        const obj: any = {}
        const adminRole = await Role.query()
          .where('roleKey', RoleKeys.organisation_admin)
          .preload('permissions')
          .firstOrFail()
        for (const usr of users.concat(existingUsers)) {
          // const roleId = createUsers.filter(
          //   (u) => u.email === usr.email || u.mobile === usr.mobile || u.id === usr.id
          // )[0]?.roleId
          // const role = roles?.filter((r) => r.id === roleId)[0]
          // if (!role) break

          const policy = await Policy.create({
            policyName: `${usr.fullName}'s policy for ${organisation.name}`,
          })
          await policy.related('permissions').sync(adminRole.permissions.map((prm) => prm.id))

          obj[usr.id] = {
            is_admin: true,
            role_id: adminRole.id,
            policy_id: policy.id,
          }
        }

        await organisation.related('user').attach(obj)

        for (const usr of users) {
          this.smsService.sendCredentialsWeb({
            mobile: usr.mobile,
            password: this.password,
            email: usr.email,
            name: usr.fullName as string,
          })

          this.mailService.sendOrganisationCreationMail({
            organisationName: organisation.name,
            password: this.password,
            userEmail: usr.email,
          })
        }
      }
      const getOrganisation = await this.fetchOrganisation(organisation.id)

      return { data: getOrganisation }
    } catch (e) {
      return errorHandler(e, this.ctx)
    }
  }

  async findAll() {
    try {
      const { isSytemAdmin, isMobile, resourceRoles } =
        await this.permissionsResolverService.permissionResolver('*', '*', {
          skipCurrentRole: true,
          skipCurrentOrganisation: true,
        })

      let organisationQuery = Organisation.query().preload('image')

      if (!isMobile) {
        organisationQuery = organisationQuery.withCount('branch')
      }

      if (!isSytemAdmin) {
        organisationQuery = organisationQuery.whereIn(
          'id',
          Object.values(Object.keys(resourceRoles))
        )
      }

      const organisations = await organisationQuery

      const data = []
      for (const organisation of organisations) {
        if (!isSytemAdmin) {
          const wrk = resourceRoles[organisation.id]
          for (const role of wrk.roles) {
            data.push({
              ...organisation?.toJSON(),
              role,
            })
          }
        } else {
          data.push({
            ...organisation?.toJSON(),
          })
        }
      }

      return {
        data,
      }
    } catch (e) {
      return errorHandler(e, this.ctx)
    }
  }

  async createOrganisationUser() {
    try {
      const body = this.ctx.request.body()
      const params = this.ctx.request.params()
      const organisation = await Organisation.findOrFail(params.organisationId)
      const createData = await createOrganisationUserValidator.validate(body)
      const role = await Role.query().where('id', body.roleId).preload('permissions')
      await createOrganisationUserRoleValidator.validate(role)
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

      const createDataUser = {
        fullName: createData.fullName,
        email: createData.email,
        password: createData.password || this.password,
        mobile: createData.mobile,
      }
      if (!user?.id) {
        user = await User.create(createDataUser)
        this.smsService.sendPasswordMobile({
          mobile: user.mobile,
          password: this.password,
          email: user.email,
          name: user.fullName as string,
        })
      }

      const policy = await Policy.create({
        policyName: `${user.fullName}'s policy for ${organisation.name}`,
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

      await organisation.related('user').sync(
        {
          [user.id]: {
            is_admin: true,
            role_id: body.roleId,
            policy_id: policy.id,
          },
        },
        false
      )

      const organisation1 = await Organisation.query()
        .where('id', organisation.id)
        .preload('image')
        .preload('user', (userQuery) =>
          userQuery.preload('organisation_role', (orgQuery) =>
            orgQuery.where('organisation_id', organisation.id)
          )
        )
        .firstOrFail()

      return { data: organisation1 }
    } catch (e) {
      return errorHandler(e, this.ctx)
    }
  }

  async findOne() {
    try {
      const id = this.ctx.request.param('id')
      await commonParamsIdValidator.validate({ id })
      const organisation = await this.fetchOrganisation(id)
      return { data: organisation }
    } catch (e) {
      return errorHandler(e, this.ctx)
    }
  }

  async findOneById() {
    try {
      const id = this.ctx.request.param('id')
      await commonParamsIdValidator.validate({ id })
      const organisation = await this.fetchOrganisation(id)
      return { data: organisation }
    } catch (e) {
      return errorHandler(e, this.ctx)
    }
  }

  async updateOne() {
    try {
      const id = this.ctx.params.id
      await commonParamsIdValidator.validate({ id })
      const data = this.ctx.request.all()
      const updateData = await updateOrganisationValidator.validate({ ...data, id })
      const updateFields = updateData
      const organisation = await Organisation.findOrFail(id)
      if (updateFields.name) {
        const organisationNameAlreadyExists = await Organisation.query()
          .whereILike('name', updateFields.name as string)
          .first()

        if (organisationNameAlreadyExists && organisationNameAlreadyExists.id !== organisation.id) {
          throw new Error(`Organisation ${updateFields.name} already exists.`)
        }
      }
      await organisation.merge(updateFields).save()

      const getOrganisation = await this.fetchOrganisation(organisation.id)

      return { data: getOrganisation }
    } catch (e) {
      return errorHandler(e, this.ctx)
    }
  }

  async deleteOne() {}
}
