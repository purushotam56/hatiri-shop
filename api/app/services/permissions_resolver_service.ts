import getUserAgentInfo from '#helper/user_agent_helper'
import BranchUser from '#models/branch_user'
import Role from '#models/role'
import User from '#models/user'
import Organisation from '#models/organisation'
import { PermissionKeys } from '#types/permissions'
import { LevelPiority, RoleAccessLevel, RoleKeys } from '#types/role'
import { HttpContext } from '@adonisjs/core/http'
import _ from 'lodash'
import OrganisationUser from '#models/organisation_user'

export default class PermissionsResolverService {
  constructor(protected ctx: HttpContext) {}

  async permissionResolver(
    roleAccessLevels?: RoleAccessLevel[] | '*',
    reqPermissionKeys?: PermissionKeys[] | '*',
    data?: {
      organisationId?: number
      branchId?: number
      propertyId?: number
      levelPiority?: RoleAccessLevel[]
      skipCurrentRole?: boolean
      skipCurrentOrganisation?: boolean
      overrideCurrentOrganisationId?: boolean
    }
  ) {
    const user = this.ctx.auth.getUserOrFail()
    const loggedInReqRole = user.currentAccessToken.abilities?.[0]
    const loggedInReqOrganisationId = user.currentAccessToken.abilities?.[1]
    const loggedInReqRoleId = user.currentAccessToken.abilities?.[2]
    let currentOrganisation = null
    let currentRole = null
    if (loggedInReqOrganisationId && loggedInReqOrganisationId !== 'unknown') {
      currentOrganisation = await Organisation.query()
        .where('id', loggedInReqOrganisationId)
        .preload('image')
        .first()
      if (!data?.skipCurrentOrganisation) {
        if (!data) data = {}
        if (!data.organisationId || !data.overrideCurrentOrganisationId)
          data.organisationId = currentOrganisation?.id
      }
    }
    if (loggedInReqRoleId && loggedInReqRoleId !== 'unknown') {
      currentRole = await Role.query().where('id', loggedInReqRoleId).preload('permissions').first()
    }
    const permissions: PermissionKeys[] = []
    const accessLevels: RoleAccessLevel[] = []
    const isSytemAdmin: boolean = this.ctx.auth.use('adminapi').isAuthenticated
    const levelPiority = data?.levelPiority || LevelPiority.propertyBranchOrg
    const userAccess: {
      organisation: number[]
      branch: number[]
      property: number[]
    } = {
      organisation: [],
      branch: [],
      property: [],
    }
    let role = currentRole

    const { isMobile } = getUserAgentInfo(
      this.ctx.request.header('user-agent') as string,
      this.ctx.request.header('platform') as string
    )

    if (isSytemAdmin) {
      permissions.push(
        PermissionKeys.property_defect_approval,
        PermissionKeys.common_area_defect_approval
      )
      const systemRole = await Role.query().where('roleKey', RoleKeys.system).firstOrFail()
      return {
        user,
        permissions,
        accessLevels,
        isSytemAdmin,
        userAccess,
        isMobile,
        loggedInReqRole,
        role: systemRole,
      }
    }

    // if (!roleAccessLevels || !reqPermissionKeys) {
    //   return {
    //     user,
    //     permissions,
    //     accessLevels,
    //     isSytemAdmin,
    //     userAccess,
    //     isMobile,
    //     loggedInReqRole,
    //   }
    // }

    if (roleAccessLevels === '*' || !roleAccessLevels) {
      roleAccessLevels = Object.keys(RoleAccessLevel) as RoleAccessLevel[]
    }

    if (reqPermissionKeys === '*' || !reqPermissionKeys) {
      reqPermissionKeys = Object.keys(PermissionKeys) as PermissionKeys[]
    }

    const organisationRoles = await OrganisationUser.query()
      .where('userId', user.id)
      .preload('role')
      .preload('organisation')
      .preload('policy', (p) => p.preload('permissions'))
      .if(loggedInReqRole && !data?.skipCurrentRole, (rq) =>
        rq.whereHas('role', (r) => r.where('roleKey', loggedInReqRole))
      )
      .if(data?.organisationId, (rq) => rq.where('organisation_id', data?.organisationId as number))
    const branchRoles = await BranchUser.query()
      .where('userId', user.id)
      .preload('role')
      .preload('branch', (pq) => pq.preload('organisation'))
      .preload('policy', (p) => p.preload('permissions'))
      .if(loggedInReqRole && !data?.skipCurrentRole, (rq) =>
        rq.whereHas('role', (r) => r.where('roleKey', loggedInReqRole))
      )
      .if(data?.branchId, (rq) => rq.where('branch_id', Number(data?.branchId)))
      .if(data?.organisationId, (rq) =>
        rq.whereHas('branch', (pq) => pq.where('organisation_id', Number(data?.organisationId)))
      )

    const resourceRoles: { [key: number]: any } = {}

    organisationRoles.forEach((usrRole) => {
      userAccess.organisation.push(usrRole.organisationId)
      if (roleAccessLevels.includes(usrRole.role.roleAccessLevel as RoleAccessLevel)) {
        accessLevels.push(usrRole.role.roleAccessLevel as RoleAccessLevel)
      }
      usrRole.policy?.permissions.forEach((per) => {
        if (reqPermissionKeys.includes(per.permissionKey as PermissionKeys)) {
          permissions.push(per.permissionKey as PermissionKeys)
        }
      })

      if (usrRole.organisation.id) {
        if (!resourceRoles[usrRole.organisation.id]) {
          resourceRoles[usrRole.organisation.id] = {
            roles: [],
          }
        }
        resourceRoles[usrRole.organisation.id] = {
          name: usrRole.organisation?.name,
          id: usrRole.organisation?.id,
          roles: _.uniqBy(
            [
              {
                name: usrRole.role.roleName,
                roleName: usrRole.role.roleName,
                id: usrRole.role.id,
                roleKey: usrRole.role.roleKey,
                roleAccessLevel: usrRole.role.roleAccessLevel,
              },
              ...resourceRoles[usrRole.organisation.id].roles,
            ],
            'id'
          ),
        }
      }
    })

    branchRoles.forEach((usrRole) => {
      userAccess.branch.push(usrRole.branchId)
      if (roleAccessLevels.includes(usrRole.role.roleAccessLevel as RoleAccessLevel)) {
        accessLevels.push(usrRole.role.roleAccessLevel as RoleAccessLevel)
      }
      usrRole.policy?.permissions.forEach((per) => {
        if (reqPermissionKeys.includes(per.permissionKey as PermissionKeys)) {
          permissions.push(per.permissionKey as PermissionKeys)
        }
      })
      if (usrRole.branch.organisationId) {
        if (!resourceRoles[usrRole.branch.organisationId]) {
          resourceRoles[usrRole.branch.organisationId] = {
            roles: [],
          }
        }
        resourceRoles[usrRole.branch.organisationId] = {
          name: usrRole.branch.organisation?.name,
          id: usrRole.branch.organisation?.id,
          roles: _.uniqBy(
            [
              {
                name: usrRole.role.roleName,
                roleName: usrRole.role.roleName,
                id: usrRole.role.id,
                roleKey: usrRole.role.roleKey,
                roleAccessLevel: usrRole.role.roleAccessLevel,
              },
              ...resourceRoles[usrRole.branch.organisation.id].roles,
            ],
            'id'
          ),
        }
      }
    })

    const roles = _.uniqBy(
      [...organisationRoles, ...branchRoles].map((r) => r.role),
      ['id']
    )

    for (const level of levelPiority) {
      if (level === RoleAccessLevel.property && !role) {
        role = roles.filter((r) => r.roleAccessLevel === RoleAccessLevel.property)[0]
      }
      if (level === RoleAccessLevel.branch && !role) {
        role = roles.filter((r) => r.roleAccessLevel === RoleAccessLevel.branch)[0]
      }
      if (level === RoleAccessLevel.organisation && !role) {
        role = roles.filter((r) => r.roleAccessLevel === RoleAccessLevel.organisation)[0]
      }
      if (role) {
        break
      }
    }

    const userRes = await User.findOrFail(user?.id)

    if (!role) {
      throw new Error('forbidden')
    }

    // if (permissions.length === 0 || accessLevels.length === 0) {
    //   this.ctx.response.forbidden({
    //     message: 'Insufficient Permissions',
    //   })
    // }

    return {
      user: userRes,
      permissions: [...new Set(permissions)],
      accessLevels,
      isSytemAdmin,
      userAccess,
      isMobile,
      loggedInReqRole,
      role,
      roles,
      resourceRoles,
    }
  }
}
