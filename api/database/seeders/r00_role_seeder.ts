import Role from '#models/role'
import { RoleAccessLevel, RoleKeys } from '#types/role'
import { BaseSeeder } from '@adonisjs/lucid/seeders'

export default class extends BaseSeeder {
  async run() {
    await Role.createMany([
      {
        roleName: 'Builder / Developer',
        roleKey: RoleKeys.organisation_admin,
        roleDescription: '',
        roleAccessLevel: RoleAccessLevel.organisation,
        isDefault: true,
      },
      {
        roleName: 'Branch Admin',
        roleKey: RoleKeys.branch_admin,
        roleAccessLevel: RoleAccessLevel.branch,
        roleDescription: '',
        isDefault: true,
      },
      {
        roleName: 'Strata',
        roleKey: RoleKeys.branch_strata,
        roleAccessLevel: RoleAccessLevel.branch,
        roleDescription: '',
        isDefault: true,
      },
      {
        roleName: 'Auditor',
        roleKey: RoleKeys.branch_auditor,
        roleAccessLevel: RoleAccessLevel.branch,
        roleDescription: '',
        isDefault: true,
      },
      {
        roleName: 'Sub Contractor',
        roleKey: RoleKeys.branch_sub_contractor,
        roleAccessLevel: RoleAccessLevel.branch,
        roleDescription: '',
        isDefault: true,
      },
      {
        roleName: 'Owner',
        roleKey: RoleKeys.property_owner,
        roleAccessLevel: RoleAccessLevel.property,
        roleDescription: '',
        isDefault: true,
      },
      {
        roleName: 'Tenant',
        roleKey: RoleKeys.property_tenant,
        roleAccessLevel: RoleAccessLevel.property,
        roleDescription: '',
        isDefault: true,
      },
      {
        roleName: 'System',
        roleKey: RoleKeys.system,
        roleAccessLevel: RoleAccessLevel.system,
        roleDescription: '',
        isDefault: true,
      },
      {
        roleName: 'Agent',
        roleKey: RoleKeys.property_agent,
        roleAccessLevel: RoleAccessLevel.property,
        roleDescription: '',
        isDefault: true,
      },
      {
        roleName: 'Sales Agent',
        roleKey: RoleKeys.branch_sales_agent,
        roleAccessLevel: RoleAccessLevel.branch,
        roleDescription: '',
        isDefault: true,
      },
    ])
  }
}
